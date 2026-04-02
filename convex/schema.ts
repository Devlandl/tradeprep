import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userProgress: defineTable({
    clerkUserId: v.string(),
    trade: v.string(),
    chapter: v.string(),
    difficulty: v.string(),
    score: v.number(),
    attempts: v.number(),
    passed: v.boolean(),
    lastAttemptAt: v.number(),
    timeSpent: v.number(),
  })
    .index("by_user_trade", ["clerkUserId", "trade"])
    .index("by_user", ["clerkUserId"]),

  examAttempts: defineTable({
    clerkUserId: v.string(),
    trade: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    passed: v.boolean(),
    timeSpent: v.number(),
    chapterScores: v.array(
      v.object({
        chapter: v.string(),
        correct: v.number(),
        total: v.number(),
      })
    ),
    attemptedAt: v.number(),
  }).index("by_user_trade", ["clerkUserId", "trade"]),

  certificates: defineTable({
    clerkUserId: v.string(),
    trade: v.string(),
    userName: v.string(),
    score: v.number(),
    passedAt: v.number(),
    examAttemptId: v.id("examAttempts"),
  }).index("by_user_trade", ["clerkUserId", "trade"]),
});
