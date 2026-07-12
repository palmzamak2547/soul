import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <Brand />
        <p>
          Memory is the layer universities forgot to build.
          <br />
          We are building it.
        </p>
      </div>
      <div className="footer-links" aria-label="ลิงก์ส่วนท้าย">
        <Link href="/tap/soul_demo_7k3m9q2v">Tap experience</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/admin">Control Center</Link>
        <Link href="/api/health">System status</Link>
        <Link href="/privacy">
          Privacy <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="footer-meta">
        <span>© 2026 SOUL Prototype · soulplatform.vercel.app</span>
        <span>Concept review only · University marks require permission before launch</span>
      </div>
    </footer>
  );
}
