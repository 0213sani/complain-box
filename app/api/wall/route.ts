import { NextResponse } from "next/server";
import { approvedPosts } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const since = Math.max(0, Number(new URL(req.url).searchParams.get("since")) || 0);
  return NextResponse.json({ posts: approvedPosts(since) });
}
