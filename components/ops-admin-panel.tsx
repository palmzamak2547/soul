"use client";

import { CheckCircle, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useOpsResource, type ResourceSource } from "./ops-admin-data";
import {
  OpsDemoBadge,
  OpsEmpty,
  OpsError,
  OpsLoading,
  OpsUnauthorized,
} from "./ops-resource-state";

export function OpsResourceGate<T>({
  children,
  demoData,
  emptyDescription,
  emptyTitle,
  endpoint,
  isEmpty,
}: {
  children: (data: T, source: ResourceSource) => ReactNode;
  demoData: T;
  emptyDescription: string;
  emptyTitle: string;
  endpoint: string;
  isEmpty: (value: T) => boolean;
}) {
  const { retry, state } = useOpsResource(endpoint, demoData, isEmpty);

  if (state.status === "loading") return <OpsLoading />;
  if (state.status === "unauthorized") return <OpsUnauthorized />;
  if (state.status === "error") return <OpsError message={state.message} onRetry={retry} />;
  if (state.status === "empty") return <OpsEmpty description={emptyDescription} title={emptyTitle} />;

  return (
    <>
      {state.source === "demo" && (
        <div className="mb-4 flex justify-end"><OpsDemoBadge /></div>
      )}
      {children(state.data, state.source)}
    </>
  );
}

export function OpsStatCard({
  accent = "pink",
  icon,
  label,
  note,
  value,
}: {
  accent?: "pink" | "green" | "amber" | "navy";
  icon: ReactNode;
  label: string;
  note: string;
  value: string;
}) {
  const accentClass = {
    amber: "bg-[#fff5e8] text-[#a65e12]",
    green: "bg-[#eaf9f3] text-[var(--success)]",
    navy: "bg-[#edf1f6] text-[var(--navy)]",
    pink: "bg-[var(--blush)] text-[var(--pink-strong)]",
  }[accent];

  return (
    <article className="min-w-0 rounded-[18px] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className={`grid size-10 place-items-center rounded-xl ${accentClass}`}>{icon}</div>
      <p className="mb-0 mt-5 text-[13px] font-medium text-[var(--muted)]">{label}</p>
      <strong className="mt-1 block font-[family-name:var(--font-display)] text-2xl tracking-[-0.04em] sm:text-[28px]">{value}</strong>
      <small className="mt-2 block text-[12px] leading-5 text-[#7a6f75]">{note}</small>
    </article>
  );
}

export function OpsPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[20px] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-card)] sm:p-5 lg:p-6 ${className}`}>{children}</section>;
}

export function OpsPanelHeading({
  action,
  eyebrow,
  title,
}: {
  action?: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-[0.12em] text-[var(--pink-strong)]">
          {eyebrow}
        </span>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-[-0.03em] sm:text-[22px]">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function OpsSuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div aria-live="polite" className="fixed bottom-5 left-4 right-4 z-[100] flex items-center gap-3 rounded-2xl bg-[var(--navy)] px-4 py-3 text-sm text-white shadow-2xl sm:left-auto sm:right-6 sm:max-w-sm" role="status">
      <CheckCircle className="shrink-0 text-[#54dbad]" size={22} weight="fill" />
      <span className="flex-1 leading-5">{message}</span>
      <button aria-label="ปิดข้อความ" className="grid size-9 shrink-0 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" onClick={onDismiss} type="button"><X size={17} /></button>
    </div>
  );
}

export function OpsStatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "danger" | "neutral" | "success" | "warning" | "info";
}) {
  const styles = {
    danger: "border-[#f3cdd7] bg-[#fff0f3] text-[#ad1849]",
    info: "border-[#cddff5] bg-[#f1f7ff] text-[#2f64a5]",
    neutral: "border-[var(--line)] bg-[#f8f5f6] text-[#6f6369]",
    success: "border-[#cdebe0] bg-[#edf9f5] text-[var(--success)]",
    warning: "border-[#f0ddc3] bg-[#fff7eb] text-[#9a5a14]",
  }[tone];

  return <span className={`inline-flex w-max items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold ${styles}`}>{label}</span>;
}

