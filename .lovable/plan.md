## السبب الجذري

في الملف `src/start.ts` تم إضافة هيدر:

```
X-Frame-Options: SAMEORIGIN
```

هذا الهيدر يمنع المتصفحات (Firefox/Chrome) من عرض الموقع داخل أي `<iframe>` من نطاق مختلف — وهو بالضبط ما تفعله معاينة Lovable (`id-preview--*.lovable.app` يضمّن النشر داخل iframe). لذلك يظهر خطأ Firefox: "Firefox Can't Open This Page".

## الإصلاح

تعديل `src/start.ts`:

1. **حذف** السطر `h.set("X-Frame-Options", "SAMEORIGIN");` لأنه يكسر المعاينة ولا يدعم استثناءات.
2. **استبداله** بـ Content-Security-Policy `frame-ancestors` يسمح بالموقع نفسه + نطاقات Lovable للمعاينة:

```ts
h.set(
  "Content-Security-Policy",
  "frame-ancestors 'self' https://*.lovable.app https://lovable.dev https://*.lovable.dev",
);
```

هذا يحقق نفس مستوى الحماية ضد الـ clickjacking ويسمح في الوقت ذاته بعمل المعاينة والنشر داخل لوحة Lovable.

باقي الهيدرات الأمنية (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) تبقى كما هي بدون تغيير.

## ملفات سيتم تعديلها

- `src/start.ts` (سطر واحد محذوف + سطر واحد مضاف)

لا حاجة لأي تغييرات في قاعدة البيانات أو ملفات أخرى.