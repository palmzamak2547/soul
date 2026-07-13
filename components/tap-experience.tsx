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
import { memories } from "./tap-data";
import { BadgeCollectionModal, MemoryDetailModal } from "./tap-modals";

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
  primaryRewardId: string;
  imageUrl: string;
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
  primaryRewardId: "reward-pink-sky-wallpaper",
  imageUrl: "/assets/soul-card-hero.webp",
};

const sleep = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration));

function normalizeCard(payload: unknown, token: string): CardData {
  if (!payload || typeof payload !== "object") return { ...fallbackCard, token };
  const root =
    "data" in payload && payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : (payload as Record<string, unknown>);
  const data =
    root.card && typeof root.card === "object"
      ? (root.card as Record<string, unknown>)
      : root;
  const profile =
    data.profile && typeof data.profile === "object"
      ? (data.profile as Record<string, unknown>)
      : {};
  const edition =
    data.edition && typeof data.edition === "object"
      ? (data.edition as Record<string, unknown>)
      : {};
  const memory =
    data.memory && typeof data.memory === "object"
      ? (data.memory as Record<string, unknown>)
      : {};
  const rewards = Array.isArray(data.rewards) ? data.rewards : [];
  const firstReward =
    rewards[0] && typeof rewards[0] === "object"
      ? (rewards[0] as Record<string, unknown>)
      : null;

  const titleTh = typeof data.titleTh === "string" ? data.titleTh : null;
  const titleEn = typeof data.titleEn === "string" ? data.titleEn : null;
  const collection =
    typeof data.collection === "string" ? data.collection : null;
  const chapter = typeof data.chapter === "string" ? data.chapter : null;
  const editionLabel =
    typeof edition.label === "string"
      ? edition.label
      : typeof data.serial === "string"
        ? data.serial
        : null;
  const rarity = typeof data.rarity === "string" ? data.rarity : null;

  const visual =
    data.visual && typeof data.visual === "object"
      ? (data.visual as Record<string, unknown>)
      : {};

  return {
    token,
    publicId: String(data.id ?? data.slug ?? data.publicId ?? fallbackCard.publicId),
    displayName: String(
      titleEn ??
        profile.displayName ??
        data.displayName ??
        titleTh ??
        fallbackCard.displayName,
    ),
    faculty: String(
      collection ?? profile.faculty ?? data.faculty ?? fallbackCard.faculty,
    ),
    cohort: String(
      chapter ??
        memory.year ??
        profile.cohort ??
        data.cohort ??
        fallbackCard.cohort,
    ),
    serial: String(editionLabel ?? fallbackCard.serial),
    points: Number(
      data.points ?? profile.points ?? (rarity === "signature" ? 520 : 420),
    ),
    badgeName: String(
      firstReward?.titleEn ??
        firstReward?.titleTh ??
        data.badgeName ??
        (rarity ? `${rarity} keep` : fallbackCard.badgeName),
    ),
    primaryRewardId: String(
      firstReward?.id ?? fallbackCard.primaryRewardId,
    ),
    imageUrl: String(visual.imageUrl ?? fallbackCard.imageUrl),
  };
}

export function TapExperience({ token }: { token: string }) {
  const [apiState, setApiState] = useState<ApiState>("loading");
  const [card, setCard] = useState<CardData>({ ...fallbackCard, token });
  const [phase, setPhase] = useState<Phase>("ready");
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [isBadgeCollectionOpen, setIsBadgeCollectionOpen] = useState(false);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>([]);
  const [redeemState, setRedeemState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [liveMessage, setLiveMessage] = useState("พร้อมจำลองการแตะ NFC");
  const running = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const saved = localStorage.getItem("soul_demo_badges");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setSelectedBadgeIds(parsed);
      } catch {}
    } else {
      setSelectedBadgeIds(["badge_first_light", "badge_orientation", "badge_faculty_pride"]);
    }
  }, []);

  useEffect(() => {
    if (selectedBadgeIds.length > 0) {
      localStorage.setItem("soul_demo_badges", JSON.stringify(selectedBadgeIds));
    }
  }, [selectedBadgeIds]);

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
        body: JSON.stringify({
          cardToken: token,
          rewardId: card.primaryRewardId,
          idempotencyKey,
        }),
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
        {phase !== "unlocked" && (
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
                <button className="button button-primary tap-start-button" onClick={runSequence} type="button">
                  <Radio size={21} weight="bold" aria-hidden="true" /> จำลองการแตะ NFC <ArrowRight size={18} aria-hidden="true" />
                </button>
                <p className="demo-disclaimer">โหมดสาธิต · ยังไม่ได้อ่านชิป NFC จริงในเบราว์เซอร์</p>
                <p className="demo-card-chip">
                  การ์ด: <strong>{card.displayName}</strong>
                  <span aria-hidden="true"> · </span>
                  <span>{card.serial}</span>
                </p>
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
                <div className="identity-image"><Image alt={`${card.displayName} SOUL card`} fill priority sizes="360px" src={card.imageUrl} /></div>
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

          </AnimatePresence>

          {phase !== "ready" && (
            <button className="skip-sequence" onClick={() => { running.current = false; setPhase("unlocked"); setLiveMessage("ข้าม animation และเปิด memory timeline แล้ว"); }} type="button">
              ข้าม animation
            </button>
          )}
          <div className="phase-dots" aria-label={`ขั้นตอน ${Math.max(1, phaseIndex)} จาก 4`}>
            {[1, 2, 3, 4].map((item) => <span className={phaseIndex >= item ? "is-active" : ""} key={item} />)}
          </div>
        </section>
        )}

        {phase === "unlocked" && (
          <motion.div animate={{ opacity: 1, y: 0 }} className="memory-dashboard w-full" initial={{ opacity: 0, y: 20 }}>
            <ProfileHero card={card} selectedBadgeIds={selectedBadgeIds} />
            <MemoryTimeline memories={memories} onSelectMemory={setSelectedMemoryIndex} selectedBadgeIds={selectedBadgeIds} onOpenBadges={() => setIsBadgeCollectionOpen(true)} />
            <NextRewardCard card={card} onOpenBadges={() => setIsBadgeCollectionOpen(true)} selectedBadgeIds={selectedBadgeIds} onRedeem={redeemReward} />
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {selectedMemoryIndex !== null && (
          <MemoryDetailModal
            memory={memories[selectedMemoryIndex]}
            memoriesCount={memories.length}
            currentIndex={selectedMemoryIndex}
            onClose={() => setSelectedMemoryIndex(null)}
            onNext={() => setSelectedMemoryIndex(Math.min(memories.length - 1, selectedMemoryIndex + 1))}
            onPrev={() => setSelectedMemoryIndex(Math.max(0, selectedMemoryIndex - 1))}
            onOpenBadges={() => {
              setSelectedMemoryIndex(null);
              setIsBadgeCollectionOpen(true);
            }}
            selectedBadgeIds={selectedBadgeIds}
          />
        )}
        {isBadgeCollectionOpen && (
          <BadgeCollectionModal
            selectedBadgeIds={selectedBadgeIds}
            onToggleBadge={(id) => {
              setSelectedBadgeIds(prev => 
                prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
              );
            }}
            onClose={() => setIsBadgeCollectionOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REUSABLE CPO-LEVEL COMPONENTS ---

function ProfileHero({ card, selectedBadgeIds }: { card: CardData, selectedBadgeIds: string[] }) {
  return (
    <section className="bg-[var(--navy)] text-white pt-8 pb-10 px-6 relative overflow-hidden shadow-soft rounded-b-[40px]">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--pink)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        <div className="flex-1 text-center md:text-left mt-2 md:mt-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[var(--pink)] text-[11px] font-mono tracking-[0.18em] font-bold uppercase">First Light</p>
            <span className="bg-white/10 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/5 font-mono">
              <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full animate-pulse" />
              Memory Unlocked
            </span>
          </div>
          <h2 className="text-4xl md:text-[44px] font-display font-bold tracking-tight mb-2 leading-none text-white">{card.displayName}</h2>
          <p className="text-[var(--on-navy-muted)] font-body text-[16px] leading-relaxed max-w-md mx-auto md:mx-0">{card.faculty} · {card.cohort}</p>
        </div>
        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl mx-auto md:mx-0">
           <Image src={card.imageUrl} alt={card.displayName} fill className="object-cover" />
        </div>
      </div>
      <JourneyStats card={card} selectedBadgeIds={selectedBadgeIds} />
    </section>
  );
}

function JourneyStats({ card, selectedBadgeIds }: { card: CardData, selectedBadgeIds: string[] }) {
  return (
    <div className="max-w-3xl mx-auto mt-10 grid grid-cols-3 gap-4 md:gap-8 border-t border-white/10 pt-8 relative z-10">
      <div className="flex flex-col items-center md:items-start">
        <span className="flex items-center gap-1.5 text-[var(--on-navy-muted)] text-[12px] font-bold mb-1.5 tracking-wide"><Coins size={15} /> SOUL Balance</span>
        <strong className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">{card.points}</strong>
      </div>
      <div className="flex flex-col items-center md:items-start border-l border-white/10 pl-4 md:pl-8">
        <span className="flex items-center gap-1.5 text-[var(--on-navy-muted)] text-[12px] font-bold mb-1.5 tracking-wide"><Trophy size={15} /> Badges</span>
        <strong className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">{selectedBadgeIds.length}<span className="text-white/30 text-lg ml-1">/ 6</span></strong>
      </div>
      <div className="flex flex-col items-center md:items-start border-l border-white/10 pl-4 md:pl-8">
        <span className="flex items-center gap-1.5 text-[var(--on-navy-muted)] text-[12px] font-bold mb-1.5 tracking-wide"><Sparkle size={15} /> Memories</span>
        <strong className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">4</strong>
      </div>
    </div>
  );
}

function TimelineItem({ memory, isLast, onClick }: { memory: any, isLast: boolean, onClick: () => void }) {
  const isLocked = memory.state === "locked";
  return (
    <div className="relative pl-10 md:pl-14 pb-12 group">
      {!isLast && <div className="absolute top-10 bottom-[-10px] left-[15px] md:left-[19px] w-[2px] bg-[var(--line)]/60" />}
      
      <div className={`absolute left-0 md:left-1 top-2 w-8 h-8 md:w-10 md:h-10 rounded-full border-[2.5px] flex items-center justify-center bg-[var(--paper)] z-10 transition-colors
        ${isLocked ? 'border-[var(--line)] text-[var(--muted-soft)]' : 'border-[var(--pink)] bg-[var(--blush)] text-[var(--pink)]'}`}>
        {isLocked ? <LockKey size={16} weight="bold" /> : <Sparkle size={16} weight="fill" />}
      </div>

      <motion.article 
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        onKeyDown={(e: any) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className={`glass-panel p-6 md:p-7 transition-all duration-300 relative overflow-hidden group-focus-within:ring-2 ring-[var(--pink)]/40 rounded-2xl cursor-pointer
          ${isLocked ? 'opacity-70 border-dashed hover:shadow-card hover:bg-white/50' : 'hover:bg-[#fdf2f6] hover:shadow-card hover:border-[var(--pink)]/20'}
        `}
        tabIndex={0}
        role="button"
        aria-label={`เปิดรายละเอียด ${memory.title}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-[11px] font-mono font-bold tracking-[0.12em] uppercase mb-1.5 block ${isLocked ? 'text-[var(--muted-soft)]' : 'text-[var(--pink-strong)]'}`}>
              {memory.type} · {memory.date}
            </span>
            <h3 className={`font-display text-[22px] md:text-2xl font-bold tracking-tight leading-snug ${isLocked ? 'text-[var(--muted)]' : 'text-[var(--ink)]'}`}>
              {memory.title}
            </h3>
          </div>
          {!isLocked ? (
            <div className="rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--pink-strong)] group-hover:bg-[var(--pink)] group-hover:text-white transition-all duration-300 shrink-0 shadow-sm px-3 py-1.5 h-9">
              <span className="text-xs font-bold font-body opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap mr-0 group-hover:mr-2">
                {memory.type === "Badge" ? "ดูเหรียญรางวัล" : memory.type === "Story" ? "อ่านเรื่องราว" : "เปิดความทรงจำ"}
              </span>
              <ArrowRight size={17} weight="bold" />
            </div>
          ) : (
            <div className="rounded-full bg-[var(--cream)] flex items-center justify-center text-[var(--muted)] transition-all duration-300 shrink-0 shadow-sm w-9 h-9">
              <LockKey size={17} weight="bold" />
            </div>
          )}
        </div>
        
        <p className={`font-body text-[15px] md:text-[16px] leading-relaxed max-w-lg mt-1 ${isLocked ? 'text-[var(--muted-soft)]' : 'text-[var(--muted)]'}`}>
          {isLocked ? "คลิกเพื่อดูเงื่อนไขการปลดล็อก" : memory.copy}
        </p>
      </motion.article>
    </div>
  );
}

function MemoryTimeline({ memories, onSelectMemory, selectedBadgeIds, onOpenBadges }: { memories: any[], onSelectMemory: (i: number) => void, selectedBadgeIds: string[], onOpenBadges: () => void }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-14 text-center md:text-left">
        <p className="text-[var(--pink)] text-[11px] font-mono font-bold tracking-[0.15em] uppercase mb-3">เส้นทางความทรงจำ</p>
        <h2 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight">เรื่องราวที่เติบโตไปกับคุณ</h2>
        <p className="text-[var(--muted-soft)] font-body text-[17px] mt-3">ทุกช่วงเวลาคือส่วนหนึ่งของบทต่อไป</p>
      </div>
      
      <div className="relative mt-8">
        {memories.map((mem, i) => (
          <TimelineItem key={mem.title} memory={mem} isLast={i === memories.length - 1} onClick={() => onSelectMemory(i)} />
        ))}
      </div>
    </section>
  );
}

function NextRewardCard({ card, onOpenBadges, selectedBadgeIds, onRedeem }: { card: CardData, onOpenBadges: () => void, selectedBadgeIds: string[], onRedeem: () => void }) {
  const badgeCount = selectedBadgeIds.length;
  const isUnlocked = badgeCount >= 6;
  const needed = Math.max(0, 6 - badgeCount);

  return (
    <section className="max-w-3xl mx-auto px-6 pb-28">
      <div className="glass-panel p-7 md:p-10 rounded-3xl relative overflow-hidden flex flex-col md:flex-row gap-8 md:items-center border border-[var(--border-subtle)] shadow-soft">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--pink)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[var(--pink-strong)] to-[var(--pink)] flex items-center justify-center text-white shrink-0 shadow-xl shadow-[var(--pink)]/20">
          <Gift size={36} weight="duotone" />
        </div>
        
        <div className="flex-1 relative z-10">
          <span className="text-[var(--pink-strong)] text-[11px] font-mono tracking-[0.15em] uppercase font-bold block mb-2">Pink Sky Digital Keepsake</span>
          <h3 className="font-display text-[26px] md:text-3xl font-bold text-[var(--ink)] mb-3 tracking-tight">{card.badgeName}</h3>
          <p className="font-body text-[var(--muted)] text-[16px] max-w-md leading-relaxed">
            {isUnlocked ? "คุณสามารถนำสิทธิ์นี้ไปสร้างของที่ระลึกดิจิทัล Pink Sky ได้แล้ว" : `เหลืออีก ${needed} เหรียญเพื่อปลดล็อกสิทธิ์สร้างของที่ระลึกดิจิทัล`}
          </p>
        </div>
        
        <div className="shrink-0 relative z-10 flex flex-col items-center md:items-end gap-3 mt-4 md:mt-0">
          {isUnlocked ? (
            <>
              <span className="inline-flex items-center gap-2 text-[var(--success)] font-bold font-body bg-[var(--success)]/10 px-5 py-3 rounded-full text-[15px]">
                <CheckCircle size={22} weight="fill" /> ปลดล็อกสิทธิ์สร้างของที่ระลึกแล้ว
              </span>
              <button 
                className="bg-[var(--ink)] hover:bg-[var(--pink)] text-white font-body font-bold py-3.5 px-7 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 mt-2 text-[15px]"
                onClick={onRedeem}
              >
                สร้างของที่ระลึก
              </button>
            </>
          ) : (
            <>
              <span className="font-display font-bold text-2xl text-[var(--pink-strong)] mb-1">{badgeCount} <span className="text-lg text-[var(--muted-soft)]">/ 6</span></span>
              <button 
                className="bg-[var(--ink)] hover:bg-[var(--pink)] text-white font-body font-bold py-3.5 px-7 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 text-[15px]"
                onClick={onOpenBadges}
              >
                ดูเหรียญที่ต้องสะสม
              </button>
            </>
          )}
          <small className="text-[12px] text-[var(--muted-soft)] block text-center md:text-right w-full mt-1 font-mono tracking-wide">โหมดสาธิตเท่านั้น</small>
        </div>
      </div>
    </section>
  );
}
