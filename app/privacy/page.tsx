import type { Metadata } from "next";
import { LockKey, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy & Prototype Boundaries",
  description: "ขอบเขตความเป็นส่วนตัวและความปลอดภัยของ SOUL prototype",
};

const sections = [
  {
    title: "ข้อมูลที่ prototype ใช้",
    body: "หน้าที่คุณกำลังดูใช้เฉพาะข้อมูลสมมติ ไม่มีชื่อ รหัสนิสิต เบอร์โทร อีเมล หรือข้อมูลส่วนบุคคลจากใบสมัครอยู่ในระบบหรือ client bundle",
  },
  {
    title: "Tap link ไม่ใช่ ownership",
    body: "ลิงก์ NFC แบบ opaque ช่วยลดการเดา card ID แต่ลิงก์ที่ถูกแชร์หรือคัดลอกไม่ควรใช้ยืนยันเจ้าของ การ claim, memory ส่วนตัว และ redemption จริงต้องมี identity verification แยกต่างหาก",
  },
  {
    title: "Profile และ memory",
    body: "แนวทาง production คือ public profile ต้อง opt-in และ personal timeline เป็น private by default เจ้าของเลือก visibility รายชิ้นและขอ export, correction หรือ deletion ได้",
  },
  {
    title: "Cookies",
    body: "prototype ใช้เฉพาะ essential cookie สำหรับ session หลังบ้าน ไม่มี advertising cookie หรือ cross-site tracking หากเพิ่ม analytics ในอนาคตต้องประเมิน consent และ retention ใหม่",
  },
  {
    title: "สื่อและสิทธิ์การใช้งาน",
    body: "ภาพตรามหาวิทยาลัยและ concept card มาจากเอกสารที่ผู้ใช้ให้เพื่อการทบทวนต้นแบบ ก่อนเผยแพร่จริงต้องได้รับอนุญาตเป็นลายลักษณ์อักษร และทุก archive/UGC ต้องมี rights status, consent และ takedown process",
  },
  {
    title: "ก่อนเปิดใช้งานจริง",
    body: "ต้องกำหนดผู้ควบคุมข้อมูล ช่องทางติดต่อ retention schedule, DPA กับผู้ให้บริการ, incident response, backup/export policy และ university SSO/RBAC ให้ครบถ้วน",
  },
];

export default function PrivacyPage() {
  return (
    <div className="site-shell legal-shell">
      <SiteHeader />
      <main id="main-content">
        <section className="legal-hero">
          <div className="legal-icon"><ShieldCheck size={32} weight="duotone" /></div>
          <p className="section-kicker">PRIVACY / PROTOTYPE POLICY</p>
          <h1>ความทรงจำมีความหมาย<br /><em>เพราะเจ้าของควบคุมมันได้</em></h1>
          <p>หน้านี้อธิบายขอบเขตที่ prototype ทำจริง และสิ่งที่ต้องพร้อมก่อนเปิดให้ผู้ใช้จริง</p>
          <span className="legal-updated">Updated 10 July 2026 · Thailand</span>
        </section>
        <section className="legal-content">
          <aside><LockKey size={20} weight="duotone" /><strong>Privacy-first default</strong><p>ไม่ใช้ข้อมูลจริงจากใบสมัคร ไม่เก็บ raw NFC UID, exact location หรือ raw IP</p></aside>
          <div className="legal-sections">
            {sections.map((section, index) => (
              <article key={section.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{section.title}</h2><p>{section.body}</p></div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
