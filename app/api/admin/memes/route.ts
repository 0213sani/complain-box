import { NextResponse } from "next/server";
import { memesByStatus } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ pending: memesByStatus("pending"), approved: memesByStatus("approved") });
}
