"use client";

import { useEffect, useState } from "react";

interface Props {
  utc: string;       // ISO-8601 UTC timestamp
  fallback: string;  // ET string shown during SSR / before hydration
  showDate?: boolean; // also show the date (for info strips)
}

export function LocalTime({ utc, fallback, showDate = false }: Props) {
  const [display, setDisplay] = useState(fallback);

  useEffect(() => {
    const d = new Date(utc);
    const time = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    if (showDate) {
      const date = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setDisplay(`${time} · ${date}`);
    } else {
      setDisplay(time);
    }
  }, [utc, showDate]);

  return <span suppressHydrationWarning>{display}</span>;
}
