"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  CheckCircle,
  ClockCounterClockwise,
  Copy,
  DotsThree,
  Eye,
  Fingerprint,
  LockKey,
  MapPin,
  PencilSimple,
  Plus,
  Radio,
  ShareNetwork,
  ShieldCheck,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  cardById,
  demoMemories,
  type MemberCard,
  type MemberMemory,
  privacyLabels,
  useMemberResource,
} from "./member-data";
import { DemoSourceBadge } from "./member-shell";

type MemoryFilter = "all" | "private" | "circle" | "public";

export function MemberCardDetail() {
  const params = useParams<{ cardId: string }>();
  const cardId = params.cardId ?? "founder-088";
  const fallbackCard = useMemo(() => cardById(cardId), [cardId]);
  const fallbackMemories = useMemo(() => demoMemories.filter((memory) => memory.cardId === fallbackCard.id), [fallbackCard.id]);
  const card = useMemberResource<MemberCard>(`/api/member/cards/${cardId}`, fallbackCard);
  const memories = useMemberResource<MemberMemory[]>(`/api/member/cards/${cardId}/memories`, fallbackMemories);
  const [filter, setFilter] = useState<MemoryFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const filtered = filter === "all" ? memories.data : memories.data.filter((memory) => memory.privacy === filter);

  async function copySerial() {
    await navigator.clipboard?.writeText(card.data.serial);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--navy)] px-4 pb-11 pt-6 text-white sm:px-7 sm:pb-14 lg:px-10 lg:pb-16">
        <div className="pointer-events-none absolute -right-36 -top-48 size-[540px] rounded-full bg-[var(--pink)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-[25%] size-[420px] rounded-full bg-[var(--cyan)]/[.07] blur-3xl" />
        <div className="relative mx-auto max-w-[1420px]">
          <div className="flex items-center justify-between gap-3">
            <Link className="inline-flex min-h-11 items-center gap-2 text-[9px] font-semibold text-white/55 transition hover:text-white" href="/member/wallet"><ArrowLeft size={16} /> กลับ Wallet</Link>
            <div className="flex items-center gap-2"><DemoSourceBadge source={card.source === "api" ? "api" : "demo"} /><div className="relative"><button aria-expanded={menuOpen} aria-label="เมนูการ์ด" className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[0.05]" onClick={() => setMenuOpen((value) => !value)} type="button"><DotsThree size={21} weight="bold" /></button><AnimatePresence>{menuOpen ? <motion.div animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-12 z-10 w-52 rounded-[18px] border border-white/10 bg-[#101b30] p-2 shadow-2xl" exit={{ opacity: 0, y: -6 }} initial={{ opacity: 0, y: -6 }}><button className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-[9px] text-white/70 hover:bg-white/[.06]" onClick={() => void copySerial()} type="button"><Copy size={15} /> {copied ? "คัดลอกแล้ว" : "คัดลอกหมายเลข"}</button><button className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-[9px] text-white/70 hover:bg-white/[.06]" type="button"><ShareNetwork size={15} /> แชร์หน้าคอลเลกชัน</button></motion.div> : null}</AnimatePresence></div></div>
          </div>

          {card.loading ? <div className="mt-10 h-[460px] animate-pulse rounded-[30px] bg-white/[.06]" /> : (
            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(300px,.72fr)_minmax(450px,1.28fr)] lg:gap-[clamp(60px,8vw,120px)]">
              <motion.div animate={{ opacity: 1, rotateY: 0, y: 0 }} className="relative mx-auto aspect-[.76] w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/15 bg-[#b7788b] shadow-[0_45px_110px_rgba(0,0,0,.42)]" initial={{ opacity: 0, rotateY: -12, y: 22 }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>
                <Image alt={card.data.name} className={`object-cover ${card.data.tone === "night" ? "opacity-85" : ""}`} fill priority sizes="(max-width: 1024px) 80vw, 390px" src={card.data.image} />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--navy)]/35 via-transparent to-white/20" />
                <motion.div animate={{ x: ["-160%", "180%"] }} className="absolute inset-y-0 w-[32%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" transition={{ duration: 1.5, delay: .8 }} />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white"><div><span className="[font-family:var(--font-mono)] text-[7px] tracking-[.14em] text-white/60">{card.data.series}</span><strong className="mt-1 block [font-family:var(--font-display)] text-[19px]">{card.data.serial}</strong></div><Fingerprint size={26} /></div>
              </motion.div>

              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-[#54d5a5]/25 bg-[#54d5a5]/10 px-3 py-1.5 [font-family:var(--font-mono)] text-[7px] font-bold uppercase tracking-[.12em] text-[#5ee3b2]"><CheckCircle size={12} weight="fill" /> Ownership verified</span><span className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.1em] text-white/48">{card.data.series}</span></div>
                <h1 className="mb-0 mt-6 [font-family:var(--font-display)] text-[clamp(42px,5.6vw,76px)] font-semibold leading-[.98] tracking-[-.065em]">{card.data.name}</h1>
                <p className="mb-0 mt-5 max-w-[620px] text-[12px] leading-7 text-white/52">การ์ดสะสมที่เชื่อมช่วงเวลาสำคัญเข้ากับตัวตนดิจิทัลของคุณ ทุกเรื่องเริ่มต้นแบบส่วนตัว และเปิดเผยเมื่อคุณเลือกเท่านั้น</p>
                <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-[22px] border border-white/10 bg-white/[.045] sm:grid-cols-4">
                  <HeroStat label="หมายเลข" value={card.data.serial} />
                  <HeroStat label="เป็นเจ้าของตั้งแต่" value={card.data.ownedSince} />
                  <HeroStat label="ความทรงจำ" value={`${card.data.memories} เรื่อง`} />
                  <HeroStat label="SOUL Points" value={card.data.points.toLocaleString()} />
                </div>
                <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                  <Link className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[11px] font-bold text-white shadow-[0_12px_30px_rgba(233,30,99,.25)] transition hover:-translate-y-0.5" href={`/member/cards/${cardId}/memories/new`}><Plus size={17} weight="bold" /> เพิ่มความทรงจำ</Link>
                  <Link className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[.055] px-6 text-[10px] font-semibold text-white/75 transition hover:bg-white/[.1] hover:text-white" href={`/member/cards/${cardId}/transfer`}><ShareNetwork size={17} /> โอนการ์ด</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1420px] gap-6 px-4 py-8 sm:px-7 sm:py-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-10 lg:py-12">
        <section className="min-w-0 rounded-[28px] border border-[var(--line)] bg-white p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="m-0 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.15em] text-[var(--pink-strong)]">MEMORY TIMELINE</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[27px] font-semibold tracking-[-.045em]">เรื่องราวของการ์ดใบนี้</h2><p className="mb-0 mt-2 text-[9px] text-[var(--muted)]">{memories.data.length} ช่วงเวลา · เรียงจากใหม่ไปเก่า</p></div>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[var(--line)] bg-[var(--cream)] p-1" role="group" aria-label="กรองความทรงจำ">
              {(["all", "private", "circle", "public"] as const).map((value) => <button aria-pressed={filter === value} className={`min-h-9 shrink-0 rounded-full px-3 text-[8px] font-semibold transition ${filter === value ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} key={value} onClick={() => setFilter(value)} type="button">{value === "all" ? "ทั้งหมด" : privacyLabels[value].label}</button>)}
            </div>
          </div>

          {memories.loading ? <div className="mt-6 space-y-3"><div className="h-28 animate-pulse rounded-[20px] bg-[var(--cream)]" /><div className="h-28 animate-pulse rounded-[20px] bg-[var(--cream)]" /></div> : filtered.length ? (
            <div className="relative mt-4 before:absolute before:bottom-12 before:left-[18px] before:top-12 before:w-px before:bg-gradient-to-b before:from-[var(--pink)] before:via-[#e7c2cf] before:to-transparent sm:before:left-[26px]">
              {filtered.slice().reverse().map((memory, index) => <TimelineMemory key={memory.id} memory={memory} index={index} />)}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center"><span className="grid size-14 place-items-center rounded-full bg-[var(--blush)] text-[var(--pink)]"><ClockCounterClockwise size={25} /></span><h3 className="mb-0 mt-4 [font-family:var(--font-display)] text-[18px]">ยังไม่มีเรื่องในหมวดนี้</h3><p className="mb-0 mt-2 text-[9px] text-[var(--muted)]">ลองเปลี่ยนตัวกรอง หรือสร้างความทรงจำใหม่</p></div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-[#cdeade] bg-[#f2fbf7] p-5">
            <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-[#dff5eb] text-[#138a64]"><ShieldCheck size={22} weight="fill" /></span><span className="[font-family:var(--font-mono)] text-[7px] font-bold uppercase tracking-[.1em] text-[#138a64]">VERIFIED</span></div>
            <h3 className="mb-0 mt-5 [font-family:var(--font-display)] text-[18px] font-semibold tracking-[-.035em]">สิทธิ์การถือครองได้รับการยืนยัน</h3>
            <p className="mb-0 mt-2 text-[9px] leading-5 text-[#537067]">บัญชีนี้เป็นผู้ควบคุม Digital Twin ปัจจุบัน การแตะ NFC เพียงอย่างเดียวไม่เปิดข้อมูลส่วนตัว</p>
            <dl className="mt-5 space-y-3 border-t border-[#cdeade] pt-4 text-[8px]"><div className="flex justify-between gap-3"><dt className="text-[#6c847c]">Ownership ID</dt><dd className="m-0 font-mono font-bold">OWN-88A4…9C2</dd></div><div className="flex justify-between gap-3"><dt className="text-[#6c847c]">Claim method</dt><dd className="m-0 font-semibold">Secure claim</dd></div><div className="flex justify-between gap-3"><dt className="text-[#6c847c]">Last verified</dt><dd className="m-0 font-semibold">วันนี้ 10:42</dd></div></dl>
          </div>

          <div className="rounded-[24px] border border-[var(--line)] bg-white p-5">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--blush)] text-[var(--pink)]"><LockKey size={19} /></span><div><h3 className="m-0 text-[11px]">Privacy snapshot</h3><p className="mb-0 mt-1 text-[7px] text-[var(--muted)]">ควบคุมได้ทีละความทรงจำ</p></div></div>
            <div className="mt-5 space-y-3">{(["private", "circle", "public"] as const).map((value) => { const Icon = value === "private" ? LockKey : value === "circle" ? UsersThree : Eye; return <div className="flex items-center gap-2" key={value}><Icon className="text-[var(--pink-strong)]" size={14} /><span className="flex-1 text-[8px] text-[var(--muted)]">{privacyLabels[value].label}</span><strong className="text-[9px]">{memories.data.filter((memory) => memory.privacy === value).length}</strong></div>; })}</div>
            <Link className="mt-5 flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] text-[9px] font-semibold transition hover:border-[var(--pink)] hover:text-[var(--pink-strong)]" href="/member/settings#privacy">จัดการความเป็นส่วนตัว <ArrowRight size={14} /></Link>
          </div>

          <div className="rounded-[24px] bg-[var(--blush)] p-5"><Radio className="text-[var(--pink)]" size={22} /><h3 className="mb-0 mt-4 [font-family:var(--font-display)] text-[17px] font-semibold tracking-[-.035em]">แตะอีกครั้งเมื่อกลับมาที่มหาวิทยาลัย</h3><p className="mb-0 mt-2 text-[8px] leading-5 text-[var(--muted)]">บางเรื่องราวและสิทธิ์จะปลดล็อกตามสถานที่และกิจกรรม</p></div>
        </aside>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-r border-white/10 p-4 last:border-r-0 sm:border-b-0 sm:p-5"><span className="block text-[7px] text-white/40">{label}</span><strong className="mt-1.5 block text-[10px] text-white/90">{value}</strong></div>;
}

function TimelineMemory({ memory, index }: { memory: MemberMemory; index: number }) {
  const PrivacyIcon = memory.privacy === "private" ? LockKey : memory.privacy === "circle" ? UsersThree : Eye;
  return (
    <motion.article animate={{ opacity: 1, x: 0 }} className="group relative grid grid-cols-[38px_1fr] gap-4 py-4 sm:grid-cols-[52px_1fr] sm:gap-5" initial={{ opacity: 0, x: -8 }} transition={{ delay: index * .06 }}>
      <span className="relative z-[1] grid size-[38px] place-items-center rounded-full border border-[#efb5c9] bg-white text-[var(--pink)] shadow-[0_5px_20px_rgba(233,30,99,.1)] sm:size-[52px]">{memory.type === "milestone" ? <Sparkle size={18} weight="fill" /> : <CalendarBlank size={18} />}</span>
      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4 transition group-hover:border-[#e3bdca] group-hover:bg-white sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><span className="[font-family:var(--font-mono)] text-[7px] uppercase tracking-[.1em] text-[var(--pink-strong)]">{memory.displayDate}</span><h3 className="mb-0 mt-1.5 [font-family:var(--font-display)] text-[16px] font-semibold tracking-[-.03em]">{memory.title}</h3></div><span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[7px] text-[var(--muted)]"><PrivacyIcon size={11} /> {privacyLabels[memory.privacy].label}</span></div>
        <p className="mb-0 mt-3 text-[9px] leading-5 text-[var(--muted)]">{memory.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-3 text-[7px] text-[#8f8389]">{memory.location ? <span className="inline-flex items-center gap-1"><MapPin size={11} /> {memory.location}</span> : null}<Link className="ml-auto inline-flex min-h-8 items-center gap-1 font-bold text-[var(--pink-strong)]" href={`/member/cards/${memory.cardId}/memories/${memory.id}/edit`}><PencilSimple size={12} /> แก้ไข</Link></div>
      </div>
    </motion.article>
  );
}
