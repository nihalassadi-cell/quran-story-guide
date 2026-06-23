// Cross-platform share helper.
// - Native (iOS/Android via Capacitor): uses the OS share sheet (matches the
//   iOS screenshot — AirDrop, Messages, Mail, WhatsApp, etc.).
// - Mobile web: uses navigator.share() when available (system share sheet).
// - Desktop web: falls back to WhatsApp. wa.me automatically routes to the
//   installed WhatsApp app, WhatsApp Desktop, or WhatsApp Web (prompting
//   the user to sign in if they aren't).
import { toast } from "sonner";

export type ShareInput = {
  title?: string;
  text: string;
  url?: string;
};

function isCapacitorNative(): boolean {
  try {
    const cap = (window as any).Capacitor;
    return !!cap?.isNativePlatform?.();
  } catch {
    return false;
  }
}

export async function shareContent({ title, text, url }: ShareInput): Promise<void> {
  const fullText = url ? `${text}\n\n${url}` : text;

  // 1. Capacitor native share (iOS/Android) — opens the native share sheet.
  if (isCapacitorNative()) {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title, text, url, dialogTitle: title });
      return;
    } catch (e: any) {
      // User cancelling throws — don't show an error toast for that.
      if (e?.message && !/cancel/i.test(e.message)) {
        console.warn("[share] capacitor share failed, falling back", e);
      } else {
        return;
      }
    }
  }

  // 2. Web Share API (mobile browsers, some desktop browsers).
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (e: any) {
      // AbortError = user dismissed the sheet. Don't fall back in that case.
      if (e?.name === "AbortError") return;
      console.warn("[share] navigator.share failed, falling back to WhatsApp", e);
    }
  }

  // 3. Desktop / unsupported — WhatsApp web/app handoff.
  // wa.me opens WhatsApp Desktop if installed, otherwise WhatsApp Web, which
  // walks the user through signing in via QR code if they aren't already.
  const waUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const win = window.open(waUrl, "_blank", "noopener,noreferrer");
  if (!win) {
    // Popup blocked — copy to clipboard so the user can paste it anywhere.
    try {
      await navigator.clipboard.writeText(fullText);
      toast.success("Copied to clipboard — paste it anywhere to share");
    } catch {
      toast.error("Unable to open share dialog");
    }
  }
}
