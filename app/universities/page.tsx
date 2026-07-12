import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "For universities",
  description:
    "SOUL as memory infrastructure for universities — alumni, clubs, and campus identity.",
};

const advantages = [
  {
    title: "Alumni network",
    copy: "ความทรงจำที่ยังมีชีวิต 30 ปีหลังจบ — การ์ดใบเดียวเปิด timeline ทั้งรุ่น",
  },
  {
    title: "Club ecosystem",
    copy: "ทุกชมรมคือ series ธรรมชาติ — ออกการ์ด เก็บเรื่องราว ต่อยอด engagement",
  },
  {
    title: "Identity merch culture",
    copy: "นักศึกษาจ่ายเพื่อตัวตนอยู่แล้ว — SOUL เปลี่ยน merch ให้โตเป็น memory layer",
  },
  {
    title: "Ops control center",
    copy: "ทีมมหาวิทยาลัยจัดการ card batches, moderation, rewards และ audit จากที่เดียว",
  },
];

export default function UniversitiesPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content">
        <section className="collection-hero">
          <div>
            <p className="section-kicker">SOUL / UNIVERSITIES</p>
            <h1>
              Memory infrastructure
              <br />
              <em>for campuses.</em>
            </h1>
          </div>
          <p>
            มหาวิทยาลัยเก่งเรื่องความรู้ แต่ลืมโครงสร้างของความทรงจำ SOUL
            เป็นต้นแบบ phygital layer ที่เริ่มจาก campus beachhead
            แล้วขยายได้ทั้งเครือข่ายศิษย์เก่า
          </p>
        </section>

        <section className="platform-section" aria-labelledby="adv-title">
          <div className="section-heading compact">
            <p className="section-kicker">WHY IT FITS</p>
            <h2 id="adv-title">
              Structural advantages
              <br />
              <em>not marketing fluff.</em>
            </h2>
          </div>
          <div className="pillar-grid">
            {advantages.map((item, index) => (
              <article className="pillar-card" key={item.title}>
                <div className="pillar-top">
                  <span>0{index + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="collection-cta">
          <h2>อยากเห็น flow จริง?</h2>
          <p>ลอง tap experience แล้วเปิด Control Center สำหรับทีม ops</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">
              Tap demo
            </Link>
            <Link className="button button-ghost" href="/admin">
              Control Center
            </Link>
            <Link className="button button-ghost" href="/collections">
              Collections
            </Link>
          </div>
          <p className="section-intro" style={{ marginTop: 24, maxWidth: 520, marginInline: "auto" }}>
            ต้นแบบนี้ใช้ข้อมูลสมมติทั้งหมด เครื่องหมายมหาวิทยาลัยต้องได้รับอนุญาตเป็นลายลักษณ์อักษรก่อน launch จริง
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
