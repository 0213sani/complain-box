import type { WallPost } from "@/lib/repo";
import { CARD_H, sizeOf } from "@/lib/wall/layout";

const CLAMP = { S: 3, M: 5, L: 7 } as const;

// Mini postcard: identity as a stamp tag, complaint small, reply larger.
export default function WallCard({ post, fresh, onOpen }: { post: WallPost; fresh: boolean; onOpen: () => void }) {
  const size = sizeOf(post);
  return (
    <button
      type="button"
      onClick={onOpen}
      data-id={post.id}
      className="relative block w-full overflow-hidden rounded-[3px] bg-cream p-5 text-left shadow-[6px_6px_0_rgba(42,22,9,0.45)] transition-shadow duration-700"
      style={{
        height: CARD_H[size],
        boxShadow: fresh ? "0 0 0 4px var(--color-ochre), 0 0 40px 10px rgba(224,166,60,0.7)" : undefined,
        backgroundImage: "linear-gradient(rgba(233,201,135,0.25), rgba(233,201,135,0.25))",
      }}
    >
      {/* stamp tag */}
      <div
        className="absolute right-4 top-4 w-[120px] p-[5px]"
        style={{ background: "radial-gradient(circle, transparent 3px, var(--color-brick) 3.5px) -5px -5px / 10px 10px" }}
      >
        <div className="border border-cream/60 bg-brick px-2 py-1.5 font-ui text-[11px] font-semibold leading-tight text-cream">
          <div className="line-clamp-2">{post.identity.title}</div>
          <div className="mt-1 text-[10px] font-normal opacity-80">PIN {post.pin}</div>
        </div>
      </div>
      <p className="line-clamp-3 min-h-[58px] pr-[132px] font-ui text-[14px] leading-snug text-ink/65">Re: {post.complaint}</p>
      <p className="mt-2 font-hand text-[22px] leading-[1.3] text-ink" style={{ display: "-webkit-box", WebkitLineClamp: CLAMP[size], WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {post.reply}
      </p>
      <div className="absolute bottom-3 right-4 flex h-[58px] w-[58px] rotate-[-12deg] items-center justify-center rounded-full border-[3px] border-maroon/70 font-ui text-[10px] font-semibold tracking-wider text-maroon/70">
        REPLIED
      </div>
    </button>
  );
}
