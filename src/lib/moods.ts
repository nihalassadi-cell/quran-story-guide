// Curated mood → kalima + verse mappings for the "How are you feeling?" experience.
// All user-facing text fields (translation, why, reason, blurb) are localized maps;
// resolve with `tr(value, lang)` from "@/lib/language".
//
// `arabic`, `transliteration` and `source` are intentionally NOT localized:
// — Arabic is the original text
// — transliteration is a universal romanization
// — `source` is a hadith/Qur'an citation reference

import type { Localized } from "@/lib/language";

export interface MoodVerse {
  surah: number;
  verse: number;
  surahName: string;
  reason: Localized;
}

export interface Kalima {
  arabic: string;
  transliteration: string;
  translation: Localized;
  repeat: number;
  source: string;
  why: Localized;
  ayah?: { surah: number; verse: number };
}

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  blurb: Localized;
  kalimas: Kalima[];
  kalima: Kalima;
  verses: MoodVerse[];
}

// ---- Reusable kalimas ----
const SUBHANALLAH_BIHAMDIH: Kalima = {
  arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
  transliteration: "Subḥāna-llāhi wa bi-ḥamdih, subḥāna-llāhi-l-ʿaẓīm",
  translation: {
    en: "Glory to Allah and praise to Him; glory to Allah the Magnificent.",
    ur: "اللہ پاک ہے اور اسی کی تعریف ہے، اللہ پاک ہے جو عظیم ہے۔",
    hi: "अल्लाह पाक है और उसी की प्रशंसा है, अल्लाह पाक है जो महान है।",
    bn: "মহিমা আল্লাহর এবং সকল প্রশংসা তাঁরই; মহিমা মহান আল্লাহর।",
    fa: "پاک و منزه است خدا و ستایش از آنِ اوست؛ پاک و منزه است خدای بزرگ.",
    id: "Mahasuci Allah dan segala puji bagi-Nya; Mahasuci Allah Yang Mahaagung.",
    ms: "Maha Suci Allah dan segala puji bagi-Nya; Maha Suci Allah Yang Maha Agung.",
    tr: "Allah'ı tüm övgülerle tesbih ederim; yüce Allah'ı tesbih ederim.",
    fr: "Gloire à Allah et louange à Lui ; gloire à Allah le Magnifique.",
    de: "Gepriesen sei Allah und Ihm sei Lob; gepriesen sei Allah, der Gewaltige.",
  },
  repeat: 100,
  source: "Bukhari 6406, Muslim 2694 — “two phrases light on the tongue, heavy on the scales, beloved to the Most Merciful.”",
  why: {
    en: "When the heart needs steady ground, return to the two phrases the Prophet ﷺ called the heaviest on the scales.",
    ur: "جب دل کو سکون چاہیے، انہی دو کلمات کی طرف لوٹیں جنہیں نبی ﷺ نے میزان میں سب سے بھاری بتایا۔",
    hi: "जब दिल को सुकून चाहिए, उन्हीं दो कलिमों की ओर लौटें जिन्हें नबी ﷺ ने तराज़ू में सबसे भारी कहा।",
    bn: "যখন হৃদয়ের শান্তি দরকার, ফিরে যান সেই দুই বাক্যে যা নবী ﷺ পাল্লায় সবচেয়ে ভারী বলেছেন।",
    fa: "وقتی دل آرامش می‌خواهد، به همان دو جمله‌ای بازگردید که پیامبر ﷺ سنگین‌ترین در ترازو خواند.",
    id: "Saat hati butuh ketenangan, kembalilah pada dua kalimat yang disebut Nabi ﷺ paling berat di timbangan.",
    ms: "Apabila hati memerlukan ketenangan, kembalilah kepada dua kalimah yang Nabi ﷺ sebut paling berat di neraca.",
    tr: "Kalp huzur aradığında, Peygamber ﷺ'in mizanda en ağır dediği iki söze dön.",
    fr: "Quand le cœur cherche la stabilité, reviens aux deux phrases que le Prophète ﷺ a dites les plus lourdes dans la balance.",
    de: "Wenn das Herz Halt sucht, kehre zu den zwei Worten zurück, die der Prophet ﷺ als schwerste auf der Waage nannte.",
  },
};

const HASBIYALLAH: Kalima = {
  arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
  transliteration: "Ḥasbiya-llāhu, lā ilāha illā huwa, ʿalayhi tawakkaltu wa huwa rabbu-l-ʿarshi-l-ʿaẓīm",
  translation: {
    en: "Allah is enough for me — there is no god but Him. In Him I trust, and He is Lord of the magnificent throne.",
    ur: "اللہ مجھے کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر میں نے بھروسا کیا، اور وہ عرشِ عظیم کا رب ہے۔",
    hi: "अल्लाह मेरे लिए काफ़ी है, उसके सिवा कोई पूज्य नहीं, उसी पर मैंने भरोसा किया, और वही महान अर्श का रब है।",
    bn: "আল্লাহই আমার জন্য যথেষ্ট, তিনি ছাড়া কোনো ইলাহ নেই; তাঁরই উপর আমি ভরসা করেছি, তিনিই মহান আরশের রব।",
    fa: "خدا مرا کافی است؛ معبودی جز او نیست؛ بر او توکل کردم و او پروردگار عرش بزرگ است.",
    id: "Cukuplah Allah bagiku — tiada tuhan selain Dia. Kepada-Nya aku bertawakal, dan Dialah Tuhan ʿArsy yang agung.",
    ms: "Cukuplah Allah bagiku — tiada tuhan selain Dia. Kepada-Nya aku bertawakal, dan Dialah Tuhan ʿArasy yang agung.",
    tr: "Allah bana yeter; O'ndan başka ilah yoktur. O'na güvendim; O büyük arşın Rabbidir.",
    fr: "Allah me suffit — il n'y a de dieu que Lui. C'est en Lui que je place ma confiance, et Il est le Seigneur du Trône immense.",
    de: "Mir genügt Allah — kein Gott außer Ihm. Auf Ihn vertraue ich, und Er ist der Herr des gewaltigen Throns.",
  },
  repeat: 7,
  source: "Abū Dāwūd 5081 — recite seven times: “Allah will suffice him in whatever worries him.”",
  why: {
    en: "When you feel alone or overrun, the Prophet ﷺ taught: say it seven times — Allah is enough.",
    ur: "جب تنہائی یا پریشانی گھیر لے، نبی ﷺ نے سکھایا: سات بار پڑھو — اللہ کافی ہے۔",
    hi: "जब अकेलापन या परेशानी घेर ले, नबी ﷺ ने सिखाया: सात बार पढ़ो — अल्लाह काफ़ी है।",
    bn: "যখন একাকীত্ব বা চাপ ঘিরে ধরে, নবী ﷺ শিখিয়েছেন: সাতবার পড়ো — আল্লাহই যথেষ্ট।",
    fa: "وقتی تنهایی یا فشار سراغت می‌آید، پیامبر ﷺ آموخت: هفت بار بگو — خدا کافی است.",
    id: "Saat sendiri atau terhimpit, Nabi ﷺ mengajarkan: ucapkan tujuh kali — Allah cukup.",
    ms: "Apabila terasa sunyi atau tertekan, Nabi ﷺ mengajar: sebutlah tujuh kali — Allah mencukupi.",
    tr: "Yalnız ya da çaresiz hissettiğinde, Peygamber ﷺ öğretti: yedi kez söyle — Allah yeter.",
    fr: "Quand tu te sens seul ou submergé, le Prophète ﷺ a enseigné : dis-le sept fois — Allah suffit.",
    de: "Wenn du dich allein oder überwältigt fühlst, lehrte der Prophet ﷺ: sprich es siebenmal — Allah genügt.",
  },
};

const ISTIGHFAR: Kalima = {
  arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  transliteration: "Astaghfiru-llāha wa atūbu ilayh",
  translation: {
    en: "I seek Allah's forgiveness and turn back to Him.",
    ur: "میں اللہ سے بخشش مانگتا/مانگتی ہوں اور اسی کی طرف توبہ کرتا/کرتی ہوں۔",
    hi: "मैं अल्लाह से क्षमा मांगता/मांगती हूँ और उसी की ओर तौबा करता/करती हूँ।",
    bn: "আমি আল্লাহর কাছে ক্ষমা চাই এবং তাঁর দিকেই ফিরে আসি।",
    fa: "از خدا آمرزش می‌خواهم و به سوی او باز می‌گردم.",
    id: "Aku memohon ampun kepada Allah dan bertobat kepada-Nya.",
    ms: "Aku memohon keampunan Allah dan bertaubat kepada-Nya.",
    tr: "Allah'tan bağışlanma diler ve O'na yönelirim.",
    fr: "Je demande pardon à Allah et je reviens à Lui.",
    de: "Ich bitte Allah um Vergebung und kehre zu Ihm zurück.",
  },
  repeat: 100,
  source: "Bukhari 6307, Muslim 2702 — the Prophet ﷺ said it more than seventy times daily.",
  why: {
    en: "Abū Dāwūd 1518: “Whoever persists on istighfār — Allah makes a way out of every distress.”",
    ur: "ابو داود ۱۵۱۸: جو استغفار پر قائم رہے، اللہ ہر تکلیف سے نکلنے کا راستہ بنا دیتا ہے۔",
    hi: "अबू दाऊद १५१८: जो इस्तिग़फ़ार पर क़ायम रहे, अल्लाह हर तकलीफ़ से निकलने का रास्ता बना देता है।",
    bn: "আবূ দাউদ ১৫১৮: যে ইস্তেগফারে অবিচল থাকে, আল্লাহ তার প্রতিটি কষ্টে পথ বের করে দেন।",
    fa: "ابوداود ۱۵۱۸: هر کس بر استغفار پایدار باشد، خدا از هر اندوهی راه گشایی می‌کند.",
    id: "Abu Dawud 1518: Siapa yang istiqamah beristighfar, Allah jadikan jalan keluar dari setiap kesulitan.",
    ms: "Abu Daud 1518: Sesiapa yang berterusan beristighfar, Allah jadikan jalan keluar dari setiap kesempitan.",
    tr: "Ebu Davud 1518: İstiğfara devam edene Allah her sıkıntıdan bir çıkış yaratır.",
    fr: "Abū Dāwūd 1518 : « Qui persiste dans l'istighfār — Allah lui ouvre une issue à toute détresse. »",
    de: "Abū Dāwūd 1518: Wer beim Istighfār beharrt — Allah schafft ihm aus jeder Bedrängnis einen Ausweg.",
  },
};

const LA_HAWLA: Kalima = {
  arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  transliteration: "Lā ḥawla wa lā quwwata illā billāh",
  translation: {
    en: "There is no power and no strength except with Allah.",
    ur: "نہ کوئی حرکت ہے اور نہ طاقت مگر اللہ کی توفیق سے۔",
    hi: "न कोई शक्ति है और न ही ताक़त सिवाय अल्लाह की मदद के।",
    bn: "আল্লাহর সাহায্য ছাড়া কোনো ক্ষমতা ও শক্তি নেই।",
    fa: "هیچ حرکت و نیرویی نیست مگر به یاری خدا.",
    id: "Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
    ms: "Tiada daya dan kekuatan melainkan dengan pertolongan Allah.",
    tr: "Güç ve kuvvet ancak Allah iledir.",
    fr: "Il n'y a de puissance ni de force qu'en Allah.",
    de: "Es gibt keine Macht und keine Kraft außer bei Allah.",
  },
  repeat: 100,
  source: "Bukhari 6384, Muslim 2704 — “a treasure from the treasures of Paradise.”",
  why: {
    en: "Hand the weight back to the One who actually carries it. Ibn al-Qayyim: a cure for ninety-nine ailments — the lightest of which is grief.",
    ur: "بوجھ اس کے سپرد کر دو جو واقعی اٹھاتا ہے۔ ابن القیم: ننانوے بیماریوں کی دوا — جن میں ہلکی ترین غم ہے۔",
    hi: "बोझ उसी को सौंप दो जो असल में उठाता है। इब्न क़य्यिम: निन्यानवे रोगों की दवा — जिनमें सबसे हल्का ग़म है।",
    bn: "ভার তাঁকেই ফিরিয়ে দাও যিনি প্রকৃতই বহন করেন। ইবন আল-কাইয়িম: নিরানব্বইটি রোগের ঔষধ — যার সবচেয়ে হালকাটি দুঃখ।",
    fa: "بار را به همان کسی بسپار که در حقیقت آن را برمی‌دارد. ابن‌قیّم: درمان نود و نه درد — که سبک‌ترینش اندوه است.",
    id: "Serahkan beban kepada Dia yang sesungguhnya memikulnya. Ibnu al-Qayyim: obat sembilan puluh sembilan penyakit — yang teringan adalah duka.",
    ms: "Serahkan beban kepada Dia yang sebenarnya memikulnya. Ibn al-Qayyim: ubat sembilan puluh sembilan penyakit — yang paling ringan ialah kesedihan.",
    tr: "Yükü, gerçekten taşıyan O'na geri ver. İbn Kayyim: doksan dokuz derdin ilacı — en hafifi üzüntüdür.",
    fr: "Remets le poids à Celui qui le porte vraiment. Ibn al-Qayyim : un remède à quatre-vingt-dix-neuf maux — le plus léger étant le chagrin.",
    de: "Gib die Last Dem zurück, der sie wirklich trägt. Ibn al-Qayyim: ein Heilmittel für neunundneunzig Leiden — das leichteste davon ist Kummer.",
  },
};

const YA_HAYYU: Kalima = {
  arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
  transliteration: "Yā Ḥayyu yā Qayyūm, bi-raḥmatika astaghīth",
  translation: {
    en: "O Ever-Living, O Sustainer — by Your mercy I seek relief.",
    ur: "اے زندہ، اے قائم رکھنے والے، تیری رحمت کے واسطے میں مدد چاہتا/چاہتی ہوں۔",
    hi: "ऐ सदा जीवित, ऐ क़ायम रखने वाले, तेरी रहमत के सहारे मैं मदद चाहता/चाहती हूँ।",
    bn: "হে চিরঞ্জীব, হে স্বনির্ভর — তোমার রহমতের ওসিলায় আমি সাহায্য চাই।",
    fa: "ای زنده، ای پایدار، به رحمتت یاری می‌جویم.",
    id: "Wahai Yang Maha Hidup, Yang Maha Berdiri Sendiri — dengan rahmat-Mu aku memohon pertolongan.",
    ms: "Wahai Yang Maha Hidup, Maha Berdiri Sendiri — dengan rahmat-Mu aku memohon pertolongan.",
    tr: "Ey Hayy, ey Kayyûm — rahmetinle imdat dilerim.",
    fr: "Ô Vivant, Ô Subsistant — par Ta miséricorde, je sollicite Ton secours.",
    de: "O Lebendiger, o Beständiger — bei Deiner Barmherzigkeit suche ich Beistand.",
  },
  repeat: 33,
  source: "Tirmidhī 3524 — the Prophet ﷺ would say it in moments of distress.",
  why: {
    en: "When grief is too large for sentences: two of His names and one need — His mercy.",
    ur: "جب غم الفاظ سے بڑا ہو: اس کے دو نام اور ایک ضرورت — اس کی رحمت۔",
    hi: "जब ग़म शब्दों से बड़ा हो: उसके दो नाम और एक ज़रूरत — उसकी रहमत।",
    bn: "যখন দুঃখ ভাষার চেয়ে বড়: তাঁর দুটি নাম এবং একটি প্রয়োজন — তাঁর রহমত।",
    fa: "وقتی غم از کلمات بزرگ‌تر است: دو نام او و یک نیاز — رحمت او.",
    id: "Saat duka melampaui kata: dua nama-Nya dan satu kebutuhan — rahmat-Nya.",
    ms: "Apabila kesedihan melampaui kata: dua nama-Nya dan satu keperluan — rahmat-Nya.",
    tr: "Üzüntü kelimelerden büyük olduğunda: O'nun iki ismi ve tek bir ihtiyaç — O'nun rahmeti.",
    fr: "Quand le chagrin dépasse les mots : deux de Ses noms et un seul besoin — Sa miséricorde.",
    de: "Wenn der Kummer größer ist als Worte: zwei Seiner Namen und ein Bedürfnis — Seine Barmherzigkeit.",
  },
};

const HASBUNALLAH: Kalima = {
  arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
  transliteration: "Ḥasbunā-llāhu wa niʿma-l-wakīl",
  translation: {
    en: "Allah is sufficient for us — the best Disposer of affairs.",
    ur: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔",
    hi: "हमारे लिए अल्लाह काफ़ी है और वह बेहतरीन कारसाज़ है।",
    bn: "আমাদের জন্য আল্লাহই যথেষ্ট, তিনিই উত্তম কার্যনির্বাহক।",
    fa: "خدا ما را بس است و او بهترین کارساز است.",
    id: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
    ms: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
    tr: "Allah bize yeter; O ne güzel vekildir.",
    fr: "Allah nous suffit — Il est le meilleur Garant.",
    de: "Allah genügt uns — Er ist der beste Sachwalter.",
  },
  repeat: 70,
  source: "Qur'an 3:173 · Bukhari 4563 — said by Ibrāhīm ﷺ in the fire and by the Prophet ﷺ at Uḥud.",
  why: {
    en: "Words spoken inside flames and on a battlefield — they did not burn, they did not lose. Borrow them.",
    ur: "آگ کے اندر اور میدانِ جنگ میں کہے گئے کلمات — نہ جلے، نہ ہارے۔ انہیں اپنا لیں۔",
    hi: "आग के अंदर और जंग के मैदान में कहे गए शब्द — न जले, न हारे। इन्हें अपना लो।",
    bn: "আগুনের মধ্যে আর যুদ্ধক্ষেত্রে উচ্চারিত কথা — তারা পোড়েনি, হারেনি। এ কথাগুলো ধার নাও।",
    fa: "سخنانی که در دل آتش و میدان نبرد گفته شد — نه سوختند و نه شکست خوردند. آن‌ها را بگو.",
    id: "Kalimat yang diucapkan dalam api dan di medan perang — tak terbakar, tak kalah. Pinjam kalimat itu.",
    ms: "Kata-kata yang diucapkan di dalam api dan di medan perang — tidak terbakar, tidak kalah. Pinjamlah ia.",
    tr: "Ateşin içinde ve savaş meydanında söylenen sözler — yanmadılar, yenilmediler. Sen de söyle.",
    fr: "Des mots prononcés dans les flammes et sur un champ de bataille — ils n'ont ni brûlé ni perdu. Reprends-les.",
    de: "Worte, im Feuer und auf dem Schlachtfeld gesprochen — sie verbrannten nicht, sie verloren nicht. Leih sie dir.",
  },
  ayah: { surah: 3, verse: 173 },
};

const YUNUS_DUA: Kalima = {
  arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
  transliteration: "Lā ilāha illā anta, subḥānaka, innī kuntu mina-ẓ-ẓālimīn",
  translation: {
    en: "There is no god but You — glory be to You. Truly, I have been among the wrongdoers.",
    ur: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا/تھی۔",
    hi: "तेरे सिवा कोई पूज्य नहीं, तू पाक है, बेशक मैं ज़ालिमों में से था/थी।",
    bn: "তুমি ছাড়া কোনো ইলাহ নেই, তুমি পবিত্র, নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।",
    fa: "معبودی جز تو نیست، پاک و منزهی، براستی من از ستمکاران بودم.",
    id: "Tiada tuhan selain Engkau, Mahasuci Engkau; sungguh aku termasuk orang-orang yang zalim.",
    ms: "Tiada tuhan selain Engkau, Maha Suci Engkau; sesungguhnya aku tergolong orang-orang yang zalim.",
    tr: "Senden başka ilah yoktur; Seni tenzih ederim; doğrusu ben zalimlerden oldum.",
    fr: "Il n'y a de dieu que Toi — gloire à Toi. En vérité, j'ai été parmi les injustes.",
    de: "Es gibt keinen Gott außer Dir — gepriesen seist Du. Wahrlich, ich gehörte zu den Ungerechten.",
  },
  repeat: 40,
  source: "Qur'an 21:87 · Tirmidhī 3505 — the duʿāʾ of Yūnus ﷺ from the belly of the whale.",
  why: {
    en: "“No Muslim ever supplicates with these words for anything except Allah answers him.”",
    ur: "”جو مسلمان بھی ان کلمات سے کسی چیز کی دعا کرے، اللہ اسے قبول فرما لیتا ہے۔“",
    hi: "”जो भी मुसलमान इन शब्दों से कोई दुआ माँगे, अल्लाह उसे क़ुबूल फ़रमाता है।“",
    bn: "“কোনো মুসলিম এই শব্দে যা-ই চায়, আল্লাহ তার দু‘আ কবুল করেন।”",
    fa: "«هیچ مسلمانی با این کلمات چیزی نخواست، مگر اینکه خدا اجابتش کرد.»",
    id: "“Tidaklah seorang Muslim berdoa dengan kalimat ini untuk sesuatu, kecuali Allah mengabulkannya.”",
    ms: "“Tidaklah seorang Muslim berdoa dengan kalimat ini untuk sesuatu, melainkan Allah mengabulkannya.”",
    tr: "“Bir Müslüman bu sözlerle ne dilerse, Allah onun duasını kabul eder.”",
    fr: "« Aucun musulman n'invoque par ces mots pour quoi que ce soit sans qu'Allah ne l'exauce. »",
    de: "„Kein Muslim ruft mit diesen Worten um etwas, ohne dass Allah ihn erhört.“",
  },
  ayah: { surah: 21, verse: 87 },
};

const TAHLIL: Kalima = {
  arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahu-l-mulku wa lahu-l-ḥamd, wa huwa ʿalā kulli shay'in qadīr",
  translation: {
    en: "There is no god but Allah, alone, with no partner. To Him belongs the dominion and all praise — and He is over all things able.",
    ur: "اللہ کے سوا کوئی معبود نہیں، اکیلا ہے، اس کا کوئی شریک نہیں؛ اسی کے لیے بادشاہت ہے اور اسی کے لیے سب تعریف، اور وہ ہر چیز پر قادر ہے۔",
    hi: "अल्लाह के सिवा कोई पूज्य नहीं, अकेला है, उसका कोई साझी नहीं; उसी की बादशाहत है और उसी की प्रशंसा, और वह हर चीज़ पर क़ादिर है।",
    bn: "আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একক, তাঁর কোনো শরীক নেই; রাজত্ব তাঁরই, প্রশংসা তাঁরই, এবং তিনি সর্ববিষয়ে সর্বশক্তিমান।",
    fa: "معبودی جز خدا نیست، یگانه است و شریکی ندارد؛ فرمانروایی و ستایش از آنِ اوست و او بر هر چیز تواناست.",
    id: "Tiada tuhan selain Allah, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan segala puji, dan Dia Mahakuasa atas segala sesuatu.",
    ms: "Tiada tuhan selain Allah, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan segala puji, dan Dia Maha Berkuasa atas segala sesuatu.",
    tr: "Allah'tan başka ilah yoktur; tektir, ortağı yoktur. Mülk O'nun, hamd O'nundur; O her şeye kâdirdir.",
    fr: "Il n'y a de dieu qu'Allah, seul, sans associé. À Lui la royauté et à Lui la louange — Il est Omnipotent sur toute chose.",
    de: "Es gibt keinen Gott außer Allah, allein, ohne Partner. Sein ist die Herrschaft und Ihm gebührt das Lob — Er hat Macht über alle Dinge.",
  },
  repeat: 100,
  source: "Bukhari 3293, Muslim 2691 — equal to freeing ten slaves; a fortress until evening.",
  why: {
    en: "The sentence that contains everything. Hope is built on the truth of who runs the universe.",
    ur: "وہ جملہ جو سب کچھ سمیٹے ہوئے ہے۔ امید اس حقیقت پر ٹکی ہے کہ کائنات کس کے قبضے میں ہے۔",
    hi: "वह वाक्य जिसमें सब कुछ है। उम्मीद इस सच पर टिकी है कि कायनात किसकी मुट्ठी में है।",
    bn: "যে বাক্যে সবকিছু আছে। আশা গড়ে ওঠে এই সত্যের ওপর — মহাবিশ্ব কার হাতে চলে।",
    fa: "جمله‌ای که همه چیز را در بر دارد. امید بر این حقیقت بنا می‌شود که جهان به دست کیست.",
    id: "Kalimat yang merangkum segalanya. Harapan dibangun di atas kebenaran: siapa yang mengatur semesta.",
    ms: "Kalimat yang merangkumi segalanya. Harapan dibina atas kebenaran: siapa yang mengatur alam.",
    tr: "Her şeyi içeren cümle. Umut, evreni yönetenin kim olduğu gerçeği üzerine kurulur.",
    fr: "La phrase qui contient tout. L'espoir repose sur la vérité : qui gouverne l'univers.",
    de: "Der Satz, der alles enthält. Hoffnung gründet auf der Wahrheit, wer das Universum lenkt.",
  },
};

const TAAWUDH: Kalima = {
  arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
  transliteration: "Aʿūdhu billāhi mina-sh-shayṭāni-r-rajīm",
  translation: {
    en: "I seek refuge in Allah from the accursed Satan.",
    ur: "میں مردود شیطان سے اللہ کی پناہ مانگتا/مانگتی ہوں۔",
    hi: "मैं धिक्कारे हुए शैतान से अल्लाह की पनाह माँगता/माँगती हूँ।",
    bn: "আমি অভিশপ্ত শয়তান থেকে আল্লাহর আশ্রয় চাই।",
    fa: "از شیطانِ رانده‌شده به خدا پناه می‌برم.",
    id: "Aku berlindung kepada Allah dari syaitan yang terkutuk.",
    ms: "Aku berlindung kepada Allah daripada syaitan yang direjam.",
    tr: "Kovulmuş şeytanın şerrinden Allah'a sığınırım.",
    fr: "Je cherche refuge en Allah contre Satan le banni.",
    de: "Ich suche Zuflucht bei Allah vor dem verfluchten Satan.",
  },
  repeat: 7,
  source: "Bukhari 3282, Muslim 2610 — the Prophet ﷺ told an angry man this would calm him.",
  why: {
    en: "Anger is Shayṭān's heat in your chest. Name the source, name the cure — say it, sit down, drink water.",
    ur: "غصہ شیطان کی آگ ہے۔ ماخذ کو پہچانو، علاج کو پہچانو — یہ کہو، بیٹھ جاؤ، پانی پیو۔",
    hi: "गुस्सा शैतान की गर्मी है। स्रोत पहचानो, इलाज पहचानो — यह कहो, बैठ जाओ, पानी पियो।",
    bn: "রাগ শয়তানের আগুন। উৎস চেনো, ওষুধ চেনো — এটি বলো, বসে পড়ো, পানি পান করো।",
    fa: "خشم آتش شیطان است. منشأ را بشناس و درمان را — این را بگو، بنشین، آب بنوش.",
    id: "Marah adalah panas syaitan di dada. Sebut sumbernya, sebut obatnya — ucapkan, duduk, minum air.",
    ms: "Kemarahan ialah bara syaitan di dada. Kenali puncanya, kenali penawarnya — sebutlah, duduk, minum air.",
    tr: "Öfke şeytanın göğsündeki ateşidir. Kaynağı söyle, çareyi söyle — söyle, otur, su iç.",
    fr: "La colère est le feu de Shayṭān dans la poitrine. Nomme la source, nomme le remède — dis-le, assieds-toi, bois de l'eau.",
    de: "Zorn ist die Hitze Shayṭāns in deiner Brust. Benenne die Quelle, benenne das Heilmittel — sprich es, setz dich hin, trink Wasser.",
  },
};

const ALHAMDU_NIMAH: Kalima = {
  arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
  transliteration: "Al-ḥamdu lillāhi-lladhī bi-niʿmatihi tatimmu-ṣ-ṣāliḥāt",
  translation: {
    en: "All praise is for Allah by whose favour all good things are completed.",
    ur: "تمام تعریفیں اس اللہ کے لیے ہیں جس کی نعمت سے ساری نیکیاں پوری ہوتی ہیں۔",
    hi: "सारी प्रशंसा उस अल्लाह के लिए है जिसकी नेमत से सारी अच्छाइयाँ पूरी होती हैं।",
    bn: "সকল প্রশংসা সেই আল্লাহর, যাঁর অনুগ্রহে সব ভালো কিছু সম্পূর্ণ হয়।",
    fa: "ستایش از آنِ خدایی است که به نعمتش همه نیکی‌ها کامل می‌شود.",
    id: "Segala puji bagi Allah yang dengan nikmat-Nya segala kebaikan menjadi sempurna.",
    ms: "Segala puji bagi Allah yang dengan nikmat-Nya segala kebaikan menjadi sempurna.",
    tr: "Lütfuyla bütün iyiliklerin tamamlandığı Allah'a hamd olsun.",
    fr: "Louange à Allah, par la grâce duquel s'accomplissent toutes les bonnes choses.",
    de: "Alles Lob gebührt Allah, durch dessen Gunst alles Gute vollendet wird.",
  },
  repeat: 33,
  source: "Ibn Mājah 3803 — what the Prophet ﷺ said when something pleased him.",
  why: {
    en: "Gratitude is itself a doorway: “If you are grateful, I will surely increase you.” (Qur'an 14:7)",
    ur: "شکر خود ایک دروازہ ہے: ”اگر تم شکر کرو گے تو میں ضرور تمہیں زیادہ دوں گا۔“ (قرآن ۱۴:۷)",
    hi: "शुक्र खुद एक दरवाज़ा है: ”अगर तुम शुक्र करो, तो मैं तुम्हें और बढ़ा दूँगा।“ (क़ुरआन १४:७)",
    bn: "কৃতজ্ঞতা নিজেই একটি দ্বার: “যদি তোমরা শোকর কর, আমি অবশ্যই বাড়িয়ে দেব।” (কুরআন ১৪:৭)",
    fa: "شکر خود دروازه‌ای است: «اگر شکر کنید، البته بر شما خواهم افزود.» (قرآن ۱۴:۷)",
    id: "Syukur itu sendiri pintu: “Jika kamu bersyukur, pasti Aku akan menambah nikmat-Ku.” (QS 14:7)",
    ms: "Syukur itu sendiri pintu: “Jika kamu bersyukur, pasti Aku akan menambah nikmat-Ku.” (Quran 14:7)",
    tr: "Şükür başlı başına bir kapıdır: “Şükrederseniz elbette artırırım.” (Kur'an 14:7)",
    fr: "La gratitude est en soi une porte : « Si vous êtes reconnaissants, Je vous accroîtrai. » (Coran 14:7)",
    de: "Dankbarkeit ist selbst eine Tür: „Wenn ihr dankbar seid, werde Ich euch wahrlich mehr geben.“ (Koran 14:7)",
  },
};

const TASBIH_FATIMI_TASBIH: Kalima = {
  arabic: "سُبْحَانَ اللَّهِ",
  transliteration: "Subḥāna-llāh",
  translation: {
    en: "Glory be to Allah.",
    ur: "اللہ پاک ہے۔",
    hi: "अल्लाह पाक है।",
    bn: "মহিমা আল্লাহর।",
    fa: "پاک و منزه است خدا.",
    id: "Mahasuci Allah.",
    ms: "Maha Suci Allah.",
    tr: "Allah'ı tesbih ederim.",
    fr: "Gloire à Allah.",
    de: "Gepriesen sei Allah.",
  },
  repeat: 33,
  source: "Bukhari 3705 — the tasbīḥ of Fāṭimah ﷺ taught after every prayer and at rest.",
  why: {
    en: "When tongue and heart are tired, the lightest praise still tilts the scales.",
    ur: "جب زبان اور دل تھک جائیں، ہلکی سی تسبیح بھی میزان جھکا دیتی ہے۔",
    hi: "जब ज़बान और दिल थक जाएँ, सबसे हल्की तसबीह भी तराज़ू झुका देती है।",
    bn: "যখন জিভ ও হৃদয় ক্লান্ত, সবচেয়ে হালকা প্রশংসাও পাল্লা ভারী করে।",
    fa: "وقتی زبان و دل خسته‌اند، سبک‌ترین تسبیح هم ترازو را سنگین می‌کند.",
    id: "Saat lisan dan hati lelah, tasbih yang paling ringan pun masih memberatkan timbangan.",
    ms: "Apabila lidah dan hati letih, tasbih paling ringan pun masih memberatkan neraca.",
    tr: "Dil ve kalp yorulduğunda, en hafif tesbih bile mizanı eğer.",
    fr: "Quand la langue et le cœur sont fatigués, la plus légère louange penche encore la balance.",
    de: "Wenn Zunge und Herz müde sind, neigt selbst das leichteste Lob die Waage.",
  },
};

const TAHMID: Kalima = {
  arabic: "الْحَمْدُ لِلَّهِ",
  transliteration: "Al-ḥamdu lillāh",
  translation: {
    en: "All praise is due to Allah.",
    ur: "تمام تعریفیں اللہ کے لیے ہیں۔",
    hi: "सारी प्रशंसा अल्लाह के लिए है।",
    bn: "সকল প্রশংসা আল্লাহর।",
    fa: "همه ستایش‌ها از آنِ خداست.",
    id: "Segala puji bagi Allah.",
    ms: "Segala puji bagi Allah.",
    tr: "Hamd Allah'a mahsustur.",
    fr: "Louange à Allah.",
    de: "Alles Lob gebührt Allah.",
  },
  repeat: 33,
  source: "Muslim 223 — “Al-ḥamdu lillāh fills the scale.”",
  why: {
    en: "One word that fills the scale and reframes the whole day.",
    ur: "ایک کلمہ جو میزان بھر دیتا ہے اور پورا دن بدل دیتا ہے۔",
    hi: "एक शब्द जो तराज़ू भर देता है और पूरा दिन बदल देता है।",
    bn: "একটি বাক্য যা পাল্লা পূর্ণ করে দেয় এবং পুরো দিনকে বদলে দেয়।",
    fa: "یک کلمه که ترازو را پر می‌کند و کل روز را دگرگون می‌سازد.",
    id: "Satu kata yang memenuhi timbangan dan mengubah keseluruhan hari.",
    ms: "Satu kata yang memenuhi neraca dan mengubah seluruh hari.",
    tr: "Mizanı dolduran ve bütün günü yeniden çerçeveleyen tek bir söz.",
    fr: "Un mot qui remplit la balance et reconfigure toute la journée.",
    de: "Ein Wort, das die Waage füllt und den ganzen Tag neu rahmt.",
  },
};

const TAKBIR: Kalima = {
  arabic: "اللَّهُ أَكْبَرُ",
  transliteration: "Allāhu akbar",
  translation: {
    en: "Allah is the Greatest.",
    ur: "اللہ سب سے بڑا ہے۔",
    hi: "अल्लाह सबसे महान है।",
    bn: "আল্লাহ সর্বশ্রেষ্ঠ।",
    fa: "خدا بزرگ‌تر است.",
    id: "Allah Mahabesar.",
    ms: "Allah Maha Besar.",
    tr: "Allah en büyüktür.",
    fr: "Allah est le Plus Grand.",
    de: "Allah ist der Größte.",
  },
  repeat: 34,
  source: "Bukhari 3705 — completing the tasbīḥ of Fāṭimah ﷺ.",
  why: {
    en: "Whatever is troubling you — He is greater. Say it until your heart hears it.",
    ur: "جو بھی تمہیں پریشان کر رہا ہے — وہ اس سے بڑا ہے۔ کہتے رہو یہاں تک کہ دل سن لے۔",
    hi: "जो भी तुम्हें परेशान कर रहा है — वह उससे बड़ा है। कहते रहो जब तक दिल सुन न ले।",
    bn: "যা-ই তোমাকে কষ্ট দিচ্ছে — তিনি তার চেয়ে বড়। বলো, যতক্ষণ না হৃদয় শোনে।",
    fa: "هر چه آزارت می‌دهد — او بزرگ‌تر است. آن‌قدر بگو تا دل بشنود.",
    id: "Apa pun yang membebanimu — Dia lebih besar. Ucapkan hingga hatimu mendengar.",
    ms: "Apa pun yang membebanimu — Dia lebih besar. Sebutkan sehingga hatimu mendengar.",
    tr: "Seni neyle sıkıyorsa — O daha büyüktür. Kalbin duyana dek söyle.",
    fr: "Quoi qui te trouble — Il est plus grand. Dis-le jusqu'à ce que ton cœur l'entende.",
    de: "Was dich auch bedrängt — Er ist größer. Sprich es, bis dein Herz es hört.",
  },
};

const SALAWAT: Kalima = {
  arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ",
  transliteration: "Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad",
  translation: {
    en: "O Allah, send blessings upon Muhammad and the family of Muhammad.",
    ur: "اے اللہ، محمد ﷺ اور آلِ محمد پر درود بھیج۔",
    hi: "ऐ अल्लाह, मुहम्मद ﷺ और मुहम्मद की आल पर दरूद भेज।",
    bn: "হে আল্লাহ, মুহাম্মাদ ﷺ ও মুহাম্মাদের পরিবারের উপর দরূদ পাঠাও।",
    fa: "خدایا، بر محمد و آلِ محمد درود فرست.",
    id: "Ya Allah, limpahkan shalawat kepada Muhammad ﷺ dan keluarga Muhammad.",
    ms: "Ya Allah, kurniakan selawat ke atas Muhammad ﷺ dan keluarga Muhammad.",
    tr: "Allah'ım, Muhammed'e ve Muhammed'in ailesine salât eyle.",
    fr: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad.",
    de: "O Allah, segne Muhammad und die Familie Muhammads.",
  },
  repeat: 100,
  source: "Tirmidhī 2457 — “Whoever sends one ṣalāh upon me, Allah sends ten upon him.”",
  why: {
    en: "When the heart is heavy, send blessings on the one who was sent as a mercy — and mercy returns multiplied.",
    ur: "جب دل بوجھل ہو، اس پر درود بھیجو جو رحمت بنا کر بھیجے گئے — رحمت کئی گنا بڑھ کر لوٹتی ہے۔",
    hi: "जब दिल भारी हो, उन पर दरूद भेजो जो रहमत बनाकर भेजे गए — रहमत कई गुना बढ़कर लौटती है।",
    bn: "যখন হৃদয় ভারী, তাঁর প্রতি দরূদ পাঠাও যিনি রহমত হয়ে এসেছেন — রহমত বহুগুণে ফিরে আসে।",
    fa: "وقتی دل سنگین است، بر کسی درود بفرست که رحمت فرستاده شد — رحمت چندبرابر باز می‌گردد.",
    id: "Saat hati berat, kirimkan shalawat kepada yang diutus sebagai rahmat — rahmat akan kembali berlipat.",
    ms: "Apabila hati berat, kirimkan selawat kepada yang diutus sebagai rahmat — rahmat akan kembali berlipat ganda.",
    tr: "Kalp ağırken, rahmet olarak gönderilene salât getir — rahmet kat kat geri döner.",
    fr: "Quand le cœur est lourd, prie sur celui qui fut envoyé comme miséricorde — la miséricorde revient multipliée.",
    de: "Wenn das Herz schwer ist, segne den, der als Barmherzigkeit gesandt wurde — Barmherzigkeit kehrt vervielfacht zurück.",
  },
};

const BISMILLAH_LA_YADURR: Kalima = {
  arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ",
  transliteration: "Bismillāhi-lladhī lā yaḍurru maʿa-smihi shay'un fī-l-arḍi wa lā fī-s-samā', wa huwa-s-samīʿu-l-ʿalīm",
  translation: {
    en: "In the name of Allah — with whose name nothing in the earth or sky can harm. He is the All-Hearing, All-Knowing.",
    ur: "اللہ کے نام سے، جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں دے سکتی، اور وہ سننے والا جاننے والا ہے۔",
    hi: "अल्लाह के नाम से, जिसके नाम के साथ ज़मीन व आसमान में कोई चीज़ नुक़सान नहीं दे सकती, और वह सुनने वाला जानने वाला है।",
    bn: "আল্লাহর নামে, যাঁর নামের সাথে আকাশ ও জমিনে কোনো কিছু ক্ষতি করতে পারে না; তিনিই সর্বশ্রোতা, সর্বজ্ঞ।",
    fa: "به نام خدایی که با نامش هیچ چیز در زمین و آسمان زیان نمی‌رساند؛ و او شنوا و داناست.",
    id: "Dengan nama Allah, yang dengan nama-Nya tidak ada sesuatu pun di bumi dan langit yang dapat membahayakan; Dia Maha Mendengar, Maha Mengetahui.",
    ms: "Dengan nama Allah, yang dengan nama-Nya tiada sesuatu pun di bumi dan di langit yang boleh memudaratkan; Dialah Yang Maha Mendengar, Maha Mengetahui.",
    tr: "Adıyla yerde ve gökte hiçbir şeyin zarar veremediği Allah'ın adıyla; O işiten, bilendir.",
    fr: "Au nom d'Allah, avec le nom duquel rien sur terre ni dans le ciel ne peut nuire ; Il est l'Audient, l'Omniscient.",
    de: "Im Namen Allahs, mit dessen Namen nichts auf Erden noch im Himmel Schaden zufügen kann; Er ist der Allhörende, Allwissende.",
  },
  repeat: 3,
  source: "Abū Dāwūd 5088, Tirmidhī 3388 — “nothing will harm him.”",
  why: {
    en: "Three times — a fortress against harm seen and unseen.",
    ur: "تین بار — ظاہر و پوشیدہ نقصان کے خلاف ایک قلعہ۔",
    hi: "तीन बार — दिखाई और छुपे नुक़सान के खिलाफ़ एक क़िला।",
    bn: "তিনবার — দৃশ্য ও অদৃশ্য ক্ষতির বিরুদ্ধে এক দুর্গ।",
    fa: "سه بار — دژی در برابر آسیب آشکار و پنهان.",
    id: "Tiga kali — benteng dari bahaya yang tampak maupun tersembunyi.",
    ms: "Tiga kali — benteng daripada bahaya yang nyata mahupun tersembunyi.",
    tr: "Üç kez — görünen ve görünmeyen zararlara karşı bir kale.",
    fr: "Trois fois — une forteresse contre le mal visible et invisible.",
    de: "Dreimal — eine Festung gegen sichtbaren und verborgenen Schaden.",
  },
};

// ---- Tiny helper to keep the verse data compact: build a Localized blurb/reason
//      where en is required and other locales are optional. ----
const L = (en: string, rest: Partial<Record<keyof Localized, string>> = {}): Localized => ({ en, ...rest });

export const MOODS: Mood[] = ([
  {
    id: "stressed",
    label: "Stressed",
    emoji: "😣",
    blurb: {
      en: "When the weight feels too much to carry.",
      ur: "جب بوجھ اٹھانے کی طاقت سے بڑا لگے۔",
      hi: "जब बोझ उठाने की ताक़त से बड़ा लगे।",
      bn: "যখন ভার বহন করার সাধ্যের বাইরে মনে হয়।",
      fa: "وقتی بار از توان حمل سنگین‌تر می‌نماید.",
      id: "Saat beban terasa terlalu berat untuk dipikul.",
      ms: "Apabila beban terasa terlalu berat untuk dipikul.",
      tr: "Yük taşıyamayacağın kadar ağır geldiğinde.",
      fr: "Quand le poids semble trop lourd à porter.",
      de: "Wenn die Last zu schwer zu tragen scheint.",
    },
    kalimas: [LA_HAWLA, SUBHANALLAH_BIHAMDIH, HASBUNALLAH],
    verses: [
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: L("“Indeed, with hardship comes ease.”", { ur: "”بے شک مشکل کے ساتھ آسانی ہے۔“", hi: "”बेशक मुश्किल के साथ आसानी है।“", bn: "“নিশ্চয়ই কষ্টের সাথে আছে স্বস্তি।”", fa: "«همانا با هر سختی آسانی است.»", id: "“Sungguh, bersama kesulitan ada kemudahan.”", ms: "“Sesungguhnya bersama kesukaran itu ada kemudahan.”", tr: "“Şüphesiz güçlükle beraber bir kolaylık vardır.”", fr: "« Certes, à côté de la difficulté est une facilité. »", de: "„Wahrlich, mit der Schwierigkeit kommt Erleichterung.“" }) },
      { surah: 94, verse: 6, surahName: "Ash-Sharh", reason: L("The promise repeated — ease is paired with every hardship.", { ur: "وعدہ دہرایا گیا — ہر مشکل کے ساتھ آسانی ہے۔", hi: "वादा दोहराया गया — हर मुश्किल के साथ आसानी है।", bn: "প্রতিশ্রুতি পুনরাবৃত্ত — প্রতিটি কষ্টের সাথে স্বস্তি।", fa: "وعده تکرار می‌شود — با هر سختی آسانی همراه است.", id: "Janji diulang — kemudahan selalu menyertai kesulitan.", ms: "Janji diulang — kemudahan sentiasa menyertai kesukaran.", tr: "Söz tekrarlanır — her zorlukla bir kolaylık vardır.", fr: "La promesse répétée — la facilité accompagne chaque difficulté.", de: "Die Verheißung wiederholt — Erleichterung begleitet jede Schwierigkeit."}) },
      { surah: 2, verse: 286, surahName: "Al-Baqarah", reason: L("“Allah does not burden a soul beyond what it can bear.”", { ur: "”اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔“", hi: "”अल्लाह किसी जान पर उसकी ताक़त से ज़्यादा बोझ नहीं डालता।“", bn: "“আল্লাহ কোনো প্রাণকে তার সাধ্যের বাইরে কষ্ট দেন না।”", fa: "«خداوند هیچ کس را جز به اندازه توانش تکلیف نمی‌کند.»", id: "“Allah tidak membebani jiwa melebihi kemampuannya.”", ms: "“Allah tidak membebani jiwa melainkan menurut kemampuannya.”", tr: "“Allah hiçbir nefse gücünün üstünde yük yüklemez.”", fr: "« Allah n'impose à une âme que selon sa capacité. »", de: "„Allah erlegt keiner Seele mehr auf, als sie zu tragen vermag.“" }) },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: L("“Whoever relies on Allah — He is sufficient for him.”", { ur: "”جو اللہ پر بھروسا کرے — وہ اسے کافی ہے۔“", hi: "”जो अल्लाह पर भरोसा करे — वह उसके लिए काफ़ी है।“", bn: "“যে আল্লাহর উপর ভরসা করে — তিনিই তার জন্য যথেষ্ট।”", fa: "«هر کس بر خدا توکل کند، او برایش کافی است.»", id: "“Siapa yang bertawakal kepada Allah, Dia mencukupinya.”", ms: "“Sesiapa yang bertawakal kepada Allah, Dia mencukupinya.”", tr: "“Kim Allah'a tevekkül ederse O ona yeter.”", fr: "« Quiconque place sa confiance en Allah — Il lui suffit. »", de: "„Wer auf Allah vertraut — Er genügt ihm.“" }) },
      { surah: 13, verse: 28, surahName: "Ar-Ra'd", reason: L("“In the remembrance of Allah hearts find rest.”", { ur: "”اللہ کے ذکر سے دلوں کو سکون ملتا ہے۔“", hi: "”अल्लाह के ज़िक्र से दिलों को सुकून मिलता है।“", bn: "“আল্লাহর স্মরণেই অন্তর প্রশান্ত হয়।”", fa: "«با یاد خدا دل‌ها آرام می‌گیرد.»", id: "“Hanya dengan mengingat Allah, hati menjadi tenteram.”", ms: "“Hanya dengan mengingati Allah, hati menjadi tenang.”", tr: "“Kalpler ancak Allah'ı anmakla huzur bulur.”", fr: "« C'est par le rappel d'Allah que les cœurs s'apaisent. »", de: "„Im Gedenken Allahs finden die Herzen Ruhe.“" }) },
    ],
  },
  {
    id: "anxious",
    label: "Anxious",
    emoji: "😟",
    blurb: {
      en: "When tomorrow won't stop knocking.",
      ur: "جب کل کا خوف دروازے سے ہٹتا نہیں۔",
      hi: "जब कल का ख़ौफ़ दरवाज़े से नहीं हटता।",
      bn: "যখন আগামীকাল দরজায় কড়া নাড়তে থাকে।",
      fa: "وقتی فردا دست از کوبیدن در برنمی‌دارد.",
      id: "Saat hari esok tak henti mengetuk pikiran.",
      ms: "Apabila esok tak henti-henti mengetuk fikiran.",
      tr: "Yarın kapıyı çalmaktan vazgeçmediğinde.",
      fr: "Quand demain n'arrête pas de frapper à la porte.",
      de: "Wenn das Morgen nicht aufhört zu klopfen.",
    },
    kalimas: [YUNUS_DUA, HASBIYALLAH, LA_HAWLA],
    verses: [
      { surah: 9, verse: 51, surahName: "At-Tawbah", reason: L("“Nothing will befall us except what Allah has decreed.”", { ur: "”ہمیں صرف وہی پہنچے گا جو اللہ نے لکھ دیا ہے۔“", hi: "”हमें वही पहुँचेगा जो अल्लाह ने लिख दिया है।“", bn: "“আমাদের তা-ই ঘটবে যা আল্লাহ লিখে রেখেছেন।”", fa: "«جز آنچه خدا برای ما نوشته به ما نمی‌رسد.»", id: "“Tidak akan menimpa kami selain apa yang telah Allah tetapkan.”", ms: "“Tidak akan menimpa kami melainkan apa yang Allah telah tetapkan.”", tr: "“Bize Allah'ın yazdığından başkası asla isabet etmez.”", fr: "« Rien ne nous atteindra hormis ce qu'Allah a prescrit. »", de: "„Uns trifft nur, was Allah uns vorgeschrieben hat.“" }) },
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: L("“Sufficient for us is Allah — the best Disposer of affairs.”", { ur: "”ہمیں اللہ کافی ہے، وہ بہترین کارساز ہے۔“", hi: "”हमारे लिए अल्लाह काफ़ी है, वह बेहतरीन कारसाज़ है।“", bn: "“আমাদের জন্য আল্লাহই যথেষ্ট, তিনি উত্তম কার্যনির্বাহক।”", fa: "«ما را خدا بس است و او نیکو کارگزاری است.»", id: "“Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.”", ms: "“Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.”", tr: "“Allah bize yeter; O ne güzel vekildir.”", fr: "« Allah nous suffit ; quel excellent Garant. »", de: "„Allah genügt uns — der beste Sachwalter.“" }) },
      { surah: 65, verse: 2, surahName: "At-Talaq", reason: L("“Whoever fears Allah — He will make a way out.”", { ur: "”جو اللہ سے ڈرے، وہ اس کے لیے راستہ بنا دیتا ہے۔“", hi: "”जो अल्लाह से डरे, वह उसके लिए रास्ता बना देता है।“", bn: "“যে আল্লাহকে ভয় করে, তিনি তার জন্য পথ বের করেন।”", fa: "«هر کس از خدا بترسد، برایش راه گشایی می‌کند.»", id: "“Siapa yang bertakwa kepada Allah, Dia akan memberi jalan keluar.”", ms: "“Sesiapa yang bertakwa kepada Allah, Dia akan beri jalan keluar.”", tr: "“Kim Allah'tan korkarsa, Allah ona bir çıkış yolu yaratır.”", fr: "« Quiconque craint Allah — Il lui ménage une issue. »", de: "„Wer Allah fürchtet — Er schafft ihm einen Ausweg.“" }) },
      { surah: 20, verse: 46, surahName: "Ta-Ha", reason: L("“Do not fear — I am with you both, hearing and seeing.”", { ur: "”ڈرو مت — میں تم دونوں کے ساتھ ہوں، سنتا اور دیکھتا ہوں۔“", hi: "”डरो मत — मैं तुम दोनों के साथ हूँ, सुनता और देखता हूँ।“", bn: "“ভয় কোরো না — আমি তোমাদের সঙ্গে আছি, শুনি ও দেখি।”", fa: "«نترسید، من با شما هستم، می‌شنوم و می‌بینم.»", id: "“Janganlah kalian takut — Aku bersama kalian, mendengar dan melihat.”", ms: "“Jangan kamu takut — Aku bersama kamu, mendengar dan melihat.”", tr: "“Korkmayın; ben sizinleyim, işitirim ve görürüm.”", fr: "« Ne craignez rien — Je suis avec vous, J'entends et Je vois. »", de: "„Fürchtet euch nicht — Ich bin mit euch beiden, höre und sehe.“" }) },
      { surah: 2, verse: 153, surahName: "Al-Baqarah", reason: L("“Seek help through patience and prayer — Allah is with the patient.”", { ur: "”صبر اور نماز سے مدد لو — اللہ صبر کرنے والوں کے ساتھ ہے۔“", hi: "”सब्र और नमाज़ से मदद लो — अल्लाह सब्र वालों के साथ है।“", bn: "“ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও — আল্লাহ ধৈর্যশীলদের সাথে।”", fa: "«از صبر و نماز یاری بجویید — خدا با صابران است.»", id: "“Mohonlah pertolongan dengan sabar dan salat — Allah bersama orang sabar.”", ms: "“Mintalah pertolongan dengan sabar dan solat — Allah bersama orang yang sabar.”", tr: "“Sabır ve namazla yardım dileyin — Allah sabredenlerle beraberdir.”", fr: "« Cherchez secours dans la patience et la prière — Allah est avec les patients. »", de: "„Sucht Hilfe in Geduld und Gebet — Allah ist mit den Geduldigen.“" }) },
    ],
  },
  {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    blurb: {
      en: "When the heart is heavy.",
      ur: "جب دل بھاری ہو۔", hi: "जब दिल भारी हो।", bn: "যখন হৃদয় ভারী।",
      fa: "وقتی دل سنگین است.", id: "Saat hati terasa berat.", ms: "Apabila hati terasa berat.",
      tr: "Kalp ağırlaştığında.", fr: "Quand le cœur est lourd.", de: "Wenn das Herz schwer ist.",
    },
    kalimas: [YA_HAYYU, SALAWAT, ISTIGHFAR],
    verses: [
      { surah: 93, verse: 3, surahName: "Ad-Duha", reason: L("“Your Lord has not forsaken you, nor become displeased.”", { ur: "”تمہارے رب نے نہ تمہیں چھوڑا اور نہ ناراض ہوا۔“", hi: "”तुम्हारे रब ने न तुम्हें छोड़ा और न नाराज़ हुआ।“", bn: "“তোমার রব তোমাকে ত্যাগ করেননি, অসন্তুষ্টও হননি।”", fa: "«پروردگارت تو را رها نکرده و خشم نگرفته است.»", id: "“Tuhanmu tidak meninggalkanmu dan tidak pula benci kepadamu.”", ms: "“Tuhanmu tidak meninggalkanmu dan tidak pula membenci kamu.”", tr: "“Rabbin seni terk etmedi ve sana darılmadı.”", fr: "« Ton Seigneur ne t'a point abandonné, ni détesté. »", de: "„Dein Herr hat dich weder verlassen noch verabscheut.“" }) },
      { surah: 93, verse: 5, surahName: "Ad-Duha", reason: L("“Your Lord will give to you, and you will be satisfied.”", { ur: "”تمہارا رب تمہیں اتنا دے گا کہ تم راضی ہو جاؤ گے۔“", hi: "”तुम्हारा रब तुम्हें इतना देगा कि तुम राज़ी हो जाओगे।“", bn: "“তোমার রব তোমাকে এত দেবেন যে তুমি সন্তুষ্ট হবে।”", fa: "«پروردگارت چنان به تو خواهد بخشید که خشنود شوی.»", id: "“Tuhanmu akan memberimu, sehingga engkau ridha.”", ms: "“Tuhanmu akan memberi kepadamu, lalu engkau berpuas hati.”", tr: "“Rabbin sana verecek ve sen razı olacaksın.”", fr: "« Ton Seigneur t'accordera et tu seras satisfait. »", de: "„Dein Herr wird dir geben, und du wirst zufrieden sein.“" }) },
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: L("“Do not despair of the mercy of Allah.”", { ur: "”اللہ کی رحمت سے مایوس نہ ہو۔“", hi: "”अल्लाह की रहमत से मायूस मत हो।“", bn: "“আল্লাহর রহমত থেকে নিরাশ হয়ো না।”", fa: "«از رحمت خدا نومید نشوید.»", id: "“Janganlah berputus asa dari rahmat Allah.”", ms: "“Janganlah kamu berputus asa dari rahmat Allah.”", tr: "“Allah'ın rahmetinden ümit kesmeyin.”", fr: "« Ne désespérez pas de la miséricorde d'Allah. »", de: "„Verzweifelt nicht an der Barmherzigkeit Allahs.“" }) },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: L("Yaqub ﷺ: “I only complain of my suffering and grief to Allah.”", { ur: "یعقوب ﷺ: ”میں اپنی پریشانی اور غم صرف اللہ سے کہتا ہوں۔“", hi: "याक़ूब ﷺ: ”मैं अपनी परेशानी और ग़म सिर्फ़ अल्लाह से कहता हूँ।“", bn: "ইয়াকূব ﷺ: “আমি আমার দুঃখ ও কষ্ট কেবল আল্লাহর কাছে জানাই।”", fa: "یعقوب ﷺ: «من اندوه و درد خویش را تنها به خدا می‌گویم.»", id: "Ya'qub ﷺ: “Sesungguhnya aku adukan kesedihan dan keluh kesahku hanya kepada Allah.”", ms: "Yaakub ﷺ: “Aku adukan kesedihan dan dukacitaku hanya kepada Allah.”", tr: "Yakub ﷺ: “Ben kederimi ve üzüntümü yalnız Allah'a şikâyet ediyorum.”", fr: "Ya'qub ﷺ : « Je ne me plains qu'à Allah de ma douleur et de ma tristesse. »", de: "Ya'qub ﷺ: „Ich klage meinen Kummer und meine Trauer allein bei Allah.“" }) },
      { surah: 65, verse: 7, surahName: "At-Talaq", reason: L("“Allah will bring about, after hardship, ease.”", { ur: "”اللہ تنگی کے بعد آسانی پیدا فرما دے گا۔“", hi: "”अल्लाह तंगी के बाद आसानी पैदा कर देगा।“", bn: "“আল্লাহ কষ্টের পর স্বস্তি দান করবেন।”", fa: "«خدا پس از سختی آسانی خواهد آورد.»", id: "“Allah akan memberikan kemudahan setelah kesulitan.”", ms: "“Allah akan datangkan kemudahan selepas kesukaran.”", tr: "“Allah, güçlüğün ardından bir kolaylık verecektir.”", fr: "« Allah, après la gêne, apportera la facilité. »", de: "„Allah wird nach der Not Erleichterung schaffen.“" }) },
    ],
  },
  {
    id: "angry",
    label: "Angry",
    emoji: "😡",
    blurb: {
      en: "When the fire rises in your chest.",
      ur: "جب سینے میں آگ بھڑک اٹھے۔", hi: "जब सीने में आग भड़क उठे।", bn: "যখন বুকের ভেতর আগুন জ্বলে ওঠে।",
      fa: "وقتی آتش در سینه‌ات بالا می‌گیرد.", id: "Saat api menyala di dada.", ms: "Apabila api menyala di dada.",
      tr: "Göğsünde alev yükseldiğinde.", fr: "Quand le feu monte dans ta poitrine.", de: "Wenn das Feuer in deiner Brust aufsteigt.",
    },
    kalimas: [TAAWUDH, LA_HAWLA, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 3, verse: 134, surahName: "Aal-E-Imran", reason: L("Praise for those who restrain anger and pardon people.", { ur: "ان کی تعریف جو غصہ پی جاتے ہیں اور لوگوں کو معاف کرتے ہیں۔", hi: "उनकी प्रशंसा जो ग़ुस्सा पी जाते हैं और लोगों को माफ़ करते हैं।", bn: "যারা রাগ চেপে রাখে ও মানুষকে ক্ষমা করে — তাদের প্রশংসা।", fa: "ستایش کسانی که خشم را فرو می‌خورند و مردم را می‌بخشایند.", id: "Pujian bagi yang menahan amarah dan memaafkan sesama.", ms: "Pujian bagi mereka yang menahan kemarahan dan memaafkan manusia.", tr: "Öfkesini yutanlar ve insanları bağışlayanlar övülür.", fr: "Éloge à ceux qui contiennent leur colère et pardonnent aux gens.", de: "Lob denen, die den Zorn zurückhalten und den Menschen vergeben."}) },
      { surah: 41, verse: 34, surahName: "Fussilat", reason: L("“Repel evil with what is better.”", { ur: "”برائی کو اس چیز سے دفع کرو جو بہتر ہو۔“", hi: "”बुराई को उससे दूर करो जो बेहतर हो।“", bn: "“মন্দকে দূর করো এমন কিছু দিয়ে যা উত্তম।”", fa: "«بدی را با آنچه نیکوتر است دفع کن.»", id: "“Tolaklah kejahatan dengan cara yang lebih baik.”", ms: "“Tolaklah kejahatan dengan cara yang lebih baik.”", tr: "“Kötülüğü en güzel bir tutumla sav.”", fr: "« Repousse le mal par ce qui est meilleur. »", de: "„Wehre das Böse mit dem ab, was besser ist.“" }) },
      { surah: 42, verse: 43, surahName: "Ash-Shura", reason: L("“Whoever is patient and forgives — that is great resolve.”", { ur: "”جو صبر کرے اور معاف کر دے — یہ بڑی ہمت کی بات ہے۔“", hi: "”जो सब्र करे और माफ़ कर दे — यह बड़ी हिम्मत की बात है।“", bn: "“যে ধৈর্য ধরে ও ক্ষমা করে — তা দৃঢ় সংকল্পের কাজ।”", fa: "«هر کس صبر و گذشت کند، این از کارهای استوار است.»", id: "“Siapa yang sabar dan memaafkan — itulah sikap yang teguh.”", ms: "“Sesiapa yang sabar dan memaafkan — itu daripada perkara yang teguh.”", tr: "“Sabreden ve bağışlayan — bu, kararlılık işlerindendir.”", fr: "« Quiconque endure et pardonne — voilà une résolution noble. »", de: "„Wer geduldig ist und vergibt — das ist Standhaftigkeit.“" }) },
      { surah: 7, verse: 199, surahName: "Al-A'raf", reason: L("“Show forgiveness, enjoin good, turn from the ignorant.”", { ur: "”درگزر کرو، اچھائی کا حکم دو، اور جاہلوں سے منہ پھیر لو۔“", hi: "”दरगुज़र करो, अच्छाई का हुक्म दो, और जाहिलों से मुँह फेर लो।“", bn: "“ক্ষমা করো, ভালো কাজের আদেশ দাও, মূর্খদের থেকে মুখ ফিরিয়ে নাও।”", fa: "«گذشت پیشه کن، به نیکی فرمان ده، و از نادانان روی برتاب.»", id: "“Berilah maaf, suruhlah kebaikan, dan berpalinglah dari yang jahil.”", ms: "“Berilah kemaafan, suruhlah kebaikan, dan jauhkan diri dari yang jahil.”", tr: "“Affı seç, iyiliği emret, cahillerden yüz çevir.”", fr: "« Accorde le pardon, ordonne le bien, détourne-toi des ignorants. »", de: "„Übe Nachsicht, gebiete das Gute, wende dich von den Unwissenden ab.“" }) },
      { surah: 25, verse: 63, surahName: "Al-Furqan", reason: L("“When the ignorant address them, they say: peace.”", { ur: "”جب جاہل ان سے بات کریں، وہ کہتے ہیں: سلام۔“", hi: "”जब जाहिल उनसे बात करें, वे कहते हैं: सलाम।“", bn: "“যখন মূর্খরা তাদের সাথে কথা বলে, তারা বলে: শান্তি।”", fa: "«وقتی نادانان با ایشان سخن گویند، گویند: سلام.»", id: "“Apabila orang jahil menyapa mereka, mereka berkata: salam.”", ms: "“Apabila orang jahil menyapa mereka, mereka berkata: salam.”", tr: "“Cahiller onlara söz attığında, ‘selâm' derler.”", fr: "« Quand les ignorants leur adressent la parole, ils disent : paix. »", de: "„Wenn die Unwissenden sie ansprechen, sagen sie: Frieden.“" }) },
    ],
  },
  {
    id: "lonely",
    label: "Lonely",
    emoji: "🥺",
    blurb: {
      en: "When no one seems to be there.",
      ur: "جب لگے کہ کوئی نہیں ہے۔", hi: "जब लगे कि कोई नहीं है।", bn: "যখন মনে হয় কেউ পাশে নেই।",
      fa: "وقتی به نظر می‌رسد هیچ‌کس کنارت نیست.", id: "Saat terasa tidak ada siapa-siapa.", ms: "Apabila terasa tiada sesiapa.",
      tr: "Yanında kimse yokmuş gibi hissettiğinde.", fr: "Quand on a l'impression que personne n'est là.", de: "Wenn es scheint, als wäre niemand da.",
    },
    kalimas: [HASBIYALLAH, SALAWAT, YA_HAYYU],
    verses: [
      { surah: 50, verse: 16, surahName: "Qaf", reason: L("“We are closer to him than his jugular vein.”", { ur: "”ہم اس کی شہ رگ سے بھی زیادہ قریب ہیں۔“", hi: "”हम उसकी शह-रग से भी क़रीब हैं।“", bn: "“আমরা তার গ্রীবাস্থ ধমনী থেকেও নিকটে।”", fa: "«ما به او از رگ گردنش نزدیک‌تریم.»", id: "“Kami lebih dekat kepadanya daripada urat lehernya.”", ms: "“Kami lebih dekat kepadanya daripada urat lehernya sendiri.”", tr: "“Biz ona şah damarından daha yakınız.”", fr: "« Nous sommes plus près de lui que sa veine jugulaire. »", de: "„Wir sind ihm näher als seine Halsschlagader.“" }) },
      { surah: 2, verse: 186, surahName: "Al-Baqarah", reason: L("“When My servants ask about Me — I am near.”", { ur: "”جب میرے بندے میرے بارے میں پوچھیں — میں قریب ہوں۔“", hi: "”जब मेरे बंदे मेरे बारे में पूछें — मैं क़रीब हूँ।“", bn: "“আমার বান্দারা আমার সম্পর্কে জিজ্ঞেস করলে — আমি নিকটেই আছি।”", fa: "«وقتی بندگانم درباره من بپرسند — من نزدیکم.»", id: "“Apabila hamba-Ku bertanya tentang-Ku — Aku dekat.”", ms: "“Apabila hamba-Ku bertanya tentang-Ku — Aku dekat.”", tr: "“Kullarım sana Beni sorduğunda — Ben yakınım.”", fr: "« Quand Mes serviteurs t'interrogent sur Moi — Je suis proche. »", de: "„Wenn Meine Diener nach Mir fragen — Ich bin nah.“" }) },
      { surah: 57, verse: 4, surahName: "Al-Hadid", reason: L("“He is with you wherever you are.”", { ur: "”تم جہاں کہیں بھی ہو، وہ تمہارے ساتھ ہے۔“", hi: "”तुम जहाँ भी हो, वह तुम्हारे साथ है।“", bn: "“তোমরা যেখানেই থাকো, তিনি তোমাদের সঙ্গে।”", fa: "«هر کجا باشید، او با شماست.»", id: "“Dia bersamamu di mana pun kamu berada.”", ms: "“Dia bersamamu di mana sahaja kamu berada.”", tr: "“Nerede olursanız olun, O sizinle beraberdir.”", fr: "« Il est avec vous où que vous soyez. »", de: "„Er ist mit euch, wo immer ihr seid.“" }) },
      { surah: 93, verse: 7, surahName: "Ad-Duha", reason: L("“He found you lost and guided you.”", { ur: "”اس نے تمہیں بھٹکا ہوا پایا اور راہ دکھائی۔“", hi: "”उसने तुम्हें भटका हुआ पाया और राह दिखाई।“", bn: "“তিনি তোমাকে পথহারা পেয়েছিলেন, এরপর পথ দেখিয়েছেন।”", fa: "«تو را گمراه یافت و هدایت کرد.»", id: "“Dia mendapatimu sebagai seorang yang bingung, lalu memberi petunjuk.”", ms: "“Dia mendapati kamu sesat lalu memberi petunjuk.”", tr: "“Seni şaşırmış buldu da yol gösterdi.”", fr: "« Il t'a trouvé égaré, et Il t'a guidé. »", de: "„Er fand dich umherirrend und leitete dich recht.“" }) },
      { surah: 12, verse: 86, surahName: "Yusuf", reason: L("Yaqub's grief carried to Allah alone — closeness.", { ur: "یعقوب کا غم صرف اللہ سے کہنا — قربت۔", hi: "याक़ूब का ग़म सिर्फ़ अल्लाह से कहना — क़ुर्बत।", bn: "ইয়াকূবের দুঃখ কেবল আল্লাহকে জানানো — এক ধরনের নৈকট্য।", fa: "اندوه یعقوب فقط با خدا — همان نزدیکی است.", id: "Kesedihan Ya'qub yang hanya diadukan kepada Allah — itulah kedekatan.", ms: "Kesedihan Yaakub yang hanya diadukan kepada Allah — itulah kedekatan.", tr: "Yakub'un kederini yalnız Allah'a iletmesi — bir yakınlıktır.", fr: "La tristesse de Ya'qub portée à Allah seul — une proximité.", de: "Ya'qubs Kummer, allein Allah anvertraut — Nähe."}) },
    ],
  },
  {
    id: "grateful",
    label: "Grateful",
    emoji: "🙏",
    blurb: {
      en: "When you want to thank Him.",
      ur: "جب آپ اس کا شکر ادا کرنا چاہیں۔", hi: "जब आप उसका शुक्र अदा करना चाहें।", bn: "যখন তাঁকে কৃতজ্ঞতা জানাতে চান।",
      fa: "وقتی می‌خواهی شکر او را به‌جا آوری.", id: "Ketika ingin bersyukur kepada-Nya.", ms: "Apabila ingin bersyukur kepada-Nya.",
      tr: "O'na şükretmek istediğinde.", fr: "Quand on veut Le remercier.", de: "Wenn du Ihm danken möchtest.",
    },
    kalimas: [ALHAMDU_NIMAH, TAHMID, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 14, verse: 7, surahName: "Ibrahim", reason: L("“If you are grateful, I will increase you.”", { ur: "”اگر شکر کرو گے تو میں اور زیادہ دوں گا۔“", hi: "”अगर शुक्र करोगे तो मैं और बढ़ाऊँगा।“", bn: "“যদি কৃতজ্ঞ হও, আমি অবশ্যই বাড়িয়ে দেব।”", fa: "«اگر شکر کنید، البته بر شما خواهم افزود.»", id: "“Jika kamu bersyukur, pasti Aku tambahkan.”", ms: "“Jika kamu bersyukur, pasti Aku tambahkan.”", tr: "“Şükrederseniz elbette artırırım.”", fr: "« Si vous êtes reconnaissants, Je vous accroîtrai. »", de: "„Wenn ihr dankbar seid, werde Ich euch mehr geben.“" }) },
      { surah: 55, verse: 13, surahName: "Ar-Rahman", reason: L("“Which of the favours of your Lord will you deny?”", { ur: "”تو تم اپنے رب کی کن کن نعمتوں کو جھٹلاؤ گے؟“", hi: "”तुम अपने रब की कौन-कौन सी नेमतें झुठलाओगे?“", bn: "“তবে তোমরা তোমাদের রবের কোন কোন অনুগ্রহকে অস্বীকার করবে?”", fa: "«پس کدام نعمت‌های پروردگارتان را انکار می‌کنید؟»", id: "“Maka nikmat Tuhanmu yang manakah yang kamu dustakan?”", ms: "“Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?”", tr: "“Rabbinizin nimetlerinden hangisini yalanlarsınız?”", fr: "« Lequel donc des bienfaits de votre Seigneur nierez-vous ? »", de: "„Welche der Wohltaten eures Herrn wollt ihr denn leugnen?“" }) },
      { surah: 16, verse: 18, surahName: "An-Nahl", reason: L("“If you tried to count Allah's blessings, you could never enumerate them.”", { ur: "”اگر تم اللہ کی نعمتیں گننا چاہو، گن نہیں سکو گے۔“", hi: "”अगर तुम अल्लाह की नेमतें गिनो, गिन नहीं सकोगे।“", bn: "“যদি তোমরা আল্লাহর নিয়ামত গুনতে চাও, পারবে না।”", fa: "«اگر نعمت‌های خدا را بشمارید، نمی‌توانید برشمارید.»", id: "“Jika kamu menghitung nikmat Allah, niscaya tidak akan mampu.”", ms: "“Jika kamu menghitung nikmat Allah, nescaya kamu tidak akan mampu.”", tr: "“Allah'ın nimetlerini sayacak olsanız sayamazsınız.”", fr: "« Si vous tentiez de compter les bienfaits d'Allah, vous n'y parviendriez pas. »", de: "„Wenn ihr Allahs Wohltaten zählen wolltet, ihr könntet sie nicht erfassen.“" }) },
      { surah: 2, verse: 152, surahName: "Al-Baqarah", reason: L("“Remember Me — I will remember you.”", { ur: "”مجھے یاد کرو، میں تمہیں یاد کروں گا۔“", hi: "”मुझे याद करो, मैं तुम्हें याद करूँगा।“", bn: "“আমাকে স্মরণ করো, আমি তোমাদেরকে স্মরণ করব।”", fa: "«مرا یاد کنید تا شما را یاد کنم.»", id: "“Ingatlah Aku, niscaya Aku ingat kepadamu.”", ms: "“Ingatlah Aku, nescaya Aku ingat kepadamu.”", tr: "“Beni anın, Ben de sizi anayım.”", fr: "« Souvenez-vous de Moi, Je me souviendrai de vous. »", de: "„Gedenkt Meiner, so gedenke Ich euer.“" }) },
      { surah: 27, verse: 19, surahName: "An-Naml", reason: L("Sulayman: “My Lord, enable me to be grateful for Your favour.”", { ur: "سلیمان: ”اے رب، مجھے توفیق دے کہ تیری نعمت کا شکر کروں۔“", hi: "सुलैमान: ”ऐ रब, मुझे तेरी नेमत का शुक्र करने की तौफ़ीक़ दे।“", bn: "সুলায়মান: “হে রব, তোমার নিয়ামতের শোকর আদায়ের তাওফিক দাও।”", fa: "سلیمان: «پروردگارا، توفیقم ده تا شکر نعمتت را به‌جا آورم.»", id: "Sulaiman: “Tuhanku, berilah aku ilham untuk mensyukuri nikmat-Mu.”", ms: "Sulaiman: “Wahai Tuhanku, ilhamkanlah aku mensyukuri nikmat-Mu.”", tr: "Süleyman: “Rabbim, beni nimetine şükretmeye muvaffak kıl.”", fr: "Sulaymān : « Mon Seigneur, inspire-moi la gratitude envers Ton bienfait. »", de: "Sulaymān: „Mein Herr, gib mir ein, dankbar für Deine Gunst zu sein.“" }) },
    ],
  },
  {
    id: "hopeful",
    label: "Hopeful",
    emoji: "🌅",
    blurb: {
      en: "When something better feels possible.",
      ur: "جب کچھ بہتر ممکن لگے۔", hi: "जब कुछ बेहतर मुमकिन लगे।", bn: "যখন কিছু উত্তম সম্ভব মনে হয়।",
      fa: "وقتی چیزی بهتر ممکن به نظر می‌رسد.", id: "Saat sesuatu yang lebih baik terasa mungkin.", ms: "Apabila sesuatu yang lebih baik terasa mungkin.",
      tr: "Daha iyi bir şey mümkün göründüğünde.", fr: "Quand quelque chose de meilleur semble possible.", de: "Wenn etwas Besseres möglich scheint.",
    },
    kalimas: [TAHLIL, TAKBIR, ALHAMDU_NIMAH],
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: L("“Do not despair of the mercy of Allah.”", { ur: "”اللہ کی رحمت سے مایوس نہ ہو۔“", hi: "”अल्लाह की रहमत से मायूस मत हो।“", bn: "“আল্লাহর রহমত থেকে নিরাশ হয়ো না।”", fa: "«از رحمت خدا نومید نشوید.»", id: "“Janganlah berputus asa dari rahmat Allah.”", ms: "“Janganlah kamu berputus asa dari rahmat Allah.”", tr: "“Allah'ın rahmetinden ümit kesmeyin.”", fr: "« Ne désespérez pas de la miséricorde d'Allah. »", de: "„Verzweifelt nicht an der Barmherzigkeit Allahs.“" }) },
      { surah: 65, verse: 3, surahName: "At-Talaq", reason: L("“Allah will accomplish His purpose.”", { ur: "”اللہ اپنا کام پورا کر کے رہتا ہے۔“", hi: "”अल्लाह अपना काम पूरा करके रहता है।“", bn: "“আল্লাহ তাঁর উদ্দেশ্য পূর্ণ করেন।”", fa: "«خدا کار خود را به انجام می‌رساند.»", id: "“Allah pasti melaksanakan urusan-Nya.”", ms: "“Allah pasti melaksanakan urusan-Nya.”", tr: "“Allah, emrini yerine getirir.”", fr: "« Allah accomplit Son décret. »", de: "„Allah führt Seinen Willen aus.“" }) },
      { surah: 94, verse: 5, surahName: "Ash-Sharh", reason: L("“With hardship comes ease.”", { ur: "”مشکل کے ساتھ آسانی ہے۔“", hi: "”मुश्किल के साथ आसानी है।“", bn: "“কষ্টের সাথে আছে স্বস্তি।”", fa: "«با هر سختی آسانی است.»", id: "“Bersama kesulitan ada kemudahan.”", ms: "“Bersama kesukaran ada kemudahan.”", tr: "“Güçlükle beraber kolaylık vardır.”", fr: "« Avec la difficulté est une facilité. »", de: "„Mit der Schwierigkeit kommt Erleichterung.“" }) },
      { surah: 12, verse: 87, surahName: "Yusuf", reason: L("“Only the disbelievers lose hope in the mercy of Allah.”", { ur: "”اللہ کی رحمت سے صرف کافر مایوس ہوتے ہیں۔“", hi: "”अल्लाह की रहमत से सिर्फ़ काफ़िर मायूस होते हैं।“", bn: "“আল্লাহর রহমত থেকে কেবল কাফেররাই নিরাশ হয়।”", fa: "«جز کافران از رحمت خدا نومید نمی‌شوند.»", id: "“Tiada yang putus asa dari rahmat Allah kecuali orang kafir.”", ms: "“Tiada yang berputus asa dari rahmat Allah melainkan orang kafir.”", tr: "“Allah'ın rahmetinden ancak kâfirler ümit keser.”", fr: "« Seuls les mécréants désespèrent de la miséricorde d'Allah. »", de: "„Nur die Ungläubigen verzweifeln an Allahs Barmherzigkeit.“" }) },
      { surah: 2, verse: 216, surahName: "Al-Baqarah", reason: L("“You may dislike a thing that is good for you.”", { ur: "”ہو سکتا ہے تم کسی چیز کو ناپسند کرو اور وہ تمہارے لیے بہتر ہو۔“", hi: "”हो सकता है तुम किसी चीज़ को नापसंद करो और वह तुम्हारे लिए बेहतर हो।“", bn: "“তোমরা এমন কিছু অপছন্দ করো যা তোমাদের জন্য ভালো।”", fa: "«شاید چیزی را ناخوش دارید و آن برایتان نیکوست.»", id: "“Boleh jadi kamu membenci sesuatu padahal itu baik bagimu.”", ms: "“Boleh jadi kamu membenci sesuatu sedangkan ia baik untukmu.”", tr: "“Bir şeyden hoşlanmazsınız ama o sizin için hayırlıdır.”", fr: "« Il se peut que vous détestiez une chose alors qu'elle est un bien pour vous. »", de: "„Vielleicht ist euch etwas verhasst, doch es ist gut für euch.“" }) },
    ],
  },
  {
    id: "guilty",
    label: "Seeking forgiveness",
    emoji: "🤲",
    blurb: {
      en: "When you want to return.",
      ur: "جب لوٹنا چاہو۔", hi: "जब लौटना चाहो।", bn: "যখন ফিরে যেতে চান।",
      fa: "وقتی می‌خواهی بازگردی.", id: "Ketika ingin kembali.", ms: "Apabila ingin kembali.",
      tr: "Geri dönmek istediğinde.", fr: "Quand tu veux revenir.", de: "Wenn du zurückkehren möchtest.",
    },
    kalimas: [ISTIGHFAR, YUNUS_DUA, SUBHANALLAH_BIHAMDIH],
    verses: [
      { surah: 39, verse: 53, surahName: "Az-Zumar", reason: L("“Do not despair of the mercy of Allah — He forgives all sins.”", { ur: "”اللہ کی رحمت سے مایوس نہ ہو — وہ تمام گناہ بخش دیتا ہے۔“", hi: "”अल्लाह की रहमत से मायूस मत हो — वह सारे गुनाह माफ़ कर देता है।“", bn: "“আল্লাহর রহমত থেকে নিরাশ হয়ো না — তিনি সব গুনাহ ক্ষমা করেন।”", fa: "«از رحمت خدا نومید نشوید — او همه گناهان را می‌آمرزد.»", id: "“Janganlah putus asa dari rahmat Allah — Dia mengampuni segala dosa.”", ms: "“Janganlah berputus asa dari rahmat Allah — Dia mengampuni segala dosa.”", tr: "“Allah'ın rahmetinden ümit kesmeyin — O bütün günahları bağışlar.”", fr: "« Ne désespérez pas de la miséricorde d'Allah — Il pardonne tous les péchés. »", de: "„Verzweifelt nicht an Allahs Barmherzigkeit — Er vergibt alle Sünden.“" }) },
      { surah: 4, verse: 110, surahName: "An-Nisa", reason: L("“Whoever does wrong then seeks forgiveness will find Him Forgiving, Merciful.”", { ur: "”جو برا کام کرے پھر بخشش مانگے، اللہ کو بخشنے والا، رحم کرنے والا پائے گا۔“", hi: "”जो बुरा करे फिर माफ़ी माँगे, वह अल्लाह को बख़्शने वाला, रहम करने वाला पाएगा।“", bn: "“যে মন্দ কাজ করে তারপর ক্ষমা চায়, সে আল্লাহকে ক্ষমাশীল, পরম দয়ালু পাবে।”", fa: "«هر کس بدی کند سپس آمرزش بخواهد، خدا را آمرزنده و مهربان خواهد یافت.»", id: "“Siapa yang berbuat jahat lalu memohon ampun, akan mendapati Allah Maha Pengampun, Maha Penyayang.”", ms: "“Sesiapa yang berbuat kejahatan kemudian memohon keampunan, akan mendapati Allah Maha Pengampun, Maha Mengasihani.”", tr: "“Kim bir kötülük yapar da bağışlanma dilerse, Allah'ı bağışlayıcı ve merhametli bulur.”", fr: "« Quiconque fait du mal puis demande pardon trouvera Allah Pardonneur, Miséricordieux. »", de: "„Wer Böses tut und dann um Vergebung bittet, wird Allah vergebend und barmherzig finden.“" }) },
      { surah: 66, verse: 8, surahName: "At-Tahrim", reason: L("“Turn to Allah with sincere repentance.”", { ur: "”اللہ کی طرف سچی توبہ کرو۔“", hi: "”अल्लाह की ओर सच्ची तौबा करो।“", bn: "“আল্লাহর কাছে আন্তরিক তওবা করো।”", fa: "«به سوی خدا با توبه‌ای راستین بازگردید.»", id: "“Bertobatlah kepada Allah dengan taubat yang tulus.”", ms: "“Bertaubatlah kepada Allah dengan taubat yang ikhlas.”", tr: "“Allah'a samimi bir tövbe ile dönün.”", fr: "« Repentez-vous à Allah d'un repentir sincère. »", de: "„Kehrt zu Allah um in aufrichtiger Reue.“" }) },
      { surah: 2, verse: 222, surahName: "Al-Baqarah", reason: L("“Allah loves those who turn to Him in repentance.”", { ur: "”اللہ توبہ کرنے والوں سے محبت کرتا ہے۔“", hi: "”अल्लाह तौबा करने वालों से मुहब्बत करता है।“", bn: "“আল্লাহ তওবাকারীদের ভালোবাসেন।”", fa: "«خدا توبه‌کنندگان را دوست دارد.»", id: "“Allah menyukai orang yang bertobat.”", ms: "“Allah menyukai mereka yang bertaubat.”", tr: "“Allah tövbe edenleri sever.”", fr: "« Allah aime ceux qui se repentent. »", de: "„Allah liebt die Reumütigen.“" }) },
      { surah: 20, verse: 82, surahName: "Ta-Ha", reason: L("“I am the Perpetual Forgiver of whoever repents.”", { ur: "”جو توبہ کرے، میں اسے بار بار معاف کرنے والا ہوں۔“", hi: "”जो तौबा करे, मैं उसे बार-बार माफ़ करने वाला हूँ।“", bn: "“যে তওবা করে, আমি তার প্রতি বারবার ক্ষমাশীল।”", fa: "«من نسبت به هر کس که توبه کند، بسیار آمرزنده‌ام.»", id: "“Aku Maha Pengampun bagi siapa yang bertobat.”", ms: "“Aku Maha Pengampun bagi sesiapa yang bertaubat.”", tr: "“Tövbe edene karşı çok bağışlayıcıyım.”", fr: "« Je suis Très-Pardonneur pour quiconque se repent. »", de: "„Ich bin der stets Vergebende für den, der bereut.“" }) },
    ],
  },
  {
    id: "fearful",
    label: "Fearful",
    emoji: "😨",
    blurb: {
      en: "When something scares you.",
      ur: "جب کوئی چیز خوفزدہ کرے۔", hi: "जब कोई चीज़ डराए।", bn: "যখন কিছু তোমাকে ভয় দেখায়।",
      fa: "وقتی چیزی تو را می‌ترساند.", id: "Saat sesuatu membuatmu takut.", ms: "Apabila sesuatu menakutkanmu.",
      tr: "Bir şey seni korkuttuğunda.", fr: "Quand quelque chose te fait peur.", de: "Wenn dich etwas erschreckt.",
    },
    kalimas: [HASBUNALLAH, BISMILLAH_LA_YADURR, HASBIYALLAH],
    verses: [
      { surah: 3, verse: 173, surahName: "Aal-E-Imran", reason: L("“Sufficient for us is Allah, the best Disposer of affairs.”", { ur: "”ہمیں اللہ کافی ہے، وہ بہترین کارساز ہے۔“", hi: "”हमारे लिए अल्लाह काफ़ी है, वह बेहतरीन कारसाज़ है।“", bn: "“আমাদের জন্য আল্লাহই যথেষ্ট, তিনি উত্তম কার্যনির্বাহক।”", fa: "«ما را خدا بس است و او نیکو کارگزاری است.»", id: "“Cukuplah Allah bagi kami, sebaik-baik pelindung.”", ms: "“Cukuplah Allah bagi kami, sebaik-baik pelindung.”", tr: "“Allah bize yeter; O ne güzel vekildir.”", fr: "« Allah nous suffit ; quel excellent Garant. »", de: "„Allah genügt uns — der beste Sachwalter.“" }) },
      { surah: 2, verse: 255, surahName: "Al-Baqarah", reason: L("Ayat al-Kursi — divine sovereignty and protection.", { ur: "آیت الکرسی — اللہ کی حاکمیت اور حفاظت۔", hi: "आयतुल कुर्सी — अल्लाह की हाकिमियत और हिफ़ाज़त।", bn: "আয়াতুল কুরসী — আল্লাহর সার্বভৌমত্ব ও সুরক্ষা।", fa: "آیةالکرسی — حاکمیت و حفاظت الهی.", id: "Ayat al-Kursi — kekuasaan dan perlindungan ilahi.", ms: "Ayat al-Kursi — kekuasaan dan perlindungan ilahi.", tr: "Ayetü'l-Kürsî — ilahi egemenlik ve koruma.", fr: "Ayat al-Kursi — souveraineté et protection divines.", de: "Āyat al-Kursī — göttliche Souveränität und Schutz."}) },
      { surah: 8, verse: 9, surahName: "Al-Anfal", reason: L("“I will reinforce you with a thousand angels.”", { ur: "”میں ہزار فرشتوں سے تمہاری مدد کروں گا۔“", hi: "”मैं हज़ार फ़रिश्तों से तुम्हारी मदद करूँगा।“", bn: "“আমি হাজার ফেরেশতা দিয়ে তোমাদের সাহায্য করব।”", fa: "«شما را با هزار فرشته یاری می‌کنم.»", id: "“Aku akan memperkuatmu dengan seribu malaikat.”", ms: "“Aku akan menguatkan kamu dengan seribu malaikat.”", tr: "“Sizi bin melekle destekleyeceğim.”", fr: "« Je vais vous renforcer de mille anges. »", de: "„Ich werde euch mit tausend Engeln stärken.“" }) },
      { surah: 9, verse: 40, surahName: "At-Tawbah", reason: L("“Do not grieve; indeed Allah is with us.”", { ur: "”غم نہ کرو، بے شک اللہ ہمارے ساتھ ہے۔“", hi: "”ग़म मत करो, बेशक अल्लाह हमारे साथ है।“", bn: "“দুঃখ কোরো না, নিশ্চয়ই আল্লাহ আমাদের সাথে আছেন।”", fa: "«اندوه مدار، خدا با ماست.»", id: "“Janganlah berduka; sesungguhnya Allah bersama kita.”", ms: "“Janganlah berdukacita; sesungguhnya Allah bersama kita.”", tr: "“Üzülme; şüphesiz Allah bizimle beraberdir.”", fr: "« Ne t'attriste pas, Allah est avec nous. »", de: "„Sei nicht traurig; gewiss, Allah ist mit uns.“" }) },
      { surah: 28, verse: 7, surahName: "Al-Qasas", reason: L("“Do not fear, nor grieve. We will return him to you.”", { ur: "”ڈرو نہیں، غم نہ کرو۔ ہم اسے تمہارے پاس واپس لائیں گے۔“", hi: "”डरो नहीं, ग़म मत करो। हम उसे तुम्हारे पास लौटा देंगे।“", bn: "“ভয় কোরো না, দুঃখ কোরো না। আমরা তাকে তোমার কাছে ফিরিয়ে দেব।”", fa: "«مترس و اندوهگین مباش، ما او را به تو باز خواهیم گرداند.»", id: "“Janganlah takut dan jangan bersedih; Kami akan mengembalikannya kepadamu.”", ms: "“Janganlah takut dan jangan bersedih; Kami akan kembalikannya kepadamu.”", tr: "“Korkma, üzülme; onu sana geri vereceğiz.”", fr: "« Ne crains rien, ne t'afflige pas. Nous te le rendrons. »", de: "„Fürchte dich nicht und sei nicht traurig; Wir werden ihn dir zurückgeben.“" }) },
    ],
  },
] as Mood[]).map((m) => ({ ...m, kalima: m.kalimas[0] })) as Mood[];

export function getMood(id: string): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}
