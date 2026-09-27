import "server-only";

import { getD1 } from "@/db/d1";
import type { StoredRoomState } from "@/lib/game";
import type { PublicRoomState } from "@/lib/online-types";
import { VEHICLE_BY_ID } from "@/lib/vehicles";

export type RoomRow = {
  code: string;
  host_name: string;
  host_token: string;
  guest_name: string | null;
  guest_token: string | null;
  state_json: string;
  version: number;
  created_at: number;
  updated_at: number;
  expires_at: number;
};

const ROOM_TTL_MS = 1000 * 60 * 60 * 6;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function cleanPlayerName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 24);
}

export function cleanRoomCode(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function createRoomCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function createPlayerToken(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

export function roomExpiry(now = Date.now()): number {
  return now + ROOM_TTL_MS;
}

export async function getRoom(code: string): Promise<RoomRow | null> {
  return (
    (await getD1()
      .prepare(
        `SELECT code, host_name, host_token, guest_name, guest_token,
                state_json, version, created_at, updated_at, expires_at
         FROM rooms WHERE code = ?`,
      )
      .bind(code)
      .first<RoomRow>()) ?? null
  );
}

export function parseRoomState(row: RoomRow): StoredRoomState {
  return JSON.parse(row.state_json) as StoredRoomState;
}

export function playerIndexForToken(row: RoomRow, token: string): 0 | 1 | null {
  if (token && token === row.host_token) return 0;
  if (token && token === row.guest_token) return 1;
  return null;
}

export function toPublicRoom(
  row: RoomRow,
  state: StoredRoomState,
  youIndex: 0 | 1,
): PublicRoomState {
  const open = new Set(state.open);
  const matched = new Set(state.matchedVehicleIds);

  return {
    code: row.code,
    version: row.version,
    status: state.status,
    players: [row.host_name, row.guest_name],
    youIndex,
    currentPlayer: state.currentPlayer,
    scores: state.scores,
    moves: state.moves,
    startedAt: state.startedAt,
    endedAt: state.endedAt,
    revealUntil: state.revealUntil,
    cards: state.cards.map((card, index) => {
      const isMatched = matched.has(card.vehicleId);
      const revealed = isMatched || open.has(index);
      return {
        index,
        language: card.language,
        revealed,
        matched: isMatched,
        vehicle: revealed ? (VEHICLE_BY_ID.get(card.vehicleId) ?? null) : null,
      };
    }),
  };
}

export async function clearExpiredReveal(row: RoomRow): Promise<RoomRow> {
  const state = parseRoomState(row);
  if (!state.revealUntil || state.revealUntil > Date.now() || state.open.length === 0) {
    return row;
  }

  state.open = [];
  state.revealUntil = null;
  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  const now = Date.now();
  const result = await getD1()
    .prepare(
      `UPDATE rooms
       SET state_json = ?, version = version + 1, updated_at = ?, expires_at = ?
       WHERE code = ? AND version = ?`,
    )
    .bind(JSON.stringify(state), now, roomExpiry(now), row.code, row.version)
    .run();

  if ((result.meta.changes ?? 0) === 0) {
    return (await getRoom(row.code)) ?? row;
  }

  return {
    ...row,
    state_json: JSON.stringify(state),
    version: row.version + 1,
    updated_at: now,
    expires_at: roomExpiry(now),
  };
}

export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

