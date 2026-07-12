export default function RootLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        minHeight: "40dvh",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--muted, #7a6b71)",
      }}
    >
      Loading SOUL…
    </div>
  );
}
