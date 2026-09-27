import { getD1 } from "@/db/d1";
import { createRoomState } from "@/lib/game";
import {
  cleanPlayerName,
  createPlayerToken,
  createRoomCode,
  jsonError,
  roomExpiry,
  toPublicRoom,
  type RoomRow,
} from "@/lib/server-room";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const hostName = cleanPlayerName(body.playerName);
    const requestedCount = Math.floor(Number(body.vehicleCount) || 8);
    const vehicleCount = [6, 8, 10].includes(requestedCount) ? requestedCount : 8;
    if (!hostName) return jsonError("Inserisci il tuo nome.");

    const db = getD1();
    const now = Date.now();
    await db.prepare("DELETE FROM rooms WHERE expires_at < ?").bind(now).run();

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = createRoomCode();
      const hostToken = createPlayerToken();
      const state = createRoomState(vehicleCount);
      const row: RoomRow = {
        code,
        host_name: hostName,
        host_token: hostToken,
        guest_name: null,
        guest_token: null,
        state_json: JSON.stringify(state),
        version: 1,
        created_at: now,
        updated_at: now,
        expires_at: roomExpiry(now),
      };
      const result = await db
        .prepare(
          `INSERT OR IGNORE INTO rooms
            (code, host_name, host_token, guest_name, guest_token, state_json,
             version, created_at, updated_at, expires_at)
           VALUES (?, ?, ?, NULL, NULL, ?, 1, ?, ?, ?)`,
        )
        .bind(
          row.code,
          row.host_name,
          row.host_token,
          row.state_json,
          row.created_at,
          row.updated_at,
          row.expires_at,
        )
        .run();

      if ((result.meta.changes ?? 0) > 0) {
        return Response.json({
          token: hostToken,
          room: toPublicRoom(row, state, 0),
        });
      }
    }

    return jsonError("Non è stato possibile creare la stanza. Riprova.", 503);
  } catch (error) {
    console.error("room-create", error);
    return jsonError("La modalità online non è disponibile in questo momento.", 503);
  }
}

