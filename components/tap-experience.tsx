"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Coins,
  Gift,
  LockKey,
  Radio,
  ShieldCheck,
  Sparkle,
  Trophy,
  Warning,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brand } from "./brand";

type Phase = "ready" | "connecting" | "identity" | "badge" | "unlocked";
type ApiState = "loading" | "ready" | "invalid";

type CardData = {
  token: string;
  publicId: string;
  displayName: string;
  faculty: string;
  cohort: string;
  serial: string;
  points: number;
  badgeName: string;
};

const fallbackCard: CardData = {
  token: "soul_demo_7k3m9q2v",
  publicId: "memory-kasem-demo",
  displayName: "Kasem",
  faculty: "Communication Arts",
  cohort: "Class of 2026 · Demo profile",
  serial: "001 / 300",
  points: 420,
  badgeName: "Faculty Pride",
};

const memories = [
  { date: "08 AUG 2026", title: "First day on campus", copy: "ประตูมหาวิทยาลัยในเช้าวันแรก และข้อความถึงตัวเองในอีกสี่ปีข้างหน้า", type: "Memory", state: "open" },
  { date: "24 AUG 2026", title: "Orientation night", copy: "เพลงที่ร้องพร้อมกันครั้งแรก ถูกเก็บไว้ใน capsule ของรุ่น", type: "Story", state: "open" },
  { date: "12 FEB 2027", title: "Faculty badge earned", copy: "ปลดล็อกจากการร่วมกิจกรรมคณะครั้งที่สาม", type: "Badge", state: "open" },
  { date: "MAY 2030", title: "Graduation chapter", copy: "จะเปิดเมื่อถึงวันสำเร็จการศึกษา", type: "Future", state: "locked" },
];

const sleep = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

function normalizeCard(payload: unknown, token: string): CardData {
  if (!payload || typeof payload !== "object") return { ...fallbackCard, token };
  const root = "data" in payload && payload.data && typeof payload.data === "object" ? payload.data : payload;
  const envelope = root as Record<string, unknown>;
  const data = envelope.card && typeof envelope.card === "object" ? envelope.card as Record<string, unknown> : envelope;
  const profile = data.profile && typeof data.profile === "object" ? data.profile as Record<string, unknown> : {};
  const edition = data.edition && typeof data.edition === "object" ? data.edition as Record<string, unknown> : {};
  return {
    token,
    publicId: String(data.publicId ?? fallbackCard.publicId),
    displayName: String(profile.displayName ?? data.displayName ?? fallbackCard.displayName),
    faculty: String(profile.faculty ?? data.faculty ?? fallbackCard.faculty),
    cohort: String(profile.cohort ?? data.cohort ?? fallbackCard.cohort),
    serial: String(edition.serial ?? data.serial ?? fallbackCard.serial),
    points: Number(data.points ?? profile.points ?? fallbackCard.points),
    badgeName: String(data.badgeName ?? fallbackCard.badgeName),
  };
}

export function TapExperience({ token }: { token: string }) {
  const [apiState, setApiState] = useState<ApiState>("loading");
  const [card, setCard] = useState<CardData>({ ...fallbackCard, token });
  const [phase, setPhase] = useState<Phase>("ready");
  const [redeemState, setRedeemState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [liveMessage, setLiveMessage] = useState("พร้อมจำลองการแตะ NFC");
  const running = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/cards/${encodeURIComponent(token)}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("CARD_NOT_FOUND");
        return response.json();
      })
      .then((payload) => {
        setCard(normalizeCard(payload, token));
        setApiState("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setApiState("invalid");
      });
    return () => controller.abort();
  }, [token]);

  const phaseIndex = useMemo(() => ["ready", "connecting", "identity", "badge", "unlocked"].indexOf(phase), [phase]);

  async function runSequence() {
    if (running.current || apiState !== "ready") return;
    running.current = true;
    setPhase("connecting");
    setLiveMessage("กำลังตรวจสอบลิงก์ของการ์ด");
    await sleep(reduceMotion ? 200 : 950);
    setPhase("identity");
    setLiveMessage(`ยืนยันโปรไฟล์ตัวอย่างของ ${card.displayName} แล้ว`);
    await sleep(reduceMotion ? 200 : 1050);
    setPhase("badge");
    setLiveMessage(`ปลดล็อก ${card.badgeName} badge`);
    await sleep(reduceMotion ? 200 : 1200);
    setPhase("unlocked");
    setLiveMessage("เปิด memory timeline เรียบร้อย");
    running.current = false;
  }

  async function redeemReward() {
    setRedeemState("loading");
    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({ cardToken: token, rewardId: "reward-pink-sky-wallpaper", idempotencyKey }),
      });
      if (!response.ok) throw new Error("REDEEM_FAILED");
      setRedeemState("success");
    } catch {
      setRedeemState("error");
    }
  }

  if (apiState === "loading") {
    return (
      <main className="tap-loading" id="main-content">
        <Brand compact />
        <div className="tap-spinner" aria-label="กำลังโหลด" />
        <p>กำลังอ่านลิงก์จากการ์ด…</p>
      </main>
    );
  }

  if (apiState === "invalid") {
    return (
      <main className="tap-invalid" id="main-content">
        <Brand compact />
        <div className="invalid-icon"><Warning size={32} weight="duotone" /></div>
        <p className="section-kicker">CARD LINK / NOT RECOGNIZED</p>
        <h1>ลิงก์นี้ยังเปิดความทรงจำไม่ได้</h1>
        <p>ลิงก์อาจไม่ถูกต้อง ถูกยกเลิก หรือไม่อยู่ในระบบตัวอย่าง กรุณากลับไปใช้ demo card ที่เตรียมไว้</p>
        <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">เปิด demo card</Link>
      </main>
    );
  }

  return (
    <div className="tap-shell">
      <header className="tap-header">
        <Brand compact />
        <div className="tap-header-status"><span className="pulse-dot" /> SECURE DEMO LINK</div>
        <Link href="/"><ArrowLeft size={17} /> กลับหน้าหลัก</Link>
      </header>
      <main id="main-content">
        <section className={`unlock-stage phase-${phase}`}>
          <div className="unlock-atmosphere" aria-hidden="true" />
          <div className="unlock-status" aria-live="polite">{liveMessage}</div>
          <AnimatePresence mode="wait">
            {phase === "ready" && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="ready-panel"
                exit={{ opacity: 0, y: -14 }}
                initial={{ opacity: 0, y: 18 }}
                key="ready"
              >
                <div className="nfc-orbit" aria-hidden="true"><span /><span /><span /><Radio size={30} weight="bold" /></div>
                <p className="section-kicker">SOUL TAP EXPERIENCE</p>
                <h1>แตะหนึ่งครั้ง<br /><em>ความทรงจำทั้งชีวิต</em></h1>
                <p>จำลองสิ่งที่เกิดขึ้นเมื่อโทรศัพท์แตะการ์ด SOUL — browser จะเปิดเอง ไม่ต้องติดตั้งแอป</p>
                <button className="button tap-start-button" onClick={runSequence} type="button">
                  <Radio size={21} weight="bold" /> จำลองการแตะ NFC <ArrowRight size={18} />
                </button>
                <span className="demo-disclaimer">Prototype · ไม่มีการอ่าน NFC จริงในหน้านี้</span>
              </motion.div>
            )}

            {phase === "connecting" && (
              <motion.div animate={{ opacity: 1 }} className="scan-panel" exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="connecting">
                <div className="scan-rings"><Radio size={34} weight="bold" /></div>
                <span className="mini-label">READING SOUL LINK</span>
                <h2>กำลังเชื่อมการ์ดกับเรื่องราว</h2>
                <div className="scan-progress"><span /></div>
                <div className="scan-checks">
                  <span><CheckCircle weight="fill" /> Signed link</span>
                  <span><CheckCircle weight="fill" /> Card active</span>
                  <span><ClockCounterClockwise /> Memory ready</span>
                </div>
              </motion.div>
            )}

            {phase === "identity" && (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="identity-panel" initial={{ opacity: 0, scale: 0.94 }} key="identity">
                <div className="identity-image"><Image alt="SOUL card identity" fill priority sizes="360px" src="/assets/soul-card-hero.webp" /></div>
                <div>
                  <span className="verified-label"><ShieldCheck weight="fill" /> PUBLIC DEMO PROFILE</span>
                  <p className="mini-label">IDENTITY UNLOCKED</p>
                  <h2>{card.displayName}</h2>
                  <p>{card.faculty}<br />{card.cohort}</p>
                  <span className="serial-label">SERIAL {card.serial}</span>
                </div>
              </motion.div>
            )}

            {phase === "badge" && (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="badge-panel" initial={{ opacity: 0, scale: 0.8 }} key="badge">
                <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0] }} className="badge-image" transition={{ duration: 2.2, repeat: Infinity }}>
                  <Image alt="Communication Arts badge unlocked" fill priority sizes="360px" src="/assets/communication-arts-badge.webp" />
                </motion.div>
                <span className="mini-label">ACHIEVEMENT UNLOCKED</span>
                <h2>{card.badgeName}</h2>
                <p>+120 SOUL points · Badge 01 of 06</p>
              </motion.div>
            )}

            {phase === "unlocked" && (
              <motion.div animate={{ opacity: 1 }} className="unlock-complete" initial={{ opacity: 0 }} key="unlocked">
                <Check size={28} weight="bold" />
                <span>MEMORY UNLOCKED</span>
              </motion.div>
            )}
          </AnimatePresence>

          {phase !== "ready" && phase !== "unlocked" && (
            <button className="skip-sequence" onClick={() => { running.current = false; setPhase("unlocked"); setLiveMessage("ข้าม animation และเปิด memory timeline แล้ว"); }} type="button">
              ข้าม animation
            </button>
          )}
          <div className="phase-dots" aria-label={`ขั้นตอน ${Math.max(1, phaseIndex)} จาก 4`}>
            {[1, 2, 3, 4].map((item) => <span className={phaseIndex >= item ? "is-active" : ""} key={item} />)}
          </div>
        </section>

        {phase === "unlocked" && (
          <motion.div animate={{ opacity: 1, y: 0 }} className="memory-dashboard" initial={{ opacity: 0, y: 36 }}>
            <section className="profile-snapshot">
              <div className="profile-main">
                <span className="mini-label">YOUR SOUL / PUBLIC DEMO</span>
                <h2>{card.displayName}</h2>
                <p>{card.faculty} · {card.cohort}</p>
              </div>
              <div className="profile-stat"><Coins size={22} weight="duotone" /><strong>{card.points}</strong><span>SOUL points</span></div>
              <div className="profile-stat"><Trophy size={22} weight="duotone" /><strong>3 / 6</strong><span>Badges earned</span></div>
              <div className="profile-stat"><ClockCounterClockwise size={22} weight="duotone" /><strong>4</strong><span>Memories</span></div>
            </section>

            <section className="memory-feed" aria-labelledby="memory-feed-title">
              <div className="feed-heading">
                <div><span className="mini-label">MEMORY TIMELINE</span><h2 id="memory-feed-title">เรื่องราวที่เติบโตไปกับคุณ</h2></div>
                <button className="privacy-control" type="button"><LockKey size={16} /> Privacy: owner controlled</button>
              </div>
              <div className="feed-list">
                {memories.map((memory, index) => (
                  <motion.article
                    className={`feed-item ${memory.state === "locked" ? "is-locked" : ""}`}
                    initial={{ opacity: 0, x: -18 }}
                    key={memory.title}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <div className="feed-marker">{memory.state === "locked" ? <LockKey size={18} /> : <Sparkle size={18} weight="fill" />}</div>
                    <span className="feed-date">{memory.date}</span>
                    <div><span className="feed-type">{memory.type}</span><h3>{memory.title}</h3><p>{memory.copy}</p></div>
                    <button aria-label={`เปิด ${memory.title}`} disabled={memory.state === "locked"} type="button"><ArrowRight size={18} /></button>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="reward-panel">
              <div className="reward-art"><Gift size={38} weight="duotone" /><span>300 PTS</span></div>
              <div>
                <span className="mini-label">NEXT REWARD</span>
                <h2>Pink Memento Pin</h2>
                <p>ของที่ระลึก physical รุ่นทดลอง ใช้ 300 SOUL points</p>
              </div>
              <div className="reward-action">
                {redeemState === "success" ? (
                  <span className="redeem-success"><CheckCircle size={20} weight="fill" /> Redeemed in demo</span>
                ) : (
                  <button className="button button-primary" disabled={redeemState === "loading"} onClick={redeemReward} type="button">
                    {redeemState === "loading" ? "กำลังตรวจสอบ…" : "ทดลองแลกรางวัล"}
                  </button>
                )}
                {redeemState === "error" && <span className="form-error">ยังแลกไม่ได้ กรุณาลองอีกครั้ง</span>}
                <small>Prototype only · tap session ไม่ใช่หลักฐาน ownership</small>
              </div>
            </section>

            <section className="tap-security-note">
              <ShieldCheck size={24} weight="duotone" />
              <div><strong>Designed with honest security boundaries</strong><p>Signed link ช่วยป้องกันการเดา card ID แต่การ claim, ความทรงจำส่วนตัว และการแลกรางวัลจริงต้องยืนยันเจ้าของแยกต่างหาก</p></div>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
