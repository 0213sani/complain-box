import Link from "next/link";

// Stub until step 5.
export default function Wall() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-maroon">
      <h1 className="font-sign text-6xl text-cream">The public wall is being painted</h1>
      <Link href="/" className="border-4 border-ink bg-ochre px-7 py-3 font-ui text-2xl font-semibold text-ink shadow-[5px_5px_0_var(--color-ink)]">
        Back to the post box
      </Link>
    </main>
  );
}
