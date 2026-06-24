import type { CapacitorConfig } from "@capacitor/cli";

// TanStack Start is an SSR framework and does not emit a static `dist/index.html`
// suitable for Capacitor's bundled web assets. Instead, the native shell loads
// the published Lovable site directly via `server.url`. This keeps the app in
// sync with your latest publish — no rebuild/resync needed for content updates.
//
// Workflow for native builds:
//   1. npm run cap:prepare   // copies icons/manifest into dist so cap sync can find them
//   2. npm run cap:sync      // (or `npx cap sync`) regenerates Android/iOS resources
//   3. npx cap open android
//
// Important: do not skip `cap:prepare`. `webDir` is `dist`, but TanStack Start
// does not emit a static `dist/index.html` on its own. Capacitor's sync step
// needs the icon files in `dist` to generate native mipmap icons.
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
