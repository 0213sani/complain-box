// A postage-stamp shaped button with scalloped edges.
export default function StampButton({ children, onClick, disabled }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="p-[7px] transition-transform hover:-rotate-2 active:scale-95 disabled:opacity-50"
      style={{ background: "radial-gradient(circle, transparent 4px, var(--color-cream) 4.5px) -7px -7px / 14px 14px" }}
    >
      <span className="block border-2 border-cream bg-brick px-8 py-3 font-sign text-3xl text-cream">{children}</span>
    </button>
  );
}
