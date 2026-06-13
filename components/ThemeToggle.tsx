"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme ?? "dark");
  }, []);

  function set(next: "light" | "dark") {
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <div className="theme-switch" role="group" aria-label="Color theme">
      <button
        className={`theme-opt${theme !== "light" ? " active" : ""}`}
        onClick={() => set("dark")}
      >
        🌙 Dark
      </button>
      <button
        className={`theme-opt${theme === "light" ? " active" : ""}`}
        onClick={() => set("light")}
      >
        ☀️ Light
      </button>
    </div>
  );
}
