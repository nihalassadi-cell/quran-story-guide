import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Noor" },
      { name: "description", content: "Terms and Conditions for Noor — The Quran." },
      { property: "og:title", content: "Terms and Conditions — Noor" },
      { property: "og:description", content: "Terms and Conditions for Noor — The Quran." },
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

        <h1 className="text-3xl font-bold gold-text mb-2">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <p>
              Welcome to Noor-The Quran, hereafter referred to as "Noor". By downloading, accessing, or using the Noor mobile application ("App"), you agree to these Terms and Conditions. If you do not agree with these terms, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. About Noor</h2>
            <p>
              Noor is an educational and informational application designed to help users explore and learn about stories from the Quran. The content provided is intended for educational, spiritual, and personal enrichment purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. Acceptance of Terms</h2>
            <p>
              By using Noor, you confirm that you are at least 13 years of age or have the permission of a parent or guardian to use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Use of the App</h2>
            <p className="mb-2">
              You agree to use Noor only for lawful purposes and in a manner that does not harm, disrupt, or interfere with the App or other users.
            </p>
            <p className="mb-2">You must not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Attempt to gain unauthorized access to the App or its systems.</li>
              <li>Reverse engineer, copy, modify, or distribute the App without permission.</li>
              <li>Use the App for any unlawful or harmful activity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Content Disclaimer</h2>
            <p className="mb-2">
              Noor aims to provide accurate and respectful Islamic educational content. However:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The content is provided for informational and educational purposes only.</li>
              <li>Interpretations, explanations, and summaries may vary among scholars and traditions.</li>
              <li>Users are encouraged to consult qualified scholars and trusted Islamic sources for religious guidance and rulings.</li>
              <li>Noor does not provide religious verdicts (fatwas), legal advice, or professional counseling.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Intellectual Property</h2>
            <p>
              All content, design elements, logos, graphics, text, and software within Noor are owned by or licensed to Noor and are protected by applicable intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, or commercially exploit any content from the App without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. User-Generated Sharing</h2>
            <p>
              Where sharing features are available, users are responsible for the content they choose to share. Noor is not responsible for how shared content is used or interpreted by third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Third-Party Services</h2>
            <p>
              The App may use third-party services such as analytics providers to improve performance and user experience. These services may collect limited technical information in accordance with their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Availability</h2>
            <p>
              We strive to keep Noor available and functioning properly, but we do not guarantee uninterrupted access. Features may be modified, suspended, or discontinued at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Noor and its creators shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, the App.
            </p>
            <p>Use of the App is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">10. Changes to These Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Updated versions will be posted within the App or on our website. Continued use of the App after changes are published constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">11. Contact Us</h2>
            <p>
              If you have any questions regarding these Terms and Conditions, please contact us at{" "}
              <a href="mailto:nihal.assadi@gmail.com" className="text-primary hover:underline">
                nihal.assadi@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <p>
              By using Noor, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
