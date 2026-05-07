# Building Noor for iOS (.ipa) and Android (.apk / .aab)

This project is a web app. To publish on the App Store and Play Store you
wrap it with [Capacitor](https://capacitorjs.com). Capacitor produces a
native iOS and Android project that loads your Lovable-published web app.

> Lovable's sandbox cannot build `.ipa` / `.apk` files. iOS builds require
> **Xcode on a Mac**. Android builds require **Android Studio** (any OS).

## 1. Export to GitHub and clone

In Lovable: **GitHub → Connect → Push**, then on your machine:

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
```

## 2. Install Capacitor

```bash
npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

(`capacitor.config.ts` is already in this repo.)

## 3. Add native platforms

```bash
npx cap add ios
npx cap add android
npx cap sync
```

## 4. Open in native IDEs and build

### Android (.apk / .aab)
```bash
npx cap open android
```
In Android Studio: **Build → Generate Signed Bundle / APK**. Upload the
`.aab` to the Play Console (one-time $25 dev account).

### iOS (.ipa) — Mac + Xcode required
```bash
npx cap open ios
```
In Xcode: select a Team, then **Product → Archive → Distribute App** to
upload to App Store Connect ($99/year Apple Developer account).

## 5. Updating the app

Because `capacitor.config.ts` sets `server.url` to your published Lovable
URL, **any change you publish in Lovable shows up in the installed app
instantly** — no rebuild or store review needed (as long as you don't
change native code, icons, or splash screens).

To bundle the web build inside the app instead (offline-capable),
remove the `server.url` field, then:
```bash
npm run build
npx cap sync
```

## No-Mac alternative for iOS

Use a cloud build service:
- [Codemagic](https://codemagic.io)
- [EAS Build](https://expo.dev/eas) (works with Capacitor)
- [Capgo](https://capgo.app)

They build and sign `.ipa` files in the cloud from your GitHub repo.
