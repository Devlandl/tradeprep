import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    clerkUserId: v.string(),
    trade: v.string(),
    userName: v.string(),
    score: v.number(),
    examAttemptId: v.id("examAttempts"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_user_trade", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("trade", args.trade)
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("certificates", {
      ...args,
      passedAt: Date.now(),
    });
  },
});

export const getByTrade = query({
  args: { clerkUserId: v.string(), trade: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user_trade", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("trade", args.trade)
      )
      .first();
  },
});

export const getAll = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const certs = await ctx.db.query("certificates").collect();
    return certs.filter((c) => c.clerkUserId === args.clerkUserId);
  },
});
