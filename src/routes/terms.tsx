import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "شروط الاستخدام | سلاسة القابضة" },
      { name: "description", content: "الشروط والأحكام لاستخدام موقع وخدمات شركة سلاسة القابضة." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  { t: "قبول الشروط", d: "باستخدامك لموقع سلاسة القابضة أو أي من خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل." },
  { t: "تعريفات", d: "تشير كلمة \"الشركة\" إلى شركة سلاسة القابضة. \"الخدمات\" تشمل تأسيس الشركات، الاستشارات، المنصات الرقمية، وأي خدمة نقدمها." },
  { t: "استخدام الموقع", d: "تتعهد باستخدام الموقع لأغراض مشروعة فقط، وعدم القيام بأي نشاط يضر بالشركة أو المستخدمين الآخرين أو الأطراف الثالثة." },
  { t: "الملكية الفكرية", d: "جميع المحتويات (نصوص، صور، شعارات، علامات تجارية، تصاميم) محمية بحقوق الملكية الفكرية المملوكة لسلاسة القابضة. لا يجوز نسخها أو إعادة استخدامها بدون إذن خطي." },
  { t: "الخدمات والأسعار", d: "نحتفظ بالحق في تعديل خدماتنا وأسعارها في أي وقت. أي عقد خدمة سيكون محكوماً ببنوده الخاصة المتفق عليها بشكل مستقل." },
  { t: "إخلاء المسؤولية", d: "نقدم المعلومات على الموقع كما هي للأغراض التعريفية. لا تشكل المعلومات استشارة قانونية أو مالية ملزمة دون اتفاقية رسمية." },
  { t: "تحديد المسؤولية", d: "لا تتحمل سلاسة القابضة المسؤولية عن أي أضرار غير مباشرة أو عرضية ناتجة عن استخدام الموقع." },
  { t: "القانون الحاكم", d: "تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وأي نزاع يحال إلى الجهات القضائية المختصة في الرياض." },
  { t: "تعديل الشروط", d: "يحق للشركة تعديل هذه الشروط في أي وقت. الاستخدام المستمر للموقع بعد التعديل يعني قبولك للشروط الجديدة." },
];

function TermsPage() {
  return (
    <section className="bg-cream py-20 px-5 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-primary/10 text-primary">شروط الاستخدام</div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground">الشروط <span className="text-accent">والأحكام</span></h1>
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
