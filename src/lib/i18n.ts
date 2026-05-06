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

const t = (ar: string, en: string, fr: string, it: string, de: string, zh: string, ru: string, ur: string) => ({
  ar, en, fr, it, de, zh, ru, ur,
});

const dict = {
  "nav.home": t("الرئيسية", "Home", "Accueil", "Home", "Startseite", "首页", "Главная", "ہوم"),
  "nav.sectors": t("قطاعاتنا", "Sectors", "Secteurs", "Settori", "Sektoren", "行业", "Сектора", "شعبے"),
  "nav.platforms": t("المنصات", "Platforms", "Plateformes", "Piattaforme", "Plattformen", "平台", "Платформы", "پلیٹ فارمز"),
  "nav.business": t("تأسيس الأعمال", "Business Setup", "Création d'entreprise", "Costituzione", "Unternehmensgründung", "企业设立", "Открытие бизнеса", "کاروبار قائم کریں"),
  "nav.about": t("عن سلاسة", "About", "À propos", "Chi siamo", "Über uns", "关于我们", "О нас", "ہمارے بارے میں"),
  "nav.contact": t("تواصل معنا", "Contact Us", "Contact", "Contatti", "Kontakt", "联系我们", "Контакты", "رابطہ"),
  "cta.book": t("احجز اجتماع مع الرئيس التنفيذي", "Book a Meeting with the CEO", "Réserver une réunion avec le PDG", "Prenota un incontro con il CEO", "Treffen mit dem CEO buchen", "预约与首席执行官会面", "Записаться к CEO", "سی ای او سے ملاقات بک کریں"),
  "footer.rights": t("جميع الحقوق محفوظة", "All rights reserved", "Tous droits réservés", "Tutti i diritti riservati", "Alle Rechte vorbehalten", "版权所有", "Все права защищены", "جملہ حقوق محفوظ ہیں"),
  "lang.switch": t("اللغة", "Language", "Langue", "Lingua", "Sprache", "语言", "Язык", "زبان"),
};

const buildResources = () => {
  const resources: Record<string, { translation: Record<string, string> }> = {};
  for (const { code } of LANGS) {
    resources[code] = { translation: {} };
    for (const [key, vals] of Object.entries(dict)) {
      resources[code].translation[key] = (vals as Record<string, string>)[code];
    }
  }
  return resources;
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: buildResources(),
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
