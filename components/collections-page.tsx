"use client";

import {
  ArrowRight,
  Check,
  LockKey,
  Radio,
  ShieldCheck,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type Collection = {
  id: string;
  category: "founder" | "faculty" | "event";
  eyebrow: string;
  name: string;
  description: string;
  price: string;
  edition: string;
  image: string;
  tone: string;
  features: string[];
};

const collections: Collection[] = [
  {
    id: "founder-088",
    category: "founder",
    eyebrow: "FOUNDER SERIES · 088/500",
    name: "SOUL Founder 2026",
    description: "รุ่นแรกสำหรับผู้ร่วมสร้าง memory layer ตั้งแต่วันแรก พร้อม serial และ Founder badge",
    price: "฿1,490",
    edition: "500 ใบ",
    image: "/assets/soul-card-hero.webp",
    tone: "rose",
    features: ["Laser engraving", "Founder digital badge", "Lifetime member"],
  },
  {
    id: "faculty-commarts",
    category: "faculty",
    eyebrow: "FACULTY SERIES · 001/300",
    name: "Communication Arts",
    description: "ตัวตนของคณะในรูปแบบ collectible พร้อมเรื่องราวรุ่น กิจกรรม และ badge เฉพาะ",
    price: "฿799",
    edition: "300 ใบ",
    image: "/assets/communication-arts-badge.webp",
    tone: "night",
    features: ["Faculty timeline", "Event unlocks", "Premium engraving"],
  },
  {
    id: "faculty-engineering",
    category: "faculty",
    eyebrow: "FACULTY SERIES · PREVIEW",
    name: "Engineering × SOUL",
    description: "เส้นเวลาแห่งการสร้าง ทดลอง และเติบโต สำหรับ community ที่ผูกพันกันข้ามรุ่น",
    price: "฿799",
    edition: "กำลังออกแบบ",
    image: "/assets/soul-card-hero.webp",
    tone: "steel",
    features: ["Faculty identity", "Project stories", "Alumni unlocks"],
  },
  {
    id: "event-reunion",
    category: "event",
    eyebrow: "EVENT SERIES · 050/200",
    name: "Reunion Capsule",
    description: "ของที่ระลึกจาก reunion ที่เปิดประตูสู่ภาพ เสียง และข้อความจากเพื่อนในรุ่น",
    price: "฿499",
    edition: "200 ใบ",
    image: "/assets/soul-card-hero.webp",
    tone: "gold",
    features: ["Event story", "Guest signatures", "Time capsule"],
  },
];

const filters = [
  { id: "all", label: "ทั้งหมด" },
  { id: "founder", label: "Founder" },
  { id: "faculty", label: "Faculty" },
  { id: "event", label: "Event" },
] as const;

export function CollectionsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [selected, setSelected] = useState<Collection | null>(null);
  const [reserved, setReserved] = useState(false);
  const visible = useMemo(
    () => collections.filter((item) => filter === "all" || item.category === filter),
    [filter],
  );

  return (
    <div className="site-shell collections-shell">
      <SiteHeader />
      <main id="main-content">
        <section className="collection-hero">
          <div>
            <p className="section-kicker">SOUL / COLLECTIONS</p>
            <h1>Choose what you carry.<br /><em>Keep what you lived.</em></h1>
          </div>
          <p>
            แต่ละคอลเลกชันเชื่อมกับเรื่องราว community และ badge ที่ต่างกัน การ์ดทุกใบเป็นจุดเริ่มของ timeline ไม่ใช่จุดจบของของที่ระลึก
          </p>
        </section>

        <section className="collection-catalog" aria-labelledby="catalog-title">
          <div className="catalog-toolbar">
            <div>
              <span className="mini-label">LIVE CATALOG</span>
              <h2 id="catalog-title">คอลเลกชันตัวอย่าง</h2>
            </div>
            <div className="filter-group" aria-label="กรองคอลเลกชัน" role="group">
              {filters.map((item) => (
                <button
                  aria-pressed={filter === item.id}
                  className={filter === item.id ? "is-active" : ""}
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div className="collection-grid" layout>
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <motion.article
                  animate={{ opacity: 1, scale: 1 }}
                  className={`collection-card tone-${item.tone}`}
                  exit={{ opacity: 0, scale: 0.96 }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  key={item.id}
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <div className="collection-image">
                    <Image
                      alt={`${item.name} collectible preview`}
                      fill
                      sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 31vw"
                      src={item.image}
                    />
                    <span className="edition-chip">{item.edition}</span>
                  </div>
                  <div className="collection-card-body">
                    <span className="mini-label">{item.eyebrow}</span>
                    <div className="collection-title-row">
                      <h3>{item.name}</h3>
                      <strong>{item.price}</strong>
                    </div>
                    <p>{item.description}</p>
                    <ul>
                      {item.features.map((feature) => (
                        <li key={feature}><Check size={15} weight="bold" /> {feature}</li>
                      ))}
                    </ul>
                    <button className="text-button" onClick={() => { setSelected(item); setReserved(false); }} type="button">
                      Personalize this card <ArrowRight size={17} weight="bold" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="collection-assurance">
          <div><ShieldCheck size={28} weight="duotone" /><strong>Signed tap link</strong><span>ลิงก์เฉพาะที่เดาได้ยาก</span></div>
          <div><LockKey size={28} weight="duotone" /><strong>Private by default</strong><span>เจ้าของเลือกสิ่งที่จะแชร์</span></div>
          <div><Radio size={28} weight="duotone" /><strong>NFC + QR</strong><span>ใช้ได้กับโทรศัพท์ทุกช่วงวัย</span></div>
          <div><Sparkle size={28} weight="duotone" /><strong>Grows over time</strong><span>เรื่องราวใหม่เพิ่มได้เสมอ</span></div>
        </section>

        <section className="collection-cta">
          <h2>อยากเห็นการ์ดมีชีวิต?</h2>
          <p>ลอง flow ตั้งแต่แตะการ์ดจน badge ปลดล็อกได้ทันที</p>
          <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">
            เปิด Tap Experience <ArrowRight size={18} weight="bold" />
          </Link>
        </section>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {selected && (
          <motion.div
            animate={{ opacity: 1 }}
            className="drawer-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}
          >
            <motion.aside
              animate={{ x: 0 }}
              aria-labelledby="personalize-title"
              aria-modal="true"
              className="personalize-drawer"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              role="dialog"
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <button aria-label="ปิด" className="drawer-close" onClick={() => setSelected(null)} type="button"><X size={21} /></button>
              {!reserved ? (
                <>
                  <p className="section-kicker">PERSONALIZE / PREVIEW</p>
                  <h2 id="personalize-title">ทำให้ {selected.name}<br />เป็นของคุณ</h2>
                  <div className="drawer-preview">
                    <Image alt="ตัวอย่างการ์ดสำหรับ personalization" fill sizes="360px" src={selected.image} />
                  </div>
                  <form onSubmit={(event) => { event.preventDefault(); setReserved(true); }}>
                    <label>ชื่อบนการ์ด<input autoComplete="off" maxLength={28} name="displayName" placeholder="เช่น PLOY K." required /></label>
                    <div className="form-row">
                      <label>ปีที่เข้า<input inputMode="numeric" maxLength={4} name="entryYear" placeholder="2026" required /></label>
                      <label>Serial preference<select defaultValue="random" name="serial"><option value="random">Random</option><option value="meaningful">เลขที่มีความหมาย</option></select></label>
                    </div>
                    <p className="privacy-note"><LockKey size={15} /> ข้อมูลในฟอร์มนี้อยู่เฉพาะบนอุปกรณ์และยังไม่ถูกส่งไปที่ใด</p>
                    <button className="button button-primary button-full" type="submit">สร้าง reservation ตัวอย่าง <ArrowRight size={18} /></button>
                  </form>
                </>
              ) : (
                <div className="reservation-success" aria-live="polite">
                  <div className="success-icon"><Check size={34} weight="bold" /></div>
                  <p className="section-kicker">DEMO RESERVATION</p>
                  <h2>บันทึกไว้ใน prototype แล้ว</h2>
                  <p>ยังไม่มีการชำระเงินหรือส่งข้อมูลจริง ขั้นต่อไปใน production คือ identity, payment และ fulfillment ที่ผ่าน PDPA review</p>
                  <button className="button button-primary button-full" onClick={() => setSelected(null)} type="button">กลับไปดูคอลเลกชัน</button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
