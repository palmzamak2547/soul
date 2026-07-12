import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <Brand />
      <span className="section-kicker">404 / MEMORY NOT FOUND</span>
      <h1>
        เรื่องราวนี้
        <br />
        ยังไม่ถูกบันทึก
      </h1>
      <p>ลิงก์อาจหมดอายุ หรือ memory นี้ยังไม่ถูกเผยแพร่</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <Link className="button button-primary" href="/">
          กลับหน้าหลัก
        </Link>
        <Link className="button button-ghost" href="/collections">
          ดูคอลเลกชัน
        </Link>
        <Link className="button button-ghost" href="/tap/soul_demo_7k3m9q2v">
          ลอง Tap Experience
        </Link>
        <Link className="button button-ghost" href="/member/wallet">
          Member space
        </Link>
      </div>
    </main>
  );
}
