"use client";

import {
  CheckCircle,
  Clock,
  MagnifyingGlass,
  ShieldCheck,
  UserMinus,
  UsersThree,
  UserSwitch,
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

type Operator = {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: "Owner" | "Admin" | "Editor" | "Support" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  lastActiveAt: string;
  mfa: boolean;
};

const demoUsers: Operator[] = [
  { id: "usr_01H9P2", name: "พิมพ์ชนก อุดมศิลป์", email: "pimchanok@chula.ac.th", organization: "SOUL Core", role: "Owner", status: "Active", lastActiveAt: "10 ก.ค. · 14:42", mfa: true },
  { id: "usr_01H9RA", name: "ธนวัฒน์ สุขเกษม", email: "thanawat@commarts.chula.ac.th", organization: "นิเทศศาสตร์", role: "Admin", status: "Active", lastActiveAt: "10 ก.ค. · 13:18", mfa: true },
  { id: "usr_01H9VE", name: "กัญญารัตน์ แสงทอง", email: "kanyarat@alumni.chula.ac.th", organization: "Alumni Office", role: "Editor", status: "Active", lastActiveAt: "9 ก.ค. · 18:04", mfa: false },
  { id: "usr_01HA1S", name: "Narin Chantarakul", email: "narin@museum.chula.ac.th", organization: "University Archive", role: "Viewer", status: "Invited", lastActiveAt: "รอตอบรับ", mfa: false },
  { id: "usr_01HA3M", name: "ศุภกิตติ์ พูลผล", email: "supakit@support.soul.team", organization: "SOUL Support", role: "Support", status: "Suspended", lastActiveAt: "2 ก.ค. · 09:32", mfa: true },
];

const roles: Operator["role"][] = ["Owner", "Admin", "Editor", "Support", "Viewer"];

export function OpsUsersPanel() {
  return (
    <OpsResourceGate
      demoData={demoUsers}
      emptyDescription="เชิญผู้ดูแลคนแรกเพื่อเริ่มกำหนดสิทธิ์ให้ทีม"
      emptyTitle="ยังไม่มีผู้ใช้ในองค์กร"
      endpoint="/api/admin/users"
      isEmpty={emptyArray}
    >
      {(data, source) => <UsersWorkspace initialUsers={data} source={source} />}
    </OpsResourceGate>
  );
}

function UsersWorkspace({ initialUsers, source }: { initialUsers: Operator[]; source: ResourceSource }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | Operator["status"]>("All");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.name} ${user.email} ${user.organization} ${user.role}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All" || user.status === status);
  }), [query, status, users]);

  async function changeRole(user: Operator, role: Operator["role"]) {
    setPendingId(user.id);
    try {
      await runOpsMutation({ body: { role }, endpoint: `/api/admin/users/${user.id}/role`, method: "PATCH", source });
      setUsers((value) => value.map((item) => item.id === user.id ? { ...item, role } : item));
      setToast(`เปลี่ยนบทบาทของ ${user.name} เป็น ${role} แล้ว`);
    } finally {
      setPendingId(null);
    }
  }

  async function toggleSuspension(user: Operator) {
    setPendingId(user.id);
    const nextStatus = user.status === "Suspended" ? "Active" : "Suspended";
    try {
      await runOpsMutation({ body: { status: nextStatus }, endpoint: `/api/admin/users/${user.id}/status`, method: "PATCH", source });
      setUsers((value) => value.map((item) => item.id === user.id ? { ...item, status: nextStatus } : item));
      setToast(nextStatus === "Suspended" ? `ระงับสิทธิ์ ${user.name} แล้ว` : `คืนสิทธิ์ให้ ${user.name} แล้ว`);
    } finally {
      setPendingId(null);
    }
  }

  const activeCount = users.filter((user) => user.status === "Active").length;
  const mfaCount = users.filter((user) => user.mfa).length;

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <OpsStatCard icon={<UsersThree size={21} weight="duotone" />} label="ผู้ใช้ทั้งหมด" note="ทุกองค์กรใน tenant" value={users.length.toString()} />
        <OpsStatCard accent="green" icon={<CheckCircle size={21} weight="duotone" />} label="Active now" note="พร้อมใช้งานระบบ" value={activeCount.toString()} />
        <OpsStatCard accent="navy" icon={<ShieldCheck size={21} weight="duotone" />} label="MFA coverage" note="เป้าหมาย 100% สำหรับ Admin" value={`${Math.round((mfaCount / users.length) * 100)}%`} />
        <OpsStatCard accent="amber" icon={<Clock size={21} weight="duotone" />} label="Pending invites" note="หมดอายุภายใน 72 ชั่วโมง" value={users.filter((user) => user.status === "Invited").length.toString()} />
      </section>

      <OpsPanel>
        <OpsPanelHeading
          action={<button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--pink)] px-4 text-xs font-semibold text-white transition hover:bg-[var(--pink-strong)]" type="button"><UserSwitch size={17} weight="bold" /> เชิญผู้ใช้</button>}
          eyebrow="ROLE DIRECTORY"
          title="ทีมที่เข้าถึง SOUL"
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-[#fcfafb] px-3 focus-within:border-[var(--pink)]">
            <MagnifyingGlass className="shrink-0 text-[#998c92]" size={17} />
            <span className="sr-only">ค้นหาผู้ใช้</span>
            <input className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a99da3]" onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อ อีเมล หรือองค์กร…" value={query} />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-xs text-[var(--muted)]">
            <span>สถานะ</span>
            <select className="min-h-10 border-0 bg-transparent font-semibold text-[var(--ink)] outline-none" onChange={(event) => setStatus(event.target.value as typeof status)} value={status}>
              <option value="All">ทั้งหมด</option><option value="Active">Active</option><option value="Invited">Invited</option><option value="Suspended">Suspended</option>
            </select>
          </label>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] py-14 text-center text-sm text-[var(--muted)]">ไม่พบผู้ใช้ที่ตรงกับตัวกรอง</div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <article className="grid gap-4 rounded-2xl border border-[var(--line)] p-4 transition hover:border-[#d8bec8] md:grid-cols-[minmax(0,1.35fr)_minmax(150px,.7fr)_150px_120px] md:items-center" key={user.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--navy)] font-[family-name:var(--font-display)] text-xs font-bold text-white">{user.name.slice(0, 2)}</span>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm">{user.name}</strong>
                    <span className="block truncate text-[11px] text-[var(--muted)]">{user.email}</span>
                    <span className="mt-1 block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.05em] text-[#a0959a]">{user.organization} · {user.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:block">
                  <label className="text-[10px] text-[var(--muted)] md:block">
                    <span className="sr-only">บทบาทของ {user.name}</span>
                    <select aria-label={`บทบาทของ ${user.name}`} className="min-h-10 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold outline-none" disabled={pendingId === user.id || user.role === "Owner"} onChange={(event) => void changeRole(user, event.target.value as Operator["role"])} value={user.role}>
                      {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </label>
                </div>
                <div>
                  <OpsStatusPill label={user.status} tone={user.status === "Active" ? "success" : user.status === "Invited" ? "info" : "danger"} />
                  <small className="mt-1.5 block text-[9px] text-[#998d93]">{user.lastActiveAt}</small>
                </div>
                <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-3 text-[10px] font-semibold transition hover:border-[#deb9c7] hover:text-[var(--pink-strong)] disabled:opacity-50" disabled={pendingId === user.id || user.role === "Owner"} onClick={() => void toggleSuspension(user)} type="button">
                  <UserMinus size={16} /> {user.status === "Suspended" ? "คืนสิทธิ์" : "ระงับ"}
                </button>
              </article>
            ))}
          </div>
        )}
      </OpsPanel>
      {toast && <OpsSuccessToast message={toast} onDismiss={() => setToast("")} />}
    </div>
  );
}

