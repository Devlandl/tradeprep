import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const record = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("examAttempts", {
      ...args,
      attemptedAt: Date.now(),
    });
  },
});

export const listByTrade = query({
  args: { clerkUserId: v.string(), trade: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("examAttempts")
      .withIndex("by_user_trade", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("trade", args.trade)
      )
      .order("desc")
      .collect();
  },
});
