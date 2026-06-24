// Global preferred language for translations (kalimas, verses, mood text).
// The Arabic recitation is always in Arabic — this only affects translation text/audio.

import { useEffect, useState } from "react";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ur", label: "Urdu", native: "اردو", rtl: true },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "fa", label: "Persian", native: "فارسی", rtl: true },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", label: "Malay", native: "Bahasa Melayu" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export type Localized = { en: string } & Partial<Record<LangCode, string>>;

const KEY = "noor:lang";
const EVENT = "noor:lang-change";

export function getLanguage(): LangCode {
  try {
    const v = localStorage.getItem(KEY);
    if (v && SUPPORTED_LANGUAGES.some((l) => l.code === v)) return v as LangCode;
  } catch {}
  return "en";
}

export function setLanguage(code: LangCode) {
  try {
    localStorage.setItem(KEY, code);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: code }));
  } catch {}
}

export function isRtl(code: LangCode): boolean {
  return !!SUPPORTED_LANGUAGES.find((l) => l.code === code && (l as any).rtl);
}

/** Resolve a Localized value with English fallback. */
export function tr(value: Localized | string | undefined, lang: LangCode): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? "";
}

export function useLanguage(): [LangCode, (c: LangCode) => void] {
  const [lang, setLang] = useState<LangCode>("en");
  useEffect(() => {
    setLang(getLanguage());
    const onChange = (e: Event) => {
      const next = (e as CustomEvent).detail as LangCode | undefined;
      setLang(next ?? getLanguage());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLang(getLanguage());
    };
    window.addEventListener(EVENT, onChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return [lang, (c) => { setLanguage(c); setLang(c); }];
}
