"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  EnvelopeSimple,
  Fingerprint,
  GraduationCap,
  LockKey,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { memberMutation } from "./member-data";

function AuthMark() {
  return (
    <Link aria-label="กลับหน้า SOUL" className="inline-flex min-h-11 items-center" href="/">
      <span className="[font-family:var(--font-display)] text-[24px] font-extrabold tracking-[-0.075em]">SOUL</span>
      <span className="ml-1 mt-3 size-[7px] rounded-full bg-[var(--pink)]" />
    </Link>
  );
}

export function MemberSignIn() {
  const [email, setEmail] = useState("pim.soul@example.com");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [ssoLoading, setSsoLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setState("sending");
    await memberMutation(
      "/api/member/auth/sign-in",
      { email, method: "magic_link" },
      { ok: true, next: "/member/onboarding", demo: true },
    );
    setState("sent");
  }

  async function signInWithUniversity() {
    setSsoLoading(true);
    await memberMutation(
      "/api/member/auth/sso",
      { provider: "chula" },
      { ok: true, redirectUrl: "/member/onboarding", demo: true },
    );
    window.location.href = "/member/onboarding";
  }

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[minmax(430px,.86fr)_minmax(540px,1.14fr)]" id="main-content">
      <section className="relative flex min-h-dvh flex-col px-5 pb-9 pt-5 sm:px-10 sm:pb-12 sm:pt-8 lg:px-[clamp(44px,6vw,88px)]">
        <div className="flex items-center justify-between">
          <AuthMark />
          <span className="rounded-full border border-[#f0ccd8] bg-[#fff2f6] px-3 py-1.5 [font-family:var(--font-mono)] text-[9px] font-bold uppercase tracking-[.1em] text-[var(--pink-strong)]">
            เข้าสู่พื้นที่สมาชิก
          </span>
        </div>

        <div className="my-auto w-full max-w-[520px] py-16">
          <AnimatePresence mode="wait">
            {state !== "sent" ? (
              <motion.div animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} initial={{ opacity: 0, x: -16 }} key="form">
                <p className="mb-4 flex items-center gap-2 [font-family:var(--font-mono)] text-[10px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">
                  <span className="size-1.5 rounded-full bg-[var(--pink)] shadow-[0_0_0_5px_rgba(233,30,99,.1)]" />
                  ความทรงจำของคุณอยู่ที่นี่
                </p>
                <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(42px,5.3vw,68px)] font-semibold leading-[1.02] tracking-[-.065em]">
                  กลับมาเปิด
                  <br />
                  <em className="not-italic text-[var(--pink)]">เรื่องของคุณ</em>
                </h1>
                <p className="mb-0 mt-6 max-w-[470px] text-[14px] leading-7 text-[var(--muted)]">
                  เข้าสู่พื้นที่ส่วนตัวเพื่อดูการ์ด บันทึกความทรงจำ และใช้สิทธิประโยชน์จากทุกการแตะ
                </p>

                <button
                  className="mt-9 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[var(--navy)] px-5 text-[12px] font-bold text-white shadow-[0_16px_38px_rgba(7,16,31,.2)] transition hover:-translate-y-0.5 hover:bg-[#111f39] disabled:translate-y-0"
                  disabled={ssoLoading}
                  onClick={() => void signInWithUniversity()}
                  type="button"
                >
                  {ssoLoading ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <GraduationCap size={20} weight="fill" />}
                  เข้าสู่ระบบด้วย CUNET
                </button>

                <div className="my-6 flex items-center gap-4 text-[9px] text-[#a89da2] before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">หรือรับลิงก์ทางอีเมล</div>

                <form onSubmit={submit}>
                  <label className="mb-2 block text-[10px] font-bold" htmlFor="member-email">อีเมล</label>
                  <div className="flex min-h-[54px] items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 transition focus-within:border-[var(--pink)] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(233,30,99,.07)]">
                    <EnvelopeSimple aria-hidden="true" className="text-[var(--muted)]" size={19} />
                    <input
                      autoComplete="email"
                      className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none placeholder:text-[#b9afb4]"
                      id="member-email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  <button className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-5 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(233,30,99,.22)] transition hover:-translate-y-0.5 hover:bg-[var(--pink-strong)]" disabled={state === "sending"} type="submit">
                    {state === "sending" ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Fingerprint size={18} />}
                    {state === "sending" ? "กำลังสร้างลิงก์ปลอดภัย…" : "ส่ง Magic Link"}
                  </button>
                </form>

                <p className="mb-0 mt-6 flex items-start gap-2 text-[9px] leading-5 text-[#8e8288]">
                  <LockKey className="mt-0.5 shrink-0 text-[var(--pink)]" size={14} />
                  SOUL จะไม่ขอรหัสผ่าน CUNET และไม่แชร์ข้อมูลความทรงจำโดยไม่ได้รับอนุญาต
                </p>
              </motion.div>
            ) : (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="text-center" initial={{ opacity: 0, scale: 0.97 }} key="sent">
                <div className="mx-auto grid size-[82px] place-items-center rounded-full bg-[#eaf9f3] text-[#138a64]"><EnvelopeSimple size={35} weight="fill" /></div>
                <p className="mb-3 mt-7 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.15em] text-[#138a64]">Magic link sent</p>
                <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(36px,4vw,52px)] font-semibold tracking-[-.055em]">เช็กกล่องข้อความของคุณ</h1>
                <p className="mx-auto mb-0 mt-4 max-w-[420px] text-[13px] leading-7 text-[var(--muted)]">เราส่งลิงก์ใช้ครั้งเดียวไปที่ <strong className="text-[var(--ink)]">{email}</strong> แล้ว ลิงก์จะหมดอายุใน 10 นาที</p>
                <Link className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-5 text-[12px] font-bold text-white" href="/member/onboarding">เปิดลิงก์ตัวอย่าง <ArrowRight size={17} weight="bold" /></Link>
                <button className="mt-3 min-h-11 text-[10px] font-semibold text-[var(--pink-strong)]" onClick={() => setState("idle")} type="button">ใช้อีเมลอื่น</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5 text-[8px] text-[#968a90]">
          <span>© 2026 SOUL · Digital Memory Platform</span>
          <div className="flex gap-4"><Link href="/privacy">ความเป็นส่วนตัว</Link><Link href="/">กลับเว็บไซต์หลัก</Link></div>
        </div>
      </section>

      <section className="relative hidden min-h-dvh overflow-hidden bg-[var(--navy)] lg:block" aria-label="ตัวอย่างการ์ด SOUL">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(233,30,99,.2),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(75,214,234,.11),transparent_35%)]" />
        <div className="absolute left-[12%] top-[10%] h-px w-[76%] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <motion.div animate={{ y: [0, -12, 0], rotate: [-4, -2.5, -4] }} className="absolute inset-x-[16%] top-[16%] aspect-[.78] max-h-[62vh] overflow-hidden rounded-[34px] border border-white/15 bg-[#d49cab] shadow-[0_50px_120px_rgba(0,0,0,.46)]" transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}>
          <Image alt="SOUL Founder collectible card" className="object-cover" fill priority sizes="50vw" src="/assets/soul-card-hero.webp" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/40 via-transparent to-white/10" />
        </motion.div>
        <div className="absolute bottom-[8%] left-[10%] right-[10%] rounded-[24px] border border-white/12 bg-white/[0.07] p-5 text-white backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--pink)]/20 text-[#ff76a9]"><Sparkle size={21} weight="fill" /></span>
            <div><p className="m-0 [font-family:var(--font-mono)] text-[7px] uppercase tracking-[.14em] text-[#ff76a9]">ONE CARD · A LIFETIME</p><strong className="mt-1 block [font-family:var(--font-display)] text-[20px] tracking-[-.035em]">ทุกความทรงจำ อยู่ในมือคุณ</strong><p className="mb-0 mt-2 text-[10px] leading-5 text-white/50">Public tap. Private ownership. You control what is remembered.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}

const interestOptions = ["ศิลปะและการออกแบบ", "กิจกรรมมหาวิทยาลัย", "เรื่องเล่ารุ่นพี่", "ดนตรีและการแสดง", "นวัตกรรม", "กีฬา"];

export function MemberOnboarding() {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("พิมพ์ชนก ว.");
  const [interests, setInterests] = useState<string[]>(["ศิลปะและการออกแบบ", "กิจกรรมมหาวิทยาลัย"]);
  const [consents, setConsents] = useState({ terms: true, analytics: true, updates: false });
  const [saving, setSaving] = useState(false);

  function toggleInterest(value: string) {
    setInterests((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function complete() {
    setSaving(true);
    await memberMutation(
      "/api/member/onboarding",
      { displayName, interests, consents },
      { ok: true, memberId: "member_demo_pim", demo: true },
    );
    setSaving(false);
    setStep(4);
  }

  const steps = ["ตัวตน", "สิ่งที่สนใจ", "ความเป็นส่วนตัว"];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[var(--paper)]" id="main-content">
      <div className="pointer-events-none absolute -right-36 -top-44 size-[520px] rounded-full bg-[var(--pink)]/[0.07] blur-3xl" />
      <header className="relative flex h-[72px] items-center justify-between border-b border-[var(--line)] px-5 sm:px-10">
        <AuthMark />
        <Link className="flex min-h-11 items-center gap-2 text-[9px] font-semibold text-[var(--muted)]" href="/member/sign-in"><ArrowLeft size={15} /> ออกจากการตั้งค่า</Link>
      </header>

      <div className="relative mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[300px_1fr] lg:py-20">
        <aside>
          <p className="mb-3 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.15em] text-[var(--pink-strong)]">WELCOME TO SOUL</p>
          <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(36px,4vw,52px)] font-semibold leading-[1.06] tracking-[-.055em]">ทำพื้นที่นี้<br />ให้เป็นของคุณ</h1>
          <p className="mb-0 mt-5 text-[12px] leading-6 text-[var(--muted)]">ใช้เวลาไม่ถึง 2 นาที คุณเปลี่ยนการตั้งค่าเหล่านี้ได้ทุกเมื่อ</p>
          {step < 4 ? (
            <ol className="mt-8 grid grid-cols-3 gap-2 lg:grid-cols-1" aria-label="ขั้นตอนการเริ่มต้น">
              {steps.map((label, index) => {
                const value = index + 1;
                const done = step > value;
                const active = step === value;
                return (
                  <li className={`flex items-center gap-3 rounded-2xl p-2 text-[9px] font-semibold transition lg:p-3 ${active ? "bg-white text-[var(--ink)] shadow-[0_12px_35px_rgba(83,41,58,.08)]" : "text-[var(--muted)]"}`} key={label}>
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full [font-family:var(--font-mono)] text-[8px] ${done ? "bg-[#138a64] text-white" : active ? "bg-[var(--pink)] text-white" : "border border-[var(--line)] bg-white"}`}>{done ? <Check size={14} weight="bold" /> : `0${value}`}</span>
                    <span className="hidden lg:block">{label}</span>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </aside>

        <section className="min-w-0">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10" exit={{ opacity: 0, x: -16 }} initial={{ opacity: 0, x: 16 }} key="identity">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink)]"><UserIdentityIcon /></span>
                <h2 className="mb-0 mt-7 [font-family:var(--font-display)] text-[28px] font-semibold tracking-[-.045em]">อยากให้เราเรียกคุณว่าอะไร?</h2>
                <p className="mt-2 text-[11px] leading-6 text-[var(--muted)]">ชื่อนี้จะแสดงบนโปรไฟล์และเรื่องเล่าที่คุณเลือกแชร์</p>
                <label className="mb-2 mt-7 block text-[10px] font-bold" htmlFor="display-name">ชื่อที่แสดง</label>
                <input className="min-h-[54px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 text-[13px] outline-none transition focus:border-[var(--pink)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(233,30,99,.07)]" id="display-name" maxLength={40} onChange={(event) => setDisplayName(event.target.value)} value={displayName} />
                <div className="mt-5 grid gap-3 rounded-[18px] bg-[var(--cream)] p-4 sm:grid-cols-2">
                  <div><span className="block text-[8px] text-[var(--muted)]">มหาวิทยาลัย</span><strong className="mt-1 block text-[10px]">จุฬาลงกรณ์มหาวิทยาลัย</strong></div>
                  <div><span className="block text-[8px] text-[var(--muted)]">ยืนยันผ่าน</span><strong className="mt-1 flex items-center gap-1.5 text-[10px] text-[#138a64]"><ShieldCheck size={14} weight="fill" /> CUNET Identity</strong></div>
                </div>
                <NextButton disabled={!displayName.trim()} onClick={() => setStep(2)} />
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10" exit={{ opacity: 0, x: -16 }} initial={{ opacity: 0, x: 16 }} key="interests">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink)]"><Sparkle size={23} weight="fill" /></span>
                <h2 className="mb-0 mt-7 [font-family:var(--font-display)] text-[28px] font-semibold tracking-[-.045em]">เรื่องแบบไหนที่มีความหมายกับคุณ?</h2>
                <p className="mt-2 text-[11px] leading-6 text-[var(--muted)]">เลือกได้มากกว่าหนึ่งข้อ เราจะใช้เพื่อจัดลำดับเรื่องเล่าเท่านั้น</p>
                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  {interestOptions.map((interest) => {
                    const selected = interests.includes(interest);
                    return (
                      <button aria-pressed={selected} className={`flex min-h-[56px] items-center justify-between rounded-[16px] border px-4 text-left text-[11px] font-semibold transition ${selected ? "border-[var(--pink)] bg-[#fff4f7] text-[var(--pink-strong)]" : "border-[var(--line)] bg-white hover:border-[#dfb7c5]"}`} key={interest} onClick={() => toggleInterest(interest)} type="button">
                        {interest}<span className={`grid size-6 place-items-center rounded-full ${selected ? "bg-[var(--pink)] text-white" : "bg-[var(--cream)] text-transparent"}`}><Check size={13} weight="bold" /></span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><BackButton onClick={() => setStep(1)} /><NextButton disabled={interests.length === 0} onClick={() => setStep(3)} /></div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-10" exit={{ opacity: 0, x: -16 }} initial={{ opacity: 0, x: 16 }} key="privacy">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf9f3] text-[#138a64]"><ShieldCheck size={24} weight="fill" /></span>
                <h2 className="mb-0 mt-7 [font-family:var(--font-display)] text-[28px] font-semibold tracking-[-.045em]">ความทรงจำของคุณ คุณเป็นคนเลือก</h2>
                <p className="mt-2 text-[11px] leading-6 text-[var(--muted)]">ทุกความทรงจำเริ่มต้นเป็น “เฉพาะฉัน” และเปลี่ยนได้ทีละรายการ</p>
                <div className="mt-7 space-y-3">
                  <ConsentRow checked={consents.terms} description="จำเป็นสำหรับการถือครองการ์ดและบันทึกความทรงจำ" label="ยอมรับข้อกำหนดและประกาศความเป็นส่วนตัว" locked onChange={() => undefined} />
                  <ConsentRow checked={consents.analytics} description="ช่วยให้เราปรับปรุงการแตะและการโหลดหน้า โดยไม่อ่านเนื้อหาความทรงจำ" label="อนุญาตข้อมูลการใช้งานแบบไม่ระบุตัวตน" onChange={(checked) => setConsents((value) => ({ ...value, analytics: checked }))} />
                  <ConsentRow checked={consents.updates} description="กิจกรรม คอลเลกชัน และรางวัลใหม่ ไม่เกิน 2 ครั้งต่อเดือน" label="รับข่าวสารจาก SOUL" onChange={(checked) => setConsents((value) => ({ ...value, updates: checked }))} />
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-[#cdebe0] bg-[#f1fbf7] p-4"><LockKey className="mt-0.5 shrink-0 text-[#138a64]" size={18} /><p className="m-0 text-[9px] leading-5 text-[#45665a]">SOUL ไม่ขายข้อมูลส่วนบุคคล คุณดาวน์โหลดหรือลบบัญชีได้จาก Settings ตามสิทธิ์ PDPA</p></div>
                <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><BackButton onClick={() => setStep(2)} /><button className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[11px] font-bold text-white shadow-[0_10px_25px_rgba(233,30,99,.2)]" disabled={saving} onClick={() => void complete()} type="button">{saving ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <CheckCircle size={18} weight="fill" />}{saving ? "กำลังสร้างพื้นที่…" : "สร้างพื้นที่ของฉัน"}</button></div>
              </motion.div>
            ) : null}

            {step === 4 ? (
              <motion.div animate={{ opacity: 1, scale: 1 }} className="rounded-[30px] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-soft)] sm:p-14" initial={{ opacity: 0, scale: 0.97 }} key="complete">
                <motion.div animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }} className="mx-auto grid size-[88px] place-items-center rounded-full bg-[var(--navy)] text-[#ff76a9]" transition={{ duration: 0.8 }}><Sparkle size={38} weight="fill" /></motion.div>
                <p className="mb-3 mt-7 [font-family:var(--font-mono)] text-[8px] font-bold uppercase tracking-[.16em] text-[var(--pink-strong)]">YOUR SOUL SPACE IS READY</p>
                <h2 className="m-0 [font-family:var(--font-display)] text-[clamp(34px,4vw,50px)] font-semibold tracking-[-.055em]">ยินดีต้อนรับ, {displayName}</h2>
                <p className="mx-auto mb-0 mt-4 max-w-[470px] text-[12px] leading-7 text-[var(--muted)]">การ์ด Founder #088 พร้อมแล้ว ลองเปิดดูเรื่องราว หรือเพิ่มความทรงจำแรกของคุณได้ทันที</p>
                <Link className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[12px] font-bold text-white sm:w-auto" href="/member/wallet">เข้าสู่ SOUL Wallet <ArrowRight size={17} weight="bold" /></Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

function UserIdentityIcon() {
  return <Fingerprint size={24} weight="fill" />;
}

function NextButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return <button className="mt-8 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-6 text-[11px] font-bold text-white shadow-[0_10px_25px_rgba(233,30,99,.2)] sm:ml-auto sm:w-auto" disabled={disabled} onClick={onClick} type="button">ถัดไป <ArrowRight size={17} weight="bold" /></button>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 text-[10px] font-semibold text-[var(--muted)]" onClick={onClick} type="button"><ArrowLeft size={15} /> ย้อนกลับ</button>;
}

function ConsentRow({ checked, description, label, locked = false, onChange }: { checked: boolean; description: string; label: string; locked?: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-[18px] border border-[var(--line)] p-4 transition hover:border-[#dfbcc8]">
      <input checked={checked} className="peer sr-only" disabled={locked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-white text-transparent peer-checked:border-[var(--pink)] peer-checked:bg-[var(--pink)] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--cyan)]"><Check size={14} weight="bold" /></span>
      <span className="min-w-0"><strong className="block text-[10px]">{label}</strong><span className="mt-1 block text-[8px] leading-4 text-[var(--muted)]">{description}</span></span>
      {locked ? <span className="ml-auto rounded-full bg-[var(--cream)] px-2 py-1 text-[7px] text-[var(--muted)]">จำเป็น</span> : null}
    </label>
  );
}
