import { getD1 } from "@/db/d1";
import {
  cleanPlayerName,
  cleanRoomCode,
  createPlayerToken,
  getRoom,
  jsonError,
  parseRoomState,
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
    const guestName = cleanPlayerName(body.playerName);
    if (!guestName) return jsonError("Inserisci il tuo nome.");

    const row = await getRoom(code);
    if (!row) return jsonError("Stanza non trovata.", 404);
    if (row.expires_at < Date.now()) return jsonError("Questa stanza è scaduta.", 410);
    if (row.guest_name || row.guest_token) return jsonError("La stanza è già completa.", 409);

    const guestToken = createPlayerToken();
    const now = Date.now();
    const state = parseRoomState(row);
    state.status = "playing";
    state.startedAt = now;
    const result = await getD1()
      .prepare(
        `UPDATE rooms
         SET guest_name = ?, guest_token = ?, state_json = ?,
             version = version + 1, updated_at = ?, expires_at = ?
         WHERE code = ? AND version = ? AND guest_token IS NULL`,
      )
      .bind(
        guestName,
        guestToken,
        JSON.stringify(state),
        now,
        roomExpiry(now),
        code,
        row.version,
      )
      .run();

    if ((result.meta.changes ?? 0) === 0) {
      return jsonError("Qualcuno è appena entrato nella stanza.", 409);
    }

    const updated = {
      ...row,
      guest_name: guestName,
      guest_token: guestToken,
      state_json: JSON.stringify(state),
      version: row.version + 1,
      updated_at: now,
      expires_at: roomExpiry(now),
    };

    return Response.json({
      token: guestToken,
      room: toPublicRoom(updated, state, 1),
    });
  } catch (error) {
    console.error("room-join", error);
    return jsonError("Non è stato possibile entrare nella stanza.", 503);
  }
}

