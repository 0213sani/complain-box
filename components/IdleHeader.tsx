import Link from "next/link";

// Title + shortcut to the wall, shown on the street (IDLE) screen.
export default function IdleHeader() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 right-0 top-[26px] text-center">
        <h1 className="font-sign text-[104px] leading-none text-cream [text-shadow:6px_6px_0_var(--color-maroon),9px_9px_0_var(--color-ink)]">
          Complain Box
        </h1>
        <p className="mt-2 font-sign text-[34px] text-cream [text-shadow:3px_3px_0_var(--color-ink)]">शिकायत पेटी · Taqneeq Post</p>
      </div>
      <Link
        href="/wall"
        className="absolute right-[40px] top-[40px] border-4 border-ink bg-ochre px-6 py-3 font-ui text-2xl font-semibold text-ink shadow-[5px_5px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        See the public wall →
      </Link>
    </>
  );
}
