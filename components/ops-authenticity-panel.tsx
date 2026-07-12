"use client";

import {
  CheckCircle,
  Fingerprint,
  GlobeHemisphereWest,
  MagnifyingGlass,
  Pulse,
  Radio,
  ShieldWarning,
  WarningOctagon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { emptyArray, runOpsMutation, type ResourceSource } from "./ops-admin-data";
import {
  OpsPanel,
  OpsPanelHeading,
  OpsResourceGate,
  OpsStatCard,
  OpsStatusPill,
  OpsSuccessToast,
} from "./ops-admin-panel";

type AuthenticityEvent = {
  id: string;
  cardId: string;
  collection: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  signal: "Counter replay" | "Impossible travel" | "Velocity spike" | "Signature mismatch";
  status: "Open" | "Investigating" | "Resolved";
  location: string;
  occurredAt: string;
  tapCount: number;
  evidence: string[];
};

const demoEvents: AuthenticityEvent[] = [
  { id: "evt_9W2K8", cardId: "SOUL-26-004218", collection: "SOUL Founder 2026", severity: "Critical", signal: "Counter replay", status: "Open", location: "Bangkok → Frankfurt", occurredAt: "10 ก.ค. · 14:36", tapCount: 19, evidence: ["SUN counter 1,482 ถูกใช้ซ้ำ 7 ครั้ง", "IP ASN เปลี่ยน 4 เครือข่ายใน 11 นาที", "ลายเซ็นถูกต้อง แต่ freshness ไม่ผ่าน"] },
  { id: "evt_9W1R3", cardId: "SOUL-26-000941", collection: "Communication Arts", severity: "High", signal: "Impossible travel", status: "Investigating", location: "Bangkok → Singapore", occurredAt: "10 ก.ค. · 12:11", tapCount: 8, evidence: ["ระยะทาง 1,425 กม. ภายใน 22 นาที", "อุปกรณ์ใหม่ 2 เครื่อง", "Counter sequence ต่อเนื่อง"] },
  { id: "evt_9VZY8", cardId: "SOUL-26-003517", collection: "Pink Memento", severity: "Medium", signal: "Velocity spike", status: "Open", location: "Pathum Wan, Bangkok", occurredAt: "10 ก.ค. · 09:48", tapCount: 31, evidence: ["31 taps ใน 3 นาที", "อุปกรณ์เดียวและพิกัดเดียว", "อาจเป็นจุดสาธิตในกิจกรรม"] },
  { id: "evt_9VTP4", cardId: "SOUL-26-001204", collection: "University Archive", severity: "Low", signal: "Signature mismatch", status: "Resolved", location: "Chiang Mai, Thailand", occurredAt: "9 ก.ค. · 17:02", tapCount: 2, evidence: ["Key version เก่าหลัง rotation", "Reprovision สำเร็จ", "ไม่มี tap ต่อหลังแก้ไข"] },
];

export function OpsAuthenticityPanel() {
  return (
    <OpsResourceGate demoData={demoEvents} emptyDescription="ทุกการแตะผ่าน authenticity policy และยังไม่มี anomaly ที่ต้องตรวจ" emptyTitle="ไม่พบเหตุการณ์ผิดปกติ" endpoint="/api/admin/authenticity" isEmpty={emptyArray}>
      {(data, source) => <AuthenticityWorkspace initialEvents={data} source={source} />}
    </OpsResourceGate>
  );
}

function AuthenticityWorkspace({ initialEvents, source }: { initialEvents: AuthenticityEvent[]; source: ResourceSource }) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<"All" | AuthenticityEvent["severity"]>("All");
  const [resolving, setResolving] = useState(false);
  const [toast, setToast] = useState("");
  const filtered = useMemo(() => events.filter((event) => `${event.cardId} ${event.collection} ${event.signal} ${event.location}`.toLowerCase().includes(query.toLowerCase()) && (severity === "All" || event.severity === severity)), [events, query, severity]);
  const selected = events.find((event) => event.id === selectedId) ?? filtered[0];

  async function resolveEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setResolving(true);
    const form = new FormData(event.currentTarget);
    const resolution = String(form.get("resolution"));
    const note = String(form.get("note"));
    try {
      await runOpsMutation({ body: { note, resolution }, endpoint: `/api/admin/authenticity/${selected.id}/resolve`, source });
      setEvents((value) => value.map((item) => item.id === selected.id ? { ...item, status: "Resolved" } : item));
      setToast(`${selected.cardId} ถูกปิดเคสเป็น ${resolution}`);
    } finally {
      setResolving(false);
    }
  }

  const openCount = events.filter((event) => event.status !== "Resolved").length;

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard accent="navy" icon={<Fingerprint size={21} weight="duotone" />} label="Verified taps" note="ผ่าน SUN + policy วันนี้" value="12,842" />
        <OpsStatCard icon={<ShieldWarning size={21} weight="duotone" />} label="Open anomalies" note="กำลังรอ triage" value={openCount.toString()} />
        <OpsStatCard accent="amber" icon={<Pulse size={21} weight="duotone" />} label="Anomaly rate" note="เป้าหมายต่ำกว่า 0.10%" value="0.07%" />
        <OpsStatCard accent="green" icon={<CheckCircle size={21} weight="duotone" />} label="Signature pass" note="ใน 24 ชั่วโมงล่าสุด" value="99.98%" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(330px,.85fr)]">
        <OpsPanel>
          <OpsPanelHeading eyebrow="ANOMALY QUEUE" title="เหตุการณ์ที่ควรตรวจ" />
          <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-[#fcfafb] px-3 focus-within:border-[var(--pink)]"><MagnifyingGlass size={17} className="text-[#988b91]" /><span className="sr-only">ค้นหา anomaly</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Card ID, collection, location…" value={query} /></label>
            <select aria-label="กรองระดับความรุนแรง" className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold" onChange={(event) => setSeverity(event.target.value as typeof severity)} value={severity}><option value="All">ทุกระดับ</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
          </div>
          <div className="space-y-2">
            {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] py-12 text-center text-sm text-[var(--muted)]">ไม่พบ anomaly ที่ตรงกับตัวกรอง</div> : filtered.map((item) => {
              const active = selected?.id === item.id;
              return (
                <button aria-pressed={active} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-[#d99db4] bg-[#fff7fa]" : "border-[var(--line)] bg-white hover:border-[#ddc2cc]"}`} key={item.id} onClick={() => setSelectedId(item.id)} type="button">
                  <span className="flex items-start justify-between gap-3"><span className="flex min-w-0 items-center gap-3"><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.severity === "Critical" ? "bg-[#fff0f3] text-[#b2164b]" : "bg-[#fff6e9] text-[#a05c15]"}`}><WarningOctagon size={20} weight="duotone" /></span><span className="min-w-0"><strong className="block truncate text-xs">{item.cardId}</strong><small className="mt-1 block truncate text-[12px] text-[var(--muted)]">{item.collection} · {item.location}</small></span></span><OpsStatusPill label={item.severity} tone={item.severity === "Critical" ? "danger" : item.severity === "High" || item.severity === "Medium" ? "warning" : "neutral"} /></span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--line)] pt-3 text-[12px] text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><Radio size={14} /> {item.signal}</span><span>{item.tapCount} taps</span><span>{item.occurredAt}</span></span>
                </button>
              );
            })}
          </div>
        </OpsPanel>

        {selected && (
          <OpsPanel className="h-fit xl:sticky xl:top-[98px]">
            <OpsPanelHeading eyebrow="EVIDENCE REVIEW" title={selected.cardId} />
            <div className="mb-4 flex flex-wrap gap-2"><OpsStatusPill label={selected.status} tone={selected.status === "Resolved" ? "success" : selected.status === "Investigating" ? "info" : "danger"} /><OpsStatusPill label={selected.signal} tone="neutral" /></div>
            <div className="rounded-2xl bg-[var(--navy)] p-4 text-white">
              <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.11em] text-[#ff8bb8]"><GlobeHemisphereWest size={15} /> TAP PATH</div>
              <strong className="mt-3 block font-[family-name:var(--font-display)] text-lg">{selected.location}</strong>
              <p className="mb-0 mt-1 text-[10px] text-[#9eabba]">Observed at {selected.occurredAt} · {selected.tapCount} requests</p>
            </div>
            <ul className="my-5 space-y-2 p-0">
              {selected.evidence.map((evidence) => <li className="flex gap-2.5 rounded-xl border border-[var(--line)] p-3 text-[11px] leading-5 text-[var(--muted)]" key={evidence}><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--pink)]" /> {evidence}</li>)}
            </ul>
            {selected.status !== "Resolved" ? (
              <form className="space-y-3 border-t border-[var(--line)] pt-4" onSubmit={resolveEvent}>
                <label className="block text-[10px] font-semibold">Resolution
                  <select className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-xs" defaultValue="Monitor" name="resolution"><option>Blocked clone</option><option>Trusted activity</option><option>Monitor</option></select>
                </label>
                <label className="block text-[10px] font-semibold">Operator note
                  <textarea className="mt-1.5 min-h-20 w-full resize-y rounded-xl border border-[var(--line)] p-3 text-xs outline-none focus:border-[var(--pink)]" name="note" placeholder="สรุปหลักฐานและเหตุผล…" required />
                </label>
                <button className="min-h-11 w-full rounded-xl bg-[var(--pink)] text-xs font-semibold text-white disabled:opacity-60" disabled={resolving} type="submit">{resolving ? "กำลังบันทึก…" : "Resolve anomaly"}</button>
              </form>
            ) : <div className="flex items-center gap-2 rounded-xl bg-[#edf9f5] p-3 text-xs font-semibold text-[var(--success)]"><CheckCircle size={18} weight="fill" /> เคสนี้ได้รับการตรวจและปิดแล้ว</div>}
          </OpsPanel>
        )}
      </section>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

