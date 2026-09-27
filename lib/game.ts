import { LANGUAGES, VEHICLES, type Language } from "./vehicles";

export type GameCard = {
  key: string;
  vehicleId: string;
  language: Language;
};

export type RoomStatus = "waiting" | "playing" | "finished";

export type StoredRoomState = {
  cards: GameCard[];
  open: number[];
  matchedVehicleIds: string[];
  scores: [number, number];
  currentPlayer: 0 | 1;
  moves: number;
  status: RoomStatus;
  startedAt: number | null;
  endedAt: number | null;
  revealUntil: number | null;
};

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function buildDeck(vehicleCount = 8): GameCard[] {
  const selected = shuffle(VEHICLES).slice(0, vehicleCount);
  return shuffle(
    selected.flatMap((vehicle) =>
      LANGUAGES.map((language) => ({
        key: `${vehicle.id}-${language}`,
        vehicleId: vehicle.id,
        language,
      })),
    ),
  );
}

export function createRoomState(vehicleCount = 8): StoredRoomState {
  return {
    cards: buildDeck(vehicleCount),
    open: [],
    matchedVehicleIds: [],
    scores: [0, 0],
    currentPlayer: 0,
    moves: 0,
    status: "waiting",
    startedAt: null,
    endedAt: null,
    revealUntil: null,
  };
}

export function isTriMatch(cards: GameCard[]): boolean {
  if (cards.length !== 3) return false;
  const vehicleIds = new Set(cards.map((card) => card.vehicleId));
  const languages = new Set(cards.map((card) => card.language));
  return vehicleIds.size === 1 && languages.size === 3;
}

