import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const LANGS = [
  { code: "ar", label: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "en", label: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", label: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "it", label: "Italiano", dir: "ltr", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", dir: "ltr", flag: "🇩🇪" },
  { code: "zh", label: "中文", dir: "ltr", flag: "🇨🇳" },
  { code: "ru", label: "Русский", dir: "ltr", flag: "🇷🇺" },
  { code: "ur", label: "اردو", dir: "rtl", flag: "🇵🇰" },
] as const;

export type LangCode = typeof LANGS[number]["code"];

// Manually translated AR <-> EN canonical dictionary
export const DICT_AR_EN: Record<string, string> = {
  // Nav
  "الرئيسية": "Home",
  "قطاعاتنا": "Sectors",
  "المنصات": "Platforms",
  "تأسيس الأعمال": "Business Setup",
  "عن سلاسة": "About",
  "تواصل معنا": "Contact Us",
  "المنتدى": "Forum",
  "الفعاليات": "Events",
  "احجز اجتماع مع الرئيس التنفيذي": "Book a Meeting with the CEO",
  "اللغة": "Language",
  "جميع الحقوق محفوظة": "All rights reserved",
  // CTAs
  "ابدأ مشروعك الآن": "Start Your Project",
  "تواصل معنا الآن": "Contact Us Now",
  "اعرف المزيد": "Learn More",
  "احجز استشارة مجانية": "Book Free Consultation",
  "تسجيل الدخول": "Sign In",
  "إنشاء حساب": "Create Account",
  "تسجيل الخروج": "Sign Out",
  "البريد الإلكتروني": "Email",
  "كلمة المرور": "Password",
  "الاسم الكامل": "Full Name",
  "رقم الجوال": "Mobile Number",
  "إرسال": "Submit",
  "حفظ": "Save",
  "إلغاء": "Cancel",
  "تأكيد": "Confirm",
  "حذف": "Delete",
  "تعديل": "Edit",
  "مشاركة جديدة": "New Post",
  "تعليق": "Comment",
  "إعجاب": "Like",
  "العنوان": "Title",
  "المحتوى": "Content",
  "اختر صورة": "Choose Image",
  "اختر فيديو": "Choose Video",
  "نشر": "Publish",
  "جاري التحميل...": "Loading...",
  // Booking
  "احجز موعدك مع": "Book Your Meeting with",
  "الرئيس التنفيذي": "the CEO",
  "اجتماع تنفيذي مباشر": "Live Executive Meeting",
  "الجنسية": "Nationality",
  "اللغة المفضلة": "Preferred Language",
  "التاريخ": "Date",
  "الوقت (توقيت الرياض)": "Time (Riyadh)",
  "موضوع الاجتماع (اختياري)": "Meeting Topic (Optional)",
  "تأكيد الحجز عبر واتساب": "Confirm via WhatsApp",
};

const RES = {
  // Map of i18n keys to Arabic source. The English column is a manual override.
  // For any other language, we rely on dynamic AI translation cached locally + DB.
};

const buildBase = () => {
  const ar: Record<string, string> = {};
  const en: Record<string, string> = {};
  for (const [arText, enText] of Object.entries(DICT_AR_EN)) {
    ar[arText] = arText;
    en[arText] = enText;
  }
  return { ar: { translation: ar }, en: { translation: en } };
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: buildBase(),
      lng: typeof window === "undefined" ? "ar" : undefined,
      fallbackLng: "ar",
      supportedLngs: LANGS.map((l) => l.code),
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "salasah_lang",
      },
    });
}

export const applyDir = (code: string) => {
  if (typeof document === "undefined") return;
  const lang = LANGS.find((l) => l.code === code) ?? LANGS[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
};

i18n.on("languageChanged", applyDir);

export default i18n;
