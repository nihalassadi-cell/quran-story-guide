import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.quranstoryguide",
  appName: "Noor",
  // Point the native shell at your published Lovable URL so the app
  // always loads the latest deployed version. To bundle the web build
  // inside the app instead, remove `server.url` and set `webDir: "dist"`
  // after running `npm run build`.
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
