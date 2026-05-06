import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | سلاسة القابضة" },
      { name: "description", content: "سياسة الخصوصية لشركة سلاسة القابضة وكيفية حماية بيانات عملائنا." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  { t: "مقدمة", d: "تلتزم شركة سلاسة القابضة بحماية خصوصية زوار موقعنا وعملائنا. توضح هذه السياسة أنواع المعلومات التي نجمعها وكيفية استخدامها وحمايتها." },
  { t: "المعلومات التي نجمعها", d: "نجمع المعلومات التي تقدمها لنا طوعاً عند التسجيل، أو ملء نماذج التواصل، أو طلب استشارة، مثل: الاسم، البريد الإلكتروني، رقم الجوال، والمعلومات المتعلقة بمشروعك." },
  { t: "كيف نستخدم معلوماتك", d: "نستخدم معلوماتك للتواصل معك، تقديم الاستشارات والخدمات المطلوبة، تحسين تجربتك، إرسال تحديثات الخدمة، والامتثال للالتزامات القانونية." },
  { t: "حماية البيانات", d: "نطبّق إجراءات أمنية تقنية وإدارية متقدمة لحماية بياناتك من الوصول غير المصرح به، الفقدان، التعديل، أو الإفصاح، بما في ذلك التشفير وضوابط الوصول." },
  { t: "مشاركة البيانات", d: "لا نبيع بياناتك لأي طرف ثالث. قد نشارك المعلومات مع شركاء موثوقين فقط لتقديم الخدمة، أو عند الالتزام بطلب قانوني من الجهات المختصة." },
  { t: "ملفات تعريف الارتباط (Cookies)", d: "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل أداء الموقع. يمكنك تعطيلها من إعدادات المتصفح." },
  { t: "حقوقك", d: "يحق لك الوصول إلى بياناتك، تصحيحها، أو طلب حذفها في أي وقت بالتواصل معنا عبر info@salasah.sa." },
  { t: "تحديثات السياسة", d: "نحتفظ بالحق في تحديث هذه السياسة. أي تغييرات جوهرية سيتم نشرها على هذه الصفحة." },
];

function PrivacyPage() {
  return (
    <section className="bg-cream py-20 px-5 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-primary/10 text-primary">سياسة الخصوصية</div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground">حمايتك <span className="text-accent">أولويتنا</span></h1>
          <p className="text-muted-foreground mt-4">آخر تحديث: 6 مايو 2026</p>
        </div>
        <div className="space-y-5">
          {sections.map((s, i) => (
            <div key={s.t} className="bg-card border border-border rounded-2xl p-7 hover:border-accent/40 transition">
              <h2 className="text-xl font-extrabold mb-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-sm font-black">{i + 1}</span>
                {s.t}
              </h2>
              <p className="text-foreground/75 leading-loose">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
