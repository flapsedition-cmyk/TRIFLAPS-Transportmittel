import { getD1 } from "@/db/d1";
import { isTriMatch } from "@/lib/game";
import {
  cleanRoomCode,
  clearExpiredReveal,
  getRoom,
  jsonError,
  parseRoomState,
  playerIndexForToken,
  roomExpiry,
  toPublicRoom,
} from "@/lib/server-room";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const { code: rawCode } = await context.params;
    const code = cleanRoomCode(rawCode);
    const body = (await request.json()) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token : "";
    const cardIndex = Math.floor(Number(body.index));

    let row = await getRoom(code);
    if (!row) return jsonError("Stanza non trovata.", 404);
    row = await clearExpiredReveal(row);
    const youIndex = playerIndexForToken(row, token);
    if (youIndex === null) return jsonError("Accesso alla stanza non valido.", 403);

    const state = parseRoomState(row);
    if (state.status !== "playing") return jsonError("La partita non è attiva.", 409);
    if (state.currentPlayer !== youIndex) return jsonError("Aspetta il tuo turno.", 409);
    if (state.revealUntil) return jsonError("Aspetta che le carte si richiudano.", 409);
    if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= state.cards.length) {
      return jsonError("Carta non valida.");
    }
    if (state.open.includes(cardIndex)) return jsonError("Questa carta è già girata.");
    const selectedCard = state.cards[cardIndex];
    if (state.matchedVehicleIds.includes(selectedCard.vehicleId)) {
      return jsonError("Questa carta è già stata conquistata.");
    }

    state.open.push(cardIndex);
    const now = Date.now();
    if (state.open.length === 3) {
      state.moves += 1;
      const selected = state.open.map((index) => state.cards[index]);
      if (isTriMatch(selected)) {
        state.matchedVehicleIds.push(selected[0].vehicleId);
        state.scores[state.currentPlayer] += 100;
        state.open = [];
        if (state.matchedVehicleIds.length === state.cards.length / 3) {
          state.status = "finished";
          state.endedAt = now;
        }
      } else {
        state.revealUntil = now + 1500;
      }
    }

    const result = await getD1()
      .prepare(
        `UPDATE rooms
         SET state_json = ?, version = version + 1, updated_at = ?, expires_at = ?
         WHERE code = ? AND version = ?`,
      )
      .bind(JSON.stringify(state), now, roomExpiry(now), code, row.version)
      .run();

    if ((result.meta.changes ?? 0) === 0) {
      const latest = await getRoom(code);
      if (!latest) return jsonError("Stanza non trovata.", 404);
      return Response.json(
        { room: toPublicRoom(latest, parseRoomState(latest), youIndex) },
        { status: 409 },
      );
    }

    const updated = {
      ...row,
      state_json: JSON.stringify(state),
      version: row.version + 1,
      updated_at: now,
      expires_at: roomExpiry(now),
    };

    if (state.status === "finished") {
      const duration = Math.max(0, now - (state.startedAt ?? now));
      const inserts = [0, 1].map((index) =>
        getD1()
          .prepare(
            `INSERT OR IGNORE INTO leaderboard
              (player_name, score, mode, moves, duration_ms, source_key, created_at)
             VALUES (?, ?, 'online', ?, ?, ?, ?)`,
          )
          .bind(
            index === 0 ? row.host_name : (row.guest_name ?? "Giocatore 2"),
            state.scores[index],
            state.moves,
            duration,
            `${code}:${index}`,
            now,
          ),
      );
      await getD1().batch(inserts);
    }

    return Response.json({ room: toPublicRoom(updated, state, youIndex) });
  } catch (error) {
    console.error("room-flip", error);
    return jsonError("Non è stato possibile girare la carta.", 503);
  }
}

