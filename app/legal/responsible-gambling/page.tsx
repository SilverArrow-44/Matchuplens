import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Gambling — MatchupLens",
  description: "Resources and information for responsible gambling.",
};

export default function ResponsibleGamblingPage() {
  return (
    <article>
      <h1 className="page-title">Responsible Gambling</h1>

      <div className="panel" style={{ marginTop: 24, lineHeight: 1.8 }}>
        <div className="storyline" style={{ borderLeftColor: "var(--green)", marginBottom: 24 }}>
          If you or someone you know has a gambling problem, help is available 24/7.
          Call <strong>1-800-522-4700</strong> (NCPG National Helpline) or text &ldquo;CHAT&rdquo; to 85258.
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Gamble Responsibly</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens is an entertainment and information platform. We take our responsibility
          seriously when it comes to gambling-adjacent content. Betting should always be fun —
          the moment it stops being fun, it&rsquo;s time to stop.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Signs of Problem Gambling</h2>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li>Betting more than you can afford to lose</li>
          <li>Chasing losses with bigger bets</li>
          <li>Hiding gambling activity from family or friends</li>
          <li>Borrowing money to gamble</li>
          <li>Gambling interfering with work, relationships, or daily life</li>
          <li>Feeling anxious or irritable when not gambling</li>
        </ul>
        <p style={{ marginBottom: 16 }}>
          If any of these apply to you, please reach out for help. It&rsquo;s confidential and free.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Tips for Responsible Gambling</h2>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>Set a budget</strong> — only bet what you can afford to lose. Treat it as entertainment spending.</li>
          <li><strong>Set time limits</strong> — decide in advance how long you&rsquo;ll spend.</li>
          <li><strong>Never chase losses</strong> — losing streaks are normal. Don&rsquo;t bet more trying to recover.</li>
          <li><strong>Don&rsquo;t bet under the influence</strong> — alcohol and stress impair judgment.</li>
          <li><strong>Use deposit limits</strong> — most sportsbooks let you set daily/weekly deposit limits.</li>
          <li><strong>Take breaks</strong> — step away regularly, especially after a loss.</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Self-Exclusion Resources</h2>
        <p style={{ marginBottom: 8 }}>
          Most licensed sportsbooks offer self-exclusion options. You can also contact your state&rsquo;s
          gaming commission directly for exclusion programs.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Help Resources</h2>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>National Council on Problem Gambling:</strong>{" "}
            <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>ncpgambling.org</a>
            {" "}| Helpline: 1-800-522-4700
          </li>
          <li><strong>Gamblers Anonymous:</strong>{" "}
            <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>gamblersanonymous.org</a>
          </li>
          <li><strong>National Problem Gambling Helpline:</strong> 1-800-GAMBLER (1-800-426-2537)</li>
          <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
        </ul>

        <p style={{ fontSize: 13, color: "var(--text3)" }}>
          Must be 21+ to bet in most US states (18+ in some jurisdictions). Know the laws in your state.
          Availability varies. Terms apply.
        </p>
      </div>
    </article>
  );
}
