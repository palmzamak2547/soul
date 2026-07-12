"use client";

import {
  CheckCircle,
  Coins,
  Gift,
  Package,
  Pause,
  Plus,
  Storefront,
  Truck,
} from "@phosphor-icons/react";
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

type Reward = {
  id: string;
  name: string;
  type: "Physical" | "Digital" | "Experience";
  points: number;
  stock: number;
  reserved: number;
  status: "Active" | "Paused" | "Sold out";
};

type Redemption = {
  id: string;
  reward: string;
  user: string;
  quantity: number;
  status: "Pending" | "Packing" | "Ready for pickup" | "Shipped" | "Completed";
  createdAt: string;
  fulfillment: "Pickup" | "Delivery";
};

type RewardsData = { rewards: Reward[]; redemptions: Redemption[] };

const demoRewards: RewardsData = {
  rewards: [
    { id: "rwd_pin_01", name: "Pink Memento Enamel Pin", type: "Physical", points: 300, stock: 48, reserved: 7, status: "Active" },
    { id: "rwd_wall_02", name: "Founder Motion Wallpaper", type: "Digital", points: 120, stock: 9999, reserved: 0, status: "Active" },
    { id: "rwd_tour_03", name: "Hidden Archive Tour", type: "Experience", points: 850, stock: 12, reserved: 9, status: "Active" },
    { id: "rwd_badge_04", name: "Reunion 110 Badge", type: "Physical", points: 600, stock: 0, reserved: 0, status: "Sold out" },
  ],
  redemptions: [
    { id: "RED-2607-1842", reward: "Pink Memento Enamel Pin", user: "Mint N.", quantity: 1, status: "Pending", createdAt: "10 ก.ค. · 14:22", fulfillment: "Pickup" },
    { id: "RED-2607-1838", reward: "Pink Memento Enamel Pin", user: "Thanawat S.", quantity: 2, status: "Packing", createdAt: "10 ก.ค. · 12:08", fulfillment: "Delivery" },
    { id: "RED-2607-1821", reward: "Hidden Archive Tour", user: "Ploy K.", quantity: 1, status: "Ready for pickup", createdAt: "9 ก.ค. · 17:35", fulfillment: "Pickup" },
    { id: "RED-2607-1799", reward: "Founder Motion Wallpaper", user: "Narin C.", quantity: 1, status: "Completed", createdAt: "9 ก.ค. · 10:01", fulfillment: "Delivery" },
  ],
};

const isRewardsEmpty = (value: RewardsData) => value.rewards.length === 0 && value.redemptions.length === 0;

export function OpsRewardsPanel() {
  return (
    <OpsResourceGate demoData={demoRewards} emptyDescription="สร้างรางวัลแรกเพื่อเปิด reward catalog ให้สมาชิก" emptyTitle="ยังไม่มีรางวัลหรือคำสั่งแลก" endpoint="/api/admin/rewards" isEmpty={isRewardsEmpty}>
      {(data, source) => <RewardsWorkspace initialData={data} source={source} />}
    </OpsResourceGate>
  );
}

function RewardsWorkspace({ initialData, source }: { initialData: RewardsData; source: ResourceSource }) {
  const [rewards, setRewards] = useState(initialData.rewards);
  const [redemptions, setRedemptions] = useState(initialData.redemptions);
  const [tab, setTab] = useState<"catalog" | "redemptions">("catalog");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const pending = redemptions.filter((item) => item.status !== "Completed").length;
  const lowStock = rewards.filter((item) => item.type !== "Digital" && item.stock - item.reserved <= 10).length;

  async function toggleReward(reward: Reward) {
    setBusyId(reward.id);
    const status: Reward["status"] = reward.status === "Paused" ? "Active" : "Paused";
    try {
      await runOpsMutation({ body: { status }, endpoint: `/api/admin/rewards/${reward.id}`, method: "PATCH", source });
      setRewards((value) => value.map((item) => item.id === reward.id ? { ...item, status } : item));
      setToast(`${reward.name}: ${status}`);
    } finally {
      setBusyId(null);
    }
  }

  async function restock(reward: Reward) {
    setBusyId(reward.id);
    const stock = reward.stock + 25;
    try {
      await runOpsMutation({ body: { stock, status: "Active" }, endpoint: `/api/admin/rewards/${reward.id}`, method: "PATCH", source });
      setRewards((value) => value.map((item) => item.id === reward.id ? { ...item, stock, status: "Active" } : item));
      setToast(`เพิ่ม stock ${reward.name} อีก 25 ชิ้นแล้ว`);
    } finally {
      setBusyId(null);
    }
  }

  async function advance(redemption: Redemption) {
    const steps: Redemption["status"][] = redemption.fulfillment === "Pickup" ? ["Pending", "Packing", "Ready for pickup", "Completed"] : ["Pending", "Packing", "Shipped", "Completed"];
    const next = steps[Math.min(steps.indexOf(redemption.status) + 1, steps.length - 1)];
    setBusyId(redemption.id);
    try {
      await runOpsMutation({ body: { status: next }, endpoint: `/api/admin/redemptions/${redemption.id}/fulfill`, source });
      setRedemptions((value) => value.map((item) => item.id === redemption.id ? { ...item, status: next } : item));
      setToast(`${redemption.id} ขยับเป็น ${next}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<Gift size={21} weight="duotone" />} label="Active rewards" note="พร้อมให้แลกใน catalog" value={rewards.filter((item) => item.status === "Active").length.toString()} />
        <OpsStatCard accent="navy" icon={<Coins size={21} weight="duotone" />} label="Points redeemed" note="รอบ 30 วันที่ผ่านมา" value="84.2K" />
        <OpsStatCard accent="amber" icon={<Package size={21} weight="duotone" />} label="Low stock" note="เหลือไม่เกิน 10 ชิ้น" value={lowStock.toString()} />
        <OpsStatCard accent="green" icon={<Truck size={21} weight="duotone" />} label="Open fulfillment" note="Pickup + delivery" value={pending.toString()} />
      </section>

      <OpsPanel>
        <div className="mb-5 flex flex-col gap-4 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl bg-[#f5f0f2] p-1" role="tablist" aria-label="Rewards operations">
            <button aria-selected={tab === "catalog"} className={`min-h-10 rounded-lg px-4 text-xs font-semibold ${tab === "catalog" ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("catalog")} role="tab" type="button">Reward catalog</button>
            <button aria-selected={tab === "redemptions"} className={`min-h-10 rounded-lg px-4 text-xs font-semibold ${tab === "redemptions" ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("redemptions")} role="tab" type="button">Redemptions <span className="ml-1 rounded-full bg-[var(--pink)] px-1.5 py-0.5 text-[9px] text-white">{pending}</span></button>
          </div>
          <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--pink)] px-4 text-xs font-semibold text-white" type="button"><Plus size={16} weight="bold" /> New reward</button>
        </div>

        {tab === "catalog" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rewards.map((reward) => {
              const available = Math.max(0, reward.stock - reward.reserved);
              return (
                <article className="rounded-2xl border border-[var(--line)] p-4" key={reward.id}>
                  <div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[var(--blush)] text-[var(--pink-strong)]"><Gift size={22} weight="duotone" /></span><OpsStatusPill label={reward.status} tone={reward.status === "Active" ? "success" : reward.status === "Sold out" ? "danger" : "warning"} /></div>
                  <span className="mt-5 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.09em] text-[var(--pink-strong)]">{reward.type.toUpperCase()} · {reward.id}</span>
                  <h3 className="mt-1 min-h-11 font-[family-name:var(--font-display)] text-base font-bold leading-6">{reward.name}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[var(--line)] py-3 text-center"><span><strong className="block text-sm">{reward.points}</strong><small className="text-[8px] text-[var(--muted)]">POINTS</small></span><span><strong className="block text-sm">{available}</strong><small className="text-[8px] text-[var(--muted)]">AVAILABLE</small></span><span><strong className="block text-sm">{reward.reserved}</strong><small className="text-[8px] text-[var(--muted)]">RESERVED</small></span></div>
                  <div className="mt-4 grid grid-cols-2 gap-2"><button className="min-h-10 rounded-xl border border-[var(--line)] text-[10px] font-semibold disabled:opacity-50" disabled={busyId === reward.id} onClick={() => void toggleReward(reward)} type="button"><Pause className="mr-1 inline" size={14} /> {reward.status === "Paused" ? "Resume" : "Pause"}</button><button className="min-h-10 rounded-xl border border-[var(--line)] text-[10px] font-semibold disabled:opacity-50" disabled={busyId === reward.id || reward.type === "Digital"} onClick={() => void restock(reward)} type="button"><Plus className="mr-1 inline" size={14} /> Restock 25</button></div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {redemptions.map((redemption) => (
              <article className="grid gap-4 rounded-2xl border border-[var(--line)] p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(150px,.65fr)_minmax(150px,.65fr)_auto] md:items-center" key={redemption.id}>
                <div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--navy)] text-[#ff7eaf]"><Storefront size={20} weight="duotone" /></span><span className="min-w-0"><strong className="block truncate text-xs">{redemption.reward}</strong><small className="mt-1 block text-[9px] text-[var(--muted)]">{redemption.id} · {redemption.user} · x{redemption.quantity}</small></span></div>
                <div><OpsStatusPill label={redemption.fulfillment} tone="neutral" /><small className="mt-1 block text-[9px] text-[#94888e]">{redemption.createdAt}</small></div>
                <OpsStatusPill label={redemption.status} tone={redemption.status === "Completed" ? "success" : redemption.status === "Pending" ? "warning" : "info"} />
                <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-3 text-[10px] font-semibold text-white disabled:opacity-50" disabled={busyId === redemption.id || redemption.status === "Completed"} onClick={() => void advance(redemption)} type="button"><CheckCircle size={16} /> Advance</button>
              </article>
            ))}
          </div>
        )}
      </OpsPanel>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

