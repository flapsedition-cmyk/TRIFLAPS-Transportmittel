import { getD1 } from "@/db/d1";
import { cleanPlayerName, jsonError } from "@/lib/server-room";

export const dynamic = "force-dynamic";

const MODES = new Set(["solo", "two", "online"]);

type LeaderboardRow = {
  playerName: string;
  score: number;
  mode: string;
  moves: number;
  durationMs: number;
  createdAt: number;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedMode = url.searchParams.get("mode");
    const mode = requestedMode && MODES.has(requestedMode) ? requestedMode : null;
    const query = mode
      ? getD1()
          .prepare(
            `SELECT player_name AS playerName, score, mode, moves,
                    duration_ms AS durationMs, created_at AS createdAt
             FROM leaderboard WHERE mode = ?
             ORDER BY score DESC, moves ASC, duration_ms ASC, created_at ASC
             LIMIT 20`,
          )
          .bind(mode)
      : getD1().prepare(
          `SELECT player_name AS playerName, score, mode, moves,
                  duration_ms AS durationMs, created_at AS createdAt
           FROM leaderboard
           ORDER BY score DESC, moves ASC, duration_ms ASC, created_at ASC
           LIMIT 20`,
        );
    const result = await query.all<LeaderboardRow>();
    return Response.json({ entries: result.results ?? [] });
  } catch (error) {
    console.error("leaderboard-get", error);
    return jsonError("La classifica non è disponibile in questo momento.", 503);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const playerName = cleanPlayerName(body.playerName);
    const mode = typeof body.mode === "string" ? body.mode : "";
    const score = Number(body.score);
    const moves = Math.max(0, Math.floor(Number(body.moves) || 0));
    const durationMs = Math.max(0, Math.floor(Number(body.durationMs) || 0));
    const sourceKey =
      typeof body.sourceKey === "string" && body.sourceKey.length <= 80
        ? body.sourceKey
        : crypto.randomUUID();

    if (!playerName) return jsonError("Inserisci un nome per la classifica.");
    if (!MODES.has(mode)) return jsonError("Modalità non valida.");
    if (!Number.isFinite(score) || score < 0 || score > 10000) {
      return jsonError("Punteggio non valido.");
    }

    await getD1()
      .prepare(
        `INSERT OR IGNORE INTO leaderboard
          (player_name, score, mode, moves, duration_ms, source_key, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        playerName,
        Math.floor(score),
        mode,
        moves,
        durationMs,
        sourceKey,
        Date.now(),
      )
      .run();

    return Response.json({ ok: true });
  } catch (error) {
    console.error("leaderboard-post", error);
    return jsonError("Non è stato possibile salvare il punteggio.", 503);
  }
}

