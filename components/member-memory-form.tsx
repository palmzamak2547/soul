"use client";

import {
  ArrowLeft,
  CalendarBlank,
  Camera,
  Check,
  CheckCircle,
  Clock,
  Eye,
  FloppyDisk,
  ImageSquare,
  Info,
  LockKey,
  MapPin,
  NotePencil,
  Sparkle,
  Trash,
  UploadSimple,
  UsersThree,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  cardById,
  memberMutation,
  memoryById,
  type MemoryPrivacy,
  privacyLabels,
} from "./member-data";

type MemoryFormProps = { mode: "create" | "edit" };
type SaveState = "idle" | "saving" | "success" | "delete-confirm" | "deleted";

export function MemberMemoryForm({ mode }: MemoryFormProps) {
  const params = useParams<{ cardId: string; memoryId?: string }>();
  const cardId = params.cardId ?? "founder-088";
  const card = useMemo(() => cardById(cardId), [cardId]);
  const existing = useMemo(() => mode === "edit" && params.memoryId ? memoryById(params.memoryId) : null, [mode, params.memoryId]);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState(existing?.location ?? "");
  const [privacy, setPrivacy] = useState<MemoryPrivacy>(existing?.privacy ?? "private");
  const [filePreview, setFilePreview] = useState(existing?.image ?? "");
  const [fileName, setFileName] = useState(existing?.image ? "ภาพที่บันทึกไว้" : "");
  const [state, setState] = useState<SaveState>("idle");
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (filePreview.startsWith("blob:")) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (filePreview.startsWith("blob:")) URL.revokeObjectURL(filePreview);
    setFilePreview(URL.createObjectURL(file));
    setFileName(file.name);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setState("saving");
    const payload = { title: title.trim(), body: body.trim(), date, location: location.trim() || null, privacy, hasAttachment: Boolean(filePreview) };
    const endpoint = mode === "create" ? `/api/member/cards/${cardId}/memories` : `/api/member/cards/${cardId}/memories/${params.memoryId}`;
    await memberMutation(endpoint, payload, { ok: true, memoryId: params.memoryId ?? "memory_demo_new", demo: true }, mode === "create" ? "POST" : "PATCH");
    setState("success");
  }

  async function deleteMemory() {
    setState("saving");
    await memberMutation(`/api/member/cards/${cardId}/memories/${params.memoryId}`, {}, { ok: true, demo: true }, "DELETE");
    setState("deleted");
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(`soul-memory-draft:${cardId}`, JSON.stringify({ title, body, date, location, privacy, savedAt: new Date().toISOString() }));
    } catch {
      // The visible confirmation still represents a session-only draft when storage is blocked.
    }
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 1800);
  }

  if (state === "success" || state === "deleted") {
    return (
      <div className="grid min-h-[calc(100dvh-78px)] place-items-center px-4 py-12">
        <motion.section animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[600px] rounded-[30px] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-soft)] sm:p-12" initial={{ opacity: 0, scale: .96 }}>
          <span className={`mx-auto grid size-[82px] place-items-center rounded-full ${state === "success" ? "bg-[#eaf9f3] text-[#138a64]" : "bg-[var(--cream)] text-[var(--muted)]"}`}>{state === "success" ? <CheckCircle size={36} weight="fill" /> : <Trash size={34} />}</span>
          <p className="mb-3 mt-7 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.15em] text-[var(--pink-strong)]">{state === "success" ? "MEMORY SAVED" : "MEMORY REMOVED"}</p>
          <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(32px,4vw,46px)] font-semibold tracking-[-.055em]">{state === "success" ? (mode === "create" ? "เก็บช่วงเวลานี้ไว้แล้ว" : "อัปเดตเรื่องราวแล้ว") : "ลบความทรงจำแล้ว"}</h1>
          <p className="mx-auto mb-0 mt-4 max-w-[440px] text-[11px] leading-6 text-[var(--muted)]">{state === "success" ? `“${title}” ถูกบันทึกเป็น ${privacyLabels[privacy].label} คุณเปลี่ยนสิทธิ์การมองเห็นได้เสมอ` : "รายการนี้จะไม่ปรากฏใน Timeline อีกต่อไป"}</p>
          <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row"><Link className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[var(--pink)] px-6 text-[11px] font-bold text-white" href={`/member/cards/${cardId}`}>กลับไป Timeline</Link>{state === "success" && mode === "create" ? <button className="min-h-[50px] rounded-full border border-[var(--line)] px-6 text-[10px] font-semibold" onClick={() => { setTitle(""); setBody(""); setFilePreview(""); setFileName(""); setPrivacy("private"); setState("idle"); }} type="button">เพิ่มอีกหนึ่งเรื่อง</button> : null}</div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
        <Link className="inline-flex min-h-11 items-center gap-2 text-[12px] font-semibold text-[var(--muted)] transition hover:text-[var(--ink)]" href={`/member/cards/${cardId}`}><ArrowLeft size={16} /> กลับไปที่ {card.name}</Link>
        <div className="flex items-center gap-2"><button className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-[12px] font-semibold" onClick={() => setShowPreview((value) => !value)} type="button"><Eye size={15} /> {showPreview ? "ซ่อนตัวอย่าง" : "ดูตัวอย่าง"}</button><button className="hidden min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-[12px] font-semibold sm:inline-flex" onClick={saveDraft} type="button"><FloppyDisk size={15} /> {draftSaved ? "บันทึกร่างแล้ว" : "เก็บเป็นร่าง"}</button></div>
      </header>

      <div className={`mt-7 grid gap-6 ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_410px]" : "lg:grid-cols-[minmax(0,1fr)_330px]"}`}>
        <form className="min-w-0 rounded-[28px] border border-[var(--line)] bg-white p-5 shadow-[0_10px_35px_rgba(83,41,58,.045)] sm:p-8" onSubmit={save}>
          <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink)]"><NotePencil size={23} weight="fill" /></span><div><p className="m-0 [font-family:var(--font-mono)] text-[11px] font-bold uppercase tracking-[.15em] text-[var(--pink-strong)]">{mode === "create" ? "NEW MEMORY" : "EDIT MEMORY"}</p><h1 className="mb-0 mt-2 [font-family:var(--font-display)] text-[clamp(28px,4vw,42px)] font-semibold tracking-[-.055em]">{mode === "create" ? "เก็บวันนี้ไว้ให้อนาคต" : "แก้ไขเรื่องราวของคุณ"}</h1></div></div>
          <p className="mb-0 mt-5 max-w-[650px] text-[11px] leading-6 text-[var(--muted)]">เขียนในแบบที่คุณอยากกลับมาอ่าน ไม่มีรูปแบบตายตัว และทุกเรื่องเริ่มเป็นส่วนตัวเสมอ</p>

          <div className="mt-8 space-y-6">
            <Field label="ชื่อความทรงจำ" required supporting={`${title.length}/80`}>
              <input className="min-h-[54px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] px-4 text-[13px] outline-none transition placeholder:text-[#b1a6ab] focus:border-[var(--pink)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(233,30,99,.07)]" maxLength={80} onChange={(event) => setTitle(event.target.value)} placeholder="เช่น วันที่เราเริ่มต้นไปด้วยกัน" required value={title} />
            </Field>
            <Field label="เรื่องราว" required supporting={`${body.length}/1,500`}>
              <textarea className="min-h-[190px] w-full resize-y rounded-[16px] border border-[var(--line)] bg-[var(--paper)] p-4 text-[13px] leading-7 outline-none transition placeholder:text-[#b1a6ab] focus:border-[var(--pink)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(233,30,99,.07)]" maxLength={1500} onChange={(event) => setBody(event.target.value)} placeholder="เกิดอะไรขึ้น ใครอยู่ตรงนั้น และทำไมช่วงเวลานี้ถึงสำคัญกับคุณ…" required value={body} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="วันที่"><div className="relative"><CalendarBlank className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} /><input className="min-h-[52px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] pl-12 pr-4 text-[11px] outline-none focus:border-[var(--pink)]" onChange={(event) => setDate(event.target.value)} type="date" value={date} /></div></Field>
              <Field label="สถานที่" optional><div className="relative"><MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} /><input className="min-h-[52px] w-full rounded-[16px] border border-[var(--line)] bg-[var(--paper)] pl-12 pr-4 text-[11px] outline-none placeholder:text-[#b1a6ab] focus:border-[var(--pink)]" onChange={(event) => setLocation(event.target.value)} placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย" value={location} /></div></Field>
            </div>

            <Field label="ภาพประกอบ" optional supporting="JPG, PNG หรือ WEBP · สูงสุด 10 MB">
              {filePreview ? (
                <div className="relative aspect-[1.9] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--cream)]"><Image alt="ตัวอย่างภาพความทรงจำ" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 700px" src={filePreview} unoptimized={filePreview.startsWith("blob:")} /><div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-[14px] border border-white/60 bg-white/85 p-2.5 backdrop-blur-md"><ImageSquare className="text-[var(--pink)]" size={17} /><span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{fileName}</span><button aria-label="ลบภาพ" className="grid size-8 place-items-center rounded-full bg-[var(--ink)] text-white" onClick={() => { if (filePreview.startsWith("blob:")) URL.revokeObjectURL(filePreview); setFilePreview(""); setFileName(""); }} type="button"><X size={14} /></button></div></div>
              ) : (
                <label className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d8c2cb] bg-[var(--paper)] p-6 text-center transition hover:border-[var(--pink)] hover:bg-[#fff6f8]"><input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} type="file" /><span className="grid size-11 place-items-center rounded-full bg-white text-[var(--pink)] shadow-sm"><UploadSimple size={20} /></span><strong className="mt-3 text-[12px]">เลือกภาพจากอุปกรณ์</strong><span className="mt-1 text-[10px] text-[var(--muted)]">หรือวางไฟล์ลงในพื้นที่นี้</span></label>
              )}
            </Field>

            <Field label="ใครมองเห็นเรื่องนี้ได้?" required>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["private", "circle", "public"] as const).map((value) => <PrivacyChoice active={privacy === value} key={value} onClick={() => setPrivacy(value)} value={value} />)}
              </div>
              {privacy === "public" ? <div className="mt-3 flex items-start gap-2 rounded-[14px] border border-[#f0d6a9] bg-[#fff9ed] p-3 text-[11px] leading-4 text-[#8b611b]"><Info className="mt-0.5 shrink-0" size={15} /> เรื่องสาธารณะอาจปรากฏบนหน้าคอลเลกชันหลังผ่านการตรวจสอบสิทธิ์เนื้อหา คุณเปลี่ยนกลับเป็นส่วนตัวได้ทุกเมื่อ</div> : null}
            </Field>
          </div>

          <div className="mt-9 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            {mode === "edit" ? <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-semibold text-[#a3264d] hover:bg-[#fff1f5]" onClick={() => setState("delete-confirm")} type="button"><Trash size={16} /> ลบความทรงจำ</button> : <p className="m-0 flex items-center gap-2 text-[11px] text-[var(--muted)]"><LockKey className="text-[var(--pink)]" size={14} /> บันทึกร่างอยู่บนอุปกรณ์นี้เท่านั้น</p>}
            <button className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--pink)] px-7 text-[11px] font-bold text-white shadow-[0_12px_28px_rgba(233,30,99,.22)] transition hover:-translate-y-0.5 disabled:translate-y-0" disabled={!title.trim() || !body.trim() || state === "saving"} type="submit">{state === "saving" ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Sparkle size={17} weight="fill" />}{state === "saving" ? "กำลังบันทึก…" : mode === "create" ? "บันทึกความทรงจำ" : "บันทึกการแก้ไข"}</button>
          </div>
        </form>

        <aside className={`${showPreview ? "block" : "hidden lg:block"}`}>
          <div className="sticky top-[102px] space-y-4">
            {showPreview ? <MemoryPreview body={body} date={date} image={filePreview} location={location} privacy={privacy} title={title} /> : null}
            <div className="rounded-[24px] border border-[var(--line)] bg-white p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[14px] bg-[var(--blush)] text-[var(--pink)]"><Camera size={19} /></span><div><strong className="block text-[10px]">การ์ดที่เชื่อมอยู่</strong><span className="mt-1 block text-[10px] text-[var(--muted)]">{card.name} · {card.serial}</span></div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--cream)]"><div className="h-full bg-[var(--pink)]" style={{ width: `${Math.min(100, ((card.memories + (mode === "create" ? 1 : 0)) / card.memoryGoal) * 100)}%` }} /></div><p className="mb-0 mt-2 text-[10px] text-[var(--muted)]">{mode === "create" ? `เรื่องนี้จะเป็นความทรงจำที่ ${card.memories + 1} จากเป้าหมาย ${card.memoryGoal}` : `กำลังแก้ไข 1 จาก ${card.memories} เรื่อง`}</p></div>
            <div className="rounded-[24px] bg-[var(--navy)] p-5 text-white"><Clock className="text-[#ff71a8]" size={21} /><h3 className="mb-0 mt-4 [font-family:var(--font-display)] text-[17px] tracking-[-.035em]">เรื่องเล่าไม่จำเป็นต้องสมบูรณ์</h3><p className="mb-0 mt-2 text-[11px] leading-5 text-white/80">บันทึกสิ่งที่รู้สึกตอนนี้ก่อน คุณกลับมาเติมรายละเอียด รูปภาพ หรือเปลี่ยนสิทธิ์ได้เสมอ</p></div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {state === "delete-confirm" ? (
          <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-[100] grid place-items-center bg-[var(--navy)]/55 p-4 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="delete-memory-title">
            <motion.div animate={{ scale: 1, y: 0 }} className="w-full max-w-[460px] rounded-[26px] bg-white p-6 shadow-2xl sm:p-8" initial={{ scale: .96, y: 10 }}><span className="grid size-12 place-items-center rounded-full bg-[#fff0f3] text-[#b42150]"><WarningCircle size={24} weight="fill" /></span><h2 className="mb-0 mt-5 [font-family:var(--font-display)] text-[24px] tracking-[-.04em]" id="delete-memory-title">ลบความทรงจำนี้?</h2><p className="mb-0 mt-2 text-[10px] leading-5 text-[var(--muted)]">“{title}” จะถูกนำออกจาก Timeline การลบจริงในระบบ Production มีช่วงกู้คืน 30 วัน</p><div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="min-h-11 rounded-full border border-[var(--line)] px-5 text-[12px] font-semibold" onClick={() => setState("idle")} type="button">ยกเลิก</button><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#a3264d] px-5 text-[12px] font-bold text-white" onClick={() => void deleteMemory()} type="button"><Trash size={15} /> ยืนยันการลบ</button></div></motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children, optional = false, required = false, supporting }: { label: string; children: React.ReactNode; optional?: boolean; required?: boolean; supporting?: string }) {
  return <div><div className="mb-2 flex items-center justify-between gap-3"><label className="text-[10px] font-bold">{label}{required ? <span className="ml-1 text-[var(--pink)]">*</span> : null}{optional ? <span className="ml-1 text-[10px] font-normal text-[var(--muted)]">ไม่บังคับ</span> : null}</label>{supporting ? <span className="text-[10px] text-[var(--muted)]">{supporting}</span> : null}</div>{children}</div>;
}

function PrivacyChoice({ value, active, onClick }: { value: MemoryPrivacy; active: boolean; onClick: () => void }) {
  const Icon = value === "private" ? LockKey : value === "circle" ? UsersThree : Eye;
  return <button aria-pressed={active} className={`relative min-h-[120px] rounded-[18px] border p-4 text-left transition ${active ? "border-[var(--pink)] bg-[#fff4f7] shadow-[0_0_0_3px_rgba(233,30,99,.06)]" : "border-[var(--line)] bg-white hover:border-[#dfbbc8]"}`} onClick={onClick} type="button"><span className={`grid size-9 place-items-center rounded-[13px] ${active ? "bg-[var(--pink)] text-white" : "bg-[var(--cream)] text-[var(--muted)]"}`}><Icon size={17} weight={active ? "fill" : "regular"} /></span><strong className="mt-3 block text-[12px]">{privacyLabels[value].label}</strong><span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">{privacyLabels[value].description}</span>{active ? <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-[var(--pink)] text-white"><Check size={11} weight="bold" /></span> : null}</button>;
}

function MemoryPreview({ title, body, date, location, privacy, image }: { title: string; body: string; date: string; location: string; privacy: MemoryPrivacy; image: string }) {
  const Icon = privacy === "private" ? LockKey : privacy === "circle" ? UsersThree : Eye;
  return <motion.div animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white shadow-[var(--shadow-card)]" initial={{ opacity: 0, y: 8 }}>{image ? <div className="relative aspect-[1.6]"><Image alt="ภาพตัวอย่าง" className="object-cover" fill sizes="410px" src={image} unoptimized={image.startsWith("blob:")} /></div> : <div className="grid aspect-[2.1] place-items-center bg-[var(--cream)] text-[#cbbcc2]"><ImageSquare size={32} /></div>}<div className="p-5"><div className="flex items-center justify-between gap-2"><span className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[.1em] text-[var(--pink-strong)]">{date ? new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(`${date}T00:00:00`)) : "ยังไม่ได้เลือกวันที่"}</span><span className="inline-flex items-center gap-1 rounded-full bg-[var(--cream)] px-2 py-1 text-[10px] text-[var(--muted)]"><Icon size={11} /> {privacyLabels[privacy].label}</span></div><h3 className="mb-0 mt-3 [font-family:var(--font-display)] text-[19px] tracking-[-.035em]">{title || "ชื่อความทรงจำ"}</h3><p className="mb-0 mt-3 line-clamp-5 text-[12px] leading-5 text-[var(--muted)]">{body || "เรื่องราวของคุณจะปรากฏตรงนี้…"}</p>{location ? <span className="mt-4 flex items-center gap-1 border-t border-[var(--line)] pt-3 text-[10px] text-[var(--muted)]"><MapPin size={11} /> {location}</span> : null}</div></motion.div>;
}
