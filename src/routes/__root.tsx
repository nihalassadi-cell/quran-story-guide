import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Onboarding } from "@/components/Onboarding";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { setScreen } from "@/lib/analytics";
import { Toaster } from "sonner";



import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#2a1f12" },
      { title: "Noor — Animated Quran" },
      { name: "description", content: "Experience each Surah of the Quran as an animated scene with recitation, translated narration, and verse-by-verse subtitles." },
      { name: "author", content: "Noor" },
      { property: "og:title", content: "Noor — Animated Quran" },
      { property: "og:description", content: "Experience each Surah of the Quran as an animated scene with recitation, translated narration, and verse-by-verse subtitles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Noor — Animated Quran" },
      { name: "twitter:description", content: "Experience each Surah of the Quran as an animated scene with recitation, translated narration, and verse-by-verse subtitles." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/80da24d1-7806-4377-957f-e4cbe6d97c7f/id-preview-59e492b4--583ad6c6-b639-4b38-9c63-7ed2aef19b82.lovable.app-1777706755169.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/80da24d1-7806-4377-957f-e4cbe6d97c7f/id-preview-59e492b4--583ad6c6-b639-4b38-9c63-7ed2aef19b82.lovable.app-1777706755169.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,600&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

const THEME_INIT = `(function(){try{var t=localStorage.getItem('noor:theme');if(t==='emerald'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  useEffect(() => {
    // Fresh app session (cold load / refresh / PWA open): always land on Today,
    // except when deep-linking into a reader/story/auth flow.
    try {
      const fresh = !sessionStorage.getItem("noor:session");
      sessionStorage.setItem("noor:session", "1");
      if (fresh) {
        const p = router.state.location.pathname;
        const keep = p.startsWith("/surah/") || p.startsWith("/story/") || p.startsWith("/mood/") || p.startsWith("/auth") || p.startsWith("/privacy") || p.startsWith("/terms");
        if (!keep && p !== "/today") {
          router.navigate({ to: "/today", replace: true });
        }
      }
    } catch {}
    setScreen(router.state.location.pathname);
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      setScreen(toLocation.pathname);
    });
    return () => unsub();
  }, [router]);

  return (
    <>
      <ThemeSwitch />
      <Outlet />
      <Onboarding />
      <Toaster position="top-center" richColors theme="dark" />
    </>
  );
}
