## التنفيذ المطلوب

### 1) تحديث الإحصائيات
- `src/routes/index.tsx` السطر 92, 168: `+250 مشروع منجز` → `+20 مشروع منجز`
- `src/routes/index.tsx` السطر 93: `+15 سنة خبرة` → `+20 سنة خبرة`
- `src/routes/about.tsx` السطر 88: `+15 سنة خبرة` → `+20 سنة`
- `src/routes/about.tsx` السطر 91: `+250 مشروع` → `+20 مشروع`
- ترك `+15 منصة` كما هو (هذا عدد المنصات وليس المشاريع/الخبرة)

### 2) تغيير اسم منصة عدل بالإنجليزي
- `src/lib/data.ts` السطر 95: `name: "Adl"` → `name: "3dl"`

### 3) صورة الرئيس التنفيذي
- نسخ `user-uploads://image-29.png` إلى `src/assets/ceo.webp` (استبدال) — تستخدم تلقائياً في `CEOBooking.tsx` و`leadership.tsx`

### 4) فحص محرك SEO ومعالجة المشاكل
- تشغيل `seo_chat--list_findings` لاستعراض النتائج الفعلية
- معالجة المشاكل القابلة للإصلاح في الكود مباشرة (meta, head, sitemap, robots, JSON-LD, alt text, hreflang)
- المشاكل خارج نطاق الكود (Google Search Console setup, AI summary, Page speed على مستوى الاستضافة) → ذكرها في التقرير النهائي مع الخطوات المطلوبة من المستخدم
- محاولة تفعيل Google Search Console عبر تكامل META verification إن كان متاحاً

### 5) تحسين سرعة الترجمة
المشكلة الحالية في `src/lib/translate.tsx`:
- `useT` يبدأ دائماً بالنص العربي ثم يحدّث (يسبب وميض/بطء عند التبديل)
- البحث في cache يحدث داخل `useEffect` بعد render
- لا يوجد prefetch للنصوص المرئية على الصفحة

التحسينات:
- جعل `useT` يقرأ من memoryCache + localStorage **بشكل متزامن** في `useState` initializer (مع SSR guard) لإظهار الترجمة فوراً بدون وميض
- إضافة batching على مستوى الصفحة: تجميع كل طلبات الترجمة في tick واحد بدل استدعاءات متفرقة
- preload الترجمة الإنجليزية للنصوص الشائعة من `DICT_AR_EN` فور تحميل الصفحة
- عند `languageChanged` تشغيل warm-up للنصوص المرئية حالياً

### تقرير ختامي
سأقدّم تقريراً يشمل:
- ما تم إصلاحه في الكود
- المشاكل الخارجية (GSC, performance hosting) مع الخطوات المطلوبة منك
- نتائج فحص SEO قبل/بعد