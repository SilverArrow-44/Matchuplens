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

// Reserve vertical space so enabling ads (or a slow fill) doesn't shift layout.
const MIN_HEIGHT: Record<NonNullable<Props["format"]>, number> = {
  auto: 100,
  rectangle: 250,
  horizontal: 90,
};

// Small, policy-safe label. Ad units must be labelled only "Advertisement" —
// never with words that imply endorsement, a pick, or a betting action.
function AdLabel() {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "var(--text3)",
        textAlign: "center",
        marginBottom: 4,
      }}
    >
      Advertisement
    </div>
  );
}

export function AdSlot({ id, slot, format = "auto" }: Props) {
  useEffect(() => {
    if (!ADS_ENABLED || !slot) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — Auto Ads will handle placement.
    }
  }, [slot]);

  const reserved = MIN_HEIGHT[format];

  // Ads not enabled yet: hide cleanly in production (no empty gap); show a
  // labelled placeholder in development so placements are visible while building.
  if (!ADS_ENABLED) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div style={{ margin: "16px 0" }}>
        <AdLabel />
        <div
          style={{
            border: "1px dashed var(--border2)",
            borderRadius: 8,
            minHeight: reserved,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "var(--text3)",
          }}
        >
          Ad placement: {id}
          {slot ? ` (unit ${slot})` : " — add slot ID"}
        </div>
      </div>
    );
  }

  // Enabled with a specific unit: render a labelled, space-reserved ad unit.
  if (slot) {
    return (
      <div style={{ margin: "16px 0" }}>
        <AdLabel />
        <div style={{ minHeight: reserved, overflow: "hidden" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={PUB_ID}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // Enabled without a specific unit: Auto Ads handles placement. Reserve space
  // so the injected ad doesn't shift content.
  return <div id={`ad-${id}`} style={{ margin: "16px 0", minHeight: reserved }} />;
}
