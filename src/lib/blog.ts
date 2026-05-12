/**
 * Static blog posts. Add new entries here; routes, sitemap, and RSS feed
 * pick them up automatically. Each post should have unique title/description
 * for SEO and a focused keyword set.
 */

export type BlogPost = {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorEn: string;
  /** Reading time minutes */
  readingTime: number;
  tags: string[];
  /** Cover image URL (absolute path under /og or /assets) */
  cover?: string;
  /** Markdown-lite body — paragraphs separated by \n\n, ## for h2 */
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "company-formation-saudi-arabia-2026",
    title: "دليل تأسيس الشركات في السعودية 2026: الخطوات والتراخيص",
    titleEn: "Company Formation in Saudi Arabia 2026: Steps & Licenses",
    description:
      "دليل شامل لتأسيس شركتك في المملكة العربية السعودية: أنواع الكيانات القانونية، التراخيص المطلوبة، رأس المال، والمدد الزمنية لكل خطوة.",
    descriptionEn:
      "Complete guide to forming your company in Saudi Arabia: legal entity types, required licenses, capital requirements, and timelines for each step.",
    publishedAt: "2026-04-20",
    updatedAt: "2026-05-01",
    author: "فريق سلاسة القابضة",
    authorEn: "Salasah Holding Team",
    readingTime: 8,
    tags: ["تأسيس الشركات", "السعودية", "رؤية 2030", "التراخيص"],
    body: `## لماذا السعودية الآن؟

تشهد المملكة العربية السعودية تحولاً اقتصادياً غير مسبوق ضمن [رؤية 2030](https://www.vision2030.gov.sa/ar)، مع فتح قطاعات جديدة أمام الاستثمار الأجنبي عبر [وزارة الاستثمار (MISA)](https://misa.gov.sa/ar/) وتسهيل إجراءات تأسيس الشركات بشكل ملحوظ من خلال [المركز السعودي للأعمال](https://business.sa/).

## أنواع الكيانات القانونية

تتوفر عدة أنواع من الكيانات القانونية في المملكة وفق [نظام الشركات الصادر عن وزارة التجارة](https://mc.gov.sa/ar/Pages/default.aspx)، أبرزها: شركة ذات مسؤولية محدودة (LLC)، شركة شخص واحد، شركة مساهمة مقفلة، وفرع شركة أجنبية. اختيار النوع المناسب يعتمد على طبيعة النشاط، حجم الاستثمار، وعدد الشركاء. يمكن الاطلاع على التفاصيل عبر [بوابة المركز السعودي للأعمال](https://business.sa/).

## التراخيص المطلوبة

كل نشاط تجاري يتطلب تراخيص محددة من الجهات المختصة:
- [السجل التجاري من وزارة التجارة](https://mc.gov.sa/ar/eservices/Pages/default.aspx)
- [ترخيص الاستثمار الأجنبي من وزارة الاستثمار](https://misa.gov.sa/ar/investor-services/)
- [التسجيل في الزكاة والضريبة (ZATCA)](https://zatca.gov.sa/ar/Pages/default.aspx)
- [التأمينات الاجتماعية (GOSI)](https://www.gosi.gov.sa/)
- [خدمات منشآت لدعم المنشآت الصغيرة والمتوسطة](https://www.monshaat.gov.sa/ar)

## المدد الزمنية المتوقعة

في المتوسط، تستغرق عملية التأسيس الكاملة من 2 إلى 6 أسابيع حسب نوع النشاط ومدى اكتمال الوثائق. شركات سلاسة القابضة تختصر هذه المدة بفضل خبرتها وعلاقاتها مع الجهات الحكومية.

## كيف تساعدك سلاسة القابضة

نقدم خدمة تأسيس متكاملة تشمل: الاستشارة القانونية، تجهيز الوثائق، استخراج التراخيص، فتح الحسابات البنكية، والتوظيف. تواصل معنا لاستشارة مجانية.`,
  },
  {
    slug: "vision-2030-business-opportunities",
    title: "فرص الأعمال ضمن رؤية المملكة 2030: القطاعات الواعدة",
    titleEn: "Business Opportunities in Saudi Vision 2030: Promising Sectors",
    description:
      "تحليل لأبرز القطاعات الواعدة ضمن رؤية المملكة 2030: الترفيه، السياحة، الطاقة المتجددة، التقنية، والبنية التحتية، مع توصيات للمستثمرين.",
    descriptionEn:
      "Analysis of the most promising sectors within Saudi Vision 2030: entertainment, tourism, renewable energy, technology, and infrastructure, with investor recommendations.",
    publishedAt: "2026-03-10",
    updatedAt: "2026-04-25",
    author: "فريق سلاسة القابضة",
    authorEn: "Salasah Holding Team",
    readingTime: 10,
    tags: ["رؤية 2030", "الاستثمار", "القطاعات", "الفرص"],
    body: `## نظرة عامة على رؤية 2030

تستهدف [رؤية المملكة 2030](https://www.vision2030.gov.sa/ar) تنويع مصادر الدخل وتقليل الاعتماد على النفط، عبر تطوير قطاعات استراتيجية متعددة تفتح فرصاً ضخمة للمستثمرين المحليين والأجانب. تعرّف على الفرص عبر [بوابة استثمر في السعودية (Invest Saudi)](https://investsaudi.sa/ar/).

## القطاعات الأكثر جاذبية

### 1. التقنية والتحول الرقمي
استثمارات تتجاوز 100 مليار ريال في البنية التحتية الرقمية، الذكاء الاصطناعي، الحوسبة السحابية، والأمن السيبراني — بقيادة [وزارة الاتصالات وتقنية المعلومات](https://www.mcit.gov.sa/ar) و[الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)](https://sdaia.gov.sa/ar).

### 2. الترفيه والسياحة
مشاريع ضخمة كـ[نيوم](https://www.neom.com/ar-sa)، و[البحر الأحمر](https://www.redseaglobal.com/ar/)، و[القدية](https://www.qiddiya.com/ar/) تخلق طلباً غير مسبوق على خدمات الضيافة والترفيه. تابع تراخيص السياحة عبر [وزارة السياحة](https://mt.gov.sa/ar).

### 3. الطاقة المتجددة
هدف توليد 50% من الكهرباء من مصادر متجددة بحلول 2030، مع مشاريع شمسية وريحية واسعة عبر [وزارة الطاقة](https://www.moenergy.gov.sa/ar) و[برنامج الطاقة المتجددة](https://www.powersaudiarabia.com.sa/web/index_ar.html).

### 4. الصناعة والتعدين
تطوير قطاع التعدين كركيزة ثالثة للاقتصاد عبر [وزارة الصناعة والثروة المعدنية](https://www.mim.gov.sa/ar)، مع فرص في المعادن الاستراتيجية والمناطق الصناعية التي تديرها [مدن](https://www.modon.gov.sa/ar).

## مصادر بيانات رسمية للمستثمرين

- [الهيئة العامة للإحصاء (GASTAT)](https://www.stats.gov.sa/ar) — بيانات اقتصادية وسكانية محدّثة
- [البنك المركزي السعودي (ساما)](https://www.sama.gov.sa/ar-sa) — تقارير مالية ونقدية
- [هيئة السوق المالية (CMA)](https://cma.org.sa/Pages/default.aspx) — تنظيم سوق رأس المال
- [منشآت](https://www.monshaat.gov.sa/ar) — دعم المنشآت الصغيرة والمتوسطة

## كيف تستفيد من هذه الفرص

التواصل مع مستشار متخصص كسلاسة القابضة يساعدك في تحديد القطاع الأنسب، تجهيز دراسة الجدوى، وتأسيس الكيان القانوني المناسب.`,
  },
  {
    slug: "digital-platforms-saudi-market",
    title: "المنصات الرقمية في السوق السعودي: نموذج عمل المستقبل",
    titleEn: "Digital Platforms in the Saudi Market: The Future Business Model",
    description:
      "كيف تُحوّل المنصات الرقمية القطاعات التقليدية في السعودية، ولماذا يستثمر روّاد الأعمال في بناء منصات SaaS و Marketplaces.",
    descriptionEn:
      "How digital platforms are transforming traditional sectors in Saudi Arabia, and why entrepreneurs are investing in building SaaS and marketplace platforms.",
    publishedAt: "2026-02-05",
    updatedAt: "2026-04-10",
    author: "فريق سلاسة القابضة",
    authorEn: "Salasah Holding Team",
    readingTime: 7,
    tags: ["المنصات الرقمية", "SaaS", "التحول الرقمي", "الأعمال"],
    body: `## ثورة المنصات الرقمية

تشهد المملكة طفرة في إطلاق المنصات الرقمية التي تخدم قطاعات متعددة من التعليم والصحة إلى التجارة والمقاولات. هذه المنصات تختصر الإجراءات وترفع الكفاءة.

## أنواع المنصات الناجحة

- **Marketplaces**: تربط البائعين بالمشترين كمتاجر التجزئة الإلكترونية.
- **SaaS B2B**: حلول برمجية للشركات بنموذج الاشتراك.
- **منصات الخدمات**: تجمع مزودي الخدمة بالعملاء.
- **منصات تعليمية (LMS)**: للتدريب والتطوير المهني.

## محفظة سلاسة القابضة

تمتلك سلاسة القابضة أكثر من 15 منصة رقمية تخدم قطاعات متنوعة، وتقدم خدمات تطوير المنصات للعملاء بأعلى معايير الجودة.

## ابدأ منصتك الآن

تواصل معنا لمناقشة فكرة منصتك، دراسة الجدوى، ومسار التطوير المناسب لميزانيتك وأهدافك.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Convert lite-markdown body to safe HTML (paragraphs + h2/h3 + links). */
export function bodyToHtml(body: string): string {
  const renderInline = (s: string) => {
    // Escape first, then convert [text](url) markdown links to safe anchors.
    const escaped = escapeHtml(s);
    return escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_m, text, url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent font-semibold hover:underline">${text}</a>`,
    );
  };
  return body
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (t.startsWith("### ")) return `<h3>${renderInline(t.slice(4))}</h3>`;
      if (t.startsWith("## ")) return `<h2>${renderInline(t.slice(3))}</h2>`;
      if (t.startsWith("- ")) {
        const items = t
          .split(/\n/)
          .map((l) => l.replace(/^[-*]\s*/, "").trim())
          .filter(Boolean)
          .map((l) => `<li>${renderInline(l)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${renderInline(t).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
