import { createFileRoute } from "@tanstack/react-router";
import noorLogo from "@/assets/noor-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noor – The Quran App | Read, Reflect & Remember" },
      { name: "description", content: "Your daily Quran companion with stories, remembrance, and guided reading. Download Noor on Google Play." },
      { property: "og:title", content: "Noor – The Quran App | Read, Reflect & Remember" },
      { property: "og:description", content: "Your daily Quran companion with stories, remembrance, and guided reading." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Noor – The Quran App | Read, Reflect & Remember" },
      { name: "twitter:description", content: "Your daily Quran companion with stories, remembrance, and guided reading." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: LandingPage,
});

const PLAY_URL = "https://play.google.com/store/apps/details?id=app.lovable.quranstoryguide";

function PlayTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 3.6c-.3.3-.5.7-.5 1.2v14.4c0 .5.2.9.5 1.2l8.2-8.4-8.2-8.4Z" fill="#1d4a3a" />
      <path d="M15.4 9.5 5.9 3.1c-.5-.2-1-.2-1.4 0l8.2 8.4 2.7-2Z" fill="#2d6b52" />
      <path d="m15.4 14.5-2.7 2-8.2 8.4c.4.2.9.2 1.4 0l9.5-6.4-0-4Z" fill="#b98a2e" transform="translate(0,-4)" />
      <path d="M19.9 10.9 15.4 9.5l-2.7 2.5 2.7 2.5 4.5-1.4c.9-.4.9-1.8 0-2.2Z" fill="#8a5f16" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Read & Understand",
    body: "The complete Holy Quran in beautiful Arabic with multiple translations, soothing audio recitation, bookmarks, and continue-where-you-left-off reading.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" /><path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
      </svg>
    ),
  },
  {
    title: "Your Daily Companion",
    body: "The Today screen brings your essentials together — today's Hijri date, resume reading, Kalimah, Dhikr, and Prophet Stories in one calm home.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    title: "Islamic Calendar",
    body: "Hijri and Gregorian dates side by side, Islamic months, observances and historical events — with source references and local date adjustment.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 15h2a1 1 0 0 1 1 1v1" />
      </svg>
    ),
  },
  {
    title: "Dhikr & Duas by Feeling",
    body: "Find remembrance for every emotion — anxiety, stress, sadness, gratitude, anger — with Arabic, transliteration, translations, audio, and a dhikr counter.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5.6 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    title: "Prophet Stories",
    body: "Beautifully illustrated stories with gentle audio narration — timeless lessons of faith, patience, gratitude, and trust in Allah, for all the family.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" /><path d="M12 8v4" />
      </svg>
    ),
  },
  {
    title: "In Your Language",
    body: "Enjoy Noor in English, Urdu, Russian, Bengali, Persian, Indonesian, Malay, Turkish, French, or German — read and reflect in your own words.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3Z" />
      </svg>
    ),
  },
];

const WHY = [
  "Complete Holy Quran with Arabic text",
  "Translations & audio recitation",
  "Continue reading & bookmarking",
  "Integrated Islamic Calendar",
  "Mood-based Kalimah & Dhikr",
  "Built-in dhikr counter",
  "Illustrated Prophet Stories with narration",
  "10 app languages",
  "Simple, peaceful navigation",
  "A daily home screen built for consistency",
];

const LANDING_CSS = `
.nlr { --deep:#07271d; --deep-2:#0b3527; --panel:rgba(255,255,255,.045); --panel-line:rgba(232,200,116,.22); --gold:#e8c874; --gold-soft:#f4e3b8; --cream:#f7f2e4; --muted:rgba(247,242,228,.66);
  position:relative; z-index:1; max-width:1120px; margin:0 auto; padding:28px 28px 40px; font-family:"Outfit",sans-serif; color:var(--cream); }
.nlr * { box-sizing:border-box; }
.nlr-backdrop { position:fixed; inset:0; z-index:0; pointer-events:none;
  background: radial-gradient(1200px 700px at 15% -10%, rgba(30,94,70,.55), transparent 60%),
    radial-gradient(900px 600px at 100% 110%, rgba(16,66,50,.6), transparent 60%),
    linear-gradient(160deg, #07271d 0%, #0b3527 55%, #051d16 100%); }
.nlr-glow { position:fixed; z-index:0; pointer-events:none; border-radius:50%; filter:blur(60px); }
.nlr-glow-a { width:420px; height:420px; top:-140px; right:-80px; background:rgba(232,200,116,.10); }
.nlr-glow-b { width:300px; height:300px; bottom:12%; left:-120px; background:rgba(64,160,122,.14); }
.nlr header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.nlr-brand { display:flex; align-items:center; gap:12px; }
.nlr-mark { width:44px; height:44px; border-radius:14px; overflow:hidden; display:block;
  border:1px solid var(--panel-line); box-shadow:inset 0 1px 0 rgba(255,255,255,.08), 0 8px 24px rgba(0,0,0,.35); }
.nlr-mark img { width:100%; height:100%; object-fit:cover; display:block; }
.nlr-name { font-family:"Cormorant Garamond",serif; font-size:26px; font-weight:600; letter-spacing:.02em; }
.nlr-name em { font-style:normal; color:var(--gold); }
.nlr-cta-top { display:inline-flex; align-items:center; gap:10px; text-decoration:none; color:#07271d;
  background:linear-gradient(180deg,#f6e0a4,var(--gold)); padding:11px 20px; border-radius:999px;
  font-weight:600; font-size:14.5px; box-shadow:0 10px 30px rgba(232,200,116,.22); white-space:nowrap;
  transition:transform .18s ease, box-shadow .18s ease; }
.nlr-cta-top:hover { transform:translateY(-1px); box-shadow:0 14px 34px rgba(232,200,116,.3); }
.nlr-hero { text-align:center; padding:64px 0 44px; }
.nlr-hero-icon { width:104px; height:104px; border-radius:26px; overflow:hidden; margin:0 auto 22px; display:block;
  border:1px solid var(--panel-line); box-shadow:0 18px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1); }
.nlr-hero-icon img { width:100%; height:100%; object-fit:cover; display:block; }
.nlr-kicker { display:inline-flex; align-items:center; gap:8px; font-size:13px; letter-spacing:.22em; text-transform:uppercase;
  color:var(--gold-soft); border:1px solid var(--panel-line); padding:8px 18px; border-radius:999px; background:rgba(232,200,116,.06); }
.nlr-h1 { font-family:"Cormorant Garamond",serif; font-weight:600; font-size:clamp(44px,7vw,84px); line-height:1.04; margin:26px 0 8px; }
.nlr-h1 .ar { color:var(--gold); }
.nlr-sub { font-family:"Cormorant Garamond",serif; font-style:italic; font-weight:500; font-size:clamp(20px,3vw,28px); color:var(--gold-soft); margin-bottom:18px; }
.nlr-lede { max-width:640px; margin:0 auto; font-size:17px; line-height:1.7; color:var(--muted); font-weight:300; }
.nlr-lede strong { color:var(--cream); font-weight:500; }
.nlr-cta-row { margin-top:34px; display:flex; align-items:center; justify-content:center; gap:18px; flex-wrap:wrap; }
.nlr-play { display:inline-flex; align-items:center; gap:14px; text-decoration:none; background:linear-gradient(180deg,#f6e0a4,var(--gold));
  color:#17352b; border-radius:16px; padding:13px 26px; box-shadow:0 16px 40px rgba(232,200,116,.28);
  transition:transform .18s ease, box-shadow .18s ease; }
.nlr-play:hover { transform:translateY(-2px); box-shadow:0 20px 46px rgba(232,200,116,.36); }
.nlr-play svg { width:30px; height:30px; flex:none; }
.nlr-play .t1 { display:block; font-size:11.5px; letter-spacing:.08em; text-transform:uppercase; opacity:.75; }
.nlr-play .t2 { display:block; font-size:19px; font-weight:600; line-height:1.15; }
.nlr-note { font-size:13.5px; color:var(--muted); }
.nlr-ornament { display:flex; align-items:center; gap:14px; justify-content:center; margin:8px 0 40px; color:var(--gold); opacity:.8; }
.nlr-ornament::before, .nlr-ornament::after { content:""; height:1px; width:120px; }
.nlr-ornament::before { background:linear-gradient(90deg,transparent,var(--gold)); }
.nlr-ornament::after { background:linear-gradient(90deg,var(--gold),transparent); }
.nlr-sec-title { text-align:center; font-family:"Cormorant Garamond",serif; font-size:clamp(28px,4vw,40px); font-weight:600; margin-bottom:6px; }
.nlr-sec-sub { text-align:center; color:var(--muted); font-size:15px; font-weight:300; margin-bottom:30px; }
.nlr-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.nlr-card { background:var(--panel); border:1px solid var(--panel-line); border-radius:20px; padding:24px 22px; text-align:left;
  position:relative; overflow:hidden; transition:transform .2s ease, border-color .2s ease, background .2s ease; }
.nlr-card:hover { transform:translateY(-3px); border-color:rgba(232,200,116,.45); background:rgba(255,255,255,.065); }
.nlr-card::before { content:""; position:absolute; inset:0 0 auto 0; height:1px; background:linear-gradient(90deg,transparent,rgba(232,200,116,.5),transparent); }
.nlr-card-icon { width:44px; height:44px; border-radius:12px; display:grid; place-items:center; margin-bottom:14px;
  background:rgba(232,200,116,.1); border:1px solid var(--panel-line); color:var(--gold); }
.nlr-card h3 { font-family:"Cormorant Garamond",serif; font-size:22px; font-weight:600; margin:0 0 8px; }
.nlr-card p { font-size:14.5px; line-height:1.65; color:var(--muted); font-weight:300; margin:0; }
.nlr-checklist { margin:44px auto 0; max-width:860px; background:var(--panel); border:1px solid var(--panel-line); border-radius:22px; padding:28px 30px; }
.nlr-checklist h3 { font-family:"Cormorant Garamond",serif; font-size:24px; font-weight:600; text-align:center; margin:0 0 18px; }
.nlr-checklist ul { list-style:none; display:grid; grid-template-columns:repeat(2,1fr); gap:10px 26px; margin:0; padding:0; }
.nlr-checklist li { display:flex; gap:10px; align-items:flex-start; font-size:14.5px; color:var(--muted); font-weight:300; }
.nlr-checklist li svg { flex:none; margin-top:2px; color:var(--gold); }
.nlr-bottom { text-align:center; margin:52px 0 8px; }
.nlr-bottom .line { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:22px; color:var(--gold-soft); margin-bottom:22px; }
.nlr-footer { margin-top:40px; text-align:center; font-size:12.5px; color:rgba(247,242,228,.4); font-weight:300; line-height:1.7; }
@media (max-width:900px) { .nlr-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px) { .nlr-checklist ul { grid-template-columns:1fr; } .nlr-checklist { padding:22px 20px; } }
@media (max-width:560px) { .nlr-grid { grid-template-columns:1fr; } .nlr { padding:22px 18px 32px; } }
`;

function LandingPage() {
  const navigate = useNavigate();

  // Inside the native (Capacitor) Android/iOS shell, skip the marketing page
  // and go straight to the app's Today screen.
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      navigate({ to: "/today", replace: true });
    }
  }, [navigate]);

  return (
    <div className="nlr-root" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <style>{LANDING_CSS}</style>
      <div className="nlr-backdrop" />
      <div className="nlr-glow nlr-glow-a" />
      <div className="nlr-glow nlr-glow-b" />

      <div className="nlr">
        <header>
          <div className="nlr-brand">
            <span className="nlr-mark">
              <img src={noorLogo.url} alt="Noor app logo" />
            </span>
            <span className="nlr-name">N<em>oo</em>r</span>
          </div>
          <a className="nlr-cta-top" href={PLAY_URL} target="_blank" rel="noopener">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 20.5V3.5c0-.6.34-1.1.84-1.35L13.7 12 3.84 21.85A1.49 1.49 0 0 1 3 20.5Zm13.8-5.4L6.05 21.3l8.5-8.5 2.25 2.3Zm3.35-4.3c.34.5.3 1.2-.2 1.7l-1.8 1.8-2.5-2.3 2.5-2.3 2 1.1ZM6.05 2.7l10.75 6.2-2.25 2.3-8.5-8.5Z" />
            </svg>
            Get the app
          </a>
        </header>

        <section className="nlr-hero">
          <span className="nlr-hero-icon">
            <img src={noorLogo.url} alt="Noor — The Quran App icon" />
          </span>
          <span className="nlr-kicker">✦ &nbsp;Read · Reflect · Remember&nbsp; ✦</span>
          <h1 className="nlr-h1">Noor <span className="ar">— نُور</span></h1>
          <div className="nlr-sub">A little faith, every day.</div>
          <p className="nlr-lede">
            <strong>Your daily Quran companion with stories, remembrance, and guided reading.</strong>
            <br />
            Build a deeper connection with the Holy Quran through beautiful Arabic reading, meaningful
            translations, soothing recitations, daily dhikr, inspiring Prophet Stories, and an Islamic
            Calendar — whether you have two minutes or twenty.
          </p>
          <div className="nlr-cta-row">
            <a className="nlr-play" href={PLAY_URL} target="_blank" rel="noopener">
              <PlayTriangle />
              <span>
                <span className="t1">Download on</span>
                <span className="t2">Google Play</span>
              </span>
            </a>
            <span className="nlr-note">Free to download · English, Urdu, Turkish, French + 6 more</span>
          </div>
        </section>

        <div className="nlr-ornament">۞</div>

        <h2 className="nlr-sec-title">Everything you need, in one peaceful place</h2>
        <p className="nlr-sec-sub">Thoughtfully designed to make your spiritual journey simple, peaceful, and consistent.</p>

        <div className="nlr-grid">
          {FEATURES.map((f) => (
            <div className="nlr-card" key={f.title}>
              <div className="nlr-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        <div className="nlr-checklist">
          <h3>Why choose Noor?</h3>
          <ul>
            {WHY.map((w) => (
              <li key={w}>
                <Check />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="nlr-bottom">
          <div className="line">"Whether you have two minutes or twenty — a little faith, every day."</div>
          <a className="nlr-play" href={PLAY_URL} target="_blank" rel="noopener">
            <PlayTriangle />
            <span>
              <span className="t1">Download on</span>
              <span className="t2">Google Play</span>
            </span>
          </a>
        </div>

        <footer className="nlr-footer">
          Noor – The Quran App · Read, Reflect &amp; Remember
          <br />
          Islamic dates are calculated estimates and may differ from confirmed local moon sightings.
        </footer>
      </div>
    </div>
  );
}
