"use client";

import {
  ChatCenteredDots,
  Check,
  Clock,
  Eye,
  Flag,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  TextT,
  VideoCamera,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { emptyArray, runOpsMutation, type ResourceSource } from "./ops-admin-data";
import {
  OpsPanel,
  OpsPanelHeading,
  OpsResourceGate,
  OpsStatCard,
  OpsStatusPill,
  OpsSuccessToast,
} from "./ops-admin-panel";

type MemoryReview = {
  id: string;
  author: string;
  title: string;
  excerpt: string;
  collection: string;
  mediaType: "Text" | "Photo" | "Video";
  reason: string;
  status: "Pending" | "Escalated" | "Approved" | "Rejected";
  submittedAt: string;
  privacy: "Public" | "Members" | "Private";
};

const demoReviews: MemoryReview[] = [
  { id: "mem_8P2A4", author: "Mint N.", title: "วันแรกที่หอประชุมใหญ่", excerpt: "รูปนี้ถ่ายหลังพิธีไหว้ครูปี 2562 เป็นครั้งแรกที่พวกเราได้ขึ้นเวทีพร้อมกัน…", collection: "Freshmen Welcome", mediaType: "Photo", reason: "บุคคลหลายคนในภาพ · ตรวจ consent", status: "Pending", submittedAt: "12 นาทีที่แล้ว", privacy: "Public" },
  { id: "mem_8P19C", author: "Narin C.", title: "เสียงจากห้องซ้อมชั้น 8", excerpt: "คลิปสั้นก่อนการแสดงละครเวทีนิเทศจุฬาฯ พร้อมคำบรรยายจากทีมงานรุ่น 58", collection: "Communication Arts", mediaType: "Video", reason: "ตรวจลิขสิทธิ์เสียงประกอบ", status: "Escalated", submittedAt: "38 นาทีที่แล้ว", privacy: "Members" },
  { id: "mem_8NZQ7", author: "Ploy S.", title: "จดหมายถึงตัวเองในอีกสิบปี", excerpt: "ถ้าย้อนกลับมาอ่าน อยากให้จำว่าเราเคยกลัวแต่ก็ยังตัดสินใจลงมือทำ…", collection: "SOUL Founder 2026", mediaType: "Text", reason: "Keyword safety review", status: "Pending", submittedAt: "1 ชม.ที่แล้ว", privacy: "Private" },
  { id: "mem_8NXE1", author: "Alumni Office", title: "ภาพจากงานคืนเหย้า 2549", excerpt: "ภาพหมู่ศิษย์เก่าหน้าศาลาพระเกี้ยว พร้อมรายชื่อที่ได้รับอนุญาตให้เผยแพร่", collection: "University Archive", mediaType: "Photo", reason: "Archive rights cleared", status: "Approved", submittedAt: "เมื่อวาน", privacy: "Public" },
];

export function OpsModerationPanel() {
  return (
    <OpsResourceGate demoData={demoReviews} emptyDescription="ไม่มี memory ใหม่ที่ต้องตรวจ ทีมสามารถกลับมาได้เมื่อมี submission" emptyTitle="Moderation queue ว่างแล้ว" endpoint="/api/admin/moderation" isEmpty={emptyArray}>
      {(data, source) => <ModerationWorkspace initialReviews={data} source={source} />}
    </OpsResourceGate>
  );
}

function ModerationWorkspace({ initialReviews, source }: { initialReviews: MemoryReview[]; source: ResourceSource }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedId, setSelectedId] = useState(initialReviews[0]?.id ?? "");
  const [status, setStatus] = useState<"All" | MemoryReview["status"]>("All");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const filtered = reviews.filter((review) => status === "All" || review.status === status);
  const selected = reviews.find((review) => review.id === selectedId) ?? filtered[0];

  async function decide(decision: "approve" | "reject" | "escalate") {
    if (!selected) return;
    setBusy(true);
    const nextStatus: MemoryReview["status"] = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Escalated";
    try {
      await runOpsMutation({ body: { decision, reason: `Reviewed from SOUL operations: ${selected.reason}` }, endpoint: `/api/admin/moderation/${selected.id}/decision`, source });
      setReviews((value) => value.map((item) => item.id === selected.id ? { ...item, status: nextStatus } : item));
      setToast(`${selected.title} ถูกเปลี่ยนสถานะเป็น ${nextStatus}`);
    } finally {
      setBusy(false);
    }
  }

  const queueCount = reviews.filter((review) => review.status === "Pending").length;

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<Clock size={21} weight="duotone" />} label="รอตรวจ" note="Median wait 18 นาที" value={queueCount.toString()} />
        <OpsStatCard accent="amber" icon={<Flag size={21} weight="duotone" />} label="Escalated" note="Rights / safety specialist" value={reviews.filter((review) => review.status === "Escalated").length.toString()} />
        <OpsStatCard accent="green" icon={<ShieldCheck size={21} weight="duotone" />} label="Approved today" note="รวม auto + manual" value="28" />
        <OpsStatCard accent="navy" icon={<ChatCenteredDots size={21} weight="duotone" />} label="SLA compliance" note="เป้าหมายตรวจใน 4 ชม." value="98.4%" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <OpsPanel>
          <OpsPanelHeading action={<select aria-label="กรองสถานะ moderation" className="min-h-10 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold" onChange={(event) => setStatus(event.target.value as typeof status)} value={status}><option value="All">ทั้งหมด</option><option>Pending</option><option>Escalated</option><option>Approved</option><option>Rejected</option></select>} eyebrow="REVIEW QUEUE" title="Memory submissions" />
          <div className="space-y-2">
            {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] py-12 text-center text-sm text-[var(--muted)]">ไม่มีรายการในสถานะนี้</div> : filtered.map((review) => {
              const Icon = review.mediaType === "Photo" ? ImageIcon : review.mediaType === "Video" ? VideoCamera : TextT;
              const active = review.id === selected?.id;
              return (
                <button aria-pressed={active} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-[#d99db4] bg-[#fff7fa]" : "border-[var(--line)] hover:border-[#dec4ce]"}`} key={review.id} onClick={() => setSelectedId(review.id)} type="button">
                  <span className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--blush)] text-[var(--pink-strong)]"><Icon size={20} weight="duotone" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><strong className="truncate text-xs">{review.title}</strong><OpsStatusPill label={review.status} tone={review.status === "Approved" ? "success" : review.status === "Rejected" ? "danger" : review.status === "Escalated" ? "warning" : "info"} /></span><small className="mt-1 block truncate text-[12px] text-[var(--muted)]">{review.author} · {review.collection}</small><span className="mt-2 block text-[12px] text-[#9a6a7c]">{review.reason}</span></span></span>
                </button>
              );
            })}
          </div>
        </OpsPanel>

        {selected && (
          <OpsPanel className="h-fit xl:sticky xl:top-[98px]">
            <OpsPanelHeading eyebrow={`MEMORY REVIEW · ${selected.id}`} title={selected.title} />
            <div className="mb-5 flex flex-wrap gap-2"><OpsStatusPill label={selected.mediaType} tone="neutral" /><OpsStatusPill label={selected.privacy} tone={selected.privacy === "Public" ? "info" : "neutral"} /><OpsStatusPill label={selected.status} tone={selected.status === "Approved" ? "success" : selected.status === "Rejected" ? "danger" : selected.status === "Escalated" ? "warning" : "info"} /></div>
            <article className="rounded-2xl border border-[var(--line)] bg-[#fdfafb] p-5">
              <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] text-[var(--pink-strong)]"><Eye size={15} /> CONTENT PREVIEW</div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.03em]">{selected.title}</h3>
              <p className="mb-0 mt-3 text-sm leading-7 text-[var(--muted)]">{selected.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-[10px] text-[#91858b]"><span>{selected.author}</span><span>{selected.submittedAt}</span></div>
            </article>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[var(--navy)] p-4 text-white"><Lock className="mt-0.5 shrink-0 text-[#ff82b2]" size={20} weight="duotone" /><div><strong className="text-xs">Privacy boundary: {selected.privacy}</strong><p className="mb-0 mt-1 text-[10px] leading-5 text-[#9faabb]">ผู้ตรวจเห็นเฉพาะข้อมูลที่จำเป็นต่อเหตุผล moderation และทุกการตัดสินใจถูกบันทึกใน audit trail</p></div></div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#efcbd7] bg-[#fff4f7] text-xs font-semibold text-[#a91a49] disabled:opacity-60" disabled={busy} onClick={() => void decide("reject")} type="button"><X size={17} weight="bold" /> Reject</button>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#f0ddc3] bg-[#fff8ed] text-xs font-semibold text-[#945813] disabled:opacity-60" disabled={busy} onClick={() => void decide("escalate")} type="button"><Flag size={17} /> Escalate</button>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--success)] text-xs font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => void decide("approve")} type="button"><Check size={17} weight="bold" /> Approve</button>
            </div>
          </OpsPanel>
        )}
      </section>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

