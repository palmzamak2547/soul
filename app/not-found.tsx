import Link from "next/link";
import { Brand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <Brand />
      <span className="section-kicker">404 / MEMORY NOT FOUND</span>
      <h1>เรื่องราวนี้<br />ยังไม่ถูกบันทึก</h1>
      <p>ลิงก์อาจหมดอายุ หรือ memory นี้ยังไม่ถูกเผยแพร่</p>
      <Link className="button button-primary" href="/">กลับหน้าหลัก</Link>
    </main>
  );
}
