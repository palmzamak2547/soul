"use client";

import {
  CardsThree,
  CheckCircle,
  DownloadSimple,
  Fingerprint,
  Package,
  Plus,
  Stack,
  WarningCircle,
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

type CardBatch = {
  id: string;
  collection: string;
  chip: "NTAG424 DNA" | "NTAG216";
  quantity: number;
  provisioned: number;
  failed: number;
  status: "Ready" | "Provisioning" | "Quality check" | "Draft";
  createdAt: string;
  operator: string;
};

const demoBatches: CardBatch[] = [
  { id: "BAT-2607-014", collection: "SOUL Founder 2026", chip: "NTAG424 DNA", quantity: 500, provisioned: 500, failed: 3, status: "Ready", createdAt: "10 ก.ค. 2026", operator: "พิมพ์ชนก" },
  { id: "BAT-2607-015", collection: "Communication Arts: First Frame", chip: "NTAG424 DNA", quantity: 300, provisioned: 186, failed: 1, status: "Provisioning", createdAt: "10 ก.ค. 2026", operator: "ธนวัฒน์" },
  { id: "BAT-2607-011", collection: "Pink Memento — Centennial", chip: "NTAG424 DNA", quantity: 250, provisioned: 250, failed: 7, status: "Quality check", createdAt: "8 ก.ค. 2026", operator: "กัญญารัตน์" },
  { id: "BAT-2607-016", collection: "Freshmen Welcome 2026", chip: "NTAG216", quantity: 1000, provisioned: 0, failed: 0, status: "Draft", createdAt: "10 ก.ค. 2026", operator: "พิมพ์ชนก" },
];

export function OpsCardsPanel() {
  return (
    <OpsResourceGate
      demoData={demoBatches}
      emptyDescription="สร้าง provisioning batch แรกเพื่อเริ่มออกการ์ด"
      emptyTitle="คลังการ์ดยังว่าง"
      endpoint="/api/admin/card-batches"
      isEmpty={emptyArray}
    >
      {(data, source) => <CardsWorkspace initialBatches={data} source={source} />}
    </OpsResourceGate>
  );
}

function CardsWorkspace({ initialBatches, source }: { initialBatches: CardBatch[]; source: ResourceSource }) {
  const [batches, setBatches] = useState(initialBatches);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const totalCards = batches.reduce((sum, item) => sum + item.quantity, 0);
  const totalProvisioned = batches.reduce((sum, item) => sum + item.provisioned, 0);
  const totalFailed = batches.reduce((sum, item) => sum + item.failed, 0);

  async function createBatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    const form = new FormData(event.currentTarget);
    const quantity = Math.max(1, Number(form.get("quantity")) || 100);
    const batch: CardBatch = {
      chip: form.get("chip") as CardBatch["chip"],
      collection: String(form.get("collection")),
      createdAt: "วันนี้",
      failed: 0,
      id: `BAT-2607-${String(batches.length + 17).padStart(3, "0")}`,
      operator: "SOUL Operator",
      provisioned: 0,
      quantity,
      status: "Draft",
    };
    try {
      await runOpsMutation({ body: batch, endpoint: "/api/admin/card-batches", source });
      setBatches((value) => [batch, ...value]);
      setShowForm(false);
      setToast(`สร้าง ${batch.id} จำนวน ${batch.quantity.toLocaleString()} ใบแล้ว`);
    } finally {
      setCreating(false);
    }
  }

  async function exportBatch(batch: CardBatch) {
    await runOpsMutation({ body: { format: "csv" }, endpoint: `/api/admin/card-batches/${batch.id}/export`, source });
    setToast(`เตรียม manifest ของ ${batch.id} แล้ว`);
  }

  async function signDemoNfcLink() {
    try {
      const response = await fetch("/api/admin/nfc/sign", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ label: "ops-demo-link" }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        data?: { mode?: string; absoluteUrl?: string; previewUrl?: string; note?: string };
        error?: { message?: string };
      };
      if (!response.ok || !payload.ok) {
        setToast(payload.error?.message ?? "ลงนาม NFC ไม่สำเร็จ — ตรวจ admin session");
        return;
      }
      const url = payload.data?.absoluteUrl ?? payload.data?.previewUrl ?? "";
      if (url && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      setToast(
        payload.data?.mode === "signed"
          ? `Signed URL พร้อมแล้ว (คัดลอกแล้ว): ${url}`
          : `Demo preview (ยังไม่มี NFC_SIGNING_SECRET): ${url}`,
      );
    } catch {
      setToast("เครือข่ายล้มเหลวตอนเรียก NFC sign");
    }
  }

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<CardsThree size={21} weight="duotone" />} label="การ์ดในระบบ" note="รวมทุก batch" value={totalCards.toLocaleString()} />
        <OpsStatCard accent="green" icon={<CheckCircle size={21} weight="duotone" />} label="Provisioned" note={`${Math.round((totalProvisioned / totalCards) * 100)}% ของ inventory`} value={totalProvisioned.toLocaleString()} />
        <OpsStatCard accent="navy" icon={<Fingerprint size={21} weight="duotone" />} label="DNA secure tags" note="NTAG424 DNA" value={batches.filter((item) => item.chip === "NTAG424 DNA").length.toString()} />
        <OpsStatCard accent="amber" icon={<WarningCircle size={21} weight="duotone" />} label="QC exceptions" note="ต้องตรวจซ้ำก่อนส่งมอบ" value={totalFailed.toString()} />
      </section>

      {showForm && (
        <OpsPanel className="border-[#dfbdca] bg-[#fffafb]">
          <OpsPanelHeading eyebrow="NEW PROVISIONING BATCH" title="กำหนดชุดการ์ดที่จะออก" />
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_.8fr_.7fr_auto] xl:items-end" onSubmit={createBatch}>
            <label className="text-xs font-semibold">Collection
              <input className="mt-2 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-[var(--pink)]" name="collection" placeholder="เช่น Alumni Reunion 2026" required />
            </label>
            <label className="text-xs font-semibold">Chip profile
              <select className="mt-2 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none" defaultValue="NTAG424 DNA" name="chip"><option>NTAG424 DNA</option><option>NTAG216</option></select>
            </label>
            <label className="text-xs font-semibold">จำนวน
              <input className="mt-2 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none" defaultValue="100" max="10000" min="1" name="quantity" type="number" />
            </label>
            <div className="flex gap-2">
              <button className="min-h-11 flex-1 rounded-xl border border-[var(--line)] px-4 text-xs font-semibold" onClick={() => setShowForm(false)} type="button">ยกเลิก</button>
              <button className="min-h-11 flex-1 rounded-xl bg-[var(--pink)] px-4 text-xs font-semibold text-white disabled:opacity-60" disabled={creating} type="submit">{creating ? "กำลังสร้าง…" : "สร้าง batch"}</button>
            </div>
          </form>
        </OpsPanel>
      )}

      <OpsPanel>
        <OpsPanelHeading
          action={
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 text-xs font-semibold transition hover:border-[#d8b5c2]"
                onClick={() => void signDemoNfcLink()}
                type="button"
              >
                <Fingerprint size={16} /> Sign NFC URL
              </button>
              <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--pink)] px-4 text-xs font-semibold text-white transition hover:bg-[var(--pink-strong)]" onClick={() => setShowForm(true)} type="button"><Plus size={16} weight="bold" /> New batch</button>
            </div>
          }
          eyebrow="PROVISIONING QUEUE"
          title="Batch inventory"
        />
        <div className="space-y-3">
          {batches.map((batch) => {
            const progress = Math.round((batch.provisioned / batch.quantity) * 100);
            return (
              <article className="grid gap-4 rounded-2xl border border-[var(--line)] p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(180px,.8fr)_minmax(150px,.65fr)_auto] md:items-center" key={batch.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--navy)] text-[#ff79ad]"><Package size={22} weight="duotone" /></span>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm">{batch.collection}</strong>
                    <span className="mt-1 block font-[family-name:var(--font-mono)] text-[9px] tracking-[0.04em] text-[var(--muted)]">{batch.id} · {batch.chip}</span>
                    <small className="mt-1 block text-[9px] text-[#9a8e94]">{batch.createdAt} · {batch.operator}</small>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-[10px]"><span className="text-[var(--muted)]">{batch.provisioned.toLocaleString()} / {batch.quantity.toLocaleString()}</span><strong>{progress}%</strong></div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f0e9ec]" role="progressbar" aria-label={`Provisioning ${batch.id}`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progress}>
                    <span className="block h-full rounded-full bg-[var(--pink)] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div>
                  <OpsStatusPill label={batch.status} tone={batch.status === "Ready" ? "success" : batch.status === "Quality check" ? "warning" : batch.status === "Provisioning" ? "info" : "neutral"} />
                  <span className="mt-1.5 block text-[9px] text-[#94888e]">{batch.failed ? `${batch.failed} exceptions` : "No exceptions"}</span>
                </div>
                <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-3 text-[10px] font-semibold transition hover:border-[#d8b5c2] hover:text-[var(--pink-strong)]" onClick={() => void exportBatch(batch)} type="button"><DownloadSimple size={16} /> Manifest</button>
              </article>
            );
          })}
        </div>
      </OpsPanel>

      <section className="grid gap-4 md:grid-cols-2">
        <OpsPanel className="bg-[var(--navy)] text-white">
          <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#ff79ad]"><Fingerprint size={23} weight="duotone" /></span><div><span className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.12em] text-[#ff8bb8]">SECURE PROFILE</span><h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">NTAG424 DNA default</h2><p className="mb-0 mt-2 text-xs leading-6 text-[#a6b0bf]">ทุก production batch ใช้ SUN message และ server-side AES verification พร้อมเก็บเฉพาะ key reference ในระบบ</p></div></div>
        </OpsPanel>
        <OpsPanel>
          <div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--blush)] text-[var(--pink-strong)]"><Stack size={23} weight="duotone" /></span><div><span className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.12em] text-[var(--pink-strong)]">PRINT HANDOFF</span><h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">Serial-to-artwork reconciliation</h2><p className="mb-0 mt-2 text-xs leading-6 text-[var(--muted)]">Manifest ทำหน้าที่จับคู่ serial, artwork revision และสถานะ QC เพื่อป้องกันการพิมพ์สลับ edition</p></div></div>
        </OpsPanel>
      </section>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

