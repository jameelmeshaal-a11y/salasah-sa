import { createFileRoute } from "@tanstack/react-router";
import { buildMeta, buildLinks, jsonLd, organizationSchema, pageSchema, breadcrumbSchema } from "@/lib/seo";

const LAST_MODIFIED = "2026-05-06";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: buildMeta({
      path: "/security",
      titleAr: "حماية الخصوصية والأمان",
      titleEn: "Security & Data Protection",
      descriptionAr: "سياسة أمن المعلومات وحماية البيانات في شركة سلاسة القابضة — تشفير TLS 1.3، AES-256، PDPL، ISO 27001.",
      descriptionEn: "Information security and data protection policy at Salasah Holding — TLS 1.3, AES-256, PDPL, ISO 27001.",
      ogImage: "og-home",
    }),
    links: buildLinks("/security"),
    scripts: [
      jsonLd([
        organizationSchema(),
        {
          ...pageSchema({
            type: "WebPage",
            path: "/security",
            name: "سياسة الأمن السيبراني | Security Policy",
            description: "سياسة أمن المعلومات وحماية البيانات في سلاسة القابضة.",
          }),
          dateModified: LAST_MODIFIED,
          datePublished: "2025-01-01",
        },
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "الأمن السيبراني", path: "/security" },
        ]),
      ]),
    ],
  }),
  component: SecurityPage,
});

const pillars = [
  { i: "🔒", t: "تشفير البيانات", d: "نستخدم تشفير TLS 1.3 لجميع الاتصالات وتشفير AES-256 للبيانات المخزنة." },
  { i: "🛡️", t: "حماية البنية التحتية", d: "خوادم مؤمنة بجدران حماية متقدمة، أنظمة كشف التسلل، ومراقبة على مدار الساعة." },
  { i: "🔑", t: "ضوابط الوصول", d: "صلاحيات قائمة على الأدوار (RBAC)، مصادقة ثنائية، وسجلات تدقيق لكل عملية." },
  { i: "🧪", t: "اختبارات الاختراق", d: "اختبارات أمان دورية ومراجعات أمنية مستقلة من جهات معتمدة." },
  { i: "💾", t: "نسخ احتياطي يومي", d: "نسخ احتياطية مشفرة يومية مع خطط استعادة كوارث (DR) موثقة ومُختبرة." },
  { i: "📋", t: "الامتثال", d: "الامتثال لأنظمة حماية البيانات الشخصية في المملكة (PDPL) ومعايير ISO 27001." },
  { i: "👥", t: "تدريب الفريق", d: "تدريب دوري لجميع موظفينا على ممارسات الأمن السيبراني والتعامل مع البيانات." },
  { i: "🚨", t: "الاستجابة للحوادث", d: "فريق استجابة مخصص يعمل 24/7 للتعامل مع أي حادث أمني خلال أقل من ساعة." },
];

function SecurityPage() {
  return (
    <>
      <section className="bg-deep py-20 md:py-28 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">الأمن السيبراني</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            بياناتك <span className="text-accent">في أمان</span>
          </h1>
          <p className="text-cream/70 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            في سلاسة القابضة، حماية بياناتك ليست خياراً — بل التزام جوهري نلتزم به منذ اليوم الأول.
          </p>
        </div>
      </section>

      <section className="bg-cream py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map(p => (
            <div key={p.t} className="bg-card border border-border rounded-2xl p-6 hover:border-accent/40 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-4">{p.i}</div>
              <h3 className="text-base font-extrabold mb-2">{p.t}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-14 bg-deep rounded-3xl p-10 text-center text-cream">
          <h2 className="text-2xl md:text-3xl font-black mb-3">هل لديك ملاحظة أمنية؟</h2>
          <p className="text-cream/70 mb-6">إذا اكتشفت ثغرة أمنية محتملة، نشكرك على إبلاغنا فوراً.</p>
          <a href="mailto:info@salasah.sa" className="inline-block px-8 py-3.5 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition" dir="ltr">
            security@salasah.sa
          </a>
        </div>
      </section>
    </>
  );
}
