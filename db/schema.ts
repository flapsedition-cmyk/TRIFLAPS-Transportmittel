import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const leaderboard = sqliteTable(
  "leaderboard",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playerName: text("player_name").notNull(),
    score: integer("score").notNull(),
    mode: text("mode").notNull(),
    moves: integer("moves").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    sourceKey: text("source_key"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [uniqueIndex("idx_leaderboard_source_key").on(table.sourceKey)],
);

export const rooms = sqliteTable("rooms", {
  code: text("code").primaryKey(),
  hostName: text("host_name").notNull(),
  hostToken: text("host_token").notNull(),
  guestName: text("guest_name"),
  guestToken: text("guest_token"),
  stateJson: text("state_json").notNull(),
  version: integer("version").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
