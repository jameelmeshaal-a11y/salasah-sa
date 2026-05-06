## المشكلة الحقيقية

في الإصلاح السابق استخدمت `web.whatsapp.com/send` على سطح المكتب لتجاوز حجب `api.whatsapp.com`. لكن:

- `web.whatsapp.com/send` يفتح واجهة WhatsApp Web ويتطلب أن يكون المستخدم مسجّل دخول بـ QR، وإذا لم يكن مسجلاً تظهر صفحة فارغة أو خطأ — وهذا ما يراه المستخدم.
- الرابط الرسمي القصير `https://wa.me/<number>` هو الذي يعمل في كل مكان (موبايل، سطح مكتب، مع/بدون تطبيق) ويقوم WhatsApp نفسه بتوجيه المستخدم تلقائياً للتطبيق أو للويب.
- بعض المتصفحات تحجب فتح نافذة جديدة عبر `window.open` من داخل `Promise` (الإصلاح السابق استخدم `import("...").then(...)` وهذا يكسر "user-gesture" → popup blocker يمنع الفتح بصمت.

## الحل

### 1) `src/lib/whatsapp.ts`
- استخدام `https://wa.me/966559500173?text=...` لكل الأجهزة (إزالة فرع `web.whatsapp.com`).
- إضافة دالة `openWhatsApp` تفتح الرابط فوراً بشكل تزامني (بدون async/await قبل `window.open`) للحفاظ على user-gesture.
- إضافة fallback: إذا فشل `window.open` (إرجاع `null`)، نستخدم `window.location.href = url` كحل بديل، ونعرض للمستخدم الرقم قابلاً للنسخ.

### 2) `src/routes/__root.tsx` (زر واتساب العائم)
- استبدال `import("@/lib/whatsapp").then(...)` بـ import ثابت في أعلى الملف، ثم استدعاء `openWhatsApp(...)` مباشرة داخل `onClick` — بدون Promise — لتجنب popup blocker.

### 3) `src/components/site/CEOBooking.tsx`
- نفس الشيء: استيراد ثابت + استدعاء مباشر بعد نجاح الحفظ. لأن `await supabase.insert` يكسر user-gesture، الحل: نفتح نافذة فارغة فور الضغط (`const w = window.open("about:blank", "_blank")`)، ثم بعد الحفظ نعيّن `w.location.href = buildWhatsAppUrl(msg)`. هذا نمط معتمد لتجاوز popup blocker بعد عمليات async.

### 4) التحقق
- بعد التعديل، استخدم أداة المتصفح للذهاب إلى `/`، الضغط على زر الواتساب العائم، والتأكد من فتح `wa.me` (عبر فحص `network requests` وعنوان النافذة الجديدة).
- اختبار نموذج CEOBooking بنفس الطريقة.

## ملخص التغييرات

| ملف | التغيير |
|---|---|
| `src/lib/whatsapp.ts` | استخدام `wa.me` للجميع + fallback عند الحجب |
| `src/routes/__root.tsx` | import ثابت، استدعاء متزامن |
| `src/components/site/CEOBooking.tsx` | فتح نافذة قبل الـ await ثم تعيين URL |
