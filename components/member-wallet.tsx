"use client";

import {
  ArrowRight,
  CalendarBlank,
  CardsThree,
  CheckCircle,
  Clock,
  Coins,
  Eye,
  Fingerprint,
  Gift,
  LockKey,
  MapPin,
  Plus,
  Radio,
  ShieldCheck,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  DemoSourceBadge,
  MemberPageHeader,
} from "./member-shell";
import {
  demoCards,
  demoMemories,
  demoProfile,
  type MemberCard,
  type MemberMemory,
  type MemberProfile,
  privacyLabels,
  useMemberResource,
} from "./member-data";

const toneStyles: Record<MemberCard["tone"], string> = {
  rose: "from-[#f6d6de] via-[#c98a9c] to-[#7f344f]",
  night: "from-[#182744] via-[#091323] to-[#020712]",
  cream: "from-[#fff9ee] via-[#ead7b9] to-[#aa8151]",
};

function WalletSkeleton() {
  return (
    <div aria-label="กำลังโหลด Wallet" className="animate-pulse space-y-6">
      <div className="h-36 rounded-[28px] bg-white" />
      <div className="grid gap-4 sm:grid-cols-3"><div className="h-32 rounded-[22px] bg-white" /><div className="h-32 rounded-[22px] bg-white" /><div className="h-32 rounded-[22px] bg-white" /></div>
      <div className="h-80 rounded-[28px] bg-white" />
    </div>
  );
}

export function MemberWallet() {
  const profile = useMemberResource<MemberProfile>("/api/member/me", demoProfile);
  const cards = useMemberResource<MemberCard[]>("/api/member/cards", demoCards);
  const memories = useMemberResource<MemberMemory[]>("/api/member/memories?limit=5", demoMemories.slice(0, 5));
  const loading = profile.loading || cards.loading || memories.loading;

  return (
    <div className="mx-auto w-full max-w-[1420px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
      <MemberPageHeader
        action={<DemoSourceBadge source={profile.source === "api" && cards.source === "api" ? "api" : "demo"} />}
        description="การ์ดทุกใบ เรื่องเล่าทุกช่วงเวลา และสิทธิ์ที่คุณปลดล็อก — อยู่ในพื้นที่ที่คุณควบคุมเอง"
        kicker="MY SOUL · MEMBER WALLET"
        title={`สวัสดี ${profile.data.firstName}, วันนี้อยากจำอะไรไว้?`}
      />

      {loading ? <div className="mt-7"><WalletSkeleton /></div> : (
        <>
          <section className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="ภาพรวม Wallet">
            <SummaryCard icon={CardsThree} label="การ์ดที่เป็นเจ้าของ" value={`${cards.data.length} ใบ`} detail="ยืนยันสิทธิ์ครบทุกใบ" tone="pink" />
            <SummaryCard icon={Coins} label="SOUL Points" value={profile.data.soulPoints.toLocaleString()} detail="+120 ใน 30 วันที่ผ่านมา" tone="gold" />
            <SummaryCard icon={Sparkle} label="ความทรงจำ" value={`${memories.data.length} เรื่อง`} detail={`${memories.data.filter((item) => item.privacy === "private").length} เรื่องเป็นส่วนตัว`} tone="cyan" />
          </section>

          <section className="mt-8" id="collection">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div><p className="m-0 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">OWNED COLLECTION</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[26px] font-semibold tracking-[-.045em]">การ์ดของฉัน</h2></div>
              <Link className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-[9px] font-bold transition hover:border-[var(--pink)] hover:text-[var(--pink-strong)]" href="/tap/soul_demo_7k3m9q2v"><Radio size={16} /> แตะการ์ดใบใหม่</Link>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {cards.data.length ? cards.data.map((card, index) => <OwnedCard card={card} index={index} key={card.id} />) : <EmptyCards />}
            </div>
          </section>

          <section className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
            <div className="rounded-[28px] border border-[var(--line)] bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><p className="m-0 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">RECENT STORIES</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[23px] font-semibold tracking-[-.04em]">ความทรงจำล่าสุด</h2></div>
                <Link className="flex min-h-10 items-center gap-1.5 text-[9px] font-bold text-[var(--pink-strong)]" href="/member/cards/founder-088">ดู Timeline <ArrowRight size={14} /></Link>
              </div>
              <div className="divide-y divide-[var(--line)]">
                {memories.data.slice(0, 4).map((memory) => <MemoryRow key={memory.id} memory={memory} />)}
              </div>
            </div>
            <aside className="overflow-hidden rounded-[28px] bg-[var(--navy)] p-6 text-white sm:p-7">
              <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-[var(--pink)]/15 text-[#ff71a8]"><Gift size={22} weight="fill" /></span><span className="rounded-full bg-white/[0.07] px-3 py-1 [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.1em] text-white/50">NEXT REWARD</span></div>
              <h2 className="mb-0 mt-10 [font-family:var(--font-display)] text-[27px] font-semibold tracking-[-.045em]">Rose Member</h2>
              <p className="mb-0 mt-2 text-[10px] leading-5 text-white/48">สะสมอีก 260 แต้ม เพื่อปลดล็อกสิทธิ์จองกิจกรรมก่อนใคร</p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: "82.6%" }} className="h-full rounded-full bg-gradient-to-r from-[var(--pink)] to-[#ff78aa]" initial={{ width: 0 }} transition={{ duration: 0.8, delay: 0.25 }} /></div>
              <div className="mt-2 flex justify-between [font-family:var(--font-mono)] text-[7px] text-white/45"><span>1,240</span><span>1,500 PTS</span></div>
              <Link className="mt-7 flex min-h-11 items-center justify-center gap-2 rounded-full bg-white text-[10px] font-bold text-[var(--navy)] transition hover:-translate-y-0.5" href="/member/rewards">ดูรางวัลทั้งหมด <ArrowRight size={15} /></Link>
              <div className="relative mt-7 border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-[8px] text-white/50"><ShieldCheck className="text-[#52d7a8]" size={15} /> คะแนนผูกกับบัญชี ไม่อยู่บน NFC</div></div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, detail, tone }: { icon: typeof CardsThree; label: string; value: string; detail: string; tone: "pink" | "gold" | "cyan" }) {
  const tones = { pink: "bg-[var(--blush)] text-[var(--pink)]", gold: "bg-[#f9f2e8] text-[#a77739]", cyan: "bg-[#eaf8fa] text-[#188ca0]" };
  return (
    <motion.article whileHover={{ y: -3 }} className="flex min-h-[126px] items-center gap-4 rounded-[22px] border border-[var(--line)] bg-white p-4 shadow-[0_8px_30px_rgba(83,41,58,.045)] sm:p-5">
      <span className={`grid size-11 shrink-0 place-items-center rounded-[15px] ${tones[tone]}`}><Icon size={21} weight="fill" /></span>
      <div className="min-w-0"><span className="block text-[8px] text-[var(--muted)]">{label}</span><strong className="mt-1 block [font-family:var(--font-display)] text-[23px] tracking-[-.04em]">{value}</strong><span className="mt-1 block truncate text-[7px] text-[#958a8f]">{detail}</span></div>
    </motion.article>
  );
}

function OwnedCard({ card, index }: { card: MemberCard; index: number }) {
  const progress = Math.min(100, Math.round((card.memories / card.memoryGoal) * 100));
  return (
    <motion.article animate={{ opacity: 1, y: 0 }} className="group grid overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-[0_14px_45px_rgba(83,41,58,.07)] sm:grid-cols-[210px_1fr]" initial={{ opacity: 0, y: 16 }} transition={{ delay: index * 0.08 }}>
      <div className={`relative min-h-[230px] overflow-hidden bg-gradient-to-br ${toneStyles[card.tone]} sm:min-h-[280px]`}>
        <Image alt={card.name} className={`object-cover transition duration-700 group-hover:scale-[1.035] ${card.tone === "night" ? "opacity-85" : ""}`} fill sizes="(max-width: 640px) 100vw, 210px" src={card.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/65 via-transparent to-white/10" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[var(--navy)]/55 px-2.5 py-1 [font-family:var(--font-mono)] text-[7px] font-bold uppercase tracking-[.1em] text-white backdrop-blur-md"><CheckCircle className="text-[#5bdfaf]" size={12} weight="fill" /> Verified</span>
        <div className="absolute bottom-4 left-4 text-white"><span className="block [font-family:var(--font-mono)] text-[7px] tracking-[.12em] text-white/60">SERIAL</span><strong className="mt-1 block [font-family:var(--font-display)] text-[18px]">{card.serial}</strong></div>
      </div>
      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <span className="[font-family:var(--font-mono)] text-[7px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">{card.series}</span>
        <h3 className="mb-0 mt-2 [font-family:var(--font-display)] text-[22px] font-semibold tracking-[-.045em]">{card.name}</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[var(--line)] py-4">
          <div><span className="block text-[7px] text-[var(--muted)]">ความทรงจำ</span><strong className="mt-1 block text-[11px]">{card.memories} เรื่อง</strong></div>
          <div><span className="block text-[7px] text-[var(--muted)]">แตะล่าสุด</span><strong className="mt-1 block text-[11px]">{card.lastTap}</strong></div>
        </div>
        <div className="mt-4"><div className="flex justify-between text-[7px] text-[var(--muted)]"><span>Memory journey</span><span>{card.memories}/{card.memoryGoal}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--cream)]"><div className="h-full rounded-full bg-[var(--pink)]" style={{ width: `${progress}%` }} /></div></div>
        <div className="mt-auto flex gap-2 pt-5">
          <Link className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-4 text-[9px] font-bold text-white transition hover:bg-[var(--pink)]" href={`/member/cards/${card.id}`}>เปิดการ์ด <ArrowRight size={14} /></Link>
          <Link aria-label={`เพิ่มความทรงจำให้ ${card.name}`} className="grid min-h-10 min-w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--pink)] transition hover:border-[var(--pink)]" href={`/member/cards/${card.id}/memories/new`}><Plus size={16} weight="bold" /></Link>
        </div>
      </div>
    </motion.article>
  );
}

function MemoryRow({ memory }: { memory: MemberMemory }) {
  const Icon = memory.privacy === "private" ? LockKey : memory.privacy === "circle" ? UsersThree : Eye;
  return (
    <Link className="grid min-h-[92px] grid-cols-[42px_1fr_auto] items-center gap-3 py-3 transition hover:translate-x-1" href={`/member/cards/${memory.cardId}/memories/${memory.id}/edit`}>
      <span className="grid size-10 place-items-center rounded-[14px] bg-[var(--blush)] text-[var(--pink)]">{memory.type === "milestone" ? <Sparkle size={18} weight="fill" /> : memory.type === "photo" ? <CalendarBlank size={18} /> : <Clock size={18} />}</span>
      <span className="min-w-0"><strong className="block truncate text-[10px]">{memory.title}</strong><span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[7px] text-[var(--muted)]"><span>{memory.displayDate}</span>{memory.location ? <span className="inline-flex items-center gap-1"><MapPin size={10} /> {memory.location}</span> : null}</span></span>
      <span className="flex items-center gap-1 rounded-full bg-[var(--cream)] px-2 py-1 text-[7px] text-[var(--muted)]"><Icon size={11} />{privacyLabels[memory.privacy].label}</span>
    </Link>
  );
}

function EmptyCards() {
  return (
    <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d9c8cf] bg-white p-8 text-center"><span className="grid size-14 place-items-center rounded-full bg-[var(--blush)] text-[var(--pink)]"><Fingerprint size={25} /></span><h3 className="mb-0 mt-5 [font-family:var(--font-display)] text-[20px]">Wallet นี้ยังไม่มีการ์ด</h3><p className="mb-0 mt-2 text-[9px] text-[var(--muted)]">แตะการ์ด SOUL หรือกรอกรหัสจากบรรจุภัณฑ์เพื่อเริ่มต้น</p><Link className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--pink)] px-5 text-[10px] font-bold text-white" href="/tap/soul_demo_7k3m9q2v"><Radio size={16} /> เริ่มแตะการ์ด</Link></div>
  );
}
