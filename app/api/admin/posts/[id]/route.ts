import { NextResponse } from "next/server";
import { getComplaint, setWallStatus } from "@/lib/repo";

export const dynamic = "force-dynamic";

// Approve, reject, or take a post off the wall (reject).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const { status } = await req.json().catch(() => ({}));
  if (status !== "approved" && status !== "rejected") return NextResponse.json({ error: "bad status" }, { status: 400 });
  if (!Number.isInteger(id) || !getComplaint(id)) return NextResponse.json({ error: "not found" }, { status: 404 });
  setWallStatus(id, status);
  return NextResponse.json({ ok: true, status });
}
