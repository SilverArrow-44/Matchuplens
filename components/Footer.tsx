export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ fontWeight: 800, color: "var(--text2)" }}>
          MatchupLens
        </div>
        <div>
          Stats, matchup history, and predictions for every game. Predictions
          are editorial analysis, not guarantees.
        </div>
        <div>
          If you or someone you know has a gambling problem, call 1-800-GAMBLER.
          21+ only. Odds and availability vary by state.
        </div>
        <div>
          Data sourced from ESPN. &copy; {new Date().getFullYear()} MatchupLens.
        </div>
      </div>
    </footer>
  );
}
