"use client";

import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  DownloadSimple,
  EnvelopeSimple,
  Fingerprint,
  Gift,
  GraduationCap,
  Laptop,
  LockKey,
  Medal,
  PencilSimple,
  Phone,
  ShieldCheck,
  SignOut,
  Sparkle,
  Trash,
  UserCircle,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  demoCards,
  demoProfile,
  memberMutation,
  type MemberProfile,
  type MemoryPrivacy,
  privacyLabels,
  useMemberResource,
} from "./member-data";
import { DemoSourceBadge, MemberPageHeader } from "./member-shell";

export function MemberProfilePage() {
  const profile = useMemberResource<MemberProfile>("/api/member/me", demoProfile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(demoProfile.displayName);
  const [faculty, setFaculty] = useState(demoProfile.faculty);
  const [year, setYear] = useState(demoProfile.graduationYear);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await memberMutation("/api/member/me", { displayName: name, faculty, graduationYear: year }, { ok: true, profile: { ...profile.data, displayName: name, faculty, graduationYear: year }, demo: true }, "PATCH");
    setSaving(false);
    setSaved(true);
    setEditing(false);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
      <MemberPageHeader action={<DemoSourceBadge source={profile.source} />} description="ตัวตนสมาชิกที่เชื่อมการ์ด ความทรงจำ และสิทธิ์ของคุณเข้าด้วยกัน" kicker="MEMBER PROFILE" title="พื้นที่ของฉันใน SOUL" />
      <AnimatePresence>{saved ? <motion.div animate={{ opacity: 1, y: 0 }} className="fixed right-4 top-24 z-50 flex items-center gap-2 rounded-full bg-[#138a64] px-4 py-3 text-[12px] font-bold text-white shadow-xl" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: -8 }}><CheckCircle size={16} weight="fill" /> บันทึกโปรไฟล์แล้ว</motion.div> : null}</AnimatePresence>

      <section className="relative mt-7 overflow-hidden rounded-[30px] bg-[var(--navy)] p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-32 -top-44 size-[460px] rounded-full bg-[var(--pink)]/20 blur-3xl" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center">
          <div className="relative grid size-[106px] shrink-0 place-items-center rounded-full border-4 border-white/10 bg-gradient-to-br from-[var(--pink)] to-[#7c1c46] [font-family:var(--font-display)] text-[30px] font-bold shadow-[0_18px_45px_rgba(0,0,0,.28)]">{profile.data.avatarInitials}<span className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-4 border-[var(--navy)] bg-[#38c994] text-white"><Check size={13} weight="bold" /></span></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#ff71a8]/25 bg-[var(--pink)]/10 px-3 py-1 [font-family:var(--font-mono)] text-[10px] uppercase tracking-[.11em] text-[#ff71a8]">PINK MEMBER</span><span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[.05] px-3 py-1 text-[10px] text-white/80"><ShieldCheck size={11} /> CUNET verified</span></div><h1 className="mb-0 mt-4 [font-family:var(--font-display)] text-[clamp(36px,5vw,58px)] font-semibold tracking-[-.06em]">{profile.data.displayName}</h1><p className="mb-0 mt-2 text-[10px] text-white/78">{profile.data.faculty} · รุ่น {profile.data.graduationYear}</p></div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[.06] px-5 text-[12px] font-semibold text-white/75 transition hover:bg-white/[.1] hover:text-white" onClick={() => setEditing(true)} type="button"><PencilSimple size={15} /> แก้ไขโปรไฟล์</button>
        </div>
        <div className="relative mt-9 grid grid-cols-2 overflow-hidden rounded-[22px] border border-white/10 bg-white/[.045] sm:grid-cols-4"><ProfileStat label="การ์ด" value={`${demoCards.length} ใบ`} /><ProfileStat label="ความทรงจำ" value="6 เรื่อง" /><ProfileStat label="SOUL Points" value={profile.data.soulPoints.toLocaleString()} /><ProfileStat label="สมาชิกตั้งแต่" value="ก.ค. 2026" /></div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <section className="rounded-[28px] border border-[var(--line)] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-5"><div><p className="m-0 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">IDENTITY</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[23px] tracking-[-.04em]">ข้อมูลสมาชิก</h2></div><Fingerprint className="text-[var(--pink)]" size={25} /></div>
          <dl className="divide-y divide-[var(--line)]"><InfoRow icon={UserCircle} label="ชื่อที่แสดง" value={profile.data.displayName} /><InfoRow icon={EnvelopeSimple} label="อีเมล" value={profile.data.email} verified /><InfoRow icon={GraduationCap} label="สถาบัน" value={profile.data.university} verified /><InfoRow icon={Sparkle} label="สิ่งที่สนใจ" value={profile.data.interests.join(" · ")} /></dl>
          <Link className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 text-[12px] font-semibold transition hover:border-[var(--pink)] hover:text-[var(--pink-strong)]" href="/member/settings">ตั้งค่าบัญชีและความเป็นส่วนตัว <ArrowRight size={14} /></Link>
        </section>

        <section className="rounded-[28px] border border-[var(--line)] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="m-0 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">MILESTONES</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[23px] tracking-[-.04em]">เครื่องหมายของคุณ</h2></div><Medal className="text-[#b5874d]" size={25} weight="fill" /></div>
          <div className="mt-6 grid grid-cols-2 gap-3"><Badge icon={Fingerprint} label="First Tap" detail="10 ก.ค. 2026" tone="pink" /><Badge icon={Sparkle} label="Story Keeper" detail="5 เรื่องขึ้นไป" tone="gold" /><Badge icon={Gift} label="First Reward" detail="ใช้แต้มครั้งแรก" tone="cyan" /><Badge icon={LockKey} label="Privacy Pro" detail="กำลังปลดล็อก" tone="locked" /></div>
        </section>
      </div>

      <section className="mt-5 rounded-[28px] border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="m-0 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.14em] text-[var(--pink-strong)]">CONNECTED COLLECTION</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[23px] tracking-[-.04em]">ตัวตนผ่านการ์ด</h2></div><Link className="inline-flex min-h-10 items-center gap-2 text-[12px] font-bold text-[var(--pink-strong)]" href="/member/wallet#collection">ดู Wallet <ArrowRight size={14} /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{demoCards.map((card) => <Link className="flex items-center gap-4 rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4 transition hover:border-[#e2b9c7] hover:bg-white" href={`/member/cards/${card.id}`} key={card.id}><span className={`grid size-12 shrink-0 place-items-center rounded-[15px] text-white ${card.tone === "night" ? "bg-[var(--navy)]" : "bg-gradient-to-br from-[#d79aac] to-[#7f344f]"}`}><Fingerprint size={20} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[10px]">{card.name}</strong><span className="mt-1 block text-[10px] text-[var(--muted)]">{card.series} · {card.serial}</span></span><ArrowRight className="text-[var(--pink)]" size={15} /></Link>)}</div></section>

      <AnimatePresence>{editing ? <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[var(--navy)]/55 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title"><motion.form animate={{ scale: 1, y: 0 }} className="my-auto w-full max-w-[520px] rounded-[28px] bg-white p-6 shadow-2xl sm:p-8" initial={{ scale: .96, y: 12 }} onSubmit={submit}><div className="flex items-start justify-between"><div><p className="m-0 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[.13em] text-[var(--pink-strong)]">EDIT PROFILE</p><h2 className="mb-0 mt-2 [font-family:var(--font-display)] text-[27px] tracking-[-.045em]" id="edit-profile-title">ข้อมูลที่คนอื่นจะเห็น</h2></div><button aria-label="ปิด" className="grid size-10 place-items-center rounded-full border border-[var(--line)]" onClick={() => setEditing(false)} type="button"><X size={17} /></button></div><div className="mt-7 space-y-5"><TextField label="ชื่อที่แสดง" onChange={setName} value={name} /><TextField label="คณะ" onChange={setFaculty} value={faculty} /><TextField label="ปีที่คาดว่าจะจบ" onChange={setYear} value={year} /></div><p className="mb-0 mt-5 flex gap-2 rounded-[15px] bg-[var(--cream)] p-3 text-[11px] leading-4 text-[var(--muted)]"><ShieldCheck className="shrink-0 text-[var(--pink)]" size={15} /> อีเมลและสถาบันแก้ไขไม่ได้ เพราะยืนยันจากผู้ให้บริการตัวตน</p><button className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[var(--pink)] text-[10px] font-bold text-white" disabled={saving || !name.trim()} type="submit">{saving ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Check size={16} weight="bold" />}{saving ? "กำลังบันทึก…" : "บันทึกโปรไฟล์"}</button></motion.form></motion.div> : null}</AnimatePresence>
    </div>
  );
}

type MemberSettings = {
  defaultPrivacy: MemoryPrivacy;
  analytics: boolean;
  marketing: boolean;
  emailMemoryReminders: boolean;
  emailRewards: boolean;
  pushTapAlerts: boolean;
  productUpdates: boolean;
  sessions: { id: string; device: string; location: string; lastActive: string; current: boolean }[];
};

const demoSettings: MemberSettings = {
  defaultPrivacy: "private",
  analytics: true,
  marketing: false,
  emailMemoryReminders: true,
  emailRewards: true,
  pushTapAlerts: true,
  productUpdates: false,
  sessions: [
    { id: "session-current", device: "Chrome · Windows", location: "Bangkok, TH", lastActive: "กำลังใช้งาน", current: true },
    { id: "session-mobile", device: "Safari · iPhone", location: "Bangkok, TH", lastActive: "เมื่อวาน 21:14", current: false },
  ],
};

function isValidSettings(value: unknown): value is MemberSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<MemberSettings>;
  return (
    typeof v.defaultPrivacy === "string" &&
    Array.isArray(v.sessions) &&
    typeof v.analytics === "boolean"
  );
}

export function MemberSettingsPage() {
  const resource = useMemberResource<MemberSettings>("/api/member/settings", demoSettings);
  // Local override after user edits — base data derives from API without setState-in-effect.
  const [localOverride, setLocalOverride] = useState<MemberSettings | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [dangerOpen, setDangerOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [exporting, setExporting] = useState(false);

  const base =
    resource.source === "api" && isValidSettings(resource.data)
      ? resource.data
      : demoSettings;
  const data = localOverride ?? base;

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2200); }

  function patchLocal(values: Partial<MemberSettings>) {
    setLocalOverride((current) => ({ ...(current ?? base), ...values }));
  }

  async function persist(section: string, values: Partial<MemberSettings>) {
    setSaving(section);
    await memberMutation("/api/member/settings", { section, values }, { ok: true, demo: true }, "PATCH");
    setSaving(null);
    notify("บันทึกการตั้งค่าแล้ว");
  }

  async function requestExport() {
    setExporting(true);
    await memberMutation("/api/member/privacy/export", { format: "json", scope: "all" }, { ok: true, requestId: "export_demo_8842", delivery: "email", demo: true });
    setExporting(false);
    notify("รับคำขอแล้ว เราจะส่งลิงก์ทางอีเมล");
  }

  async function revokeSession(id: string) {
    await memberMutation(`/api/member/sessions/${id}`, {}, { ok: true, demo: true }, "DELETE");
    patchLocal({ sessions: data.sessions.filter((session) => session.id !== id) });
    notify("ออกจากระบบอุปกรณ์แล้ว");
  }

  async function deleteAccount() {
    await memberMutation("/api/member/account", { confirmation: confirmText }, { ok: true, gracePeriodDays: 30, demo: true }, "DELETE");
    setDangerOpen(false); notify("เริ่มช่วงรอลบบัญชี 30 วันแล้ว (Demo)");
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-12" id="privacy">
      <MemberPageHeader action={<DemoSourceBadge source={resource.source} />} description="ควบคุมสิ่งที่แชร์ การแจ้งเตือน อุปกรณ์ และสิทธิ์ในข้อมูลของคุณ" kicker="SETTINGS & PRIVACY" title="คุณเป็นคนกำหนดขอบเขต" />
      <AnimatePresence>{toast ? <motion.div animate={{ opacity: 1, y: 0 }} className="fixed right-4 top-24 z-[110] flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-3 text-[12px] font-bold text-white shadow-xl" exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: -8 }}><CheckCircle className="text-[#5bdcaf]" size={16} weight="fill" /> {toast}</motion.div> : null}</AnimatePresence>

      <div className="mt-7 space-y-5">
        <SettingsSection description="กำหนดค่าเริ่มต้นสำหรับเรื่องใหม่ คุณยังเปลี่ยนทีละเรื่องได้เสมอ" icon={LockKey} title="ความเป็นส่วนตัวของความทรงจำ">
          <div className="grid gap-2 sm:grid-cols-3">{(["private", "circle", "public"] as const).map((value) => <button aria-pressed={data.defaultPrivacy === value} className={`min-h-[100px] rounded-[18px] border p-4 text-left transition ${data.defaultPrivacy === value ? "border-[var(--pink)] bg-[#fff4f7]" : "border-[var(--line)] bg-white"}`} key={value} onClick={() => { patchLocal({ defaultPrivacy: value }); void persist("privacy", { defaultPrivacy: value }); }} type="button"><div className="flex items-center justify-between"><strong className="text-[12px]">{privacyLabels[value].label}</strong>{data.defaultPrivacy === value ? <span className="grid size-5 place-items-center rounded-full bg-[var(--pink)] text-white"><Check size={11} weight="bold" /></span> : null}</div><p className="mb-0 mt-2 text-[10px] leading-4 text-[var(--muted)]">{privacyLabels[value].description}</p></button>)}</div>
          <ToggleRow checked={data.analytics} description="วัดความลื่นไหลของการแตะและการโหลด โดยไม่เก็บเนื้อหาความทรงจำ" label="ข้อมูลการใช้งานแบบไม่ระบุตัวตน" onChange={(checked) => { patchLocal({ analytics: checked }); void persist("consent", { analytics: checked }); }} /><ToggleRow checked={data.marketing} description="ใช้กิจกรรมและคอลเลกชันที่สนใจเพื่อแนะนำเนื้อหา" label="การแนะนำแบบเฉพาะบุคคล" onChange={(checked) => { patchLocal({ marketing: checked }); void persist("consent", { marketing: checked }); }} />
        </SettingsSection>

        <SettingsSection description="เลือกเฉพาะสิ่งที่คุณอยากได้รับ เปลี่ยนได้ทันที" icon={Bell} title="การแจ้งเตือน">
          <ToggleRow checked={data.emailMemoryReminders} description="เตือนวันครบรอบและเรื่องที่ตั้งใจกลับมาเปิด" label="Memory reminders ทางอีเมล" onChange={(checked) => { patchLocal({ emailMemoryReminders: checked }); void persist("notifications", { emailMemoryReminders: checked }); }} /><ToggleRow checked={data.emailRewards} description="เมื่อมีรางวัลใหม่หรือสิทธิ์ใกล้หมดอายุ" label="รางวัลและสิทธิ์" onChange={(checked) => { patchLocal({ emailRewards: checked }); void persist("notifications", { emailRewards: checked }); }} /><ToggleRow checked={data.pushTapAlerts} description="แจ้งเมื่อมีการแตะผิดปกติหรือ Claim ใหม่" label="ความปลอดภัยของการ์ด" onChange={(checked) => { patchLocal({ pushTapAlerts: checked }); void persist("notifications", { pushTapAlerts: checked }); }} /><ToggleRow checked={data.productUpdates} description="ฟีเจอร์และกิจกรรมใหม่ ไม่เกิน 2 ครั้งต่อเดือน" label="ข่าวสารจาก SOUL" onChange={(checked) => { patchLocal({ productUpdates: checked }); void persist("notifications", { productUpdates: checked }); }} />
        </SettingsSection>

        <SettingsSection description="ตรวจสอบอุปกรณ์ที่เข้าถึงบัญชีและออกจากระบบจากระยะไกล" icon={ShieldCheck} title="ความปลอดภัยและอุปกรณ์">
          <div className="divide-y divide-[var(--line)] rounded-[18px] border border-[var(--line)]">{data.sessions.map((session) => <div className="flex flex-wrap items-center gap-4 p-4" key={session.id}><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--cream)] text-[var(--muted)]">{session.device.includes("iPhone") ? <Phone size={19} /> : <Laptop size={19} />}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><strong className="text-[12px]">{session.device}</strong>{session.current ? <span className="rounded-full bg-[#eaf9f3] px-2 py-1 text-[6px] font-bold text-[#138a64]">อุปกรณ์นี้</span> : null}</div><span className="mt-1 block text-[10px] text-[var(--muted)]">{session.location} · {session.lastActive}</span></div>{session.current ? null : <button className="min-h-9 rounded-full border border-[var(--line)] px-3 text-[11px] font-semibold text-[#a3264d]" onClick={() => void revokeSession(session.id)} type="button"><SignOut className="mr-1 inline" size={13} /> ออกจากระบบ</button>}</div>)}</div>
        </SettingsSection>

        <SettingsSection description="ดาวน์โหลดสำเนาข้อมูล หรือขอใช้สิทธิ์ตาม PDPA" icon={DownloadSimple} title="ข้อมูลของฉัน">
          <div className="grid gap-3 sm:grid-cols-2"><button className="flex min-h-[84px] items-center gap-4 rounded-[18px] border border-[var(--line)] bg-white p-4 text-left transition hover:border-[#dfbbc8]" disabled={exporting} onClick={() => void requestExport()} type="button"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[var(--blush)] text-[var(--pink)]">{exporting ? <span className="size-4 animate-spin rounded-full border-2 border-[var(--pink)]/25 border-t-[var(--pink)]" /> : <DownloadSimple size={19} />}</span><span><strong className="block text-[12px]">ดาวน์โหลดข้อมูล</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">โปรไฟล์ การ์ด และความทรงจำใน JSON</span></span></button><Link className="flex min-h-[84px] items-center gap-4 rounded-[18px] border border-[var(--line)] bg-white p-4 text-left transition hover:border-[#dfbbc8]" href="/privacy"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#eaf9f3] text-[#138a64]"><ShieldCheck size={19} /></span><span><strong className="block text-[12px]">ประกาศความเป็นส่วนตัว</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">ดูวัตถุประสงค์และระยะเวลาจัดเก็บ</span></span></Link></div>
        </SettingsSection>

        <section className="rounded-[26px] border border-[#efcbd6] bg-[#fff5f7] p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-white text-[#a3264d]"><Trash size={20} /></span><div><h2 className="m-0 [font-family:var(--font-display)] text-[18px] tracking-[-.035em]">ลบบัญชี SOUL</h2><p className="mb-0 mt-2 max-w-[610px] text-[11px] leading-4 text-[#805865]">เริ่มช่วงรอ 30 วัน ก่อนลบโปรไฟล์ ความทรงจำ และสิทธิ์ดิจิทัลถาวร การถือครองการ์ดจะถูกปลดจากบัญชีนี้</p></div></div><button className="min-h-11 shrink-0 rounded-full border border-[#dbaebe] bg-white px-5 text-[12px] font-bold text-[#a3264d]" onClick={() => setDangerOpen(true)} type="button">เริ่มกระบวนการลบ</button></div></section>
      </div>

      {saving ? <span className="fixed bottom-24 right-4 rounded-full bg-white px-3 py-2 text-[11px] text-[var(--muted)] shadow-lg lg:bottom-5">กำลังบันทึก {saving}…</span> : null}

      <AnimatePresence>{dangerOpen ? <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[var(--navy)]/60 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="delete-account-title"><motion.div animate={{ scale: 1, y: 0 }} className="my-auto w-full max-w-[500px] rounded-[28px] bg-white p-6 shadow-2xl sm:p-8" initial={{ scale: .96, y: 12 }}><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-full bg-[#fff0f3] text-[#a3264d]"><WarningCircle size={24} weight="fill" /></span><button aria-label="ปิด" className="grid size-10 place-items-center rounded-full border border-[var(--line)]" onClick={() => setDangerOpen(false)} type="button"><X size={17} /></button></div><h2 className="mb-0 mt-5 [font-family:var(--font-display)] text-[26px] tracking-[-.045em]" id="delete-account-title">คุณต้องการลบบัญชีจริงหรือ?</h2><p className="mb-0 mt-3 text-[12px] leading-5 text-[var(--muted)]">พิมพ์ <strong className="font-mono text-[#a3264d]">DELETE MY SOUL</strong> เพื่อยืนยัน คุณยกเลิกคำขอได้ภายใน 30 วัน</p><input aria-label="ข้อความยืนยัน" className="mt-5 min-h-[52px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 font-mono text-[11px] uppercase outline-none focus:border-[#a3264d]" onChange={(event) => setConfirmText(event.target.value.toUpperCase())} placeholder="DELETE MY SOUL" value={confirmText} /><button className="mt-4 min-h-[50px] w-full rounded-full bg-[#a3264d] text-[10px] font-bold text-white disabled:bg-[#c9bdc1]" disabled={confirmText !== "DELETE MY SOUL"} onClick={() => void deleteAccount()} type="button">ยืนยันเริ่มช่วงรอลบบัญชี</button></motion.div></motion.div> : null}</AnimatePresence>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) { return <div className="border-b border-r border-white/10 p-4 last:border-r-0 sm:border-b-0 sm:p-5"><span className="block text-[10px] text-white/40">{label}</span><strong className="mt-1.5 block text-[11px] text-white/90">{value}</strong></div>; }
function InfoRow({ icon: Icon, label, value, verified = false }: { icon: typeof UserCircle; label: string; value: string; verified?: boolean }) { return <div className="grid grid-cols-[34px_1fr] gap-3 py-4 sm:grid-cols-[34px_140px_1fr]"><span className="grid size-8 place-items-center rounded-[11px] bg-[var(--cream)] text-[var(--pink-strong)]"><Icon size={15} /></span><span className="self-center text-[11px] text-[var(--muted)]">{label}</span><strong className="col-start-2 flex items-center gap-1.5 text-[12px] sm:col-start-3">{value}{verified ? <CheckCircle className="text-[#138a64]" size={13} weight="fill" /> : null}</strong></div>; }
function Badge({ icon: Icon, label, detail, tone }: { icon: typeof Fingerprint; label: string; detail: string; tone: "pink" | "gold" | "cyan" | "locked" }) { const styles = { pink: "bg-[var(--blush)] text-[var(--pink)]", gold: "bg-[#fbf2e5] text-[#a8793f]", cyan: "bg-[#e9f8fa] text-[#258da0]", locked: "bg-[var(--cream)] text-[#aaa0a5]" }; return <div className={`min-h-[135px] rounded-[18px] p-4 ${tone === "locked" ? "opacity-60" : ""} ${styles[tone]}`}><Icon size={22} weight={tone === "locked" ? "regular" : "fill"} /><strong className="mt-7 block text-[12px]">{label}</strong><span className="mt-1 block text-[10px] opacity-70">{detail}</span></div>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-[12px] font-bold">{label}</span><input className="min-h-[52px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 text-[11px] outline-none focus:border-[var(--pink)]" onChange={(event) => onChange(event.target.value)} value={value} /></label>; }
function SettingsSection({ icon: Icon, title, description, children }: { icon: typeof LockKey; title: string; description: string; children: React.ReactNode }) { return <section className="rounded-[26px] border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex items-start gap-4 border-b border-[var(--line)] pb-5"><span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-[var(--blush)] text-[var(--pink)]"><Icon size={20} weight="fill" /></span><div><h2 className="m-0 [font-family:var(--font-display)] text-[20px] tracking-[-.035em]">{title}</h2><p className="mb-0 mt-1 text-[11px] leading-4 text-[var(--muted)]">{description}</p></div></div><div className="mt-5 space-y-3">{children}</div></section>; }
function ToggleRow({ checked, label, description, onChange }: { checked: boolean; label: string; description: string; onChange: (checked: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-4 rounded-[17px] border border-[var(--line)] p-4"><span className="min-w-0 flex-1"><strong className="block text-[12px]">{label}</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">{description}</span></span><input checked={checked} className="peer sr-only" onChange={(event) => onChange(event.target.checked)} type="checkbox" /><span className="relative h-7 w-12 shrink-0 rounded-full bg-[#d9cfd3] transition peer-checked:bg-[var(--pink)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--cyan)] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition after:content-[''] peer-checked:after:translate-x-5" /></label>; }
