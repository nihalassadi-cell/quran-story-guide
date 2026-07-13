// Animated Prophet stories. MVP: Yunus (AS) pilot with 6 symbolic scenes.
// Art rule: no faces, no bodies — silhouettes, light, objects, landscapes only.
// Sources: Qur'an 21:87, 37:139–148, 68:48–50; Ibn Kathir, Qisas al-Anbiya.

import type { Localized } from "@/lib/language";

import img01 from "@/assets/stories/yunus/01-city.jpg";
import img02 from "@/assets/stories/yunus/02-storm.jpg";
import img03 from "@/assets/stories/yunus/03-lots.jpg";
import img04 from "@/assets/stories/yunus/04-depths.jpg";
import img05 from "@/assets/stories/yunus/05-darkness.jpg";
import img06 from "@/assets/stories/yunus/06-dawn.jpg";

export type KenBurns = "in" | "out" | "panLeft" | "panRight";

export interface StoryScene {
  image: string;
  narration: Localized;
  durationMs: number;
  kenBurns: KenBurns;
}

export interface Story {
  id: string;
  moodId: string;
  title: Localized;
  scenes: StoryScene[];
  sources: string[];
  durationSec: number;
}

// ---------- Yunus (AS) — "The Whale's Prayer" ----------

const YUNUS: Story = {
  id: "yunus",
  moodId: "anxious",
  title: {
    en: "The Whale's Prayer",
    ur: "مچھلی کی دعا", ru: "Молитва во чреве кита", bn: "মাছের ভেতরের দোয়া",
    fa: "دعای درون ماهی", id: "Doa di Perut Ikan", ms: "Doa di Perut Ikan",
    tr: "Balığın Karnındaki Dua", fr: "La prière dans la baleine", de: "Das Gebet im Wal",
  },
  sources: [
    "Qur'an 21:87 · Al-Anbiya",
    "Qur'an 37:139–148 · As-Saffat",
    "Qur'an 68:48–50 · Al-Qalam",
    "Ibn Kathir · Qisas al-Anbiya",
  ],
  durationSec: 72,
  scenes: [
    {
      image: img01,
      durationMs: 12000,
      kenBurns: "in",
      narration: {
        en: "The people of Nineveh had turned away. Prophet Yunus, upon him be peace, called them back to their Lord — and when they refused, he left them behind.",
        ur: "نینوا کے لوگ منہ موڑ چکے تھے۔ حضرت یونس علیہ السلام نے انہیں اپنے رب کی طرف بلایا — اور جب انہوں نے انکار کیا، وہ انہیں چھوڑ گئے۔",
        ru: "Народ Ниневии отвернулся. Пророк Юнус, мир ему, звал их к их Господу — а когда они отказались, он покинул их.",
        bn: "নিনেভার লোকেরা মুখ ফিরিয়ে নিয়েছিল। নবী ইউনুস (আঃ) তাদের রবের দিকে ডেকেছিলেন — যখন তারা অস্বীকার করল, তিনি তাদের ছেড়ে গেলেন।",
        fa: "مردم نینوا روی گردانیده بودند. حضرت یونس (ع) آنان را به سوی پروردگارشان فراخواند — و چون نپذیرفتند، از میان آنان رفت.",
        id: "Penduduk Ninawa berpaling. Nabi Yunus (AS) menyeru mereka kembali kepada Tuhan — dan ketika mereka menolak, ia meninggalkan mereka.",
        ms: "Penduduk Ninawa berpaling. Nabi Yunus (AS) menyeru mereka kembali kepada Tuhan — dan apabila mereka menolak, dia meninggalkan mereka.",
        tr: "Ninova halkı yüz çevirmişti. Yunus (AS) onları Rablerine çağırdı — reddettiklerinde, onları arkasında bıraktı.",
        fr: "Le peuple de Ninive s'était détourné. Le prophète Younous, sur lui la paix, les rappela à leur Seigneur — et quand ils refusèrent, il s'en alla.",
        de: "Das Volk von Ninive hatte sich abgewandt. Prophet Yunus, Friede sei mit ihm, rief sie zurück zu ihrem Herrn — und als sie sich weigerten, ließ er sie zurück.",
      },
    },
    {
      image: img02,
      durationMs: 11000,
      kenBurns: "panRight",
      narration: {
        en: "He boarded a ship, laden with cargo. The sea grew heavy. A storm rose against them, and the ship began to sink.",
        ur: "وہ سامان سے لدے جہاز پر سوار ہوئے۔ سمندر بھاری ہو گیا۔ ان پر طوفان اٹھا، اور جہاز ڈوبنے لگا۔",
        ru: "Он взошёл на нагруженный корабль. Море отяжелело. На них поднялась буря, и корабль стал тонуть.",
        bn: "তিনি বোঝাই এক জাহাজে উঠলেন। সমুদ্র ভারী হয়ে উঠল। ঝড় এল, জাহাজ ডুবতে লাগল।",
        fa: "او بر کشتی‌ای پر از بار سوار شد. دریا سنگین شد. طوفانی برخاست و کشتی به غرق شدن نزدیک گشت.",
        id: "Ia menaiki kapal yang penuh muatan. Laut menjadi berat. Badai menerpa, dan kapal mulai tenggelam.",
        ms: "Dia menaiki kapal yang sarat muatan. Laut menjadi berat. Ribut melanda, dan kapal mula tenggelam.",
        tr: "Yüklü bir gemiye bindi. Deniz ağırlaştı. Fırtına koptu ve gemi batmaya başladı.",
        fr: "Il monta à bord d'un navire chargé. La mer s'alourdit. Une tempête se leva, et le navire commença à sombrer.",
        de: "Er ging an Bord eines beladenen Schiffes. Das Meer wurde schwer. Ein Sturm erhob sich, und das Schiff begann zu sinken.",
      },
    },
    {
      image: img03,
      durationMs: 11000,
      kenBurns: "in",
      narration: {
        en: "The sailors cast lots to decide who must be thrown overboard. Three times the lot fell on him. He accepted, and stepped into the sea.",
        ur: "ملاحوں نے قرعہ ڈالا کہ کسے سمندر میں پھینکا جائے۔ تین بار قرعہ ان پر پڑا۔ انہوں نے قبول کیا اور سمندر میں چھلانگ لگا دی۔",
        ru: "Моряки бросили жребий, чтобы решить, кого сбросить в море. Трижды выпадало на него. Он согласился и шагнул в море.",
        bn: "নাবিকেরা লটারি করল কাকে সমুদ্রে ফেলা হবে। তিনবার লট তাঁর নামে পড়ল। তিনি মেনে নিয়ে সমুদ্রে নেমে গেলেন।",
        fa: "ملاحان قرعه انداختند تا معلوم شود چه کسی به دریا افکنده شود. سه بار قرعه به نام او افتاد. او پذیرفت و به دریا رفت.",
        id: "Para pelaut mengundi siapa yang harus dilempar ke laut. Tiga kali undian jatuh padanya. Ia menerima, dan turun ke laut.",
        ms: "Para kelasi membuang undi untuk memilih siapa yang harus dicampak ke laut. Tiga kali undian jatuh padanya. Dia menerima, lalu turun ke laut.",
        tr: "Denizciler, kimin denize atılacağına karar vermek için kura çektiler. Üç kez kura ona düştü. Kabul etti ve denize adım attı.",
        fr: "Les marins tirèrent au sort pour décider qui serait jeté à la mer. Trois fois, le sort tomba sur lui. Il accepta et se jeta dans les flots.",
        de: "Die Seeleute warfen das Los, um zu entscheiden, wer über Bord geworfen werden musste. Dreimal fiel das Los auf ihn. Er nahm es an und trat ins Meer.",
      },
    },
    {
      image: img04,
      durationMs: 12000,
      kenBurns: "out",
      narration: {
        en: "A great whale was sent for him. It swallowed him whole. And Yunus found himself in the depths — of the sea, of the whale, of the night.",
        ur: "اس کے لیے ایک بڑی مچھلی بھیجی گئی۔ اس نے انہیں پورا نگل لیا۔ اور یونس نے خود کو گہرائیوں میں پایا — سمندر کی، مچھلی کی، رات کی۔",
        ru: "К нему был послан огромный кит. Он проглотил его целиком. И Юнус оказался в трёх глубинах — моря, кита и ночи.",
        bn: "তাঁর জন্য একটি বিশাল মাছ পাঠানো হলো। সে তাঁকে গিলে নিল। ইউনুস নিজেকে পেলেন গভীরে — সমুদ্রের, মাছের, রাতের।",
        fa: "ماهی بزرگی برای او فرستاده شد. او را کامل بلعید. یونس خود را در ژرفاها یافت — دریا، ماهی و شب.",
        id: "Seekor ikan besar dikirim untuknya. Ia menelannya bulat-bulat. Yunus mendapati dirinya di kedalaman — lautan, ikan, malam.",
        ms: "Seekor ikan besar dihantar untuknya. Ia menelannya bulat-bulat. Yunus mendapati dirinya di kedalaman — lautan, ikan, malam.",
        tr: "Ona büyük bir balık gönderildi. Onu bütün olarak yuttu. Ve Yunus kendini derinliklerde buldu — denizin, balığın, gecenin.",
        fr: "Une immense baleine fut envoyée à lui. Elle l'engloutit tout entier. Et Younous se retrouva dans les profondeurs — de la mer, de la baleine, de la nuit.",
        de: "Ein großer Wal wurde ihm gesandt. Er verschlang ihn ganz. Und Yunus fand sich in der Tiefe wieder — des Meeres, des Wals, der Nacht.",
      },
    },
    {
      image: img05,
      durationMs: 14000,
      kenBurns: "in",
      narration: {
        en: "In the layered darkness he called out: There is no god but You. Glory be to You. Truly I have been of the wrongdoers. Allah heard him. Every atom of that darkness heard him.",
        ur: "پرت در پرت اندھیرے میں انہوں نے پکارا: تیرے سوا کوئی معبود نہیں، تُو پاک ہے، بے شک میں ظالموں میں سے ہوں۔ اللہ نے سنا۔ اس اندھیرے کے ہر ذرے نے سنا۔",
        ru: "В многослойной тьме он воззвал: нет божества, кроме Тебя, пречист Ты, поистине я был из несправедливых. Аллах услышал его. Каждая частица той тьмы услышала.",
        bn: "স্তরে স্তরে অন্ধকারে তিনি ডেকে উঠলেন: তুমি ছাড়া কোনো ইলাহ নেই, মহিমা তোমারই, নিশ্চয়ই আমি সীমালঙ্ঘনকারীদের মধ্যে ছিলাম। আল্লাহ তাঁকে শুনলেন।",
        fa: "در تاریکی‌های تو در تو ندا کرد: معبودی جز تو نیست، پاک و منزهی، به‌راستی من از ستمکاران بودم. خداوند شنید. هر ذرهٔ آن تاریکی شنید.",
        id: "Dalam kegelapan berlapis ia berseru: Tiada tuhan selain Engkau, Mahasuci Engkau, sungguh aku termasuk orang-orang yang zalim. Allah mendengarnya. Setiap atom kegelapan itu mendengarnya.",
        ms: "Dalam kegelapan berlapis dia menyeru: Tiada tuhan melainkan Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang yang zalim. Allah mendengarnya.",
        tr: "Katmerli karanlıkta seslendi: Senden başka ilah yoktur, Seni tenzih ederim, gerçekten ben zalimlerden oldum. Allah onu işitti. O karanlığın her zerresi işitti.",
        fr: "Dans les ténèbres superposées il appela : il n'y a de dieu que Toi, gloire à Toi, en vérité j'ai été parmi les injustes. Allah l'entendit. Chaque atome de ces ténèbres l'entendit.",
        de: "In der geschichteten Finsternis rief er: Es gibt keinen Gott außer Dir, gepriesen seist Du, wahrlich ich war unter den Ungerechten. Allah hörte ihn. Jedes Teilchen jener Finsternis hörte.",
      },
    },
    {
      image: img06,
      durationMs: 12000,
      kenBurns: "out",
      narration: {
        en: "The whale cast him onto an empty shore. Weak, bare. And Allah caused a gourd vine to grow over him — shade, and mercy, and a return. If not for his remembrance, he would have remained there. So call. He is listening.",
        ur: "مچھلی نے انہیں ایک ویران ساحل پر پھینک دیا۔ کمزور، ننگے۔ اور اللہ نے ان پر بیل اُگا دی — سایہ، رحمت، اور واپسی۔ اگر ان کا ذکر نہ ہوتا، وہ وہیں رہ جاتے۔ سو پکارو۔ وہ سن رہا ہے۔",
        ru: "Кит выбросил его на пустынный берег. Слабого, обнажённого. И Аллах взрастил над ним тыквенную лозу — тень, милость, возвращение. Если бы не его поминание, он остался бы там. Так зовите. Он слышит.",
        bn: "মাছটি তাঁকে এক নির্জন সমুদ্রতটে ফেলে দিল। দুর্বল, উলঙ্গ। আল্লাহ তাঁর ওপর একটি লতা উদ্গত করলেন — ছায়া, রহমত, ফেরার পথ। তাঁর জিকর না থাকলে তিনি সেখানেই থাকতেন। তাই ডাকো। তিনি শুনছেন।",
        fa: "ماهی او را بر ساحلی خالی افکند. ناتوان، برهنه. و خداوند بوته‌ای کدو بر او رویاند — سایه، رحمت، بازگشت. اگر ذکر او نبود، در همان‌جا می‌ماند. پس بخوانید. او می‌شنود.",
        id: "Ikan itu melemparkannya ke pantai yang kosong. Lemah, telanjang. Dan Allah menumbuhkan pohon labu di atasnya — naungan, rahmat, dan kembali. Jika bukan karena zikirnya, ia akan tetap di sana. Maka berdoalah. Dia mendengar.",
        ms: "Ikan itu mencampakkannya ke pantai yang sunyi. Lemah, telanjang. Dan Allah menumbuhkan pokok labu di atasnya — teduhan, rahmat, dan kepulangan. Jika bukan kerana zikirnya, dia akan tinggal di situ. Maka berdoalah. Dia mendengar.",
        tr: "Balık onu ıssız bir sahile bıraktı. Zayıf, çıplak. Ve Allah üzerine kabak yaprağı gibi bir bitki bitirdi — gölge, rahmet ve dönüş. Zikri olmasaydı, orada kalırdı. Öyleyse çağır. O işitiyor.",
        fr: "La baleine le rejeta sur un rivage désert. Faible, dénudé. Et Allah fit pousser sur lui une plante rampante — ombre, miséricorde, et retour. Sans son rappel, il serait resté là. Alors appelle. Il écoute.",
        de: "Der Wal warf ihn an ein leeres Ufer. Schwach, entblößt. Und Allah ließ eine Kürbisranke über ihm wachsen — Schatten, Barmherzigkeit und Rückkehr. Ohne sein Gedenken wäre er dort geblieben. So ruf. Er hört.",
      },
    },
  ],
};

// ---------- Registry ----------

const STORIES: Record<string, Story> = {
  yunus: YUNUS,
};

export function getStory(id: string): Story | undefined {
  return STORIES[id];
}

export function hasStory(id: string): boolean {
  return id in STORIES;
}

// Reverse map: mood → story id (first story matching that mood).
const MOOD_TO_STORY: Record<string, string> = Object.values(STORIES).reduce(
  (acc, s) => {
    if (!acc[s.moodId]) acc[s.moodId] = s.id;
    return acc;
  },
  {} as Record<string, string>,
);

export function storyForMood(moodId: string): string | undefined {
  return MOOD_TO_STORY[moodId];
}
