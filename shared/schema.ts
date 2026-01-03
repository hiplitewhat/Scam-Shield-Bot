import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const scamLogs = pgTable("scam_logs", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorId: text("author_id").notNull(),
  channelId: text("channel_id").notNull(),
  ocrText: text("ocr_text"),
  isScam: boolean("is_scam").notNull().default(false),
  confidence: text("confidence"), // High/Medium/Low
  detectedAt: timestamp("detected_at").defaultNow(),
  actionTaken: text("action_taken").default("logged"), // logged, deleted, warned
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(), // JSON string
});

// === SCHEMAS ===
export const insertScamLogSchema = createInsertSchema(scamLogs).omit({ id: true, detectedAt: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });

// === TYPES ===
export type ScamLog = typeof scamLogs.$inferSelect;
export type InsertScamLog = z.infer<typeof insertScamLogSchema>;
export type Setting = typeof settings.$inferSelect;
