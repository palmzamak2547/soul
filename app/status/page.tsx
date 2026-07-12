import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "System status",
  description: "Live health and prototype boundary for SOUL Platform.",
  robots: { index: false, follow: false },
};

async function loadHealth() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "https://soulplatform.vercel.app",
  ].filter((value): value is string => Boolean(value));

  for (const base of candidates) {
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/api/health`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (!res.ok) continue;
      return (await res.json()) as {
        ok?: boolean;
        data?: Record<string, unknown>;
      };
    } catch {
      // try next candidate
    }
  }
  return null;
}

export default async function StatusPage() {
  const health = await loadHealth();
  const data = health?.data ?? {};
  const ok = health?.ok === true && data.status === "ok";

  return (
    <main
      id="main-content"
      style={{
        minHeight: "100dvh",
        padding: "48px 20px 80px",
        background: "var(--paper, #fffafb)",
        color: "var(--ink, #1c1216)",
        fontFamily: "var(--font-body), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--pink-strong, #c2185b)",
          }}
        >
          SOUL / STATUS
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            letterSpacing: "-0.05em",
            margin: "12px 0 8px",
          }}
        >
          System status
        </h1>
        <p style={{ color: "var(--muted, #7a6b71)", lineHeight: 1.7 }}>
          ต้นแบบสาธารณะบน{" "}
          <strong>soulplatform.vercel.app</strong> — ข้อมูลทั้งหมดเป็น
          fictional demo
        </p>

        <div
          style={{
            marginTop: 28,
            padding: 24,
            borderRadius: 24,
            border: "1px solid var(--line, #eadce1)",
            background: "#fff",
            boxShadow: "0 18px 50px rgba(42,22,31,.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: ok ? "#16a675" : "#c62828",
                boxShadow: ok
                  ? "0 0 0 6px rgba(22,166,117,.15)"
                  : "0 0 0 6px rgba(198,40,40,.12)",
              }}
            />
            <strong style={{ fontSize: 18 }}>
              {ok ? "All systems operational" : "Health check unavailable"}
            </strong>
          </div>

          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "10px 16px",
              marginTop: 24,
              fontSize: 14,
            }}
          >
            {[
              ["Service", String(data.service ?? "—")],
              ["Version", String(data.version ?? "—")],
              ["Mode", String(data.mode ?? "—")],
              ["Repository", String(data.repository ?? "—")],
              ["Commit", String(data.commit ?? "—")],
              ["Region", String(data.region ?? "—")],
              ["Timestamp", String(data.timestamp ?? "—")],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt style={{ color: "var(--muted, #7a6b71)" }}>{k}</dt>
                <dd style={{ margin: 0, fontFamily: "var(--font-mono), monospace", fontSize: 12 }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/" style={{ color: "var(--pink-strong, #c2185b)" }}>
            ← กลับหน้าแรก
          </Link>
          <Link href="/api/health" style={{ color: "var(--muted, #7a6b71)" }}>
            Raw JSON
          </Link>
          <Link href="/collections" style={{ color: "var(--muted, #7a6b71)" }}>
            Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
