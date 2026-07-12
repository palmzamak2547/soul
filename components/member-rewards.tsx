"use client";

import {
  ArrowRight,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Coins,
  DownloadSimple,
  Gift,
  LockKey,
  MapPin,
  Medal,
  Sparkle,
  Ticket,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  demoProfile,
  demoRedemptions,
  demoRewards,
  memberMutation,
  type Redemption,
  type Reward,
  useMemberResource,
} from "./member-data";
import { DemoSourceBadge, MemberPageHeader } from "./member-shell";

type RewardWallet = { balance: number; tier: string; rewards: Reward[]; redemptions: Redemption[] };
const demoRewardWallet: RewardWallet = { balance: demoProfile.soulPoints, tier: "Pink Member", rewards: demoRewards, redemptions: demoRedemptions };

export function MemberRewards() {
  const wallet = useMemberResource<RewardWallet>("/api/member/rewards", demoRewardWallet);
  const [tab, setTab] = useState<"rewards" | "history">("rewards");
  const [selected, setSelected] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [receipt, setReceipt] = useState<{ reward: Reward; code: string; balance: number } | null>(null);
  const [category, setCategory] = useState<"all" | Reward["category"]>("all");
  const filtered = useMemo(() => category === "all" ? wallet.data.rewards : wallet.data.rewards.filter((reward) => reward.category === category), [category, wallet.data.rewards]);

  async function redeem(reward: Reward) {
    setRedeeming(true);
    const idempotencyKey = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `demo-${Date.now()}`;
    const result = await memberMutation(
      "/api/member/rewards/redeem",
      { rewardId: reward.id, idempotencyKey },
      { ok: true, redemptionId: `redemption_${Date.now()}`, code: `SOUL-${reward.id.slice(-3).toUpperCase()}-8842`, balance: Math.max(0, wallet.data.balance - reward.points), demo: true },
    );
    setRedeeming(false);
    setSelected(null);
    setReceipt({ reward, code: result.data.code, balance: result.data.balance });
  }

  return (
    <div className="mx-auto w-full max-w-[1420px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
      <MemberPageHeader action={<DemoSourceBadge source={wallet.source} />} description="ทุกการแตะ การสร้างความทรงจำ และการร่วมกิจกรรม ช่วยปลดล็อกสิทธิ์ที่มีความหมายกับคุณ" kicker="SOUL REWARDS" title="แต้มที่พาคุณกลับไปพบเรื่องราว" />

      <section className="relative mt-7 overflow-hidden rounded-[30px] bg-[var(--navy)] p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-36 size-[390px] rounded-full bg-[var(--pink)]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[30%] size-[360px] rounded-full bg-[var(--cyan)]/10 blur-3xl" />
        <div className="relative grid gap-9 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.12em] text-white/55"><Medal className="text-[#ff71a8]" size={13} /> {wallet.data.tier}</span>
            <p className="mb-2 mt-7 text-[9px] text-white/45">ยอดคงเหลือ</p>
            <div className="flex items-baseline gap-3"><strong className="[font-family:var(--font-display)] text-[clamp(48px,7vw,82px)] leading-none tracking-[-.07em]">{wallet.loading ? "—" : wallet.data.balance.toLocaleString()}</strong><span className="[font-family:var(--font-mono)] text-[9px] uppercase tracking-[.14em] text-[#ff71a8]">SOUL POINTS</span></div>
            <p className="mb-0 mt-5 max-w-[560px] text-[10px] leading-5 text-white/48">คะแนนไม่มีมูลค่าเป็นเงินสดและโอนไม่ได้ คุณจะเห็นรายละเอียดการใช้แต้มก่อนยืนยันทุกครั้ง</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[8px]"><span className="text-white/50">เส้นทางสู่ Rose Member</span><strong>1,240 / 1,500</strong></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: "82.6%" }} className="h-full rounded-full bg-gradient-to-r from-[var(--pink)] to-[#ff75a9]" initial={{ width: 0 }} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-[16px] bg-white/[.05] p-3"><Coins className="text-[#ff71a8]" size={18} /><strong className="mt-3 block text-[12px]">+120</strong><span className="mt-1 block text-[7px] text-white/40">เดือนนี้</span></div><div className="rounded-[16px] bg-white/[.05] p-3"><Gift className="text-[#50d9eb]" size={18} /><strong className="mt-3 block text-[12px]">3</strong><span className="mt-1 block text-[7px] text-white/40">รางวัลที่ใช้ได้</span></div></div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-full border border-[var(--line)] bg-white p-1" role="tablist" aria-label="รางวัลและประวัติ"><button aria-selected={tab === "rewards"} className={`min-h-10 rounded-full px-4 text-[9px] font-bold ${tab === "rewards" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`} onClick={() => setTab("rewards")} role="tab" type="button">รางวัลที่แลกได้</button><button aria-selected={tab === "history"} className={`min-h-10 rounded-full px-4 text-[9px] font-bold ${tab === "history" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`} onClick={() => setTab("history")} role="tab" type="button">ประวัติการใช้แต้ม</button></div>
        {tab === "rewards" ? <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-[var(--cream)] p-1">{(["all", "physical", "digital", "experience"] as const).map((value) => <button aria-pressed={category === value} className={`min-h-9 shrink-0 rounded-full px-3 text-[8px] font-semibold ${category === value ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} key={value} onClick={() => setCategory(value)} type="button">{value === "all" ? "ทั้งหมด" : value === "physical" ? "ของสะสม" : value === "digital" ? "ดิจิทัล" : "ประสบการณ์"}</button>)}</div> : null}
      </div>

      {tab === "rewards" ? (
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="รางวัลที่แลกได้">
          {wallet.loading ? [0, 1, 2].map((item) => <div className="h-[320px] animate-pulse rounded-[26px] bg-white" key={item} />) : filtered.map((reward, index) => <RewardCard balance={wallet.data.balance} index={index} key={reward.id} onRedeem={() => setSelected(reward)} reward={reward} />)}
        </section>
      ) : (
        <section className="mt-5 overflow-hidden rounded-[28px] border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] p-5 sm:p-7"><p className="m-0 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">REDEMPTION HISTORY</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[24px] tracking-[-.04em]">สิทธิ์และรายการที่ผ่านมา</h2></div>
          <div className="divide-y divide-[var(--line)]">{wallet.data.redemptions.length ? wallet.data.redemptions.map((item) => <RedemptionRow item={item} key={item.id} />) : <div className="p-12 text-center text-[10px] text-[var(--muted)]">ยังไม่มีประวัติการแลกรางวัล</div>}</div>
        </section>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-[var(--line)] bg-white p-4 sm:p-5"><LockKey className="mt-0.5 shrink-0 text-[var(--pink)]" size={19} /><div><strong className="block text-[9px]">การแลกรางวัลปลอดภัยและใช้ซ้ำไม่ได้</strong><p className="mb-0 mt-1 text-[8px] leading-4 text-[var(--muted)]">ทุกคำขอมี idempotency key และบันทึกเวลา การคืนแต้มจะเกิดเมื่อคำขอล้มเหลวเท่านั้น</p></div></div>

      <AnimatePresence>
        {selected ? (
          <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[var(--navy)]/60 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="redeem-title">
            <motion.div animate={{ scale: 1, y: 0 }} className="my-auto w-full max-w-[500px] rounded-[28px] bg-white p-6 shadow-2xl sm:p-8" initial={{ scale: .96, y: 12 }}>
              <div className="flex items-start justify-between"><span className="grid size-14 place-items-center rounded-[18px] text-white" style={{ background: selected.accent }}><Gift size={26} weight="fill" /></span><button aria-label="ปิด" className="grid size-10 place-items-center rounded-full border border-[var(--line)]" onClick={() => setSelected(null)} type="button"><X size={17} /></button></div>
              <p className="mb-2 mt-6 [font-family:var(--font-mono)] text-[8px] uppercase tracking-[.13em] text-[var(--pink-strong)]">CONFIRM REDEMPTION</p><h2 className="m-0 [font-family:var(--font-display)] text-[27px] tracking-[-.045em]" id="redeem-title">{selected.name}</h2><p className="mb-0 mt-3 text-[10px] leading-5 text-[var(--muted)]">{selected.description}</p>
              <dl className="mt-6 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper)] text-[9px]"><div className="flex justify-between border-b border-[var(--line)] p-4"><dt className="text-[var(--muted)]">ยอดปัจจุบัน</dt><dd className="m-0 font-bold">{wallet.data.balance.toLocaleString()} แต้ม</dd></div><div className="flex justify-between border-b border-[var(--line)] p-4"><dt className="text-[var(--muted)]">ใช้สำหรับรายการนี้</dt><dd className="m-0 font-bold text-[var(--pink-strong)]">−{selected.points.toLocaleString()} แต้ม</dd></div><div className="flex justify-between p-4"><dt className="text-[var(--muted)]">คงเหลือ</dt><dd className="m-0 font-bold">{Math.max(0, wallet.data.balance - selected.points).toLocaleString()} แต้ม</dd></div></dl>
              <button className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[11px] font-bold text-white disabled:bg-[#aaa]" disabled={redeeming || wallet.data.balance < selected.points} onClick={() => void redeem(selected)} type="button">{redeeming ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Check size={17} weight="bold" />}{wallet.data.balance < selected.points ? "แต้มไม่เพียงพอ" : redeeming ? "กำลังยืนยัน…" : `ยืนยันใช้ ${selected.points} แต้ม`}</button>
            </motion.div>
          </motion.div>
        ) : null}
        {receipt ? (
          <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[var(--navy)]/60 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="receipt-title">
            <motion.div animate={{ scale: 1 }} className="my-auto w-full max-w-[480px] rounded-[28px] bg-white p-7 text-center shadow-2xl sm:p-9" initial={{ scale: .96 }}><span className="mx-auto grid size-[74px] place-items-center rounded-full bg-[#eaf9f3] text-[#138a64]"><CheckCircle size={33} weight="fill" /></span><p className="mb-2 mt-6 [font-family:var(--font-mono)] text-[8px] uppercase tracking-[.13em] text-[#138a64]">REWARD READY</p><h2 className="m-0 [font-family:var(--font-display)] text-[28px] tracking-[-.045em]" id="receipt-title">แลก {receipt.reward.name} สำเร็จ</h2><p className="mb-0 mt-3 text-[9px] leading-5 text-[var(--muted)]">แสดงรหัสนี้ต่อเจ้าหน้าที่ หรือเปิดจากประวัติการใช้แต้มภายหลัง</p><div className="mt-6 rounded-[20px] border border-dashed border-[#d6b8c4] bg-[var(--paper)] p-5"><span className="block [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.12em] text-[var(--muted)]">REDEMPTION CODE</span><strong className="mt-2 block [font-family:var(--font-mono)] text-[20px] tracking-[.08em] text-[var(--pink-strong)]">{receipt.code}</strong></div><button className="mt-6 min-h-[50px] w-full rounded-full bg-[var(--ink)] text-[10px] font-bold text-white" onClick={() => { setReceipt(null); setTab("history"); }} type="button">ดูในประวัติ</button></motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function RewardCard({ reward, balance, onRedeem, index }: { reward: Reward; balance: number; onRedeem: () => void; index: number }) {
  const Icon = reward.category === "physical" ? Gift : reward.category === "digital" ? DownloadSimple : Ticket;
  const available = balance >= reward.points;
  return <motion.article animate={{ opacity: 1, y: 0 }} className="group flex min-h-[330px] flex-col overflow-hidden rounded-[26px] border border-[var(--line)] bg-white p-6 shadow-[0_10px_35px_rgba(83,41,58,.05)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]" initial={{ opacity: 0, y: 12 }} transition={{ delay: index * .07 }}><div className="flex items-start justify-between"><span className="grid size-13 place-items-center rounded-[17px] text-white" style={{ background: reward.accent }}><Icon size={23} weight="fill" /></span><span className="rounded-full bg-[var(--cream)] px-2.5 py-1 [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.1em] text-[var(--muted)]">{reward.category}</span></div><h3 className="mb-0 mt-8 [font-family:var(--font-display)] text-[21px] tracking-[-.04em]">{reward.name}</h3><p className="mb-0 mt-3 text-[9px] leading-5 text-[var(--muted)]">{reward.description}</p><span className="mt-4 flex items-center gap-1.5 text-[8px] text-[var(--muted)]">{reward.category === "experience" ? <MapPin size={13} /> : <Sparkle size={13} />} {reward.availability}</span><div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--line)] pt-5"><div><strong className="[font-family:var(--font-display)] text-[25px] tracking-[-.04em]">{reward.points}</strong><span className="ml-1 text-[7px] text-[var(--muted)]">แต้ม</span></div><button className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[9px] font-bold ${available ? "bg-[var(--pink)] text-white" : "bg-[var(--cream)] text-[var(--muted)]"}`} disabled={!available} onClick={onRedeem} type="button">{available ? <>แลกรางวัล <ArrowRight size={13} /></> : <><LockKey size={13} /> แต้มไม่พอ</>}</button></div></motion.article>;
}

function RedemptionRow({ item }: { item: Redemption }) {
  return <article className="grid gap-4 p-5 sm:grid-cols-[44px_1fr_auto] sm:items-center sm:p-6"><span className={`grid size-11 place-items-center rounded-[15px] ${item.status === "ready" ? "bg-[var(--blush)] text-[var(--pink)]" : "bg-[#eaf9f3] text-[#138a64]"}`}>{item.status === "ready" ? <Ticket size={20} weight="fill" /> : <CheckCircle size={20} weight="fill" />}</span><div><strong className="block text-[10px]">{item.rewardName}</strong><span className="mt-1 flex flex-wrap gap-3 text-[7px] text-[var(--muted)]"><span>{item.date}</span><span>−{item.points} แต้ม</span>{item.code ? <span className="font-mono font-bold text-[var(--pink-strong)]">{item.code}</span> : null}</span></div><span className={`w-fit rounded-full px-2.5 py-1 text-[7px] ${item.status === "ready" ? "bg-[#fff1f5] text-[var(--pink-strong)]" : "bg-[#eff9f5] text-[#138a64]"}`}>{item.status === "ready" ? "พร้อมรับ" : item.status === "fulfilled" ? "รับแล้ว" : "หมดอายุ"}</span></article>;
}
