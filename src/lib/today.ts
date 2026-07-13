// Deterministic daily rotation. Same content for every user on a given date,
// derived from an epoch day number. Curated pools; expand freely.
//
// Phase 2 will move this into a `daily_content` table with scheduled rows.
// For MVP, the rotation is index = daysSinceEpoch % pool.length.

import type { LanguageCode } from "@/lib/quran-api";

export interface DailyVerse {
  surah: number;
  verse: number;
  surahName: string;
  arabic: string;
  translation: Partial<Record<LanguageCode, string>>;
}

export interface DailyHadith {
  arabic?: string;
  text: Partial<Record<LanguageCode, string>>;
  source: string;
  narrator?: string;
}

export interface DailyDhikr {
  arabic: string;
  transliteration: string;
  translation: Partial<Record<LanguageCode, string>>;
  count: number;
  source: string;
}

export interface DailyReflection {
  prompt: Partial<Record<LanguageCode, string>>;
}

export interface DailyStoryTeaser {
  storyId: string;
  moodId: string;
  title: Partial<Record<LanguageCode, string>>;
  blurb: Partial<Record<LanguageCode, string>>;
  durationMin: number;
}

// ---------- Pools (widely-accepted sources; pending scholarly review) ----------
// Translations across en, ur, ru, bn, fa, id, ms, tr, fr, de.

const VERSES: DailyVerse[] = [
  {
    surah: 2, verse: 286, surahName: "Al-Baqarah",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: {
      en: "Allah does not burden a soul beyond what it can bear.",
      ur: "اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔",
      ru: "Аллах не возлагает на душу ничего, кроме того, что ей по силам.",
      bn: "আল্লাহ কোনো আত্মাকে তার সাধ্যের অতিরিক্ত ভার দেন না।",
      fa: "خداوند هیچ کس را جز به اندازهٔ توانش تکلیف نمی‌کند.",
      id: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
      ms: "Allah tidak membebani seseorang melainkan setakat kemampuannya.",
      tr: "Allah, kimseye gücünün üstünde bir şey yüklemez.",
      fr: "Allah n'impose à aucune âme une charge supérieure à ses capacités.",
      de: "Allah erlegt keiner Seele mehr auf, als sie zu tragen vermag.",
    },
  },
  {
    surah: 94, verse: 6, surahName: "Ash-Sharh",
    arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: {
      en: "Indeed, with hardship comes ease.",
      ur: "بے شک ہر مشکل کے ساتھ آسانی ہے۔",
      ru: "Воистину, за тягостью наступает облегчение.",
      bn: "নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।",
      fa: "به‌راستی که با هر سختی، آسانی است.",
      id: "Sesungguhnya bersama kesulitan ada kemudahan.",
      ms: "Sesungguhnya bersama kesukaran itu ada kemudahan.",
      tr: "Şüphesiz her güçlükle beraber bir kolaylık vardır.",
      fr: "En vérité, à côté de la difficulté est la facilité.",
      de: "Wahrlich, mit der Erschwernis kommt die Erleichterung.",
    },
  },
  {
    surah: 13, verse: 28, surahName: "Ar-Ra'd",
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: {
      en: "Truly, in the remembrance of Allah do hearts find rest.",
      ur: "خبردار! اللہ کے ذکر ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔",
      ru: "Воистину, только в поминании Аллаха сердца находят покой.",
      bn: "জেনে রাখো, আল্লাহর স্মরণেই হৃদয় প্রশান্তি পায়।",
      fa: "آگاه باشید که تنها با یاد خدا دل‌ها آرام می‌گیرد.",
      id: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
      ms: "Ketahuilah, dengan mengingati Allah hati menjadi tenang.",
      tr: "Bilesiniz ki kalpler ancak Allah'ı anmakla huzur bulur.",
      fr: "N'est-ce point par le rappel d'Allah que les cœurs se tranquillisent ?",
      de: "Wahrlich, im Gedenken Allahs finden die Herzen Ruhe.",
    },
  },
  {
    surah: 65, verse: 3, surahName: "At-Talaq",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ",
    translation: {
      en: "And whoever puts their trust in Allah — He is sufficient for them.",
      ur: "اور جو اللہ پر بھروسہ کرے، وہ اس کے لیے کافی ہے۔",
      ru: "А тому, кто уповает на Аллаха, достаточно Его.",
      bn: "আর যে আল্লাহর উপর ভরসা করে, তিনিই তার জন্য যথেষ্ট।",
      fa: "و هر کس بر خدا توکل کند، خدا او را کافی است.",
      id: "Barang siapa bertawakal kepada Allah, niscaya Dia mencukupinya.",
      ms: "Sesiapa yang bertawakal kepada Allah, cukuplah Allah baginya.",
      tr: "Kim Allah'a tevekkül ederse, O ona yeter.",
      fr: "Quiconque place sa confiance en Allah, Il lui suffit.",
      de: "Und wer auf Allah vertraut, dem genügt Er.",
    },
  },
  {
    surah: 39, verse: 53, surahName: "Az-Zumar",
    arabic: "لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ",
    translation: {
      en: "Do not despair of the mercy of Allah.",
      ur: "اللہ کی رحمت سے مایوس نہ ہو۔",
      ru: "Не отчаивайтесь в милости Аллаха.",
      bn: "আল্লাহর রহমত থেকে নিরাশ হয়ো না।",
      fa: "از رحمت خدا نومید نشوید.",
      id: "Janganlah kamu berputus asa dari rahmat Allah.",
      ms: "Janganlah kamu berputus asa dari rahmat Allah.",
      tr: "Allah'ın rahmetinden ümit kesmeyin.",
      fr: "Ne désespérez pas de la miséricorde d'Allah.",
      de: "Verzweifelt nicht an der Barmherzigkeit Allahs.",
    },
  },
  {
    surah: 20, verse: 25, surahName: "Ta-Ha",
    arabic: "رَبِّ ٱشْرَحْ لِى صَدْرِى",
    translation: {
      en: "My Lord, expand for me my chest.",
      ur: "اے میرے رب! میرا سینہ کھول دے۔",
      ru: "Господи, раскрой мне грудь мою.",
      bn: "হে আমার প্রতিপালক! আমার বক্ষ প্রশস্ত করে দাও।",
      fa: "پروردگارا، سینه‌ام را برایم گشاده گردان.",
      id: "Ya Tuhanku, lapangkanlah dadaku.",
      ms: "Wahai Tuhanku, lapangkanlah dadaku.",
      tr: "Rabbim! Gönlüme genişlik ver.",
      fr: "Seigneur, ouvre-moi la poitrine.",
      de: "Mein Herr, weite mir meine Brust.",
    },
  },
  {
    surah: 3, verse: 173, surahName: "Aal 'Imran",
    arabic: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ",
    translation: {
      en: "Allah is sufficient for us, and He is the best disposer of affairs.",
      ur: "ہمارے لیے اللہ کافی ہے اور وہ بہترین کارساز ہے۔",
      ru: "Нам достаточно Аллаха, и Он — прекрасный Покровитель.",
      bn: "আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনিই উত্তম কর্মবিধায়ক।",
      fa: "خدا ما را بس است و او بهترین کارساز است.",
      id: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
      ms: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
      tr: "Allah bize yeter, O ne güzel vekildir.",
      fr: "Allah nous suffit ; Il est le meilleur garant.",
      de: "Uns genügt Allah, und Er ist der beste Sachwalter.",
    },
  },
  {
    surah: 2, verse: 152, surahName: "Al-Baqarah",
    arabic: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ",
    translation: {
      en: "So remember Me — I will remember you.",
      ur: "پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔",
      ru: "Поминайте Меня, и Я буду помнить о вас.",
      bn: "সুতরাং তোমরা আমাকে স্মরণ করো, আমি তোমাদের স্মরণ করব।",
      fa: "پس مرا یاد کنید تا شما را یاد کنم.",
      id: "Maka ingatlah kepada-Ku, niscaya Aku ingat kepadamu.",
      ms: "Ingatlah kepada-Ku, nescaya Aku ingat kepadamu.",
      tr: "Öyleyse siz beni anın ki, ben de sizi anayım.",
      fr: "Souvenez-vous de Moi, Je Me souviendrai de vous.",
      de: "Gedenkt also Meiner, so gedenke Ich eurer.",
    },
  },
  {
    surah: 55, verse: 13, surahName: "Ar-Rahman",
    arabic: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: {
      en: "Then which of the favors of your Lord will you deny?",
      ur: "پھر تم اپنے رب کی کون کون سی نعمتوں کو جھٹلاؤ گے؟",
      ru: "Какую же из милостей вашего Господа вы отвергаете?",
      bn: "সুতরাং তোমরা তোমাদের প্রতিপালকের কোন কোন অনুগ্রহ অস্বীকার করবে?",
      fa: "پس کدام یک از نعمت‌های پروردگارتان را انکار می‌کنید؟",
      id: "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
      ms: "Maka nikmat Tuhan kamu yang manakah yang kamu hendak dustakan?",
      tr: "O hâlde Rabbinizin nimetlerinden hangisini yalanlıyorsunuz?",
      fr: "Lequel donc des bienfaits de votre Seigneur nierez-vous ?",
      de: "Welche der Wohltaten eures Herrn wollt ihr beide denn leugnen?",
    },
  },
  {
    surah: 14, verse: 7, surahName: "Ibrahim",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: {
      en: "If you are grateful, I will surely increase you.",
      ur: "اگر تم شکر کرو گے تو میں تمہیں اور زیادہ دوں گا۔",
      ru: "Если будете благодарны, Я непременно приумножу вам.",
      bn: "যদি তোমরা কৃতজ্ঞ হও, তবে আমি অবশ্যই তোমাদের বাড়িয়ে দেব।",
      fa: "اگر شکرگزار باشید، حتماً بر شما می‌افزایم.",
      id: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah nikmat kepadamu.",
      ms: "Demi sesungguhnya! Jika kamu bersyukur, nescaya Aku akan tambahi nikmat-Ku kepadamu.",
      tr: "Andolsun, eğer şükrederseniz elbette size (nimetimi) artırırım.",
      fr: "Si vous êtes reconnaissants, très certainement J'augmenterai [Mes bienfaits] pour vous.",
      de: "Wenn ihr dankbar seid, werde Ich euch wahrlich mehr geben.",
    },
  },
];

const HADITHS: DailyHadith[] = [
  {
    text: {
      en: "The strong believer is not the one who overpowers others, but the one who controls himself when angry.",
      ur: "طاقتور وہ نہیں جو دوسروں کو پچھاڑ دے، بلکہ طاقتور وہ ہے جو غصے کے وقت اپنے آپ پر قابو رکھے۔",
      ru: "Сильный не тот, кто одолевает других, а тот, кто владеет собой в гневе.",
      bn: "শক্তিশালী সে নয় যে অন্যকে পরাজিত করে, বরং সে যে রাগের সময় নিজেকে সংযত রাখে।",
      fa: "قوی کسی نیست که دیگران را زمین بزند، بلکه کسی است که هنگام خشم بر خود مسلط باشد.",
      id: "Orang kuat bukanlah yang menang bergulat, tetapi yang mampu menahan diri saat marah.",
      ms: "Orang kuat bukanlah yang mampu menewaskan orang lain, tetapi yang mampu mengawal dirinya ketika marah.",
      tr: "Güçlü, güreşte üstün gelen değildir; asıl güçlü, öfke anında kendine hâkim olandır.",
      fr: "Le fort n'est pas celui qui terrasse les autres, mais celui qui se maîtrise dans la colère.",
      de: "Stark ist nicht, wer andere niederringt, sondern wer sich im Zorn beherrscht.",
    },
    source: "Bukhari 6114, Muslim 2609",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: {
      en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      ur: "جو اللہ اور یومِ آخرت پر ایمان رکھتا ہے، وہ اچھی بات کہے یا خاموش رہے۔",
      ru: "Кто верит в Аллаха и в Последний день — пусть говорит благое или молчит.",
      bn: "যে আল্লাহ ও আখিরাতে বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
      fa: "هر کس به خدا و روز قیامت ایمان دارد، سخن نیک بگوید یا خاموش بماند.",
      id: "Barang siapa beriman kepada Allah dan Hari Akhir, hendaklah berkata baik atau diam.",
      ms: "Sesiapa yang beriman kepada Allah dan Hari Akhirat, hendaklah dia berkata baik atau diam.",
      tr: "Kim Allah'a ve ahiret gününe iman ediyorsa ya hayır söylesin ya da sussun.",
      fr: "Que celui qui croit en Allah et au Jour dernier dise du bien ou se taise.",
      de: "Wer an Allah und den Jüngsten Tag glaubt, soll Gutes sprechen oder schweigen.",
    },
    source: "Bukhari 6018, Muslim 47",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: {
      en: "None of you truly believes until he loves for his brother what he loves for himself.",
      ur: "تم میں سے کوئی اس وقت تک مؤمن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی نہ چاہے جو اپنے لیے چاہتا ہے۔",
      ru: "Никто из вас не уверует, пока не полюбит для брата своего то же, что любит для себя.",
      bn: "তোমাদের কেউ ততক্ষণ প্রকৃত মুমিন হবে না, যতক্ষণ না সে নিজের জন্য যা পছন্দ করে ভাইয়ের জন্যও তাই পছন্দ করবে।",
      fa: "هیچ‌یک از شما ایمان نمی‌آورد تا آنکه برای برادرش همان را دوست بدارد که برای خود دوست دارد.",
      id: "Tidak sempurna iman salah seorang di antara kalian sehingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya.",
      ms: "Tidak sempurna iman seseorang antara kamu sehingga dia mencintai untuk saudaranya apa yang dia cintai untuk dirinya sendiri.",
      tr: "Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe (gerçek) iman etmiş olamaz.",
      fr: "Aucun de vous ne croit vraiment tant qu'il ne désire pas pour son frère ce qu'il désire pour lui-même.",
      de: "Keiner von euch glaubt (wahrhaft), bis er für seinen Bruder liebt, was er für sich selbst liebt.",
    },
    source: "Bukhari 13, Muslim 45",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    text: {
      en: "Deeds are judged by intentions, and each person shall have what they intended.",
      ur: "اعمال کا دارومدار نیتوں پر ہے، اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
      ru: "Дела оцениваются по намерениям, и каждому — то, что он намеревался.",
      bn: "কর্মের মূল্য নির্ভর করে নিয়তের উপর, আর প্রত্যেকে তাই পাবে যা সে নিয়ত করেছে।",
      fa: "اعمال به نیت‌ها بستگی دارد و برای هر کس همان است که نیت کرده است.",
      id: "Sesungguhnya amal itu tergantung pada niat, dan setiap orang mendapatkan apa yang ia niatkan.",
      ms: "Sesungguhnya amalan itu bergantung pada niat, dan setiap orang akan mendapat apa yang diniatkannya.",
      tr: "Ameller ancak niyetlere göredir; herkese niyet ettiği şey vardır.",
      fr: "Les actes ne valent que par les intentions, et à chacun ce qu'il a eu l'intention de faire.",
      de: "Die Taten werden nach den Absichten beurteilt, und jedem wird das, was er beabsichtigt hat.",
    },
    source: "Bukhari 1, Muslim 1907",
    narrator: "Umar ibn al-Khattab (RA)",
  },
  {
    text: {
      en: "Make things easy, do not make them difficult; give good news, do not repel.",
      ur: "آسانی کرو، مشکل نہ بناؤ؛ خوش خبری دو، نفرت نہ دلاؤ۔",
      ru: "Облегчайте, не затрудняйте; радуйте вестями, не отталкивайте.",
      bn: "সহজ করো, কঠিন করো না; সুসংবাদ দাও, বিরক্ত করো না।",
      fa: "آسان بگیرید و سخت نگیرید؛ مژده دهید و متنفر نسازید.",
      id: "Mudahkanlah, jangan mempersulit; berilah kabar gembira, jangan membuat orang lari.",
      ms: "Permudahkanlah, jangan menyusahkan; berilah khabar gembira, jangan menakutkan.",
      tr: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.",
      fr: "Facilitez et ne rendez pas difficile ; annoncez la bonne nouvelle et ne repoussez pas.",
      de: "Macht es leicht und nicht schwer; verkündet Gutes und stoßt nicht ab.",
    },
    source: "Bukhari 69, Muslim 1734",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    text: {
      en: "The most beloved deeds to Allah are those done consistently, even if small.",
      ur: "اللہ کو سب سے پیارے اعمال وہ ہیں جو مسلسل ہوں، خواہ کم ہی کیوں نہ ہوں۔",
      ru: "Самые любимые Аллахом дела — те, что совершаются постоянно, пусть и малы.",
      bn: "আল্লাহর কাছে সবচেয়ে প্রিয় সেই আমল, যা নিয়মিত করা হয়, যদিও তা অল্প হয়।",
      fa: "محبوب‌ترین اعمال نزد خدا آن است که پیوسته باشد، هرچند اندک.",
      id: "Amalan yang paling dicintai Allah adalah yang dilakukan terus-menerus meski sedikit.",
      ms: "Amalan yang paling disukai Allah ialah yang dilakukan berterusan walaupun sedikit.",
      tr: "Amellerin Allah'a en sevimlisi, az da olsa devamlı olanıdır.",
      fr: "Les actes les plus aimés d'Allah sont ceux accomplis avec constance, même s'ils sont peu.",
      de: "Die Allah liebsten Taten sind jene, die beständig verrichtet werden, auch wenn sie gering sind.",
    },
    source: "Bukhari 6464, Muslim 783",
    narrator: "'Aisha (RA)",
  },
  {
    text: {
      en: "Whoever relieves a believer's hardship in this world — Allah will relieve his hardship on the Day of Judgment.",
      ur: "جو کسی مؤمن کی دنیاوی مشکل دور کرے، اللہ قیامت کے دن اس کی مشکل دور کرے گا۔",
      ru: "Кто облегчит верующему тяготу в этом мире — Аллах облегчит ему тяготу в День Суда.",
      bn: "যে দুনিয়াতে কোনো মুমিনের কষ্ট দূর করবে, আল্লাহ কিয়ামতের দিন তার কষ্ট দূর করবেন।",
      fa: "هر کس مشکلی از مؤمنی در دنیا برطرف کند، خدا مشکلی از او در روز قیامت برطرف می‌سازد.",
      id: "Barang siapa meringankan kesulitan seorang mukmin di dunia, Allah akan meringankan kesulitannya di hari kiamat.",
      ms: "Sesiapa yang meringankan kesusahan seorang mukmin di dunia, Allah akan meringankan kesusahannya di hari kiamat.",
      tr: "Kim bir mümini bir sıkıntıdan kurtarırsa, Allah da kıyamet gününde onu bir sıkıntıdan kurtarır.",
      fr: "Quiconque soulage un croyant d'une peine ici-bas, Allah le soulagera d'une peine au Jour du Jugement.",
      de: "Wer einem Gläubigen eine Not in dieser Welt nimmt, dem nimmt Allah eine Not am Tag der Auferstehung.",
    },
    source: "Muslim 2699",
    narrator: "Abu Hurairah (RA)",
  },
  {
    text: {
      en: "Kindness is not found in anything except that it beautifies it.",
      ur: "نرمی جس چیز میں بھی ہو، اسے خوبصورت بنا دیتی ہے۔",
      ru: "В чём бы ни была мягкость — она украшает это.",
      bn: "কোমলতা যে কোনো কিছুতেই থাকুক, তা তাকে সৌন্দর্যময় করে তোলে।",
      fa: "نرمی در هر چیزی که باشد، آن را زیبا می‌کند.",
      id: "Kelembutan tidaklah ada pada sesuatu kecuali menghiasinya.",
      ms: "Kelembutan tidak ada pada sesuatu melainkan ia menghiasinya.",
      tr: "Yumuşaklık, hangi şeyde bulunursa onu güzelleştirir.",
      fr: "La douceur n'est jamais dans une chose sans l'embellir.",
      de: "Sanftmut ist in nichts, ohne dass sie es schmückt.",
    },
    source: "Muslim 2594",
    narrator: "'Aisha (RA)",
  },
  {
    text: {
      en: "The best of people are those most beneficial to people.",
      ur: "لوگوں میں سب سے بہتر وہ ہے جو لوگوں کے لیے سب سے زیادہ نفع بخش ہو۔",
      ru: "Лучший из людей — тот, кто больше всех приносит пользу людям.",
      bn: "মানুষের মধ্যে শ্রেষ্ঠ সেই, যে মানুষের জন্য সবচেয়ে বেশি উপকারী।",
      fa: "بهترین مردم کسی است که برای مردم سودمندتر باشد.",
      id: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.",
      ms: "Sebaik-baik manusia ialah yang paling bermanfaat kepada manusia.",
      tr: "İnsanların en hayırlısı, insanlara en faydalı olanıdır.",
      fr: "Le meilleur des hommes est celui qui est le plus utile aux autres.",
      de: "Die besten Menschen sind jene, die den Menschen am nützlichsten sind.",
    },
    source: "Al-Mu'jam al-Awsat 5787 (hasan)",
    narrator: "Jabir (RA)",
  },
  {
    text: {
      en: "Smiling in your brother's face is charity.",
      ur: "اپنے بھائی کے چہرے پر مسکرانا صدقہ ہے۔",
      ru: "Улыбка брату твоему — это милостыня.",
      bn: "তোমার ভাইয়ের মুখে হাসি ফোটানোও সদকা।",
      fa: "لبخند زدن به روی برادرت صدقه است.",
      id: "Senyummu kepada saudaramu adalah sedekah.",
      ms: "Senyumanmu kepada saudaramu adalah sedekah.",
      tr: "Kardeşinin yüzüne gülümsemen bir sadakadır.",
      fr: "Sourire à ton frère est une aumône.",
      de: "Deinem Bruder ins Gesicht zu lächeln ist eine Wohltätigkeit.",
    },
    source: "Tirmidhi 1956 (hasan)",
    narrator: "Abu Dharr (RA)",
  },
];

const DHIKRS: DailyDhikr[] = [
  {
    arabic: "سُبْحَانَ ٱللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subḥāna-llāhi wa bi-ḥamdih",
    translation: {
      en: "Glory to Allah and praise to Him.",
      ur: "اللہ پاک ہے اور اسی کی تعریف ہے۔",
      ru: "Пречист Аллах и хвала Ему.",
      bn: "আল্লাহ পবিত্র, সমস্ত প্রশংসা তাঁরই।",
      fa: "پاک و منزه است خدا و ستایش از آن اوست.",
      id: "Maha Suci Allah dan segala puji bagi-Nya.",
      ms: "Maha Suci Allah dan segala puji bagi-Nya.",
      tr: "Allah'ı tesbih ederim, hamd O'nadır.",
      fr: "Gloire à Allah et louange à Lui.",
      de: "Preis sei Allah und Lobpreis Ihm.",
    },
    count: 100,
    source: "Bukhari 6405",
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا ٱللَّهُ",
    transliteration: "Lā ilāha illa-llāh",
    translation: {
      en: "There is no god but Allah.",
      ur: "اللہ کے سوا کوئی معبود نہیں۔",
      ru: "Нет бога, кроме Аллаха.",
      bn: "আল্লাহ ছাড়া কোনো ইলাহ নেই।",
      fa: "هیچ معبودی جز خدا نیست.",
      id: "Tiada tuhan selain Allah.",
      ms: "Tiada tuhan melainkan Allah.",
      tr: "Allah'tan başka ilah yoktur.",
      fr: "Il n'y a de divinité qu'Allah.",
      de: "Es gibt keinen Gott außer Allah.",
    },
    count: 100,
    source: "Tirmidhi 3585",
  },
  {
    arabic: "أَسْتَغْفِرُ ٱللَّهَ",
    transliteration: "Astaghfiru-llāh",
    translation: {
      en: "I seek forgiveness from Allah.",
      ur: "میں اللہ سے بخشش مانگتا ہوں۔",
      ru: "Прошу прощения у Аллаха.",
      bn: "আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি।",
      fa: "از خدا آمرزش می‌خواهم.",
      id: "Aku memohon ampun kepada Allah.",
      ms: "Aku memohon ampun kepada Allah.",
      tr: "Allah'tan bağışlanma dilerim.",
      fr: "Je demande pardon à Allah.",
      de: "Ich bitte Allah um Vergebung.",
    },
    count: 100,
    source: "Muslim 2702",
  },
  {
    arabic: "ٱلْحَمْدُ لِلَّهِ",
    transliteration: "Al-ḥamdu li-llāh",
    translation: {
      en: "All praise is due to Allah.",
      ur: "تمام تعریفیں اللہ ہی کے لیے ہیں۔",
      ru: "Хвала Аллаху.",
      bn: "সমস্ত প্রশংসা আল্লাহর জন্য।",
      fa: "ستایش از آن خداست.",
      id: "Segala puji bagi Allah.",
      ms: "Segala puji bagi Allah.",
      tr: "Hamd Allah'a mahsustur.",
      fr: "Louange à Allah.",
      de: "Alles Lob gebührt Allah.",
    },
    count: 33,
    source: "Muslim 2731",
  },
  {
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّهِ",
    transliteration: "Lā ḥawla wa lā quwwata illā bi-llāh",
    translation: {
      en: "There is no might nor power except with Allah.",
      ur: "نہ کوئی طاقت ہے نہ قوت مگر اللہ کے ساتھ۔",
      ru: "Нет мощи и силы, кроме как с Аллахом.",
      bn: "আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।",
      fa: "هیچ نیرو و توانی جز به خدا نیست.",
      id: "Tiada daya dan kekuatan kecuali dengan Allah.",
      ms: "Tiada daya dan kekuatan melainkan dengan Allah.",
      tr: "Güç ve kuvvet ancak Allah iledir.",
      fr: "Il n'y a de force ni de puissance qu'en Allah.",
      de: "Es gibt keine Macht und keine Kraft außer bei Allah.",
    },
    count: 33,
    source: "Bukhari 6384",
  },
  {
    arabic: "حَسْبِيَ ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
    transliteration: "Ḥasbiya-llāhu lā ilāha illā huwa",
    translation: {
      en: "Allah is enough for me; there is no god but Him.",
      ur: "مجھے اللہ کافی ہے، اس کے سوا کوئی معبود نہیں۔",
      ru: "Мне достаточно Аллаха, нет бога, кроме Него.",
      bn: "আমার জন্য আল্লাহই যথেষ্ট, তিনি ছাড়া কোনো ইলাহ নেই।",
      fa: "خدا مرا کافی است؛ معبودی جز او نیست.",
      id: "Cukuplah Allah bagiku; tiada tuhan selain Dia.",
      ms: "Cukuplah Allah bagiku; tiada tuhan melainkan Dia.",
      tr: "Allah bana yeter, O'ndan başka ilah yoktur.",
      fr: "Allah me suffit ; il n'y a de divinité que Lui.",
      de: "Allah genügt mir; es gibt keinen Gott außer Ihm.",
    },
    count: 7,
    source: "Abu Dawud 5081",
  },
  {
    arabic: "ٱللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
    transliteration: "Allāhumma ṣalli ʿalā Muḥammad",
    translation: {
      en: "O Allah, send blessings upon Muhammad.",
      ur: "اے اللہ! محمد ﷺ پر درود بھیج۔",
      ru: "О Аллах, благослови Мухаммада.",
      bn: "হে আল্লাহ! মুহাম্মদের উপর রহমত বর্ষণ করুন।",
      fa: "خدایا، بر محمد درود فرست.",
      id: "Ya Allah, limpahkanlah salawat kepada Muhammad.",
      ms: "Ya Allah, cucurilah selawat ke atas Muhammad.",
      tr: "Allah'ım, Muhammed'e salât et.",
      fr: "Ô Allah, prie sur Muhammad.",
      de: "O Allah, segne Muhammad.",
    },
    count: 10,
    source: "Tirmidhi 484",
  },
];

const REFLECTIONS: DailyReflection[] = [
  {
    prompt: {
      en: "What is one blessing today you almost overlooked?",
      ur: "آج کی وہ کون سی نعمت ہے جسے آپ تقریباً نظرانداز کر گئے؟",
      ru: "Какое благо сегодня вы едва не упустили из виду?",
      bn: "আজকের কোন নেয়ামতটি আপনি প্রায় লক্ষ্যই করেননি?",
      fa: "امروز چه نعمتی بود که تقریباً از آن غافل شدید؟",
      id: "Nikmat apa hari ini yang hampir kamu lewatkan?",
      ms: "Apakah satu nikmat hari ini yang hampir kamu terlepas pandang?",
      tr: "Bugün neredeyse fark etmediğin bir nimet nedir?",
      fr: "Quelle bénédiction avez-vous presque manquée aujourd'hui ?",
      de: "Welchen Segen hast du heute beinahe übersehen?",
    },
  },
  {
    prompt: {
      en: "Where did you feel Allah's mercy today, even quietly?",
      ur: "آج آپ نے کہاں اللہ کی رحمت محسوس کی، خواہ خاموشی سے؟",
      ru: "Где вы почувствовали милость Аллаха сегодня, пусть и тихо?",
      bn: "আজ কোথায় আপনি আল্লাহর রহমত অনুভব করেছেন, নীরবেও?",
      fa: "امروز کجا رحمت خدا را حس کردید، حتی به آرامی؟",
      id: "Di mana kamu merasakan rahmat Allah hari ini, meski secara diam?",
      ms: "Di manakah kamu merasai rahmat Allah hari ini, walaupun secara senyap?",
      tr: "Bugün, sessizce de olsa, Allah'ın rahmetini nerede hissettin?",
      fr: "Où avez-vous ressenti la miséricorde d'Allah aujourd'hui, même discrètement ?",
      de: "Wo hast du heute Allahs Barmherzigkeit gespürt, auch leise?",
    },
  },
  {
    prompt: {
      en: "Whose burden could you lighten this week?",
      ur: "اس ہفتے آپ کس کا بوجھ ہلکا کر سکتے ہیں؟",
      ru: "Чью тяжесть вы могли бы облегчить на этой неделе?",
      bn: "এই সপ্তাহে আপনি কার ভার হালকা করতে পারেন?",
      fa: "این هفته بار چه کسی را می‌توانید سبک کنید؟",
      id: "Beban siapa yang bisa kamu ringankan pekan ini?",
      ms: "Beban siapakah yang boleh kamu ringankan minggu ini?",
      tr: "Bu hafta kimin yükünü hafifletebilirsin?",
      fr: "Le fardeau de qui pourriez-vous alléger cette semaine ?",
      de: "Wessen Last könntest du diese Woche erleichtern?",
    },
  },
  {
    prompt: {
      en: "What are you trying to control that isn't yours to carry?",
      ur: "آپ کس چیز کو قابو کرنے کی کوشش کر رہے ہیں جو اٹھانا آپ کا کام نہیں؟",
      ru: "Что вы пытаетесь контролировать, что не ваша ноша?",
      bn: "আপনি এমন কী নিয়ন্ত্রণ করতে চাইছেন যা বহন করা আপনার দায়িত্ব নয়?",
      fa: "چه چیزی را می‌خواهید کنترل کنید که بار شما نیست؟",
      id: "Apa yang sedang kamu coba kendalikan padahal bukan bebanmu?",
      ms: "Apa yang cuba kamu kawal sedangkan ia bukan tanggunganmu?",
      tr: "Taşımak sana ait olmayan neyi kontrol etmeye çalışıyorsun?",
      fr: "Que cherchez-vous à contrôler qui n'est pas à vous de porter ?",
      de: "Was versuchst du zu kontrollieren, was nicht deine Last ist?",
    },
  },
  {
    prompt: {
      en: "When did you last make du'a for someone by name?",
      ur: "آخری بار آپ نے کب کسی کے لیے نام لے کر دعا کی؟",
      ru: "Когда вы в последний раз молились за кого-то по имени?",
      bn: "শেষ কবে আপনি কারও জন্য নাম ধরে দোয়া করেছেন?",
      fa: "آخرین بار کی برای کسی به اسم دعا کردید؟",
      id: "Kapan terakhir kali kamu berdoa untuk seseorang dengan menyebut namanya?",
      ms: "Bilakah kali terakhir kamu berdoa untuk seseorang dengan menyebut namanya?",
      tr: "En son ne zaman birinin ismini anarak dua ettin?",
      fr: "Quand avez-vous prié pour quelqu'un en le nommant pour la dernière fois ?",
      de: "Wann hast du zuletzt für jemanden namentlich Bittgebet gesprochen?",
    },
  },
  {
    prompt: {
      en: "What word did you speak today that you'd want recorded?",
      ur: "آج آپ نے کون سا لفظ کہا جسے آپ محفوظ رکھنا چاہیں گے؟",
      ru: "Какое слово, сказанное сегодня, вы хотели бы записать?",
      bn: "আজ আপনি এমন কী বললেন যা আপনি লিপিবদ্ধ রাখতে চাইবেন?",
      fa: "امروز چه سخنی گفتید که دوست دارید ثبت شود؟",
      id: "Kata apa yang kamu ucapkan hari ini yang ingin kamu abadikan?",
      ms: "Apakah kata yang kamu ucapkan hari ini yang kamu ingin ia dicatat?",
      tr: "Bugün söylediğin ve kayda geçmesini isteyeceğin söz nedir?",
      fr: "Quel mot avez-vous prononcé aujourd'hui que vous voudriez voir consigné ?",
      de: "Welches Wort hast du heute gesprochen, das aufgezeichnet werden sollte?",
    },
  },
  {
    prompt: {
      en: "What is one small act of worship you can be consistent in?",
      ur: "کون سا چھوٹا سا عمل ہے جس پر آپ مستقل رہ سکتے ہیں؟",
      ru: "Какое малое поклонение вы можете совершать постоянно?",
      bn: "কোন ছোট্ট ইবাদতটি আপনি নিয়মিত করতে পারেন?",
      fa: "کدام عبادت کوچک را می‌توانید پیوسته انجام دهید؟",
      id: "Ibadah kecil apa yang bisa kamu lakukan secara konsisten?",
      ms: "Apakah ibadah kecil yang boleh kamu lakukan secara istiqamah?",
      tr: "Sürekli yapabileceğin küçük bir ibadet nedir?",
      fr: "Quel petit acte d'adoration pouvez-vous accomplir avec constance ?",
      de: "Welche kleine Anbetung kannst du beständig verrichten?",
    },
  },
  {
    prompt: {
      en: "What are you rushing that deserves patience?",
      ur: "آپ کس چیز میں جلدی کر رہے ہیں جو صبر کی مستحق ہے؟",
      ru: "С чем вы торопитесь, что заслуживает терпения?",
      bn: "আপনি কোন বিষয়ে তাড়াহুড়ো করছেন যা ধৈর্য দাবি করে?",
      fa: "چه چیزی را می‌شتابید که سزاوار صبر است؟",
      id: "Apa yang sedang kamu buru-buru padahal layak untuk disabari?",
      ms: "Apakah yang kamu tergesa-gesa padahal ia berhak dengan kesabaran?",
      tr: "Sabır hak eden neyi acele ediyorsun?",
      fr: "Que précipitez-vous qui mériterait de la patience ?",
      de: "Was drängst du, das Geduld verdient?",
    },
  },
  {
    prompt: {
      en: "Whom do you need to forgive — for your own peace?",
      ur: "آپ کو کس کو معاف کرنے کی ضرورت ہے — اپنی سکون کے لیے؟",
      ru: "Кого вам нужно простить — ради собственного покоя?",
      bn: "নিজের প্রশান্তির জন্য আপনাকে কাকে ক্ষমা করতে হবে?",
      fa: "برای آرامش خود، چه کسی را باید ببخشید؟",
      id: "Siapa yang perlu kamu maafkan — demi ketenanganmu sendiri?",
      ms: "Siapakah yang perlu kamu maafkan — demi ketenanganmu sendiri?",
      tr: "Kendi huzurun için kimi affetmen gerekiyor?",
      fr: "Qui devez-vous pardonner — pour votre propre paix ?",
      de: "Wem musst du vergeben — für deinen eigenen Frieden?",
    },
  },
  {
    prompt: {
      en: "What is one thing you're grateful for that money can't buy?",
      ur: "کوئی ایک چیز جس کے لیے آپ شکر گزار ہیں جو پیسے سے نہیں خریدی جا سکتی؟",
      ru: "Что-то одно, за что вы благодарны и что нельзя купить за деньги?",
      bn: "এমন একটি বিষয় যার জন্য আপনি কৃতজ্ঞ, যা অর্থ দিয়ে কেনা যায় না?",
      fa: "یک چیز که برای آن سپاسگزارید و با پول خریدنی نیست چیست؟",
      id: "Satu hal apa yang kamu syukuri dan tak bisa dibeli dengan uang?",
      ms: "Satu perkara yang kamu bersyukur atasnya dan tidak boleh dibeli dengan wang?",
      tr: "Parayla satın alınamayan, şükrettiğin bir şey nedir?",
      fr: "Une chose pour laquelle vous êtes reconnaissant et que l'argent ne peut acheter ?",
      de: "Wofür bist du dankbar, das man mit Geld nicht kaufen kann?",
    },
  },
];

const STORY_TEASERS: DailyStoryTeaser[] = [
  {
    storyId: "yunus", moodId: "anxious", durationMin: 4,
    title: {
      en: "The Whale's Prayer",
      ur: "مچھلی کی دعا", ru: "Молитва во чреве кита", bn: "মাছের ভেতরের দোয়া",
      fa: "دعای درون ماهی", id: "Doa di Perut Ikan", ms: "Doa di Perut Ikan",
      tr: "Balığın Karnındaki Dua", fr: "La prière dans la baleine", de: "Das Gebet im Wal",
    },
    blurb: {
      en: "Prophet Yunus (AS) in the depths — and the words that brought him back.",
      ur: "حضرت یونس علیہ السلام گہرائیوں میں — اور وہ کلمات جو انہیں واپس لے آئے۔",
      ru: "Пророк Юнус (мир ему) в пучине — и слова, что вернули его.",
      bn: "নবী ইউনুস (আঃ) গভীরে — এবং সেই বাক্য যা তাঁকে ফিরিয়ে আনল।",
      fa: "حضرت یونس (ع) در ژرفا — و کلماتی که او را بازگرداند.",
      id: "Nabi Yunus (AS) di kedalaman — dan kalimat yang membawanya kembali.",
      ms: "Nabi Yunus (AS) di dasar lautan — dan kalimah yang membawanya pulang.",
      tr: "Yunus (AS) derinliklerde — ve onu geri getiren kelimeler.",
      fr: "Le prophète Younous (as) dans les profondeurs — et les mots qui l'ont ramené.",
      de: "Prophet Yunus (as) in der Tiefe — und die Worte, die ihn zurückbrachten.",
    },
  },
  {
    storyId: "musa", moodId: "impatient", durationMin: 5,
    title: {
      en: "The Sea Parts",
      ur: "سمندر پھٹتا ہے", ru: "Море расступается", bn: "সমুদ্র বিদীর্ণ হয়",
      fa: "دریا شکافته می‌شود", id: "Laut Terbelah", ms: "Laut Terbelah",
      tr: "Deniz İkiye Yarılıyor", fr: "La mer s'ouvre", de: "Das Meer teilt sich",
    },
    blurb: {
      en: "Prophet Musa (AS) at the edge — trapped, told to strike, and trusting anyway.",
      ur: "حضرت موسیٰ علیہ السلام کنارے پر — پھنسے ہوئے، عصا مارنے کا حکم، اور پھر بھی بھروسہ۔",
      ru: "Пророк Муса (мир ему) на краю — в ловушке, велено ударить, и он всё же доверился.",
      bn: "নবী মুসা (আঃ) কিনারায় — আটকা, লাঠি মারার নির্দেশ, তবু ভরসা।",
      fa: "حضرت موسی (ع) در آستانه — محاصره، فرمان زدن عصا، و توکل با این وجود.",
      id: "Nabi Musa (AS) di tepi — terjebak, diperintahkan memukul, dan tetap percaya.",
      ms: "Nabi Musa (AS) di pinggir laut — terperangkap, disuruh memukul, dan tetap yakin.",
      tr: "Musa (AS) sınırda — kapana kısılmış, vurmakla emrolunmuş, yine de tevekkül eden.",
      fr: "Le prophète Moussa (as) au bord — piégé, appelé à frapper, et se confiant malgré tout.",
      de: "Prophet Musa (as) am Rand — gefangen, aufgefordert zuzuschlagen, dennoch vertrauend.",
    },
  },
  {
    storyId: "maryam", moodId: "lonely", durationMin: 4,
    title: {
      en: "Under the Palm Tree",
      ur: "کھجور کے درخت کے نیچے", ru: "Под пальмой", bn: "খেজুর গাছের নিচে",
      fa: "زیر درخت خرما", id: "Di Bawah Pohon Kurma", ms: "Di Bawah Pohon Kurma",
      tr: "Hurma Ağacının Altında", fr: "Sous le palmier", de: "Unter der Palme",
    },
    blurb: {
      en: "Maryam (AS) alone in the desert — and the sustenance that fell to her.",
      ur: "مریم علیہا السلام صحرا میں تنہا — اور وہ رزق جو ان پر گرا۔",
      ru: "Марьям (мир ей) одна в пустыне — и пропитание, что упало к ней.",
      bn: "মারইয়াম (আঃ) মরুতে একা — এবং যে রিযিক তাঁর জন্য নেমে এলো।",
      fa: "مریم (س) در بیابان تنها — و رزقی که بر او فرود آمد.",
      id: "Maryam (AS) sendirian di padang — dan rezeki yang jatuh untuknya.",
      ms: "Maryam (AS) keseorangan di padang — dan rezeki yang gugur untuknya.",
      tr: "Meryem (as) çölde yalnız — ve ona düşen rızık.",
      fr: "Maryam (as) seule dans le désert — et la subsistance qui tomba pour elle.",
      de: "Maryam (as) allein in der Wüste — und die Versorgung, die auf sie fiel.",
    },
  },
  {
    storyId: "adam", moodId: "guilty", durationMin: 4,
    title: {
      en: "The First Return",
      ur: "پہلی توبہ", ru: "Первое возвращение", bn: "প্রথম প্রত্যাবর্তন",
      fa: "نخستین بازگشت", id: "Kembali yang Pertama", ms: "Kepulangan Pertama",
      tr: "İlk Dönüş", fr: "Le premier retour", de: "Die erste Umkehr",
    },
    blurb: {
      en: "Adam (AS), the first sin, and the words Allah taught him to come home.",
      ur: "آدم علیہ السلام، پہلا گناہ، اور وہ کلمات جو اللہ نے انہیں گھر واپسی کے لیے سکھائے۔",
      ru: "Адам (мир ему), первый грех, и слова, которым Аллах научил его вернуться.",
      bn: "আদম (আঃ), প্রথম পাপ, এবং সেই বাক্য যা আল্লাহ তাঁকে ফিরে আসতে শেখালেন।",
      fa: "آدم (ع)، نخستین گناه، و کلماتی که خدا برای بازگشت به او آموخت.",
      id: "Adam (AS), dosa pertama, dan kalimat yang Allah ajarkan agar ia pulang.",
      ms: "Adam (AS), dosa pertama, dan kalimah yang Allah ajarkan untuk kembali pulang.",
      tr: "Âdem (AS), ilk günah, ve Allah'ın ona dönmesi için öğrettiği kelimeler.",
      fr: "Adam (as), le premier péché, et les mots qu'Allah lui enseigna pour revenir.",
      de: "Adam (as), die erste Sünde, und die Worte, die Allah ihn zur Umkehr lehrte.",
    },
  },
  {
    storyId: "ibrahim", moodId: "afraid", durationMin: 5,
    title: {
      en: "Into the Fire",
      ur: "آگ میں", ru: "В огонь", bn: "আগুনের ভেতরে",
      fa: "به درون آتش", id: "Ke Dalam Api", ms: "Ke Dalam Api",
      tr: "Ateşin İçine", fr: "Dans le feu", de: "Ins Feuer",
    },
    blurb: {
      en: "Prophet Ibrahim (AS) — and the flame that was commanded to be cool.",
      ur: "حضرت ابراہیم علیہ السلام — اور وہ شعلہ جسے ٹھنڈا ہونے کا حکم دیا گیا۔",
      ru: "Пророк Ибрахим (мир ему) — и пламя, которому велено было стать прохладным.",
      bn: "নবী ইব্রাহিম (আঃ) — এবং সেই আগুন যাকে ঠাণ্ডা হতে বলা হলো।",
      fa: "حضرت ابراهیم (ع) — و شعله‌ای که به آن فرمان سرد شدن داده شد.",
      id: "Nabi Ibrahim (AS) — dan api yang diperintahkan menjadi sejuk.",
      ms: "Nabi Ibrahim (AS) — dan api yang diperintahkan menjadi sejuk.",
      tr: "İbrahim (AS) — ve serin olması emredilen alev.",
      fr: "Le prophète Ibrahim (as) — et la flamme qui reçut l'ordre d'être fraîche.",
      de: "Prophet Ibrahim (as) — und die Flamme, der befohlen wurde, kühl zu sein.",
    },
  },
  {
    storyId: "sulaiman", moodId: "grateful", durationMin: 4,
    title: {
      en: "The King Who Bowed",
      ur: "وہ بادشاہ جس نے سجدہ کیا", ru: "Царь, склонившийся ниц", bn: "সেই বাদশাহ যিনি নত হলেন",
      fa: "پادشاهی که سجده کرد", id: "Raja yang Bersujud", ms: "Raja yang Bersujud",
      tr: "Secde Eden Kral", fr: "Le roi qui s'est prosterné", de: "Der König, der sich niederwarf",
    },
    blurb: {
      en: "Prophet Sulaiman (AS), given kingdoms — and only wanting to be thankful.",
      ur: "حضرت سلیمان علیہ السلام کو سلطنتیں دی گئیں — اور وہ صرف شکر گزار رہنا چاہتے تھے۔",
      ru: "Пророк Сулейман (мир ему), которому дарованы царства — и он лишь желал быть благодарным.",
      bn: "নবী সুলাইমান (আঃ), যাকে রাজত্ব দেওয়া হলো — তবু তিনি কেবল কৃতজ্ঞ থাকতে চেয়েছিলেন।",
      fa: "حضرت سلیمان (ع) که به او پادشاهی داده شد — و تنها می‌خواست سپاسگزار باشد.",
      id: "Nabi Sulaiman (AS), diberi kerajaan — dan hanya ingin bersyukur.",
      ms: "Nabi Sulaiman (AS), diberi kerajaan — dan hanya ingin bersyukur.",
      tr: "Süleyman (AS), kendisine krallıklar verildi — ve o yalnızca şükretmek istedi.",
      fr: "Le prophète Sulaymân (as), à qui furent donnés des royaumes — et qui ne voulait qu'être reconnaissant.",
      de: "Prophet Sulaiman (as), dem Königreiche gegeben wurden — und der nur dankbar sein wollte.",
    },
  },
];

// ---------- Rotation ----------

function daysSinceEpoch(d = new Date()): number {
  return Math.floor(d.getTime() / 86400000);
}

function pick<T>(pool: T[], offset: number): T {
  const day = daysSinceEpoch();
  return pool[(day + offset) % pool.length];
}

export function todayKey(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getToday() {
  return {
    date: todayKey(),
    verse: pick(VERSES, 0),
    hadith: pick(HADITHS, 3),
    dhikr: pick(DHIKRS, 1),
    reflection: pick(REFLECTIONS, 5),
    story: pick(STORY_TEASERS, 2),
  };
}

export function pickTr(map: Partial<Record<LanguageCode, string>>, lang: string, fallback = ""): string {
  return (map as Record<string, string | undefined>)[lang] ?? map.en ?? fallback;
}
