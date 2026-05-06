## الخطة

حذف رموز الريال والعلم المتحركة في خلفية الموقع.

### التغييرات
1. إزالة استخدامات `<FloatingPattern />` من:
   - `src/routes/index.tsx`
   - `src/components/site/CEOBooking.tsx`
2. حذف ملف `src/components/site/FloatingPattern.tsx`.
3. (اختياري) إزالة كلاس `.float-item` و keyframes `drift` غير المستخدمة من `src/styles.css`.

النتيجة: خلفية نظيفة بدون أيقونات عائمة.