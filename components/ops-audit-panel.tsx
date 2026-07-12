"use client";

import {
  CheckCircle,
  Copy,
  DownloadSimple,
  Funnel,
  LockKey,
  MagnifyingGlass,
  Scroll,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { emptyArray } from "./ops-admin-data";
import {
  OpsPanel,
  OpsPanelHeading,
  OpsResourceGate,
  OpsStatCard,
  OpsStatusPill,
  OpsSuccessToast,
} from "./ops-admin-panel";

type AuditEvent = {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ip: string;
  occurredAt: string;
  outcome: "Success" | "Denied" | "Failed";
  metadata: string;
};

const demoAudit: AuditEvent[] = [
  { id: "aud_01J2Q8NE", actor: "พิมพ์ชนก อุดมศิลป์", actorRole: "Owner", action: "organization.policy.update", resource: "Organization", resourceId: "org_chula_soul", ip: "203.150.12.84", occurredAt: "10 ก.ค. 2026 · 14:41:08", outcome: "Success", metadata: "retentionDays: 730 → 1095" },
  { id: "aud_01J2Q7W4", actor: "ธนวัฒน์ สุขเกษม", actorRole: "Admin", action: "card.batch.create", resource: "CardBatch", resourceId: "BAT-2607-015", ip: "161.200.86.31", occurredAt: "10 ก.ค. 2026 · 13:19:42", outcome: "Success", metadata: "quantity: 300, chip: NTAG424 DNA" },
  { id: "aud_01J2Q6J9", actor: "unknown", actorRole: "Anonymous", action: "admin.session.create", resource: "Session", resourceId: "redacted", ip: "45.155.205.9", occurredAt: "10 ก.ค. 2026 · 12:57:01", outcome: "Denied", metadata: "rate_limit: 8/5m, country: NL" },
  { id: "aud_01J2Q5B2", actor: "กัญญารัตน์ แสงทอง", actorRole: "Editor", action: "memory.approve", resource: "Memory", resourceId: "mem_8NXE1", ip: "161.200.122.19", occurredAt: "10 ก.ค. 2026 · 11:34:27", outcome: "Success", metadata: "rights_reference: ARC-2549-118" },
  { id: "aud_01J2Q3Y7", actor: "SOUL System", actorRole: "Service", action: "nfc.key.rotate", resource: "KeyVersion", resourceId: "kv_prod_07", ip: "internal", occurredAt: "10 ก.ค. 2026 · 09:00:00", outcome: "Success", metadata: "previous: kv_prod_06, grace: 24h" },
  { id: "aud_01J2PZZ1", actor: "ศุภกิตติ์ พูลผล", actorRole: "Support", action: "user.role.update", resource: "User", resourceId: "usr_01H9RA", ip: "49.228.117.20", occurredAt: "9 ก.ค. 2026 · 18:22:16", outcome: "Failed", metadata: "insufficient_scope: iam.write" },
];

export function OpsAuditPanel() {
  return (
    <OpsResourceGate demoData={demoAudit} emptyDescription="ยังไม่มีเหตุการณ์ที่ตรงกับช่วงเวลานี้" emptyTitle="Audit trail ว่าง" endpoint="/api/admin/audit" isEmpty={emptyArray}>
      {(data) => <AuditWorkspace initialEvents={data} />}
    </OpsResourceGate>
  );
}

function AuditWorkspace({ initialEvents }: { initialEvents: AuditEvent[] }) {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState<"All" | AuditEvent["outcome"]>("All");
  const [toast, setToast] = useState("");
  const filtered = useMemo(() => initialEvents.filter((event) => `${event.actor} ${event.action} ${event.resource} ${event.resourceId} ${event.ip} ${event.metadata}`.toLowerCase().includes(query.toLowerCase()) && (outcome === "All" || event.outcome === outcome)), [initialEvents, outcome, query]);

  async function copyEvent(event: AuditEvent) {
    await navigator.clipboard?.writeText(JSON.stringify(event, null, 2));
    setToast(`คัดลอก ${event.id} แล้ว`);
  }

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<Scroll size={21} weight="duotone" />} label="Events / 24h" note="ทุก tenant action" value="1,284" />
        <OpsStatCard accent="green" icon={<CheckCircle size={21} weight="duotone" />} label="Successful" note="98.9% ของ events" value="1,270" />
        <OpsStatCard accent="amber" icon={<WarningCircle size={21} weight="duotone" />} label="Denied / failed" note="ส่งเข้า security signals" value="14" />
        <OpsStatCard accent="navy" icon={<LockKey size={21} weight="duotone" />} label="Retention" note="Policy ขององค์กร" value="1,095d" />
      </section>

      <OpsPanel>
        <OpsPanelHeading action={<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 text-xs font-semibold hover:border-[#d8bac5]" onClick={() => setToast("เริ่มเตรียม signed CSV export แล้ว")} type="button"><DownloadSimple size={16} /> Export signed CSV</button>} eyebrow="IMMUTABLE EVENT STREAM" title="Governance timeline" />
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-[#fcfafb] px-3 focus-within:border-[var(--pink)]"><MagnifyingGlass className="text-[#988b91]" size={17} /><span className="sr-only">ค้นหา audit log</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Actor, action, resource ID, IP…" value={query} /></label>
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3"><Funnel size={16} className="text-[var(--muted)]" /><span className="sr-only">กรอง outcome</span><select className="bg-transparent text-xs font-semibold outline-none" onChange={(event) => setOutcome(event.target.value as typeof outcome)} value={outcome}><option value="All">ทุก outcome</option><option>Success</option><option>Denied</option><option>Failed</option></select></label>
        </div>

        {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] py-14 text-center text-sm text-[var(--muted)]">ไม่พบเหตุการณ์ที่ตรงกับตัวกรอง</div> : (
          <div className="space-y-2">
            {filtered.map((event) => (
              <article className="grid gap-4 rounded-2xl border border-[var(--line)] p-4 md:grid-cols-[minmax(0,1.25fr)_minmax(170px,.75fr)_minmax(150px,.65fr)_auto] md:items-center" key={event.id}>
                <div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${event.outcome === "Success" ? "bg-[#edf9f5] text-[var(--success)]" : "bg-[#fff0f3] text-[#ac1848]"}`}>{event.outcome === "Success" ? <ShieldCheck size={18} weight="duotone" /> : <WarningCircle size={18} weight="duotone" />}</span><div className="min-w-0"><strong className="block truncate font-[family-name:var(--font-mono)] text-[10px] tracking-[-0.01em]">{event.action}</strong><span className="mt-1 block truncate text-[10px] text-[var(--muted)]">{event.actor} · {event.actorRole}</span><small className="mt-1 block truncate text-[9px] text-[#9b8f95]">{event.metadata}</small></div></div>
                <div><strong className="block truncate text-[10px]">{event.resource}</strong><span className="mt-1 block truncate font-[family-name:var(--font-mono)] text-[8px] text-[var(--muted)]">{event.resourceId}</span></div>
                <div><OpsStatusPill label={event.outcome} tone={event.outcome === "Success" ? "success" : "danger"} /><span className="mt-1.5 block font-[family-name:var(--font-mono)] text-[8px] text-[#94888e]">{event.ip}</span></div>
                <div className="flex items-center justify-between gap-3 md:block md:text-right"><span className="block text-[9px] leading-4 text-[var(--muted)]">{event.occurredAt}</span><button aria-label={`คัดลอก ${event.id}`} className="mt-0 grid size-9 place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--pink-strong)] md:ml-auto md:mt-2" onClick={() => void copyEvent(event)} type="button"><Copy size={15} /></button></div>
              </article>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2 border-t border-[var(--line)] pt-4 text-[9px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"><span>Showing {filtered.length} of {initialEvents.length} events</span><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[var(--success)]" /> Append-only · SHA-256 chained · UTC normalized</span></div>
      </OpsPanel>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

