"use client";

import {
  Bell,
  CardsThree,
  ChatCenteredDots,
  Fingerprint,
  GearSix,
  Gift,
  House,
  IdentificationCard,
  Scroll,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Brand } from "./brand";

const navigation = [
  { href: "/admin/users", label: "ผู้ใช้และสิทธิ์", short: "Users", icon: UsersThree },
  { href: "/admin/cards", label: "คลังการ์ด", short: "Cards", icon: CardsThree },
  { href: "/admin/authenticity", label: "NFC Authenticity", short: "NFC", icon: Fingerprint },
  { href: "/admin/moderation", label: "ตรวจเนื้อหา", short: "Moderate", icon: ChatCenteredDots },
  { href: "/admin/rewards", label: "รางวัลและการแลก", short: "Rewards", icon: Gift },
  { href: "/admin/audit", label: "Audit logs", short: "Audit", icon: Scroll },
  { href: "/admin/settings", label: "องค์กร", short: "Settings", icon: GearSix },
  { href: "/admin/notifications", label: "การแจ้งเตือน", short: "Alerts", icon: Bell },
] as const;

const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  "/admin/users": {
    eyebrow: "IDENTITY & ACCESS",
    title: "ผู้ใช้และบทบาท",
    description: "ดูแลสิทธิ์สมาชิก ทีมคณะ และผู้ปฏิบัติงานจากจุดเดียว",
  },
  "/admin/cards": {
    eyebrow: "PHYSICAL INVENTORY",
    title: "Card inventory",
    description: "ออก batch, ตรวจ serial และติดตามการ provision ก่อนส่งมอบ",
  },
  "/admin/authenticity": {
    eyebrow: "TRUST OPERATIONS",
    title: "NFC authenticity",
    description: "คัดกรองรูปแบบการแตะผิดปกติและดูหลักฐานความแท้แบบละเอียด",
  },
  "/admin/moderation": {
    eyebrow: "MEMORY SAFETY",
    title: "Memory moderation",
    description: "ปกป้องพื้นที่ความทรงจำด้วย consent, privacy และการตรวจอย่างมีบริบท",
  },
  "/admin/rewards": {
    eyebrow: "FULFILLMENT",
    title: "Rewards & redemptions",
    description: "บริหาร stock, จุดแลก และสถานะ fulfillment ครบวงจร",
  },
  "/admin/audit": {
    eyebrow: "GOVERNANCE",
    title: "Audit trail",
    description: "เหตุการณ์สำคัญที่ค้นหา ส่งออก และตรวจย้อนกลับได้",
  },
  "/admin/settings": {
    eyebrow: "TENANT CONFIGURATION",
    title: "Organization settings",
    description: "ตั้งค่าแบรนด์ โดเมน นโยบายข้อมูล และ security baseline ขององค์กร",
  },
  "/admin/notifications": {
    eyebrow: "OPERATIONS INBOX",
    title: "Notifications",
    description: "รวมเหตุการณ์ที่ต้องลงมือทำ พร้อม routing และ escalation ที่ชัดเจน",
  },
};

export function OpsAdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta["/admin/users"];

  return (
    <div className="min-h-dvh overflow-x-clip bg-[var(--paper)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col bg-[var(--navy)] px-5 py-6 text-white lg:flex">
        <div className="flex items-center justify-between px-2">
          <div className="[&_.brand-dot]:bg-[#ff6ca5] [&_.brand-word]:text-white">
            <Brand compact />
          </div>
          <span className="grid size-8 place-items-center rounded-lg border border-white/10 text-[#ff7bae]">
            <ShieldCheck size={17} weight="duotone" />
          </span>
        </div>
        <p className="mt-4 px-2 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[#78869c]">OPERATIONS SUITE</p>

        <nav aria-label="เมนูระบบปฏิบัติการ" className="mt-7 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${active ? "bg-white text-[var(--navy)] shadow-lg" : "text-[#a8b3c2] hover:bg-white/7 hover:text-white"}`}
                href={item.href}
                key={item.href}
              >
                <Icon className={active ? "text-[var(--pink)]" : "text-[#78869c]"} size={19} weight={active ? "fill" : "regular"} />
                {item.label}
                {item.href === "/admin/notifications" && <span className="ml-auto grid size-5 place-items-center rounded-full bg-[var(--pink)] text-[10px] font-bold text-white">4</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-white/10 pt-5">
          <Link className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-[#a8b3c2] transition hover:bg-white/7 hover:text-white" href="/admin">
            <House size={19} /> ภาพรวมเดิม
          </Link>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.08em] text-[#70dfb9]">
              <span className="size-1.5 rounded-full bg-[#54dbad]" /> PLATFORM HEALTHY
            </div>
            <p className="mb-0 mt-2 text-[11px] leading-5 text-[#94a0b2]">ap-southeast-1 · policy checks active</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--line)_78%,transparent)] bg-[color-mix(in_srgb,var(--paper)_91%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-9 lg:py-4">
          <div className="mx-auto flex max-w-[1460px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 lg:hidden"><Brand compact /></div>
              <div className="hidden h-8 w-px bg-[var(--line)] sm:block lg:hidden" />
              <div className="min-w-0">
                <span className="block truncate font-[family-name:var(--font-mono)] text-[8px] tracking-[0.13em] text-[var(--pink-strong)]">{meta.eyebrow}</span>
                <strong className="block truncate font-[family-name:var(--font-display)] text-sm sm:text-base">{meta.title}</strong>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-[#d8eee7] bg-[#f2fbf8] px-3 py-2 font-[family-name:var(--font-mono)] text-[8px] tracking-[0.06em] text-[var(--success)] md:inline-flex">
                <span className="size-1.5 rounded-full bg-[var(--success)]" /> LIVE SYSTEM
              </span>
              <Link aria-label="เปิดการแจ้งเตือน" className="relative grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-white transition hover:border-[#d9bcc7] hover:text-[var(--pink-strong)]" href="/admin/notifications">
                <Bell size={19} />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[var(--pink)]" />
              </Link>
              <span aria-label="บัญชีผู้ดูแล SOUL" className="grid size-10 place-items-center rounded-xl bg-[var(--navy)] font-[family-name:var(--font-display)] text-xs font-bold text-white">SO</span>
            </div>
          </div>
        </header>

        <nav aria-label="เมนูระบบปฏิบัติการบนมือถือ" className="sticky top-[65px] z-20 overflow-x-auto border-b border-[var(--line)] bg-white px-3 py-2 lg:hidden">
          <div className="flex w-max gap-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link aria-current={active ? "page" : undefined} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-[11px] font-semibold ${active ? "bg-[var(--navy)] text-white" : "text-[var(--muted)]"}`} href={item.href} key={item.href}>
                  <Icon size={17} weight={active ? "fill" : "regular"} /> {item.short}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="mx-auto max-w-[1460px] px-4 pb-16 pt-6 sm:px-6 lg:px-9 lg:pt-9" id="main-content">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-start gap-3">
              <span className="mt-1 hidden size-10 place-items-center rounded-xl bg-[var(--blush)] text-[var(--pink-strong)] sm:grid">
                <IdentificationCard size={21} weight="duotone" />
              </span>
              <div>
                <p className="m-0 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[var(--pink-strong)]">{meta.eyebrow}</p>
                <h1 className="mt-1 font-[family-name:var(--font-display)] text-[clamp(26px,3vw,40px)] font-bold tracking-[-0.045em]">{meta.title}</h1>
                <p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{meta.description}</p>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

