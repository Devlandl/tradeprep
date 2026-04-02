import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!userId || !slug) {
    return NextResponse.json({ purchased: false });
  }

  try {
    const convexUrl = process.env.NEXT_PUBLIC_TVR_CONVEX_URL!;
    const response = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "purchases:isPurchasedBySlug",
        args: { clerkUserId: userId, productSlug: slug },
      }),
    });
    const data = await response.json();
    return NextResponse.json({ purchased: data.value === true });
  } catch {
    return NextResponse.json({ purchased: false });
  }
}
