import type { ReactNode } from "react";

export function SectionHeader({
  tag, title, highlight, desc, light = false,
}: { tag?: string; title: string; highlight?: string; desc?: string; light?: boolean }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {tag && (
        <div className={`inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 ${light ? "bg-accent/15 text-accent" : "bg-primary/8 text-primary"}`}>
          {tag}
        </div>
      )}
      <h2 className={`text-3xl md:text-5xl font-black leading-tight ${light ? "text-cream" : "text-foreground"}`}>
        {title} {highlight && <span className="text-accent">{highlight}</span>}
      </h2>
      {desc && <p className={`mt-4 text-base md:text-lg ${light ? "text-cream/65" : "text-muted-foreground"}`}>{desc}</p>}
    </div>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`py-20 md:py-28 px-5 md:px-8 ${className}`}>{children}</section>;
}
