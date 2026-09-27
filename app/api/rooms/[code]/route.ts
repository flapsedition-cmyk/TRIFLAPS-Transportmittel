import {
  cleanRoomCode,
  clearExpiredReveal,
  getRoom,
  jsonError,
  parseRoomState,
  playerIndexForToken,
  toPublicRoom,
} from "@/lib/server-room";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  try {
    const { code: rawCode } = await context.params;
    const code = cleanRoomCode(rawCode);
    const token = new URL(request.url).searchParams.get("token") ?? "";
    let row = await getRoom(code);
    if (!row) return jsonError("Stanza non trovata.", 404);
    if (row.expires_at < Date.now()) return jsonError("Questa stanza è scaduta.", 410);

    row = await clearExpiredReveal(row);
    const youIndex = playerIndexForToken(row, token);
    if (youIndex === null) return jsonError("Accesso alla stanza non valido.", 403);

    return Response.json({ room: toPublicRoom(row, parseRoomState(row), youIndex) });
  } catch (error) {
    console.error("room-get", error);
    return jsonError("Non è stato possibile aggiornare la partita.", 503);
  }
}

