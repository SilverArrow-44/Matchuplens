"use client";

import { useEffect } from "react";
import { ADS_ENABLED } from "@/lib/monetize";

const PUB_ID = "ca-pub-7937234001453997";

interface Props {
  id: string;
  /** AdSense ad unit slot ID — create units at adsense.google.com → Ads → By ad unit */
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
}

export function AdSlot({ id, slot, format = "auto" }: Props) {
  useEffect(() => {
    if (!ADS_ENABLED || !slot) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — auto ads will handle it
    }
  }, [slot]);

  // Dev: show placeholder so you can see ad placements
  if (!ADS_ENABLED) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div style={{
        border: "1px dashed var(--border2)",
        borderRadius: 8,
        padding: "18px 12px",
        textAlign: "center",
        fontSize: 11,
        color: "var(--text3)",
        margin: "16px 0",
      }}>
        Ad slot: {id}{slot ? ` (unit: ${slot})` : " — add slot ID"}
      </div>
    );
  }

  // Production with a specific slot ID: render a manual ad unit
  if (slot) {
    return (
      <div style={{ margin: "16px 0", overflow: "hidden" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={PUB_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Production without a slot ID: invisible spacer
  // Auto Ads (enabled in your AdSense dashboard) handles placement automatically
  return <div id={`ad-${id}`} style={{ margin: "16px 0" }} />;
}
