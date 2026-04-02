import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByTrade = query({
  args: { clerkUserId: v.string(), trade: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_user_trade", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("trade", args.trade)
      )
      .collect();
  },
});

export const getAll = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();
  },
});

export const recordScore = mutation({
  args: {
    clerkUserId: v.string(),
    trade: v.string(),
    chapter: v.string(),
    difficulty: v.string(),
    score: v.number(),
    timeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_trade", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("trade", args.trade)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("chapter"), args.chapter),
          q.eq(q.field("difficulty"), args.difficulty)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        score: Math.max(existing.score, args.score),
        attempts: existing.attempts + 1,
        passed: existing.passed || args.score >= 80,
        lastAttemptAt: Date.now(),
        timeSpent: existing.timeSpent + args.timeSpent,
      });
    } else {
      await ctx.db.insert("userProgress", {
        clerkUserId: args.clerkUserId,
        trade: args.trade,
        chapter: args.chapter,
        difficulty: args.difficulty,
        score: args.score,
        attempts: 1,
        passed: args.score >= 80,
        lastAttemptAt: Date.now(),
        timeSpent: args.timeSpent,
      });
    }
  },
});
