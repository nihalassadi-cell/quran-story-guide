import { useT } from "@/lib/i18n";

export function ContinueSheet({
  open,
  onEnd,
  onContinue,
}: {
  open: boolean;
  onEnd: () => void;
  onContinue: () => void;
}) {
  const t = useT();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-primary/25 bg-gradient-to-br from-[#1a1206] to-[#08090C] p-6 shadow-2xl animate-in slide-in-from-bottom duration-400">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-bold">
            {t("micro.sheet.eyebrow")}
          </p>
          <h3 className="mt-2 font-display-serif italic text-2xl gold-text leading-tight">
            {t("micro.sheet.title")}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {t("micro.sheet.sub")}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onEnd}
            className="w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold transition-transform active:scale-[0.97] hover:bg-primary/90"
          >
            {t("micro.sheet.end")}
          </button>
          <button
            onClick={onContinue}
            className="w-full rounded-full border border-primary/30 bg-transparent text-foreground py-3 font-medium hover:bg-primary/10 transition-colors"
          >
            {t("micro.sheet.more")}
          </button>
        </div>
      </div>
    </div>
  );
}
