"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  EnvelopeSimple,
  Fingerprint,
  Info,
  LockKey,
  PaperPlaneTilt,
  Phone,
  ShieldCheck,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { cardById, memberMutation, type MemberCard, useMemberResource } from "./member-data";

type RecipientMethod = "email" | "phone" | "member_code";
type MemoryPolicy = "keep_private" | "shared_only";
type TransferReceipt = { transferId: string; status: "pending"; expiresAt: string; recipientMasked: string };

export function MemberCardTransfer() {
  const params = useParams<{ cardId: string }>();
  const cardId = params.cardId ?? "founder-088";
  const fallback = useMemo(() => cardById(cardId), [cardId]);
  const card = useMemberResource<MemberCard>(`/api/member/cards/${cardId}`, fallback);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<RecipientMethod>("email");
  const [recipient, setRecipient] = useState("friend@example.com");
  const [message, setMessage] = useState("การ์ดใบนี้มีความหมายกับเรา หวังว่าเธอจะสร้างเรื่องราวบทต่อไปได้ดีนะ");
  const [memoryPolicy, setMemoryPolicy] = useState<MemoryPolicy>("keep_private");
  const [acknowledged, setAcknowledged] = useState(false);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);

  function continueFromRecipient(event: FormEvent) {
    event.preventDefault();
    if (recipient.trim()) setStep(2);
  }

  async function transfer() {
    if (!acknowledged) return;
    setSending(true);
    const result = await memberMutation(
      `/api/member/cards/${cardId}/transfers`,
      { recipient: recipient.trim(), method, message: message.trim() || null, memoryPolicy, acknowledgedOwnershipChange: true },
      { transferId: `transfer_demo_${Date.now()}`, status: "pending" as const, expiresAt: "17 กรกฎาคม 2026 เวลา 23:59", recipientMasked: maskRecipient(recipient, method), demo: true },
    );
    setReceipt(result.data);
    setSending(false);
    setStep(4);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
      <header className="flex items-center justify-between border-b border-[var(--line)] pb-5"><Link className="inline-flex min-h-11 items-center gap-2 text-[12px] font-semibold text-[var(--muted)]" href={`/member/cards/${cardId}`}><ArrowLeft size={16} /> กลับไปที่การ์ด</Link><span className="rounded-full border border-[#f0cbd8] bg-[#fff2f6] px-3 py-1.5 [font-family:var(--font-mono)] text-[10px] font-bold uppercase tracking-[.11em] text-[var(--pink-strong)]">SECURE TRANSFER</span></header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
        <aside>
          <p className="mb-3 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.15em] text-[var(--pink-strong)]">PASS THE STORY ON</p>
          <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(34px,4vw,50px)] font-semibold leading-[1.05] tracking-[-.055em]">ส่งต่อการ์ด<br />ไม่ส่งต่อความลับ</h1>
          <p className="mb-0 mt-5 text-[10px] leading-5 text-[var(--muted)]">ผู้รับต้องยืนยันบัญชีและตอบรับก่อนสิทธิ์เปลี่ยน คุณยกเลิกได้ระหว่างรอ</p>
          <ol className="mt-7 grid grid-cols-3 gap-2 lg:grid-cols-1" aria-label="ขั้นตอนโอนการ์ด">{["ผู้รับ", "ความทรงจำ", "ตรวจสอบ"].map((label, index) => { const value = index + 1; const active = step === value; const done = step > value; return <li className={`flex items-center gap-3 rounded-[16px] p-2 lg:p-3 ${active ? "bg-white shadow-[0_8px_28px_rgba(83,41,58,.08)]" : "text-[var(--muted)]"}`} key={label}><span className={`grid size-8 shrink-0 place-items-center rounded-full [font-family:var(--font-mono)] text-[11px] ${done ? "bg-[#138a64] text-white" : active ? "bg-[var(--pink)] text-white" : "border border-[var(--line)] bg-white"}`}>{done ? <Check size={13} weight="bold" /> : `0${value}`}</span><span className="hidden text-[12px] font-semibold lg:block">{label}</span></li>; })}</ol>
          <div className="mt-7 overflow-hidden rounded-[22px] border border-[var(--line)] bg-white"><div className="relative aspect-[1.85]"><Image alt={card.data.name} className="object-cover" fill sizes="280px" src={card.data.image} /><div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/55 to-transparent" /><span className="absolute bottom-3 left-3 text-[11px] font-bold text-white">{card.data.name}</span></div><div className="grid grid-cols-2 divide-x divide-[var(--line)] p-4 text-[10px]"><div><span className="text-[var(--muted)]">Serial</span><strong className="mt-1 block">{card.data.serial}</strong></div><div className="pl-4"><span className="text-[var(--muted)]">Status</span><strong className="mt-1 flex items-center gap-1 text-[#138a64]"><CheckCircle size={11} weight="fill" /> Eligible</strong></div></div></div>
        </aside>

        <section className="min-w-0">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-9" exit={{ opacity: 0, x: -15 }} initial={{ opacity: 0, x: 15 }} key="recipient" onSubmit={continueFromRecipient}>
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink)]"><UserCircle size={24} weight="fill" /></span><h2 className="mb-0 mt-6 [font-family:var(--font-display)] text-[28px] tracking-[-.045em]">ใครจะเป็นเจ้าของคนต่อไป?</h2><p className="mb-0 mt-2 text-[10px] leading-5 text-[var(--muted)]">เราจะส่งคำเชิญที่ใช้ได้ครั้งเดียว ผู้รับต้องเข้าสู่ระบบ SOUL ก่อนตอบรับ</p>
                <div className="mt-7 flex gap-1 overflow-x-auto rounded-full bg-[var(--cream)] p-1">{(["email", "phone", "member_code"] as const).map((value) => <button aria-pressed={method === value} className={`min-h-10 shrink-0 rounded-full px-4 text-[11px] font-semibold ${method === value ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} key={value} onClick={() => { setMethod(value); setRecipient(value === "email" ? "friend@example.com" : value === "phone" ? "0812345678" : "SOUL-XXXX"); }} type="button">{value === "email" ? "อีเมล" : value === "phone" ? "เบอร์โทร" : "Member Code"}</button>)}</div>
                <label className="mb-2 mt-6 block text-[12px] font-bold" htmlFor="transfer-recipient">{method === "email" ? "อีเมลผู้รับ" : method === "phone" ? "เบอร์โทรผู้รับ" : "SOUL Member Code"}</label><div className="flex min-h-[54px] items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 focus-within:border-[var(--pink)] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(233,30,99,.07)]">{method === "email" ? <EnvelopeSimple className="text-[var(--muted)]" size={18} /> : method === "phone" ? <Phone className="text-[var(--muted)]" size={18} /> : <Fingerprint className="text-[var(--muted)]" size={18} />}<input className="min-w-0 flex-1 border-0 bg-transparent text-[12px] outline-none" id="transfer-recipient" onChange={(event) => setRecipient(event.target.value)} required type={method === "email" ? "email" : "text"} value={recipient} /></div>
                <label className="mb-2 mt-5 block text-[12px] font-bold" htmlFor="transfer-message">ข้อความถึงผู้รับ <span className="font-normal text-[var(--muted)]">ไม่บังคับ</span></label><textarea className="min-h-[120px] w-full resize-y rounded-[16px] border border-[var(--line)] bg-[var(--paper)] p-4 text-[11px] leading-6 outline-none focus:border-[var(--pink)]" id="transfer-message" maxLength={300} onChange={(event) => setMessage(event.target.value)} value={message} /><div className="mt-7 flex justify-end"><button className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[10px] font-bold text-white" type="submit">ถัดไป: เลือกความทรงจำ <ArrowRight size={15} weight="bold" /></button></div>
              </motion.form>
            ) : null}

            {step === 2 ? (
              <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-9" exit={{ opacity: 0, x: -15 }} initial={{ opacity: 0, x: 15 }} key="memories">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf9f3] text-[#138a64]"><LockKey size={24} weight="fill" /></span><h2 className="mb-0 mt-6 [font-family:var(--font-display)] text-[28px] tracking-[-.045em]">ความทรงจำส่วนตัวจะอยู่กับคุณ</h2><p className="mb-0 mt-2 text-[10px] leading-5 text-[var(--muted)]">การโอนสิทธิ์การ์ดไม่เท่ากับการโอนข้อมูลส่วนบุคคล เลือกสิ่งที่จะเกิดกับเรื่องที่เชื่อมอยู่</p>
                <div className="mt-7 space-y-3"><PolicyChoice active={memoryPolicy === "keep_private"} description="เรื่องส่วนตัวและ SOUL Circle ทั้งหมดจะถูกย้ายไป Archive ของคุณ ผู้รับเริ่ม Timeline ใหม่" icon={LockKey} label="เก็บความทรงจำทั้งหมดไว้กับฉัน" onClick={() => setMemoryPolicy("keep_private")} recommended /><PolicyChoice active={memoryPolicy === "shared_only"} description="เฉพาะเรื่องที่คุณตั้งเป็นสาธารณะจะอยู่ในประวัติการ์ด เรื่องอื่นย้ายไป Archive ของคุณ" icon={Sparkle} label="คงไว้เฉพาะเรื่องสาธารณะ" onClick={() => setMemoryPolicy("shared_only")} /></div>
                <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-[#cdeade] bg-[#f1fbf7] p-4"><ShieldCheck className="mt-0.5 shrink-0 text-[#138a64]" size={18} /><p className="m-0 text-[11px] leading-4 text-[#496d60]">รูปภาพและข้อความที่ไม่ส่งต่อจะยังอยู่ในบัญชีคุณและดาวน์โหลดได้ตามเดิม การตั้งค่านี้เปลี่ยนไม่ได้หลังผู้รับตอบรับ</p></div>
                <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><button className="min-h-[48px] rounded-full border border-[var(--line)] px-5 text-[12px] font-semibold" onClick={() => setStep(1)} type="button"><ArrowLeft className="mr-1 inline" size={14} /> ย้อนกลับ</button><button className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[10px] font-bold text-white" onClick={() => setStep(3)} type="button">ตรวจสอบก่อนส่ง <ArrowRight size={15} weight="bold" /></button></div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-9" exit={{ opacity: 0, x: -15 }} initial={{ opacity: 0, x: 15 }} key="review">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink)]"><ShieldCheck size={24} weight="fill" /></span><h2 className="mb-0 mt-6 [font-family:var(--font-display)] text-[28px] tracking-[-.045em]">ตรวจสอบการส่งต่อ</h2><p className="mb-0 mt-2 text-[10px] leading-5 text-[var(--muted)]">ยังไม่มีสิทธิ์เปลี่ยนมือจนกว่าผู้รับจะตอบรับ ภายใน 7 วัน</p>
                <dl className="mt-7 overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--paper)] text-[12px]"><ReviewRow label="การ์ด" value={`${card.data.name} · ${card.data.serial}`} /><ReviewRow label="ส่งถึง" value={maskRecipient(recipient, method)} /><ReviewRow label="วิธีเชิญ" value={method === "email" ? "อีเมล" : method === "phone" ? "SMS" : "Member Code"} /><ReviewRow label="ความทรงจำ" value={memoryPolicy === "keep_private" ? "เก็บทั้งหมดไว้ใน Archive ของฉัน" : "คงไว้เฉพาะเรื่องสาธารณะ"} /></dl>
                <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-[#efd7ab] bg-[#fff9ed] p-4"><Info className="mt-0.5 shrink-0 text-[#a06b16]" size={18} /><p className="m-0 text-[11px] leading-4 text-[#7c5d28]">หลังผู้รับตอบรับ คุณจะเปิดข้อมูลเจ้าของและเพิ่มเรื่องใหม่ในการ์ดใบนี้ไม่ได้ แต่เรื่องส่วนตัวที่เก็บไว้ยังอยู่ใน Archive</p></div>
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[16px] border border-[var(--line)] p-4"><input checked={acknowledged} className="peer sr-only" onChange={(event) => setAcknowledged(event.target.checked)} type="checkbox" /><span className="grid size-6 shrink-0 place-items-center rounded-lg border border-[var(--line)] text-transparent peer-checked:border-[var(--pink)] peer-checked:bg-[var(--pink)] peer-checked:text-white"><Check size={13} weight="bold" /></span><span><strong className="block text-[12px]">ฉันเข้าใจว่าสิทธิ์การถือครองจะเปลี่ยนเมื่อผู้รับตอบรับ</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">SOUL อาจขอให้ยืนยันตัวตนอีกครั้งสำหรับการ์ดที่มีมูลค่าสูง</span></span></label>
                <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><button className="min-h-[48px] rounded-full border border-[var(--line)] px-5 text-[12px] font-semibold" onClick={() => setStep(2)} type="button"><ArrowLeft className="mr-1 inline" size={14} /> ย้อนกลับ</button><button className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[10px] font-bold text-white disabled:bg-[#c7b9be]" disabled={!acknowledged || sending} onClick={() => void transfer()} type="button">{sending ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <PaperPlaneTilt size={17} weight="fill" />}{sending ? "กำลังสร้างคำเชิญ…" : "ส่งคำเชิญโอนการ์ด"}</button></div>
              </motion.div>
            ) : null}

            {step === 4 && receipt ? (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="rounded-[30px] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-soft)] sm:p-12" initial={{ opacity: 0, scale: .97 }} key="complete"><motion.span animate={{ rotate: [0, -8, 8, 0] }} className="mx-auto grid size-[82px] place-items-center rounded-full bg-[#eaf9f3] text-[#138a64]"><PaperPlaneTilt size={34} weight="fill" /></motion.span><p className="mb-3 mt-7 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.15em] text-[#138a64]">TRANSFER INVITATION SENT</p><h2 className="m-0 [font-family:var(--font-display)] text-[clamp(32px,4vw,46px)] tracking-[-.055em]">รอผู้รับเปิดบทต่อไป</h2><p className="mx-auto mb-0 mt-4 max-w-[500px] text-[10px] leading-5 text-[var(--muted)]">ส่งคำเชิญไปที่ <strong className="text-[var(--ink)]">{receipt.recipientMasked}</strong> แล้ว การ์ดยังเป็นของคุณจนกว่าจะได้รับการตอบรับ</p><div className="mx-auto mt-6 max-w-[440px] rounded-[20px] border border-dashed border-[#d8bdc7] bg-[var(--paper)] p-5 text-left"><div className="flex justify-between gap-3 text-[11px]"><span className="text-[var(--muted)]">Transfer ID</span><strong className="font-mono">{receipt.transferId.slice(-12).toUpperCase()}</strong></div><div className="mt-3 flex justify-between gap-3 text-[11px]"><span className="text-[var(--muted)]">หมดอายุ</span><strong>{receipt.expiresAt}</strong></div></div><div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row"><Link className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[var(--pink)] px-6 text-[10px] font-bold text-white" href={`/member/cards/${cardId}`}>กลับไปที่การ์ด</Link><button className="min-h-[50px] rounded-full border border-[var(--line)] px-6 text-[12px] font-semibold" type="button">คัดลอกลิงก์คำเชิญ</button></div></motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

function PolicyChoice({ active, label, description, icon: Icon, onClick, recommended = false }: { active: boolean; label: string; description: string; icon: typeof LockKey; onClick: () => void; recommended?: boolean }) { return <button aria-pressed={active} className={`relative flex w-full items-start gap-4 rounded-[18px] border p-4 text-left transition ${active ? "border-[var(--pink)] bg-[#fff4f7]" : "border-[var(--line)] bg-white hover:border-[#dfbbc8]"}`} onClick={onClick} type="button"><span className={`grid size-10 shrink-0 place-items-center rounded-[14px] ${active ? "bg-[var(--pink)] text-white" : "bg-[var(--cream)] text-[var(--muted)]"}`}><Icon size={19} weight={active ? "fill" : "regular"} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="text-[12px]">{label}</strong>{recommended ? <span className="rounded-full bg-[#eaf9f3] px-2 py-1 text-[6px] font-bold text-[#138a64]">แนะนำ</span> : null}</span><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">{description}</span></span>{active ? <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--pink)] text-white"><Check size={11} weight="bold" /></span> : null}</button>; }
function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 border-b border-[var(--line)] p-4 last:border-b-0 sm:grid-cols-[130px_1fr]"><dt className="text-[var(--muted)]">{label}</dt><dd className="m-0 font-semibold sm:text-right">{value}</dd></div>; }
function maskRecipient(value: string, method: RecipientMethod) { if (method === "email") { const [name, domain = ""] = value.split("@"); return `${name.slice(0, 2)}•••@${domain}`; } if (method === "phone") return `${value.slice(0, 3)}••••${value.slice(-3)}`; return value.slice(0, 5) + "••••"; }
