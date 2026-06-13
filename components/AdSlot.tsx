import { ADS_ENABLED } from "@/lib/monetize";

// Reserved ad placement. Keeps layout space consistent so enabling ads
// later doesn't shift content (good for Core Web Vitals / CLS).
// id maps to the ad network's placement id when you configure Ezoic/AdSense.
export function AdSlot({ id }: { id: string }) {
  if (!ADS_ENABLED) {
    if (process.env.NODE_ENV === "production") return null;
    // Visible only during development so you can see placements
    return (
      <div
        style={{
          border: "1px dashed var(--border2)",
          borderRadius: 8,
          padding: "18px 12px",
          textAlign: "center",
          fontSize: 11,
          color: "var(--text3)",
          margin: "16px 0",
        }}
      >
        Ad slot: {id}
      </div>
    );
  }
  return <div id={`ad-${id}`} style={{ margin: "16px 0", minHeight: 90 }} />;
}
