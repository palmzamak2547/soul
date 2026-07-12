"use client";

import {
  ArrowSquareOut,
  Bell,
  BellRinging,
  ChatCenteredDots,
  CheckCircle,
  Cpu,
  DeviceMobile,
  EnvelopeSimple,
  Gift,
  Package,
  ShieldWarning,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { runOpsMutation, type ResourceSource } from "./ops-admin-data";
import {
  OpsPanel,
  OpsPanelHeading,
  OpsResourceGate,
  OpsStatCard,
  OpsStatusPill,
  OpsSuccessToast,
} from "./ops-admin-panel";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  category: "Security" | "Moderation" | "Inventory" | "Rewards" | "System";
  priority: "Urgent" | "High" | "Normal";
  read: boolean;
  createdAt: string;
  href: string;
};

type NotificationData = {
  items: NotificationItem[];
  preferences: { email: boolean; push: boolean; security: boolean; dailyDigest: boolean };
};

const demoNotifications: NotificationData = {
  items: [
    { id: "not_92KA", title: "ตรวจพบ NFC counter replay", description: "SOUL-26-004218 ถูกแตะด้วย counter เดิม 7 ครั้งจากหลาย ASN", category: "Security", priority: "Urgent", read: false, createdAt: "4 นาทีที่แล้ว", href: "/admin/authenticity" },
    { id: "not_92JQ", title: "Memory รอ rights specialist", description: "คลิปเสียงจากห้องซ้อมชั้น 8 ถูก escalate เพราะยังไม่มี music license", category: "Moderation", priority: "High", read: false, createdAt: "38 นาทีที่แล้ว", href: "/admin/moderation" },
    { id: "not_92HF", title: "Hidden Archive Tour เหลือ 3 สิทธิ์", description: "Stock หลังหัก reservation ต่ำกว่า threshold ที่ตั้งไว้", category: "Rewards", priority: "High", read: false, createdAt: "1 ชม.ที่แล้ว", href: "/admin/rewards" },
    { id: "not_92D1", title: "Batch BAT-2607-015 ผ่าน 60%", description: "Provisioning NTAG424 DNA สำเร็จ 186 จาก 300 ใบ", category: "Inventory", priority: "Normal", read: false, createdAt: "2 ชม.ที่แล้ว", href: "/admin/cards" },
    { id: "not_91ZX", title: "Key rotation เสร็จสมบูรณ์", description: "kv_prod_07 active แล้วและมี grace period สำหรับ key เดิม 24 ชั่วโมง", category: "System", priority: "Normal", read: true, createdAt: "5 ชม.ที่แล้ว", href: "/admin/audit" },
  ],
  preferences: { dailyDigest: true, email: true, push: false, security: true },
};

const isNotificationsEmpty = (value: NotificationData) => value.items.length === 0;

export function OpsNotificationsPanel() {
  return (
    <OpsResourceGate demoData={demoNotifications} emptyDescription="ทุกอย่างเรียบร้อยดี ไม่มีเหตุการณ์ใหม่ที่ต้องลงมือทำ" emptyTitle="Inbox clear" endpoint="/api/admin/notifications" isEmpty={isNotificationsEmpty}>
      {(data, source) => <NotificationsWorkspace initialData={data} source={source} />}
    </OpsResourceGate>
  );
}

function NotificationsWorkspace({ initialData, source }: { initialData: NotificationData; source: ResourceSource }) {
  const [items, setItems] = useState(initialData.items);
  const [preferences, setPreferences] = useState(initialData.preferences);
  const [filter, setFilter] = useState<"All" | NotificationItem["category"]>("All");
  const [toast, setToast] = useState("");
  const filtered = items.filter((item) => filter === "All" || item.category === filter);
  const unread = items.filter((item) => !item.read).length;

  async function setRead(item: NotificationItem, read: boolean) {
    await runOpsMutation({ body: { read }, endpoint: `/api/admin/notifications/${item.id}/read`, source });
    setItems((value) => value.map((entry) => entry.id === item.id ? { ...entry, read } : entry));
  }

  async function markAllRead() {
    await Promise.all(items.filter((item) => !item.read).map((item) => runOpsMutation({ body: { read: true }, endpoint: `/api/admin/notifications/${item.id}/read`, source })));
    setItems((value) => value.map((item) => ({ ...item, read: true })));
    setToast("ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าอ่านแล้ว");
  }

  async function updatePreference(key: keyof NotificationData["preferences"], value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    try {
      await runOpsMutation({ body: next, endpoint: "/api/admin/notifications/preferences", method: "PATCH", source });
      setToast("อัปเดต notification routing แล้ว");
    } catch {
      setPreferences(preferences);
    }
  }

  const iconFor = (category: NotificationItem["category"]) => {
    const Icon = category === "Security" ? ShieldWarning : category === "Moderation" ? ChatCenteredDots : category === "Inventory" ? Package : category === "Rewards" ? Gift : Cpu;
    return <Icon size={21} weight="duotone" />;
  };

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<BellRinging size={21} weight="duotone" />} label="Unread" note="ทุก operational channel" value={unread.toString()} />
        <OpsStatCard accent="amber" icon={<ShieldWarning size={21} weight="duotone" />} label="Urgent" note="Security escalation" value={items.filter((item) => item.priority === "Urgent" && !item.read).length.toString()} />
        <OpsStatCard accent="green" icon={<CheckCircle size={21} weight="duotone" />} label="Resolved today" note="Closed by operator" value="17" />
        <OpsStatCard accent="navy" icon={<EnvelopeSimple size={21} weight="duotone" />} label="Delivery health" note="Email + push pipeline" value="99.9%" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
        <OpsPanel>
          <OpsPanelHeading action={<button className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line)] px-3 text-[10px] font-semibold disabled:opacity-50" disabled={unread === 0} onClick={() => void markAllRead()} type="button"><CheckCircle size={16} /> Mark all read</button>} eyebrow="OPERATIONS INBOX" title="สิ่งที่ต้องรู้และลงมือทำ" />
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-[#f5f0f2] p-1">
            {(["All", "Security", "Moderation", "Inventory", "Rewards", "System"] as const).map((item) => <button aria-pressed={filter === item} className={`min-h-9 shrink-0 rounded-lg px-3 text-[10px] font-semibold ${filter === item ? "bg-white shadow-sm" : "text-[var(--muted)]"}`} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}
          </div>
          <div className="space-y-2">
            {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] py-14 text-center text-sm text-[var(--muted)]">ไม่มีการแจ้งเตือนในหมวดนี้</div> : filtered.map((item) => (
              <article className={`rounded-2xl border p-4 transition ${item.read ? "border-[var(--line)] bg-white" : "border-[#dfb5c5] bg-[#fff8fa]"}`} key={item.id}>
                <div className="flex items-start gap-3">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${item.category === "Security" ? "bg-[#fff0f3] text-[#ad1849]" : "bg-[var(--blush)] text-[var(--pink-strong)]"}`}>{iconFor(item.category)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><strong className="block text-xs leading-5">{item.title}</strong><p className="mb-0 mt-1 text-[10px] leading-5 text-[var(--muted)]">{item.description}</p></div><OpsStatusPill label={item.priority} tone={item.priority === "Urgent" ? "danger" : item.priority === "High" ? "warning" : "neutral"} /></div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3"><span className="text-[12px] text-[var(--muted)]">{item.category} · {item.createdAt}</span><span className="flex items-center gap-2"><button className="min-h-9 rounded-lg px-2 text-[12px] font-semibold text-[var(--muted)] hover:bg-white" onClick={() => void setRead(item, !item.read)} type="button">{item.read ? "Mark unread" : "Mark read"}</button><Link className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--navy)] px-3 text-[12px] font-semibold text-white" href={item.href}>Open <ArrowSquareOut size={13} /></Link></span></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </OpsPanel>

        <div className="space-y-4">
          <OpsPanel>
            <OpsPanelHeading eyebrow="ROUTING PREFERENCES" title="ช่องทางที่ทีมจะได้รับ" />
            {([
              { key: "email", label: "Email alerts", detail: "High + urgent events", icon: EnvelopeSimple },
              { key: "push", label: "Browser push", detail: "Real-time on this device", icon: DeviceMobile },
              { key: "security", label: "Security escalation", detail: "Always-on critical routing", icon: ShieldWarning },
              { key: "dailyDigest", label: "Daily digest", detail: "08:30 Asia/Bangkok", icon: Bell },
            ] as const).map((preference) => { const Icon = preference.icon; return <label className="flex cursor-pointer items-center gap-3 border-b border-[var(--line)] py-4 last:border-0" key={preference.key}><span className="grid size-9 place-items-center rounded-xl bg-[#f6f1f3] text-[var(--pink-strong)]"><Icon size={18} weight="duotone" /></span><span className="min-w-0 flex-1"><strong className="block text-xs">{preference.label}</strong><small className="block text-[12px] text-[var(--muted)]">{preference.detail}</small></span><input aria-label={preference.label} checked={preferences[preference.key]} className="size-5 accent-[var(--pink)]" onChange={(event) => void updatePreference(preference.key, event.target.checked)} type="checkbox" /></label>; })}
          </OpsPanel>
          <OpsPanel className="bg-[var(--navy)] text-white">
            <ShieldWarning className="text-[#ff7eaf]" size={25} weight="duotone" />
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold">Urgent bypasses digest</h2>
            <p className="mb-0 mt-2 text-[10px] leading-5 text-[#9faabb]">Critical authenticity และ account-takeover signals จะส่งทันทีไปยัง Owner + Security contact เสมอ</p>
          </OpsPanel>
        </div>
      </section>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

