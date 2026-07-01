import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — MatchupLens",
  description: "Get in touch with the MatchupLens team.",
  alternates: { canonical: "https://matchuplens.com/legal/contact" },
};

export default function ContactPage() {
  return (
    <article>
      <h1 className="page-title">Contact Us</h1>

      <div className="panel" style={{ marginTop: 24, lineHeight: 1.8 }}>
        <p style={{ marginBottom: 24 }}>
          Have a question, found a bug, or want to discuss a partnership?
          We&rsquo;d love to hear from you.
        </p>

        <div style={{ display: "grid", gap: 16 }}>
          <div className="storyline" style={{ borderLeftColor: "var(--blue)" }}>
            <strong>General enquiries</strong><br />
            <a href="mailto:picklytools@gmail.com" style={{ color: "var(--blue)" }}>
              picklytools@gmail.com
            </a>
            <br />
            <span style={{ fontSize: 13, color: "var(--text3)" }}>We aim to respond within 2 business days.</span>
          </div>

          <div className="storyline" style={{ borderLeftColor: "var(--green)" }}>
            <strong>Advertising &amp; partnerships</strong><br />
            <a href="mailto:picklytools@gmail.com?subject=Partnership%20Enquiry" style={{ color: "var(--blue)" }}>
              picklytools@gmail.com
            </a>
            <br />
            <span style={{ fontSize: 13, color: "var(--text3)" }}>Subject: Partnership Enquiry</span>
          </div>

          <div className="storyline" style={{ borderLeftColor: "var(--red)" }}>
            <strong>Data errors or corrections</strong><br />
            If you spot incorrect stats, scores, or predictions, please email us with the page URL
            and what appears to be wrong. We&rsquo;ll investigate promptly.
          </div>

          <div className="storyline" style={{ borderLeftColor: "var(--text3)" }}>
            <strong>Responsible gambling</strong><br />
            If you have a gambling problem, please reach out to the{" "}
            <Link href="/legal/responsible-gambling" style={{ color: "var(--blue)" }}>resources on our Responsible Gambling page</Link>
            {" "}rather than contacting us — they can provide immediate professional support.
          </div>
        </div>
      </div>
    </article>
  );
}
