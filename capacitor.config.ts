import type { CapacitorConfig } from "@capacitor/cli";

// TanStack Start is an SSR framework and does not emit a static `dist/index.html`
// suitable for Capacitor's bundled web assets. Instead, the native shell loads
// the published Lovable site directly via `server.url`. This keeps the app in
// sync with your latest publish — no rebuild/resync needed for content updates.
//
// Workflow for native builds:
//   1. (one-time) mkdir -p dist && touch dist/index.html  // satisfy `cap sync`
//   2. npx cap sync
//   3. npx cap open android
//
// To ship offline, you'd need a static export of the app — not supported by
// TanStack Start out of the box.
const config: CapacitorConfig = {
  appId: "app.lovable.quranstoryguide",
  appName: "Noor-The Quran",
  webDir: "dist",
  server: {
    url: "https://quran-story-guide.lovable.app",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
