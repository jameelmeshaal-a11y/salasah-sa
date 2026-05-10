import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import ceoImg from "@/assets/ceo.webp";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  organizationSchema,
  pageSchema,
  breadcrumbSchema,
  SITE_URL,
  SITE_NAME_EN,
  SITE_NAME_AR,
} from "@/lib/seo";

type Leader = {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  bio: string;
  image?: string;
  sameAs?: string[];
};

const leaders: Leader[] = [
  {
    id: "ceo",
    name: "أ. جميل مشعل",
    nameEn: "Mr. Jameel Mishal",
    role: "الرئيس التنفيذي ورئيس مجلس الإدارة",
    roleEn: "Chief Executive Officer & Chairman",
    bio: "قائد تنفيذي بخبرة تتجاوز 20 عاماً في تأسيس وإدارة الشركات الاستراتيجية بقطاعات المقاولات والتقنية والاستثمار، ومُسهم فاعل في تحقيق التحول الرقمي ضمن مستهدفات رؤية المملكة 2030.",
    image: ceoImg,
    sameAs: [
      "https://www.linkedin.com/company/salasah-holding",
    ],
  },
];

function personSchema(l: Leader) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: l.nameEn,
    alternateName: l.name,
    jobTitle: l.roleEn,
    description: l.bio,
    image: l.image ? `${SITE_URL}${l.image}` : undefined,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME_EN,
      alternateName: SITE_NAME_AR,
      url: SITE_URL,
    },
    sameAs: l.sameAs,
  };
}

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: buildMeta({
      path: "/leadership",
      titleAr: "فريق القيادة — مجلس إدارة سلاسة القابضة",
      titleEn: "Leadership — Salasah Holding Board & Executives",
      descriptionAr:
        "تعرّف على فريق قيادة سلاسة القابضة: الرئيس التنفيذي، مجلس الإدارة، والقادة التنفيذيون الذين يقودون المجموعة نحو رؤية 2030.",
      descriptionEn:
        "Meet the leadership of Salasah Holding: CEO, Board, and executive team driving the group's contribution to Vision 2030.",
      ogImage: "og-about",
    }),
    links: buildLinks("/leadership"),
    scripts: [
      jsonLd(organizationSchema()),
      jsonLd(
        pageSchema({
          path: "/leadership",
          name: "فريق القيادة — سلاسة القابضة",
          description: "الرئيس التنفيذي ومجلس الإدارة والفريق التنفيذي.",
        }),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "فريق القيادة", path: "/leadership" },
        ]),
      ),
      ...leaders.map((l) => jsonLd(personSchema(l))),
    ],
  }),
  component: LeadershipPage,
});

function LeadershipPage() {
  return (
    <>
      <Section className="bg-deep text-cream pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="text-accent text-sm font-bold tracking-[0.3em] mb-3">
            LEADERSHIP
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            فريق <span className="text-accent">القيادة</span>
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            قادة من ذوي الخبرات الواسعة يقودون مجموعة سلاسة القابضة نحو الريادة
            وتحقيق مستهدفات رؤية المملكة 2030.
          </p>
        </div>
      </Section>

      <Section className="bg-cream py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8 space-y-10">
          {leaders.map((l) => (
            <article
              key={l.id}
              className="grid md:grid-cols-[260px_1fr] gap-8 items-start bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm"
            >
              {l.image && (
                <img
                  src={l.image}
                  alt={`${l.name} — ${l.role}`}
                  width={260}
                  height={320}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />
              )}
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1">
                  {l.name}
                </h2>
                <p className="text-accent font-bold mb-4">{l.role}</p>
                <p className="text-muted-foreground leading-relaxed">{l.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <RelatedLinks exclude="/about" />
    </>
  );
}
