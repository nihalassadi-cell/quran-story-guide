// UI copy translations. Keys are stable — values map to each supported language.
// Falls back to English when a key/lang is missing.

import { useLanguage, type LangCode } from "@/lib/language";

type Dict = Record<string, Partial<Record<LangCode, string>> & { en: string }>;

const UI: Dict = {
  // Tabs
  "tab.today":     { en: "Today", ur: "آج", ru: "Сегодня", bn: "আজ", fa: "امروز", id: "Hari Ini", ms: "Hari Ini", tr: "Bugün", fr: "Aujourd'hui", de: "Heute" },
  "tab.quran":     { en: "Quran", ur: "قرآن", ru: "Коран", bn: "কুরআন", fa: "قرآن", id: "Al-Qur'an", ms: "Al-Qur'an", tr: "Kur'an", fr: "Coran", de: "Koran" },
  "tab.feelings":  { en: "Feelings", ur: "احساسات", ru: "Чувства", bn: "অনুভূতি", fa: "احساسات", id: "Perasaan", ms: "Perasaan", tr: "Duygular", fr: "Émotions", de: "Gefühle" },
  "tab.settings":  { en: "Settings", ur: "ترتیبات", ru: "Настройки", bn: "সেটিংস", fa: "تنظیمات", id: "Pengaturan", ms: "Tetapan", tr: "Ayarlar", fr: "Paramètres", de: "Einstellungen" },

  // Quran home
  "quran.title":   { en: "The Quran", ur: "قرآن مجید", ru: "Коран", bn: "আল-কুরআন", fa: "قرآن کریم", id: "Al-Qur'an", ms: "Al-Qur'an", tr: "Kur'an-ı Kerim", fr: "Le Coran", de: "Der Koran" },
  "quran.sub":     {
    en: "114 chapters. Recitation and translation — verse by verse.",
    ur: "114 سورتیں۔ تلاوت اور ترجمہ — آیت بہ آیت۔",
    ru: "114 сур. Чтение и перевод — стих за стихом.",
    bn: "১১৪টি সূরা। তেলাওয়াত ও অনুবাদ — আয়াতে আয়াতে।",
    fa: "۱۱۴ سوره. تلاوت و ترجمه — آیه به آیه.",
    id: "114 surah. Bacaan dan terjemahan — ayat demi ayat.",
    ms: "114 surah. Bacaan dan terjemahan — ayat demi ayat.",
    tr: "114 sûre. Tilavet ve tercüme — âyet âyet.",
    fr: "114 chapitres. Récitation et traduction — verset par verset.",
    de: "114 Kapitel. Rezitation und Übersetzung — Vers für Vers.",
  },
  "quran.search":  { en: "Search across the entire Quran", ur: "پورے قرآن میں تلاش کریں", ru: "Поиск по всему Корану", bn: "সম্পূর্ণ কুরআনে খুঁজুন", fa: "جستجو در سراسر قرآن", id: "Cari di seluruh Al-Qur'an", ms: "Cari di seluruh Al-Qur'an", tr: "Kur'an'ın tamamında ara", fr: "Rechercher dans tout le Coran", de: "Im gesamten Koran suchen" },
  "quran.continue":{ en: "Continue reading", ur: "پڑھنا جاری رکھیں", ru: "Продолжить чтение", bn: "পড়া চালিয়ে যান", fa: "ادامهٔ خواندن", id: "Lanjutkan membaca", ms: "Sambung membaca", tr: "Okumaya devam et", fr: "Continuer la lecture", de: "Weiterlesen" },
  "quran.page":    { en: "Page", ur: "صفحہ", ru: "Стр.", bn: "পৃষ্ঠা", fa: "صفحه", id: "Halaman", ms: "Halaman", tr: "Sayfa", fr: "Page", de: "Seite" },
  "quran.verse":   { en: "Verse", ur: "آیت", ru: "Аят", bn: "আয়াত", fa: "آیه", id: "Ayat", ms: "Ayat", tr: "Âyet", fr: "Verset", de: "Vers" },
  "quran.pickup":  { en: "pick up where you left off", ur: "جہاں چھوڑا تھا وہاں سے شروع کریں", ru: "продолжить с того места, где остановились", bn: "যেখানে থেমেছিলেন সেখান থেকে শুরু করুন", fa: "از جایی که رها کردید ادامه دهید", id: "lanjutkan dari tempat kamu berhenti", ms: "sambung dari tempat kamu berhenti", tr: "kaldığın yerden devam et", fr: "reprenez là où vous vous étiez arrêté", de: "dort weitermachen, wo du aufgehört hast" },
  "quran.verses":  { en: "Verses", ur: "آیات", ru: "Аяты", bn: "আয়াতসমূহ", fa: "آیات", id: "Ayat-ayat", ms: "Ayat-ayat", tr: "Âyetler", fr: "Versets", de: "Verse" },
  "quran.surahs":  { en: "Surahs", ur: "سورتیں", ru: "Суры", bn: "সূরাসমূহ", fa: "سوره‌ها", id: "Surah", ms: "Surah", tr: "Sûreler", fr: "Sourates", de: "Suren" },
  "quran.surah":   { en: "Surah", ur: "سورہ", ru: "Сура", bn: "সূরা", fa: "سوره", id: "Surah", ms: "Surah", tr: "Sûre", fr: "Sourate", de: "Sure" },
  "quran.verseSuffix": { en: "verses", ur: "آیات", ru: "аятов", bn: "আয়াত", fa: "آیه", id: "ayat", ms: "ayat", tr: "âyet", fr: "versets", de: "Verse" },
  "quran.noMatches": { en: "No matches. Try a different word.", ur: "کوئی نتیجہ نہیں۔ کوئی اور لفظ آزمائیں۔", ru: "Ничего не найдено. Попробуйте другое слово.", bn: "কিছু পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।", fa: "چیزی یافت نشد. کلمهٔ دیگری امتحان کنید.", id: "Tidak ada hasil. Coba kata lain.", ms: "Tiada padanan. Cuba perkataan lain.", tr: "Eşleşme yok. Farklı bir kelime deneyin.", fr: "Aucun résultat. Essayez un autre mot.", de: "Keine Treffer. Versuche ein anderes Wort." },

  // Feelings
  "feel.title":    { en: "How are you feeling right now?", ur: "آپ ابھی کیسا محسوس کر رہے ہیں؟", ru: "Как вы сейчас себя чувствуете?", bn: "আপনি এখন কেমন অনুভব করছেন?", fa: "الان چه احساسی دارید؟", id: "Bagaimana perasaanmu sekarang?", ms: "Bagaimana perasaan kamu sekarang?", tr: "Şu an nasıl hissediyorsun?", fr: "Comment vous sentez-vous en ce moment ?", de: "Wie fühlst du dich gerade?" },
  "feel.sub":      {
    en: "Pick a mood. For each feeling, the Prophet ﷺ taught a short remembrance — a kalima you can repeat like a heartbeat. Tap a mood to begin.",
    ur: "ایک احساس چنیں۔ ہر احساس کے لیے نبی ﷺ نے ایک مختصر ذکر سکھایا — ایک کلمہ جسے آپ دل کی دھڑکن کی طرح دہرا سکتے ہیں۔ شروع کرنے کے لیے کسی احساس پر ٹیپ کریں۔",
    ru: "Выберите состояние. Для каждого чувства Пророк ﷺ научил короткому поминанию — калиме, которую можно повторять как биение сердца. Нажмите, чтобы начать.",
    bn: "একটি অনুভূতি বেছে নিন। প্রতিটি অনুভূতির জন্য নবী ﷺ একটি সংক্ষিপ্ত জিকির শিখিয়েছেন — একটি কালিমা যা আপনি হৃদস্পন্দনের মতো পুনরাবৃত্তি করতে পারেন। শুরু করতে ট্যাপ করুন।",
    fa: "یک احساس را انتخاب کنید. برای هر احساس، پیامبر ﷺ ذکری کوتاه آموخته است — کلمه‌ای که مانند ضربان قلب تکرار می‌کنید. برای شروع لمس کنید.",
    id: "Pilih suasana hati. Untuk tiap perasaan, Nabi ﷺ mengajarkan zikir singkat — kalimah yang dapat kamu ulang seperti detak jantung. Ketuk untuk mulai.",
    ms: "Pilih perasaan. Untuk setiap perasaan, Nabi ﷺ mengajar zikir pendek — kalimah yang boleh kamu ulang seperti degupan jantung. Ketik untuk mula.",
    tr: "Bir duygu seç. Her duygu için Peygamber ﷺ kısa bir zikir öğretti — kalp atışı gibi tekrar edebileceğin bir kelime. Başlamak için dokun.",
    fr: "Choisissez un état. Pour chaque émotion, le Prophète ﷺ a enseigné une brève invocation — une kalima à répéter comme un battement de cœur. Touchez pour commencer.",
    de: "Wähle ein Gefühl. Für jedes Gefühl lehrte der Prophet ﷺ ein kurzes Gedenken — eine Kalima, die du wie einen Herzschlag wiederholen kannst. Tippe zum Beginnen.",
  },

  // Today
  "today.eyebrow": { en: "Today's Guidance", ur: "آج کی رہنمائی", ru: "Наставление на сегодня", bn: "আজকের পথনির্দেশ", fa: "راهنمای امروز", id: "Panduan Hari Ini", ms: "Panduan Hari Ini", tr: "Bugünün Rehberi", fr: "Guidance du jour", de: "Rechtleitung heute" },
  "today.sub":     { en: "Five small things. Take them slowly.", ur: "پانچ چھوٹی چیزیں۔ آہستہ آہستہ لیں۔", ru: "Пять малых вещей. Не спешите.", bn: "পাঁচটি ছোট বিষয়। ধীরে ধীরে গ্রহণ করুন।", fa: "پنج چیز کوچک. آرام‌آرام دریافت کنید.", id: "Lima hal kecil. Nikmati perlahan.", ms: "Lima perkara kecil. Ambil perlahan-lahan.", tr: "Beş küçük şey. Yavaşça al.", fr: "Cinq petites choses. Prenez-les lentement.", de: "Fünf kleine Dinge. Nimm sie langsam." },

  // Settings
  "settings.title":    { en: "Settings", ur: "ترتیبات", ru: "Настройки", bn: "সেটিংস", fa: "تنظیمات", id: "Pengaturan", ms: "Tetapan", tr: "Ayarlar", fr: "Paramètres", de: "Einstellungen" },
  "settings.language": { en: "Preferred language", ur: "پسندیدہ زبان", ru: "Предпочитаемый язык", bn: "পছন্দের ভাষা", fa: "زبان دلخواه", id: "Bahasa pilihan", ms: "Bahasa pilihan", tr: "Tercih edilen dil", fr: "Langue préférée", de: "Bevorzugte Sprache" },
  "settings.langHint": {
    en: "Translations of verses and kalimas appear in this language. The Quran recitation is always in Arabic. Translation audio is currently available only for English and Urdu.",
    ur: "آیات اور کلمات کے ترجمے اس زبان میں ظاہر ہوں گے۔ قرآن کی تلاوت ہمیشہ عربی میں ہوتی ہے۔ ترجمے کی آواز فی الحال صرف انگریزی اور اردو کے لیے دستیاب ہے۔",
    ru: "Переводы аятов и калим отображаются на этом языке. Чтение Корана всегда на арабском. Аудио перевода пока доступно только для английского и урду.",
    bn: "আয়াত ও কালিমার অনুবাদ এই ভাষায় দেখাবে। কুরআনের তেলাওয়াত সর্বদা আরবিতে। অনুবাদের অডিও এখন শুধু ইংরেজি ও উর্দুতে উপলব্ধ।",
    fa: "ترجمهٔ آیات و کلمات به این زبان نمایش داده می‌شود. تلاوت قرآن همیشه به عربی است. صوت ترجمه در حال حاضر تنها برای انگلیسی و اردو موجود است.",
    id: "Terjemahan ayat dan kalimah tampil dalam bahasa ini. Bacaan Al-Qur'an selalu dalam bahasa Arab. Audio terjemahan saat ini hanya tersedia untuk bahasa Inggris dan Urdu.",
    ms: "Terjemahan ayat dan kalimah dipaparkan dalam bahasa ini. Bacaan Al-Qur'an sentiasa dalam bahasa Arab. Audio terjemahan buat masa ini hanya tersedia untuk Inggeris dan Urdu.",
    tr: "Âyet ve kelimelerin çevirileri bu dilde görünür. Kur'an tilaveti daima Arapçadır. Çeviri sesi şimdilik yalnızca İngilizce ve Urduca için mevcuttur.",
    fr: "Les traductions des versets et des kalimas apparaissent dans cette langue. La récitation du Coran est toujours en arabe. L'audio des traductions n'est actuellement disponible qu'en anglais et en ourdou.",
    de: "Übersetzungen von Versen und Kalimas erscheinen in dieser Sprache. Die Koran-Rezitation ist stets auf Arabisch. Übersetzungs-Audio ist derzeit nur auf Englisch und Urdu verfügbar.",
  },
  "settings.reciter":  { en: "Reciter", ur: "قاری", ru: "Чтец", bn: "ক্বারী", fa: "قاری", id: "Qari", ms: "Qari", tr: "Kari", fr: "Récitateur", de: "Rezitator" },
  "settings.autoplay": { en: "Autoplay next verse", ur: "اگلی آیت خودکار چلائیں", ru: "Автовоспроизведение следующего аята", bn: "পরবর্তী আয়াত স্বয়ংক্রিয় চালু", fa: "پخش خودکار آیهٔ بعدی", id: "Putar otomatis ayat berikutnya", ms: "Main auto ayat seterusnya", tr: "Sonraki âyeti otomatik oynat", fr: "Lecture automatique du verset suivant", de: "Nächsten Vers automatisch abspielen" },
  "settings.autoplayHint": { en: "Continue to next verse automatically", ur: "خود بخود اگلی آیت پر جائیں", ru: "Автоматически переходить к следующему аяту", bn: "স্বয়ংক্রিয়ভাবে পরবর্তী আয়াতে যান", fa: "به‌طور خودکار به آیهٔ بعدی برو", id: "Lanjut otomatis ke ayat berikutnya", ms: "Sambung ke ayat berikutnya secara automatik", tr: "Sonraki âyete otomatik geç", fr: "Passer automatiquement au verset suivant", de: "Automatisch zum nächsten Vers weitergehen" },
  "settings.save":     { en: "Save preferences", ur: "ترجیحات محفوظ کریں", ru: "Сохранить настройки", bn: "পছন্দ সংরক্ষণ করুন", fa: "ذخیرهٔ تنظیمات", id: "Simpan preferensi", ms: "Simpan keutamaan", tr: "Tercihleri kaydet", fr: "Enregistrer les préférences", de: "Einstellungen speichern" },
  "settings.saved":    { en: "Preferences saved", ur: "ترجیحات محفوظ ہو گئیں", ru: "Настройки сохранены", bn: "পছন্দ সংরক্ষিত হয়েছে", fa: "تنظیمات ذخیره شد", id: "Preferensi tersimpan", ms: "Keutamaan disimpan", tr: "Tercihler kaydedildi", fr: "Préférences enregistrées", de: "Einstellungen gespeichert" },
  "settings.saveErr":  { en: "Could not save preferences", ur: "ترجیحات محفوظ نہ ہو سکیں", ru: "Не удалось сохранить настройки", bn: "পছন্দ সংরক্ষণ করা যায়নি", fa: "ذخیرهٔ تنظیمات ممکن نشد", id: "Tidak dapat menyimpan preferensi", ms: "Tidak dapat menyimpan keutamaan", tr: "Tercihler kaydedilemedi", fr: "Impossible d'enregistrer les préférences", de: "Einstellungen konnten nicht gespeichert werden" },
  "settings.terms":    { en: "Terms and Conditions", ur: "شرائط و ضوابط", ru: "Условия использования", bn: "শর্তাবলী", fa: "شرایط و ضوابط", id: "Syarat dan Ketentuan", ms: "Terma dan Syarat", tr: "Şartlar ve Koşullar", fr: "Conditions générales", de: "Nutzungsbedingungen" },
  "settings.privacy":  { en: "Privacy Policy", ur: "پرائیویسی پالیسی", ru: "Политика конфиденциальности", bn: "গোপনীয়তা নীতি", fa: "سیاست حریم خصوصی", id: "Kebijakan Privasi", ms: "Dasar Privasi", tr: "Gizlilik Politikası", fr: "Politique de confidentialité", de: "Datenschutzerklärung" },
};

export function t(key: keyof typeof UI, lang: LangCode): string {
  const entry = UI[key];
  if (!entry) return String(key);
  return entry[lang] ?? entry.en;
}

export function useT(): (key: keyof typeof UI) => string {
  const [lang] = useLanguage();
  return (key) => t(key, lang);
}
