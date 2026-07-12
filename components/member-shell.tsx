"use client";

import {
  Bell,
  CaretDown,
  CardsThree,
  Gift,
  House,
  List,
  Plus,
  Radio,
  SignOut,
  SlidersHorizontal,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { demoProfile } from "./member-data";

type ShellNavItem = {
  href: string;
  label: string;
  icon: typeof House;
  match: string;
  accent?: boolean;
};

const navigation: ShellNavItem[] = [
  { href: "/member/wallet", label: "หน้าหลัก", icon: House, match: "/member/wallet" },
  { href: "/member/rewards", label: "รางวัล", icon: Gift, match: "/member/rewards" },
  { href: "/member/profile", label: "โปรไฟล์", icon: UserCircle, match: "/member/profile" },
];

const mobileNav: ShellNavItem[] = [
  ...navigation,
  {
    href: "/member/cards/founder-088/memories/new",
    label: "เพิ่ม",
    icon: Plus,
    match: "/memories/new",
    accent: true,
  },
];

function SoulMark({ light = false }: { light?: boolean }) {
  return (
    <Link aria-label="SOUL member home" className="inline-flex min-h-11 items-center" href="/member/wallet">
      <span className={`[font-family:var(--font-display)] text-[23px] font-extrabold tracking-[-0.075em] ${light ? "text-white" : "text-[var(--ink)]"}`}>
        SOUL
      </span>
      <span className="ml-1 mt-3 size-[7px] rounded-full bg-[var(--pink)]" />
      <span className={`ml-3 hidden border-l pl-3 [font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] sm:block ${light ? "border-white/20 text-white/75" : "border-[var(--line)] text-[var(--muted)]"}`}>
        MEMBER
        <br />
        SPACE
      </span>
    </Link>
  );
}

function DemoChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#efcad7] bg-[#fff1f6] px-2.5 py-1 [font-family:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--pink-strong)]">
      <span className="size-1.5 rounded-full bg-[var(--pink)]" />
      Demo member
    </span>
  );
}

function MemberNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const sideLinks = [
    ...navigation,
    { href: "/member/wallet#collection", label: "การ์ดของฉัน", icon: CardsThree, match: "#collection" },
    { href: "/member/settings", label: "ตั้งค่า", icon: SlidersHorizontal, match: "/member/settings" },
  ];
  return (
    <nav aria-label="พื้นที่สมาชิก" className="flex flex-col gap-1.5">
      {sideLinks.map(({ href, label, icon: Icon, match }) => {
        const active =
          match === "/member/wallet"
            ? pathname === "/member/wallet" || pathname === "/member"
            : match.startsWith("#")
              ? false
              : pathname.startsWith(match);
        return (
          <Link
            className={`group flex min-h-12 items-center gap-3 rounded-2xl px-3.5 text-[13px] font-semibold transition ${
              active
                ? "bg-white text-[var(--ink)] shadow-[0_10px_30px_rgba(3,8,18,.2)]"
                : "text-white/82 hover:bg-white/[0.06] hover:text-white"
            }`}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            <Icon aria-hidden="true" className={active ? "text-[var(--pink)]" : "text-white/75 group-hover:text-white"} size={20} weight={active ? "fill" : "regular"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MemberShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/member/sign-in" || pathname === "/member/onboarding";

  if (isAuth) {
    return <div className="min-h-dvh bg-[var(--paper)]">{children}</div>;
  }

  // Remount chrome on route change so mobile/profile menus close without
  // synchronous setState-in-effect (react-hooks/set-state-in-effect).
  return (
    <MemberShellFrame key={pathname} pathname={pathname}>
      {children}
    </MemberShellFrame>
  );
}

function MemberShellFrame({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#f8f4f5] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col overflow-hidden bg-[var(--navy)] px-4 py-6 text-white lg:flex">
        <div className="absolute -left-20 top-28 size-64 rounded-full bg-[var(--pink)]/10 blur-3xl" />
        <div className="relative px-2"><SoulMark light /></div>
        <div className="relative mt-10"><MemberNav /></div>
        <Link
          className="relative mt-4 flex min-h-12 items-center gap-3 rounded-2xl border border-dashed border-white/15 px-3.5 text-[12px] font-semibold text-white/65 transition hover:border-[var(--pink)]/55 hover:bg-[var(--pink)]/10 hover:text-white"
          href="/tap/soul_demo_7k3m9q2v"
        >
          <Radio aria-hidden="true" className="text-[#ff71a8]" size={20} />
          แตะการ์ดใบใหม่
        </Link>
        <div className="relative mt-auto rounded-[22px] border border-white/10 bg-white/[0.055] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-white/75">SOUL POINTS</span>
            <Gift className="text-[#ff71a8]" size={17} />
          </div>
          <strong className="[font-family:var(--font-display)] text-2xl tracking-[-0.04em]">{demoProfile.soulPoints.toLocaleString()}</strong>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[var(--pink)] to-[#ff76a9]" />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-white/75">อีก 260 แต้ม ปลดล็อกรางวัลระดับ Rose</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[var(--line)]/80 bg-[rgba(255,250,251,.88)] px-4 backdrop-blur-xl sm:px-6 lg:ml-[252px] lg:h-[78px] lg:px-9">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
            className="grid min-h-11 min-w-11 place-items-center rounded-full border border-[var(--line)] bg-white"
            onClick={() => setMobileOpen((value) => !value)}
            type="button"
          >
            {mobileOpen ? <X size={21} /> : <List size={21} />}
          </button>
          <SoulMark />
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <DemoChip />
          <span className="text-[11px] text-[var(--muted)]">ข้อมูลในพื้นที่นี้เป็นตัวอย่างที่พร้อมเชื่อมต่อบัญชีจริง</span>
        </div>
        <div className="relative ml-auto flex items-center gap-2">
          <Link
            aria-label="สร้างความทรงจำ"
            className="hidden min-h-10 items-center gap-2 rounded-full bg-[var(--pink)] px-4 text-[11px] font-bold text-white shadow-[0_8px_25px_rgba(233,30,99,.2)] transition hover:-translate-y-0.5 hover:bg-[var(--pink-strong)] sm:inline-flex"
            href="/member/cards/founder-088/memories/new"
          >
            <Plus size={16} weight="bold" />
            เพิ่มความทรงจำ
          </Link>
          <button aria-label="การแจ้งเตือน" className="relative grid min-h-10 min-w-10 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--muted)] transition hover:text-[var(--pink)]" type="button">
            <Bell size={18} />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--pink)] ring-2 ring-white" />
          </button>
          <button
            aria-expanded={profileOpen}
            aria-label="เปิดเมนูโปรไฟล์"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white p-1 pr-2 transition hover:border-[#d7bac5]"
            onClick={() => setProfileOpen((value) => !value)}
            type="button"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[var(--navy)] text-[10px] font-bold text-white">{demoProfile.avatarInitials}</span>
            <CaretDown className="text-[var(--muted)]" size={13} />
          </button>
          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-[52px] w-[250px] overflow-hidden rounded-[20px] border border-[var(--line)] bg-white p-2 shadow-[0_24px_70px_rgba(42,22,31,.16)]"
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
              >
                <div className="border-b border-[var(--line)] px-3 py-3">
                  <strong className="block text-[12px]">{demoProfile.displayName}</strong>
                  <span className="text-[12px] text-[var(--muted)]">{demoProfile.email}</span>
                </div>
                <Link className="mt-1 flex min-h-10 items-center gap-2 rounded-xl px-3 text-[11px] hover:bg-[var(--cream)]" href="/member/settings">
                  <SlidersHorizontal size={17} /> ตั้งค่าและความเป็นส่วนตัว
                </Link>
                <Link className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-[11px] text-[#a3264d] hover:bg-[#fff1f5]" href="/member/sign-in">
                  <SignOut size={17} /> ออกจากระบบ
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="ปิดเมนู"
              className="fixed inset-0 z-40 bg-[var(--navy)]/45 backdrop-blur-sm lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              type="button"
            />
            <motion.aside
              animate={{ x: 0 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(84vw,330px)] flex-col bg-[var(--navy)] p-5 text-white lg:hidden"
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between">
                <SoulMark light />
                <button aria-label="ปิดเมนู" className="grid size-11 place-items-center rounded-full border border-white/15" onClick={() => setMobileOpen(false)} type="button"><X size={20} /></button>
              </div>
              <div className="mt-10"><MemberNav onNavigate={() => setMobileOpen(false)} /></div>
              <Link className="mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-dashed border-white/15 px-3.5 text-[12px] text-white/70" href="/tap/soul_demo_7k3m9q2v"><Radio className="text-[#ff71a8]" size={20} />แตะการ์ดใบใหม่</Link>
              <div className="mt-auto rounded-[22px] bg-white/[0.06] p-4"><DemoChip /><p className="mb-0 mt-3 text-[10px] leading-relaxed text-white/82">พื้นที่ทดลองพร้อมข้อมูลจำลอง ไม่มีข้อมูลส่วนบุคคลจริงถูกเผยแพร่</p></div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <main className="min-h-[calc(100dvh-70px)] pb-24 lg:ml-[252px] lg:min-h-[calc(100dvh-78px)] lg:pb-0" id="main-content">
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }} key={pathname} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      </main>

      <nav
        aria-label="เมนูสมาชิกบนมือถือ"
        className="member-mobile-tabbar fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 gap-1 rounded-[22px] border border-white/70 bg-[rgba(7,16,31,.94)] p-1.5 shadow-[0_18px_50px_rgba(7,16,31,.3)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
      >
        {mobileNav.map(({ href, label, icon: Icon, match, accent }) => {
          const active = match.includes("memories")
            ? pathname.includes("/memories/")
            : match === "/member/wallet"
              ? pathname === "/member/wallet" || pathname === "/member"
              : pathname.startsWith(match);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold leading-none transition ${
                accent
                  ? "bg-[var(--pink)] text-white shadow-[0_8px_20px_rgba(233,30,99,.35)]"
                  : active
                    ? "bg-white text-[var(--ink)]"
                    : "text-white/82"
              }`}
              href={href}
              key={href}
            >
              <Icon
                className={accent ? "text-white" : active ? "text-[var(--pink)]" : ""}
                size={20}
                weight={active || accent ? "fill" : "regular"}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function MemberPageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-8">
      <div className="min-w-0">
        <p className="mb-2.5 [font-family:var(--font-mono)] text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--pink-strong)]">{kicker}</p>
        <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.08] tracking-[-0.05em]">{title}</h1>
        {description ? (
          <p className="mb-0 mt-3 max-w-2xl text-[13px] leading-7 text-[var(--muted)] sm:text-[14px] sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-start sm:self-end">{action}</div> : null}
    </div>
  );
}

export function DemoSourceBadge({ source }: { source: "api" | "demo" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 [font-family:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.1em] ${source === "api" ? "border-[#b8ead7] bg-[#effbf6] text-[#0d7857]" : "border-[#eadce1] bg-white text-[var(--muted)]"}`}>
      <span className={`size-1.5 rounded-full ${source === "api" ? "bg-[#16a675]" : "bg-[#b9aeb3]"}`} />
      {source === "api" ? "LIVE DATA" : "DEMO FALLBACK"}
    </span>
  );
}
