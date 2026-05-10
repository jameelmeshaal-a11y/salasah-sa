import { Link } from "@tanstack/react-router";

type LinkItem = {
  to: "/" | "/about" | "/sectors" | "/platforms" | "/business-setup" | "/contact";
  title: string;
  desc: string;
};

/**
 * Internal cross-links section. Place at the bottom of major content pages
 * to strengthen internal linking, distribute PageRank, and reduce bounce.
 */
export function RelatedLinks({ exclude }: { exclude: LinkItem["to"] }) {
  const all: LinkItem[] = [
    { to: "/about", title: "من نحن", desc: "تعرّف على مجموعة سلاسة القابضة وقيمها." },
    { to: "/sectors", title: "قطاعاتنا", desc: "المقاولات، التقنية، التعليم، التجارة وأكثر." },
    { to: "/platforms", title: "منصاتنا الرقمية", desc: "+15 منصة تخدم قطاعات متعددة." },
    { to: "/business-setup", title: "تأسيس الأعمال", desc: "تأسيس شركتك في السعودية والإمارات." },
    { to: "/contact", title: "تواصل معنا", desc: "احجز استشارة مجانية مع فريقنا." },
    { to: "/about", title: "رؤيتنا", desc: "كيف نُسهم في رؤية المملكة 2030." },
  ];
  const items = all.filter((l) => l.to !== exclude).slice(0, 3);

  return (
    <section
      aria-label="روابط ذات صلة"
      className="bg-cream py-16 px-5 md:px-8 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
          استكشف <span className="text-accent">المزيد</span>
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">
          روابط ذات صلة قد تهمّك
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((l) => (
            <Link
              key={`${l.to}-${l.title}`}
              to={l.to}
              className="group block bg-card rounded-2xl p-6 border border-border hover:border-accent/50 hover:-translate-y-1 transition-all"
            >
              <h3 className="text-lg font-extrabold mb-2 text-foreground group-hover:text-primary transition">
                {l.title} <span className="text-accent">←</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{l.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
