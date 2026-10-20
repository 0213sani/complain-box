// Kiosk state machine: IDLE -> WRITING -> SENDING -> (WAITING) -> REPLY -> IDLE
export type Phase = "IDLE" | "WRITING" | "SENDING" | "WAITING" | "REPLY";
export type Identity = { id: number; title: string; dept: string; place: string; pin: string };
export type ReplyData = { complaintId: number | null; reply: string; voice: string };
export type WallState = "idle" | "posting" | "pending" | "approved" | "rejected";

export type KioskState = {
  phase: Phase;
  identity: Identity | null; // this visit
  next: Identity | null; // prefetched for the next visit
  complaint: string;
  reply: ReplyData | null;
  rideDone: boolean;
  wall: WallState;
  returning: boolean; // postman riding back in
};

export type KioskEvent =
  | { type: "IDENTITY_LOADED"; identity: Identity }
  | { type: "OPEN" }
  | { type: "CLOSE" } // back to IDLE without a ride (Esc / idle in WRITING)
  | { type: "SEND"; complaint: string }
  | { type: "REPLY_ARRIVED"; reply: ReplyData }
  | { type: "RIDE_DONE" }
  | { type: "WALL"; wall: WallState }
  | { type: "FINISH" } // close the reply: card leaves, postman returns
  | { type: "RETURNED" };

export const initialState: KioskState = {
  phase: "IDLE", identity: null, next: null, complaint: "", reply: null, rideDone: false, wall: "idle", returning: false,
};

export function reducer(s: KioskState, e: KioskEvent): KioskState {
  switch (e.type) {
    case "IDENTITY_LOADED":
      if (!s.identity) return { ...s, identity: e.identity };
      if (!s.next) return { ...s, next: e.identity };
      return s;
    case "OPEN":
      return s.phase === "IDLE" && s.identity ? { ...s, phase: "WRITING", returning: false } : s;
    case "CLOSE":
      return s.phase === "WRITING" ? { ...s, phase: "IDLE" } : s;
    case "SEND":
      return s.phase === "WRITING" ? { ...s, phase: "SENDING", complaint: e.complaint, reply: null, rideDone: false } : s;
    case "REPLY_ARRIVED":
      if (s.phase === "SENDING") return { ...s, reply: e.reply };
      if (s.phase === "WAITING") return { ...s, reply: e.reply, phase: "REPLY" };
      return s; // stale reply after a reset: ignore
    case "RIDE_DONE":
      if (s.phase !== "SENDING") return s;
      return { ...s, rideDone: true, phase: s.reply ? "REPLY" : "WAITING" };
    case "WALL":
      return s.phase === "REPLY" ? { ...s, wall: e.wall } : s;
    case "FINISH":
      if (s.phase !== "REPLY" && s.phase !== "WAITING") return s;
      // new visitor gets the prefetched identity; a fresh one is fetched for `next`
      return { ...initialState, identity: s.next, returning: true };
    case "RETURNED":
      return { ...s, returning: false };
  }
}
