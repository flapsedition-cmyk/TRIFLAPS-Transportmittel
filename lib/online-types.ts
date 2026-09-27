import type { Language, Vehicle } from "./vehicles";
import type { RoomStatus } from "./game";

export type PublicOnlineCard = {
  index: number;
  language: Language;
  revealed: boolean;
  matched: boolean;
  vehicle: Vehicle | null;
};

export type PublicRoomState = {
  code: string;
  version: number;
  status: RoomStatus;
  players: [string, string | null];
  youIndex: 0 | 1;
  currentPlayer: 0 | 1;
  scores: [number, number];
  moves: number;
  startedAt: number | null;
  endedAt: number | null;
  revealUntil: number | null;
  cards: PublicOnlineCard[];
};

