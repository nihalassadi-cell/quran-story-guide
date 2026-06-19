import type { CapacitorConfig } from "@capacitor/cli";

// The native shell loads the bundled web build from `dist/` so the app
// works offline and is independent of any remote host (including Lovable).
//
// Workflow for native builds:
//   1. npm run build           → produces dist/
//   2. npx cap sync            → copies dist/ into the native projects
//   3. npx cap open ios|android
//
// To temporarily point the shell at a live URL again (e.g. for hot-reload
// during development), add a `server: { url: "...", cleartext: false }`
// block back in. Do not ship that to the Play Store.
const config: CapacitorConfig = {
  appId: "app.lovable.quranstoryguide",
  appName: "Noor",
  webDir: "dist",
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
