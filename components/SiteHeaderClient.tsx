"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { GameSummary, Sport } from "@/lib/types";
import { LocalTime } from "./LocalTime";

interface Props {
  sports: Sport[];
  games: GameSummary[];
}

const SPORT_IDS = new Set([
  "nba", "nfl", "mlb", "nhl", "ncaaf", "ncaab", "ufc", "soccer", "worldcup",
]);

function ThemeToggleInline() {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme ?? "dark");
  }, []);
  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }
  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "7px 10px",
        fontSize: 16,
        cursor: "pointer",
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export function SiteHeaderClient({ sports, games }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  // Hide pills + ribbon on legal/static pages — they add crawl noise before unique content
  const hidePillsAndRibbon = pathname.startsWith("/legal") || pathname === "/methodology";
  const searchRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  // Track drag state so we can scroll on mouse-drag and still allow normal link clicks
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  // Derive selected sport from URL path
  const pathSeg = pathname.split("/")[1] ?? "";
  const urlSport = SPORT_IDS.has(pathSeg) ? pathSeg : "all";

  const [selectedSport, setSelectedSport] = useState(urlSport);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync pill with URL when navigating
  useEffect(() => {
    setSelectedSport(urlSport);
  }, [urlSport]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Mouse drag-to-scroll for the game ribbon (desktop UX)
  useEffect(() => {
    const el = ribbonRef.current;
    if (!el) return;
    const d = drag.current;

    const onDown = (e: MouseEvent) => {
      d.active = true;
      d.startX = e.pageX;
      d.scrollLeft = el.scrollLeft;
      d.moved = false;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent) => {
      if (!d.active) return;
      const dx = e.pageX - d.startX;
      if (Math.abs(dx) > 4) {
        d.moved = true;
        el.scrollLeft = d.scrollLeft - dx;
      }
    };
    const onUp = () => {
      d.active = false;
      el.style.cursor = "";
    };
    // Prevent link navigation if the mouse moved during drag
    const onClick = (e: MouseEvent) => {
      if (d.moved) {
        e.preventDefault();
        e.stopPropagation();
        d.moved = false;
      }
    };
    const noDrag = (e: Event) => e.preventDefault();

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", noDrag);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", noDrag);
    };
  }, []);

  // Games filtered by selected sport pill (for ribbon), live first, capped at 10
  const RIBBON_MAX = 10;
  const STATUS_ORDER: Record<string, number> = { live: 0, scheduled: 1, postponed: 2, final: 3, cancelled: 4 };
  const ribbonGames = useMemo(() => {
    const all = selectedSport === "all" ? games : games.filter((g) => g.sport === selectedSport);
    const sorted = [...all].sort((a, b) => (STATUS_ORDER[a.status] ?? 1) - (STATUS_ORDER[b.status] ?? 1));
    return sorted.slice(0, RIBBON_MAX);
  }, [games, selectedSport]);
  const totalFiltered = useMemo(() => {
    return selectedSport === "all" ? games.length : games.filter((g) => g.sport === selectedSport).length;
  }, [games, selectedSport]);

  // Search results across teams, venue, city, league, sport
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return games
      .filter((g) =>
        g.home.name.toLowerCase().includes(q) ||
        g.away.name.toLowerCase().includes(q) ||
        g.home.shortName.toLowerCase().includes(q) ||
        g.away.shortName.toLowerCase().includes(q) ||
        g.home.abbr.toLowerCase().includes(q) ||
        g.away.abbr.toLowerCase().includes(q) ||
        g.venue.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.league.toLowerCase().includes(q) ||
        g.sport.toLowerCase().includes(q) ||
        (g.contextLabel ?? "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [games, query]);

  const liveCount = games.filter((g) => g.status === "live").length;

  function handleSportPill(id: string) {
    setSelectedSport(id);
    setQuery("");
    setSearchOpen(false);
    if (id === "all") {
      router.push("/");
    } else {
      router.push(`/${id}`);
    }
  }

  function handleSearchSelect(g: GameSummary) {
    setQuery("");
    setSearchOpen(false);
    router.push(`/${g.sport}/${g.slug}`);
  }

  return (
    <header className="site-header">
      {/* ── Line 1: Logo · Search · Theme ── */}
      <div className="site-header-line1">
        <Link href="/" className="logo">
          Matchup<span>Lens</span>
        </Link>

        {/* Search */}
        <div className="search-wrap" ref={searchRef}>
          <div className="search-box">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="Search teams, venues, leagues…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
                if (e.key === "Enter" && searchResults.length > 0) {
                  handleSearchSelect(searchResults[0]);
                }
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(""); setSearchOpen(false); }}>
                ✕
              </button>
            )}
          </div>

          {/* Search dropdown */}
          {searchOpen && query.length >= 2 && (
            <div className="search-dropdown">
              {searchResults.length === 0 ? (
                <div className="search-empty">No games found for &ldquo;{query}&rdquo;</div>
              ) : (
                <>
                  <div className="search-hint">Today&rsquo;s games</div>
                  {searchResults.map((g) => {
                    const isLive = g.status === "live";
                    const isFinal = g.status === "final";
                    return (
                      <button
                        key={g.id}
                        className="search-result"
                        onClick={() => handleSearchSelect(g)}
                      >
                        <span className="search-result-teams">
                          {g.away.shortName} vs {g.home.shortName}
                        </span>
                        <span className="search-result-meta">
                          <span className={`search-chip chip-${g.sport}`}>
                            {g.sport.toUpperCase()}
                          </span>
                          {isLive ? (
                            <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 11 }}>
                              ● LIVE {g.period}
                            </span>
                          ) : isFinal ? (
                            <span style={{ color: "var(--text3)", fontSize: 11 }}>
                              {g.awayScore}–{g.homeScore} · FINAL
                            </span>
                          ) : (
                            <span style={{ color: "var(--text3)", fontSize: 11 }}>
                              <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />
                            </span>
                          )}
                          {g.venue && (
                            <span style={{ color: "var(--text3)", fontSize: 11 }}>
                              · {g.venue}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        <ThemeToggleInline />
      </div>

      {/* ── Lines 2 + 3: hidden on legal/minimal pages ── */}
      {!hidePillsAndRibbon && <>
        {/* Line 2: Sport filter pills */}
        <div className="sport-pills-wrap">
          <div className="sport-pills">
            <button
              className={`sport-pill${selectedSport === "all" ? " active" : ""}`}
              onClick={() => handleSportPill("all")}
            >
              All
              {liveCount > 0 && <span className="pill-live"> · {liveCount} live</span>}
            </button>
            {sports.map((s) => {
              const count = games.filter((g) => g.sport === s.id && g.status === "live").length;
              return (
                <button
                  key={s.id}
                  className={`sport-pill${selectedSport === s.id ? " active" : ""}`}
                  onClick={() => handleSportPill(s.id)}
                >
                  {s.label}
                  {count > 0 && <span className="pill-live"> · {count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Line 3: Game ribbon */}
        <div className="ribbon-scroll" ref={ribbonRef}>
        {ribbonGames.length === 0 ? (
          <div style={{ padding: "10px 16px", fontSize: 13, color: "var(--text3)" }}>
            No games today for {sports.find((s) => s.id === selectedSport)?.label ?? selectedSport}.
          </div>
        ) : (
          <div className="ribbon-inner">
            {ribbonGames.map((g) => {
              const isLive = g.status === "live";
              const isFinal = g.status === "final";
              const hasScore = isLive || isFinal;
              const vs = g.sport === "ufc" || g.sport === "worldcup" ? "vs" : "@";
              return (
                <Link
                  key={g.id}
                  href={`/${g.sport}/${g.slug}`}
                  className={`ribbon-card${isLive ? " live" : ""}`}
                >
                  <div className="ribbon-league">
                    <span>{g.sport.toUpperCase()}</span>
                    {isLive && <span style={{ color: "var(--green)" }}>● LIVE</span>}
                    {isFinal && <span style={{ color: "var(--text3)" }}>FINAL</span>}
                  </div>
                  <div className="ribbon-teams">
                    <div className="ribbon-row">
                      <span>{g.away.abbr}</span>
                      {hasScore && (
                        <span style={{ fontWeight: isFinal && (g.awayScore ?? 0) > (g.homeScore ?? 0) ? 800 : 600 }}>
                          {g.awayScore}
                        </span>
                      )}
                    </div>
                    <div className="ribbon-row">
                      <span><span style={{ color: "var(--text3)", fontSize: 10 }}>{vs} </span>{g.home.abbr}</span>
                      {hasScore && (
                        <span style={{ fontWeight: isFinal && (g.homeScore ?? 0) > (g.awayScore ?? 0) ? 800 : 600 }}>
                          {g.homeScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ribbon-time">
                    {isLive ? g.period : isFinal ? "" : (
                      <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />
                    )}
                  </div>
                </Link>
              );
            })}
            {totalFiltered > RIBBON_MAX && (
              <Link
                href={selectedSport === "all" ? "/" : `/${selectedSport}`}
                className="ribbon-card ribbon-card-more"
              >
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>MORE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--blue)" }}>
                  +{totalFiltered - RIBBON_MAX} games
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  View all →
                </div>
              </Link>
            )}
          </div>
        )}
        </div>{/* end ribbon-scroll */}
      </>}{/* end hidePillsAndRibbon guard */}
    </header>
  );
}
