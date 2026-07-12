"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[soul-root-error]", error.message, error.digest);
  }, [error]);

  return (
    <main
      id="main-content"
      style={{
        minHeight: "70dvh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
        background: "var(--paper, #fffafb)",
        color: "var(--ink, #1c1216)",
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--pink-strong, #c2185b)",
          }}
        >
          Something went wrong
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui",
            fontSize: 32,
            letterSpacing: "-0.04em",
          }}
        >
          หน้านี้สะดุดชั่วคราว
        </h1>
        <p style={{ color: "var(--muted, #7a6b71)", lineHeight: 1.7 }}>
          ลองรีโหลดส่วนนี้ หรือกลับหน้าหลัก — ไม่มีข้อมูลส่วนบุคคลถูกบันทึกจาก error นี้
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 44,
              padding: "0 20px",
              borderRadius: 999,
              border: 0,
              background: "var(--pink, #e91e63)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ลองอีกครั้ง
          </button>
          <Link
            href="/"
            style={{
              minHeight: 44,
              display: "inline-flex",
              alignItems: "center",
              padding: "0 20px",
              borderRadius: 999,
              border: "1px solid var(--line, #eadce1)",
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </main>
  );
}
