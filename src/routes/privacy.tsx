import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Noor" },
      { name: "description", content: "Privacy Policy for Noor — The Quran." },
      { property: "og:title", content: "Privacy Policy — Noor" },
      { property: "og:description", content: "Privacy Policy for Noor — The Quran." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://quran-story-guide.lovable.app/privacy" },
    ],
    links: [
      { rel: "canonical", href: "https://quran-story-guide.lovable.app/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <div className="mb-6">
          <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Settings
          </Link>
        </div>

        <h1 className="text-3xl font-bold gold-text mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <p>
              This Privacy Policy describes how Noor-The Quran ("Noor", "we", "us", or "our") handles information in connection with the Noor mobile application ("App"). By using the App, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              Noor is designed to minimize data collection. We do not require you to create an account to use the core features of the App.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Preferences stored on your device:</strong> Settings such as language, theme, and reading preferences are stored locally on your device and are not transmitted to us.</li>
              <li><strong>Optional account information:</strong> If you choose to sign in, we collect basic account information (such as your email address) solely to enable sign-in and sync features.</li>
              <li><strong>Technical information:</strong> We may collect limited technical data (such as device type, operating system version, and crash logs) to diagnose issues and improve performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Operate, maintain, and improve the App.</li>
              <li>Provide requested features such as sign-in and preference sync.</li>
              <li>Diagnose technical problems and monitor App performance.</li>
              <li>Respond to user inquiries and support requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">3. Sharing of Information</h2>
            <p>
              We do not sell or rent your personal information. We do not share personal information with third parties for advertising purposes. Limited technical information may be processed by trusted service providers (such as hosting and analytics providers) strictly to operate the App, subject to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">4. Data Storage and Security</h2>
            <p>
              We use industry-standard measures to help protect the limited information we process. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">5. Children's Privacy</h2>
            <p>
              Noor is intended for a general audience. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, please contact us so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">6. Your Choices</h2>
            <p>
              You can clear locally stored preferences at any time by clearing the App's data through your device settings. If you have an account, you may request deletion of your account and associated data by contacting us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">7. Third-Party Services and AI</h2>
            <p>
              The App may rely on third-party services (such as hosting, authentication, and analytics providers) to function. These services process data in accordance with their own privacy policies. The App also uses third-party AI providers to pre-generate narrations, translations, and story media; this generation happens server-side and does not involve sending your personal information or prompts to AI providers during normal use of the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Updated versions will be posted within the App or on our website. Continued use of the App after changes are published constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your data, please contact us at{" "}
              <a href="mailto:nihal.assadi@gmail.com" className="text-primary hover:underline">
                nihal.assadi@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
