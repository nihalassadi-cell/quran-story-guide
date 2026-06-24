import type { CapacitorConfig } from "@capacitor/cli";

// TanStack Start is an SSR framework, so the native shell loads the published
// Lovable site directly via `server.url`. Capacitor still needs a `webDir`
// during sync to read app icons and basic web assets, so we point it at
// committed `public/` files instead of generated/gitignored `dist/` files.
//
// Workflow for native builds:
//   1. npm run cap:sync      // regenerates Android/iOS resources
//   3. npx cap open android
const config: CapacitorConfig = {
  appId: "app.lovable.quranstoryguide",
  appName: "Noor-The Quran",
  webDir: "public",
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
