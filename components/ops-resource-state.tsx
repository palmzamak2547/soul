"use client";

import {
  ArrowClockwise,
  LockKey,
  MagnifyingGlass,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";

export function OpsLoading({ label = "กำลังโหลดข้อมูลล่าสุด" }: { label?: string }) {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="grid min-h-[420px] place-items-center rounded-[20px] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-card)]"
    >
      <div>
        <span className="mx-auto block size-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--pink)] motion-reduce:animate-none" />
        <p className="mt-5 text-sm font-semibold text-[var(--ink)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">SOUL Operations กำลังประสานข้อมูลอย่างปลอดภัย</p>
      </div>
    </section>
  );
}

export function OpsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[20px] border border-[#f3cdd7] bg-white p-8 text-center shadow-[var(--shadow-card)]" role="alert">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#fff0f3] text-[var(--pink-strong)]">
          <WarningCircle size={26} weight="duotone" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold">ข้อมูลยังมาไม่ครบ</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
        <button className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--navy)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--navy-soft)]" onClick={onRetry} type="button">
          <ArrowClockwise size={18} weight="bold" /> ลองเชื่อมต่ออีกครั้ง
        </button>
      </div>
    </section>
  );
}

export function OpsEmpty({ description, title }: { description: string; title: string }) {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[20px] border border-dashed border-[var(--line)] bg-white p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--blush)] text-[var(--pink-strong)]">
          <MagnifyingGlass size={25} weight="duotone" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

export function OpsUnauthorized() {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-[20px] border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-card)]" role="alert">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--navy)] text-white">
          <LockKey size={24} weight="duotone" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold">Session หมดอายุแล้ว</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">เข้าสู่ระบบผู้ดูแลอีกครั้งก่อนเปิดข้อมูลปฏิบัติการ</p>
        <Link className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[var(--pink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--pink-strong)]" href="/admin">
          กลับไปเข้าสู่ระบบ
        </Link>
      </div>
    </section>
  );
}

export function OpsDemoBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#ecd7df] bg-[#fff7fa] px-3 py-1.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] text-[var(--pink-strong)]">
      <span className="size-1.5 rounded-full bg-[var(--pink)]" aria-hidden="true" /> DEMO FALLBACK
    </span>
  );
}

