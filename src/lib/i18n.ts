import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const LANGS = [
  { code: "ar", label: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "en", label: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", label: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "es", label: "Español", dir: "ltr", flag: "🇪🇸" },
  { code: "pt", label: "Português", dir: "ltr", flag: "🇵🇹" },
  { code: "it", label: "Italiano", dir: "ltr", flag: "🇮🇹" },
  { code: "de", label: "Deutsch", dir: "ltr", flag: "🇩🇪" },
  { code: "nl", label: "Nederlands", dir: "ltr", flag: "🇳🇱" },
  { code: "ru", label: "Русский", dir: "ltr", flag: "🇷🇺" },
  { code: "uk", label: "Українська", dir: "ltr", flag: "🇺🇦" },
  { code: "tr", label: "Türkçe", dir: "ltr", flag: "🇹🇷" },
  { code: "fa", label: "فارسی", dir: "rtl", flag: "🇮🇷" },
  { code: "ur", label: "اردو", dir: "rtl", flag: "🇵🇰" },
  { code: "hi", label: "हिन्दी", dir: "ltr", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", dir: "ltr", flag: "🇧🇩" },
  { code: "id", label: "Bahasa Indonesia", dir: "ltr", flag: "🇮🇩" },
  { code: "ms", label: "Bahasa Melayu", dir: "ltr", flag: "🇲🇾" },
  { code: "tl", label: "Filipino", dir: "ltr", flag: "🇵🇭" },
  { code: "vi", label: "Tiếng Việt", dir: "ltr", flag: "🇻🇳" },
  { code: "th", label: "ไทย", dir: "ltr", flag: "🇹🇭" },
  { code: "zh", label: "中文", dir: "ltr", flag: "🇨🇳" },
  { code: "ja", label: "日本語", dir: "ltr", flag: "🇯🇵" },
  { code: "ko", label: "한국어", dir: "ltr", flag: "🇰🇷" },
  { code: "sw", label: "Kiswahili", dir: "ltr", flag: "🇰🇪" },
] as const;

export type LangCode = typeof LANGS[number]["code"];

// Map ISO country code → site language
export const COUNTRY_TO_LANG: Record<string, LangCode> = {
  SA: "ar", AE: "ar", KW: "ar", QA: "ar", BH: "ar", OM: "ar", YE: "ar",
  JO: "ar", LB: "ar", SY: "ar", IQ: "ar", PS: "ar", EG: "ar", LY: "ar",
  TN: "ar", DZ: "ar", MA: "ar", SD: "ar", MR: "ar",
  GB: "en", US: "en", CA: "en", AU: "en", NZ: "en", IE: "en", ZA: "en",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  IT: "it", SM: "it", VA: "it",
  DE: "de", AT: "de", CH: "de", LI: "de",
  NL: "nl",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  UA: "uk",
  TR: "tr", CY: "tr",
  IR: "fa", AF: "fa",
  PK: "ur",
  IN: "hi", NP: "hi",
  BD: "bn",
  ID: "id",
  MY: "ms", BN: "ms",
  PH: "tl",
  VN: "vi",
  TH: "th",
  CN: "zh", HK: "zh", TW: "zh", SG: "zh", MO: "zh",
  JP: "ja",
  KR: "ko", KP: "ko",
  KE: "sw", TZ: "sw", UG: "sw", RW: "sw",
};

// Manually translated AR -> EN dictionary (fast-path for common UI)
export const DICT_AR_EN: Record<string, string> = {
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
  "نشر": "Publish",
  "جاري التحميل...": "Loading...",
  "القائمة": "Menu",
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { ar: { translation: {} }, en: { translation: {} } },
      lng: typeof window === "undefined" ? "ar" : undefined,
      fallbackLng: "ar",
      supportedLngs: LANGS.map((l) => l.code),
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      detection: {
        order: ["cookie", "localStorage", "navigator"],
        caches: ["cookie", "localStorage"],
        lookupCookie: "salasah_lang",
        lookupLocalStorage: "salasah_lang",
        cookieMinutes: 60 * 24 * 365,
      },
    });
}

export const applyDir = (code: string) => {
  if (typeof document === "undefined") return;
  const lang = LANGS.find((l) => l.code === code) ?? LANGS[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
};

i18n.on("languageChanged", (lng) => {
  applyDir(lng);
  if (typeof document !== "undefined") {
    document.cookie = `salasah_lang=${lng};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  }
});

export default i18n;
