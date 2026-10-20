import { NextResponse } from "next/server";
import { postsByStatus } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ pending: postsByStatus("pending"), approved: postsByStatus("approved") });
}
