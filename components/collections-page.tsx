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
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type LiveCatalogCard = {
  id: string;
  slug: string;
  titleTh: string;
  titleEn: string;
  collection: string;
  chapter: string;
  rarity: string;
  edition: { label: string };
  visual: { imageUrl: string; accent: string };
  memory: { headline: string; year: string };
  demoTapPath: string;
};

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
  { id: "faculty", label: "คณะ" },
  { id: "event", label: "อีเวนต์" },
] as const;

function CatalogSkeleton() {
  return (
    <div className="collection-grid" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div className="collection-card collection-skeleton" key={item}>
          <div className="collection-image skeleton-block" />
          <div className="collection-card-body">
            <div className="skeleton-line w-40" />
            <div className="skeleton-line w-72" />
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-56" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CollectionsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [selected, setSelected] = useState<Collection | null>(null);
  const [reserved, setReserved] = useState(false);
  const [liveCards, setLiveCards] = useState<LiveCatalogCard[]>([]);
  const [liveStatus, setLiveStatus] = useState<"loading" | "ready" | "error">("loading");
  const visible = useMemo(
    () => collections.filter((item) => filter === "all" || item.category === filter),
    [filter],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/cards", { headers: { accept: "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = (await response.json()) as {
          ok?: boolean;
          data?: { cards?: LiveCatalogCard[] };
        };
        if (!cancelled) {
          setLiveCards(payload.data?.cards ?? []);
          setLiveStatus("ready");
        }
      } catch {
        if (!cancelled) setLiveStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

        <section className="collection-catalog collection-catalog-live" aria-labelledby="live-demo-title">
          <div className="catalog-toolbar">
            <div>
              <span className="mini-label">DEMO · แตะได้ทันที</span>
              <h2 id="live-demo-title">การ์ดสาธิตจากระบบ</h2>
              <p className="catalog-subcopy">เลือกใบใดก็ได้เพื่อลอง flow แตะ → ปลดล็อก → แลกรางวัล</p>
            </div>
            <span className="catalog-status-pill" aria-live="polite">
              {liveStatus === "loading" && "กำลังโหลด…"}
              {liveStatus === "ready" && `${liveCards.length} ใบพร้อมแตะ`}
              {liveStatus === "error" && "โหลดไม่สำเร็จ"}
            </span>
          </div>
          {liveStatus === "loading" ? <CatalogSkeleton /> : null}
          {liveStatus === "error" ? (
            <div className="catalog-empty">
              <p>ยังดึงแคตตาล็อกไม่สำเร็จ — ใช้ลิงก์ demo หลักได้</p>
              <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">
                เปิด demo card
              </Link>
            </div>
          ) : null}
          {liveStatus === "ready" ? (
            <div className="collection-grid">
              {liveCards.map((card) => (
                <article className="collection-card tone-rose" key={card.id}>
                  <div className="collection-image">
                    <Image
                      alt={`${card.titleEn} demo card`}
                      fill
                      sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 31vw"
                      src={card.visual.imageUrl}
                    />
                    <span className="edition-chip">{card.edition.label}</span>
                    <span className="live-chip">TAP READY</span>
                  </div>
                  <div className="collection-card-body">
                    <span className="mini-label">{card.collection}</span>
                    <div className="collection-title-row">
                      <h3>{card.titleTh}</h3>
                      <strong className="rarity-pill" style={{ color: card.visual.accent }}>
                        {card.rarity}
                      </strong>
                    </div>
                    <p>{card.memory.headline}</p>
                    <ul>
                      <li><Check size={15} weight="bold" aria-hidden="true" /> {card.chapter}</li>
                      <li><Check size={15} weight="bold" aria-hidden="true" /> {card.memory.year}</li>
                    </ul>
                    <Link className="button button-primary collection-cta" href={card.demoTapPath}>
                      เปิด Tap Experience <ArrowRight size={17} weight="bold" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <section className="collection-catalog" aria-labelledby="catalog-title">
          <div className="catalog-toolbar catalog-toolbar-sticky">
            <div>
              <span className="mini-label">SERIES CATALOG</span>
              <h2 id="catalog-title">คอลเลกชันตัวอย่าง</h2>
              <p className="catalog-subcopy">กรองตามประเภท แล้วสำรวจ story ของแต่ละ series</p>
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
          {visible.length === 0 ? (
            <div className="catalog-empty">
              <p>ไม่มีคอลเลกชันในหมวดนี้</p>
              <button className="button button-ghost" onClick={() => setFilter("all")} type="button">
                แสดงทั้งหมด
              </button>
            </div>
          ) : null}

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
                      ปรับแต่งการ์ดนี้ <ArrowRight size={17} weight="bold" aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="collection-assurance" aria-label="ความมั่นใจในการออกแบบ">
          <div><ShieldCheck size={28} weight="duotone" aria-hidden="true" /><strong>ลิงก์เฉพาะ</strong><span>เดา card ID ได้ยาก</span></div>
          <div><LockKey size={28} weight="duotone" aria-hidden="true" /><strong>ส่วนตัวเป็นค่าเริ่มต้น</strong><span>เจ้าของเลือกสิ่งที่จะแชร์</span></div>
          <div><Radio size={28} weight="duotone" aria-hidden="true" /><strong>NFC + QR</strong><span>ใช้ได้กับมือถือทั่วไป</span></div>
          <div><Sparkle size={28} weight="duotone" aria-hidden="true" /><strong>เติบโตตามเวลา</strong><span>เรื่องราวใหม่เพิ่มได้เสมอ</span></div>
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
                  <p className="section-kicker">ปรับแต่ง · ตัวอย่าง</p>
                  <h2 id="personalize-title">ทำให้ {selected.name}<br />เป็นของคุณ</h2>
                  <div className="drawer-preview">
                    <Image alt="ตัวอย่างการ์ดสำหรับ personalization" fill sizes="360px" src={selected.image} />
                  </div>
                  <form onSubmit={(event) => { event.preventDefault(); setReserved(true); }}>
                    <label>ชื่อบนการ์ด<input autoComplete="off" maxLength={28} name="displayName" placeholder="เช่น พิมพ์ ว." required /></label>
                    <div className="form-row">
                      <label>ปีที่เข้า<input inputMode="numeric" maxLength={4} name="entryYear" placeholder="2026" required /></label>
                      <label>เลข serial<select defaultValue="random" name="serial"><option value="random">สุ่ม</option><option value="meaningful">เลขที่มีความหมาย</option></select></label>
                    </div>
                    <p className="privacy-note"><LockKey size={15} aria-hidden="true" /> ข้อมูลในฟอร์มนี้อยู่เฉพาะบนอุปกรณ์ ยังไม่ถูกส่งไปที่ใด</p>
                    <button className="button button-primary button-full" type="submit">บันทึกตัวอย่าง <ArrowRight size={18} aria-hidden="true" /></button>
                  </form>
                </>
              ) : (
                <div className="reservation-success" aria-live="polite">
                  <div className="success-icon"><Check size={34} weight="bold" aria-hidden="true" /></div>
                  <p className="section-kicker">ตัวอย่างการจอง</p>
                  <h2>บันทึกใน prototype แล้ว</h2>
                  <p>ยังไม่มีการชำระเงินหรือส่งข้อมูลจริง ใน production จะมี identity, payment และ fulfillment หลังผ่าน PDPA review</p>
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
