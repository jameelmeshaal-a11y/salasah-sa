
## 1) روابط حسابات التواصل الاجتماعي (Footer)

استبدال الأزرار الوهمية الحالية في `src/components/site/Footer.tsx` بروابط فعلية (Instagram, TikTok, X, LinkedIn, YouTube, Facebook, Snapchat) مع أيقونات SVG واضحة بدل الأحرف، `target="_blank"` و `rel="noopener noreferrer"` و `aria-label` لكل أيقونة.

## 2) جعل اللغة الافتراضية الإنجليزية

تعديل `src/lib/i18n.ts`:
- `fallbackLng: "en"`
- إضافة دالة كشف مخصصة قبل `navigator`/`cookie` بحيث يكون الافتراضي للزائر الجديد `en` (مع الحفاظ على احترام اختيار المستخدم اليدوي عبر `?lang=` أو الكوكي/التخزين المحلي).
- تحديث القيمة الأولية في SSR من `"ar"` إلى `"en"`.

> ملاحظة: الموقع سيظهر بالإنجليزية افتراضياً، ومن سبق له تعيين اللغة يدوياً يبقى على اختياره.

## 3) خدمات قطاع تقنية المعلومات

إضافة بيانات الخدمات (المعروضة في الصورة: البرمجة والتطوير + أنظمة الشركات والمؤسسات بكافة بنودها) إلى `src/lib/data.ts` ضمن خريطة جديدة `sectorServices: Record<string, { title, desc, items[] }[]>` مفهرسة بـ `id` القطاع (`tech` أولاً).

تعديل `src/routes/sectors.tsx`: جعل بطاقة القطاع قابلة للنقر — عند الضغط تُفتح نافذة `Dialog` (من shadcn) تعرض كل خدمات القطاع في عمودين بنفس ستايل الصورة (بطاقتان: عناوين خضراء ورموز قائمة منقطة). للقطاعات الأخرى تظل فارغة الآن مع رسالة "قريباً".

## 4) صفحة وقسم التوظيف /careers

### Footer
إضافة `<li><Link to="/careers">التوظيف</Link></li>` ضمن قسم "روابط سريعة".

### قاعدة البيانات
عبر migration:
- جدول `job_applications` بالحقول: `full_name, email, phone, position, city, country, work_type` (enum: full_time / part_time / remote / commission)، `linkedin_url, bio, cv_url, created_at`.
- bucket تخزين `cv-uploads` (خاص) لرفع PDF.
- RLS: `INSERT` متاح للجميع (anon)، `SELECT` للأدمن فقط عبر `has_role`.
- سياسات storage مماثلة (رفع للجميع، قراءة للأدمن).

### الصفحة `src/routes/careers.tsx`
- Hero بنفس ستايل صفحة `/sectors`: عنوان "انضم إلى فريق سلاسة"، وصف، زر "تقدّم الآن" يمرر إلى `#apply`.
- قسم "لماذا سلاسة؟": 4 بطاقات (بيئة محفزة، رواتب تنافسية، تطوير مهني، مرونة).
- نموذج التقديم بكل الحقول المذكورة:
  - تحقق Zod (الإيميل، الجوال، PDF فقط، حد حجم 5MB).
  - رفع الـ PDF إلى bucket `cv-uploads` ثم insert في `job_applications` بالرابط.
  - تنبيه: "يمكنك أيضاً إرسال سيرتك مباشرةً إلى hr@salasah.sa" (mailto).
  - بعد النجاح: عرض رسالة شكر بدل النموذج.
- إشعار للأدمن: استدعاء edge function `notify` الموجودة (إن كانت تدعم العام) أو إضافة حقل بسيط فقط (سنكتفي بالحفظ بقاعدة البيانات + ظهوره لاحقاً في لوحة التحكم — يمكن إضافة تبويب لاحقاً عند الطلب).
- اتجاه RTL، الألوان `bg-deep` / `text-cream` / `bg-accent`، نفس الخطوط ومكونات shadcn (`Input, Label, Textarea, RadioGroup, Button`).

### تسجيل المسار
سيُحدّث `src/routeTree.gen.ts` تلقائياً بواسطة TanStack — لا تعديل يدوي.

## ملاحظات تقنية
- لا تغييرات على business logic للحجوزات/الرسائل.
- كل التغييرات frontend + جدول DB واحد + bucket واحد.
- لن نستخدم EmailJS/Formspree (الموقع يعتمد Lovable Cloud)؛ بدل ذلك التخزين بقاعدة البيانات + إمكانية الاستلام عبر hr@salasah.sa من النموذج (mailto كنص تنبيه فقط).

هل توافق على هذه الخطة لأبدأ التنفيذ؟
