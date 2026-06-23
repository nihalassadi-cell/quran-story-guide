import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Noor" },
      { name: "description", content: "Terms and conditions for using Noor — The Quran." },
      { property: "og:title", content: "Terms and Conditions — Noor" },
      { property: "og:description", content: "Terms and conditions for using Noor — The Quran." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quran-story-guide.lovable.app/terms" },
    ],
    links: [
      { rel: "canonical", href: "https://quran-story-guide.lovable.app/terms" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <div className="mb-6">
          <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Settings
          </Link>
        </div>
        <h1 className="text-3xl font-bold gold-text mb-6">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Noor — The Quran ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Use of the App</h2>
            <p>
              The App is provided for personal, non-commercial use. You agree to use the App only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use of the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Content and Intellectual Property</h2>
            <p>
              The App includes Quranic text, translations, audio recitations, and other materials that may be sourced from third-party providers. Where applicable, original content and features of the App are the property of the App owner. You may not reproduce, distribute, modify, or create derivative works from the App's original materials without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Third-Party Services</h2>
            <p>
              The App may rely on third-party services and content providers. We are not responsible for the availability, accuracy, or practices of these third parties. Your use of third-party materials is subject to their respective terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The App is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the App will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the App owner shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Changes to These Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Continued use of the App after any changes means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Contact</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us through the App or at the support email provided in the App store listing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">9. Legal Notice</h2>
            <p>
              This is a generic terms and conditions draft provided as a starting point. It does not constitute legal advice. You should review these terms with a qualified legal professional before publishing them as binding terms for your app.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
