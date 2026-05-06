import { useMemo } from "react";

/**
 * Subtle floating background pattern: KSA flag glyph + Saudi Riyal symbol drifting.
 * Pure CSS-driven, low opacity, decorative only.
 */
export function FloatingPattern({ density = 14, className = "" }: { density?: number; className?: string }) {
  const items = useMemo(() => {
    const arr: { id: number; type: "flag" | "riyal"; left: number; top: number; size: number; delay: number; dur: number }[] = [];
    for (let i = 0; i < density; i++) {
      arr.push({
        id: i,
        type: i % 2 === 0 ? "riyal" : "flag",
        left: Math.random() * 95,
        top: Math.random() * 90,
        size: 18 + Math.random() * 36,
        delay: Math.random() * -14,
        dur: 10 + Math.random() * 10,
      });
    }
    return arr;
  }, [density]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {items.map((it) => (
        <span
          key={it.id}
          className="float-item"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.dur}s`,
          }}
        >
          {it.type === "riyal" ? <RiyalGlyph /> : <FlagGlyph />}
        </span>
      ))}
    </div>
  );
}

/* Saudi Riyal new symbol — stylized */
function RiyalGlyph() {
  return (
    <svg viewBox="0 0 64 64" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18 L34 14 L34 50" />
      <path d="M14 30 L50 22" />
      <path d="M14 42 L50 34" />
      <path d="M22 50 L46 50" />
    </svg>
  );
}

/* KSA flag mini icon */
function FlagGlyph() {
  return (
    <svg viewBox="0 0 64 48" width="1em" height="0.75em">
      <rect width="64" height="48" rx="4" fill="currentColor" opacity="0.85" />
      <path d="M14 22 H50" stroke="oklch(0.96 0.01 95)" strokeWidth="1.5" opacity="0.85" />
      <path d="M22 32 L42 32 L40 36 L24 36 Z" fill="oklch(0.96 0.01 95)" opacity="0.85" />
    </svg>
  );
}
