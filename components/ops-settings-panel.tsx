"use client";

import {
  Buildings,
  Clock,
  Database,
  EnvelopeSimple,
  Globe,
  Key,
  PaintBrush,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useState } from "react";
import { runOpsMutation, type ResourceSource } from "./ops-admin-data";
import {
  OpsPanel,
  OpsPanelHeading,
  OpsResourceGate,
  OpsStatCard,
  OpsSuccessToast,
} from "./ops-admin-panel";

type OrganizationSettings = {
  name: string;
  slug: string;
  domain: string;
  supportEmail: string;
  locale: string;
  timezone: string;
  retentionDays: number;
  requireMfa: boolean;
  allowPublicMemories: boolean;
  brandColor: string;
  updatedAt: string;
};

const demoSettings: OrganizationSettings = {
  allowPublicMemories: true,
  brandColor: "#E91E63",
  domain: "soul.chula.ac.th",
  locale: "th-TH",
  name: "Chulalongkorn University · SOUL",
  requireMfa: true,
  retentionDays: 1095,
  slug: "chula-soul",
  supportEmail: "soul-support@chula.ac.th",
  timezone: "Asia/Bangkok",
  updatedAt: "10 ก.ค. 2026 · 14:41",
};

const isSettingsEmpty = (value: OrganizationSettings) => !value.name;

export function OpsSettingsPanel() {
  return (
    <OpsResourceGate demoData={demoSettings} emptyDescription="สร้าง organization profile ก่อนเปิดใช้งาน tenant" emptyTitle="ยังไม่มีข้อมูลองค์กร" endpoint="/api/admin/organization" isEmpty={isSettingsEmpty}>
      {(data, source) => <SettingsWorkspace initialSettings={data} source={source} />}
    </OpsResourceGate>
  );
}

function SettingsWorkspace({ initialSettings, source }: { initialSettings: OrganizationSettings; source: ResourceSource }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const next: OrganizationSettings = {
      allowPublicMemories: form.get("allowPublicMemories") === "on",
      brandColor: String(form.get("brandColor")),
      domain: String(form.get("domain")),
      locale: String(form.get("locale")),
      name: String(form.get("name")),
      requireMfa: form.get("requireMfa") === "on",
      retentionDays: Number(form.get("retentionDays")),
      slug: String(form.get("slug")),
      supportEmail: String(form.get("supportEmail")),
      timezone: String(form.get("timezone")),
      updatedAt: "เพิ่งอัปเดต",
    };
    try {
      await runOpsMutation({ body: next, endpoint: "/api/admin/organization", method: "PATCH", source });
      setSettings(next);
      setToast("บันทึก organization settings และสร้าง audit event แล้ว");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--pink)]";

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<Buildings size={21} weight="duotone" />} label="Tenant" note="Production organization" value="1" />
        <OpsStatCard accent="green" icon={<Globe size={21} weight="duotone" />} label="Custom domain" note="DNS + TLS verified" value="Active" />
        <OpsStatCard accent="navy" icon={<ShieldCheck size={21} weight="duotone" />} label="MFA policy" note="Owner / Admin / Support" value={settings.requireMfa ? "Required" : "Optional"} />
        <OpsStatCard accent="amber" icon={<Database size={21} weight="duotone" />} label="Data retention" note="Memories + audit metadata" value={`${settings.retentionDays}d`} />
      </section>

      <form className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]" onSubmit={save}>
        <div className="space-y-4">
          <OpsPanel>
            <OpsPanelHeading eyebrow="ORGANIZATION PROFILE" title="ตัวตนของ tenant" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs font-semibold md:col-span-2"><span className="inline-flex items-center gap-2"><Buildings size={15} /> Organization name</span><input className={inputClass} defaultValue={settings.name} name="name" required /></label>
              <label className="text-xs font-semibold">Organization slug<input className={inputClass} defaultValue={settings.slug} name="slug" pattern="[a-z0-9-]+" required /></label>
              <label className="text-xs font-semibold"><span className="inline-flex items-center gap-2"><Globe size={15} /> Custom domain</span><input className={inputClass} defaultValue={settings.domain} name="domain" required /></label>
              <label className="text-xs font-semibold"><span className="inline-flex items-center gap-2"><EnvelopeSimple size={15} /> Support email</span><input className={inputClass} defaultValue={settings.supportEmail} name="supportEmail" required type="email" /></label>
              <label className="text-xs font-semibold"><span className="inline-flex items-center gap-2"><PaintBrush size={15} /> Brand accent</span><span className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3"><input aria-label="Brand color" className="size-7 rounded-lg border-0 bg-transparent p-0" defaultValue={settings.brandColor} name="brandColor" type="color" /><input aria-label="Brand color hex" className="min-w-0 flex-1 bg-transparent font-[family-name:var(--font-mono)] text-xs uppercase outline-none" defaultValue={settings.brandColor} /></span></label>
            </div>
          </OpsPanel>

          <OpsPanel>
            <OpsPanelHeading eyebrow="LOCALE & DATA" title="เวลา ภาษา และวงจรข้อมูล" />
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-xs font-semibold">Locale<select className={inputClass} defaultValue={settings.locale} name="locale"><option value="th-TH">ไทย (th-TH)</option><option value="en-US">English (en-US)</option></select></label>
              <label className="text-xs font-semibold"><span className="inline-flex items-center gap-2"><Clock size={15} /> Timezone</span><select className={inputClass} defaultValue={settings.timezone} name="timezone"><option>Asia/Bangkok</option><option>UTC</option></select></label>
              <label className="text-xs font-semibold">Retention (days)<input className={inputClass} defaultValue={settings.retentionDays} max="3650" min="30" name="retentionDays" type="number" /></label>
            </div>
            <div className="mt-4 rounded-2xl border border-[#e2e9ee] bg-[#f5f8fa] p-4 text-[11px] leading-5 text-[var(--muted)]"><Database className="mr-2 inline text-[var(--success)]" size={17} weight="duotone" /> การเปลี่ยน retention จะใช้กับข้อมูลใหม่ทันที และส่ง existing records เข้า lifecycle queue โดยไม่ลบแบบ synchronous</div>
          </OpsPanel>
        </div>

        <div className="space-y-4">
          <OpsPanel>
            <OpsPanelHeading eyebrow="SECURITY BASELINE" title="นโยบายระดับองค์กร" />
            <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-[var(--line)] py-4 first:pt-0"><span><strong className="flex items-center gap-2 text-xs"><Key size={16} /> Require MFA</strong><small className="mt-1 block max-w-[250px] text-[10px] leading-5 text-[var(--muted)]">บังคับกับ role ที่เข้าถึงข้อมูลผู้ใช้ การ์ด และ fulfillment</small></span><input className="mt-1 size-5 accent-[var(--pink)]" defaultChecked={settings.requireMfa} name="requireMfa" type="checkbox" /></label>
            <label className="flex cursor-pointer items-start justify-between gap-4 py-4"><span><strong className="flex items-center gap-2 text-xs"><Globe size={16} /> Public memories</strong><small className="mt-1 block max-w-[250px] text-[10px] leading-5 text-[var(--muted)]">อนุญาตให้เจ้าของเสนอ memory สำหรับ public timeline หลัง moderation</small></span><input className="mt-1 size-5 accent-[var(--pink)]" defaultChecked={settings.allowPublicMemories} name="allowPublicMemories" type="checkbox" /></label>
          </OpsPanel>

          <OpsPanel className="bg-[var(--navy)] text-white">
            <ShieldCheck className="text-[#ff7eaf]" size={27} weight="duotone" />
            <span className="mt-6 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.12em] text-[#ff8bb8]">CHANGE CONTROL</span>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold">Review before applying</h2>
            <p className="mt-3 text-xs leading-6 text-[#9faabb]">Security และ data-policy changes ถูกบันทึกพร้อม actor, previous value, new value และ request context</p>
            <button className="mt-5 min-h-11 w-full rounded-xl bg-[var(--pink)] text-xs font-semibold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? "กำลังบันทึก…" : "Save organization settings"}</button>
            <small className="mt-3 block text-center text-[8px] text-[#7f8c9e]">Last updated {settings.updatedAt}</small>
          </OpsPanel>
        </div>
      </form>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

