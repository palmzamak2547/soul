import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="SOUL — กลับหน้าหลัก">
      <span className="brand-word">SOUL</span>
      <span className="brand-dot" aria-hidden="true" />
      {!compact && <span className="brand-sub">Stories of University Life</span>}
    </Link>
  );
}
