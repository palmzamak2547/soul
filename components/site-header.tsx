"use client";

import { List, Radio, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "./brand";

/** Keep primary nav short — secondary ops live in mobile drawer + footer. */
const primaryLinks = [
  { href: "/collections", label: "คอลเลกชัน" },
  { href: "/universities", label: "มหาวิทยาลัย" },
  { href: "/member/wallet", label: "สมาชิก" },
];

const drawerExtra = [
  { href: "/#experience", label: "ประสบการณ์บนหน้าแรก" },
  { href: "/#memories", label: "เส้นเวลาความทรงจำ" },
  { href: "/admin", label: "Control Center (ทีม)" },
  { href: "/status", label: "สถานะระบบ" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`site-header ${dark ? "is-dark" : ""} ${open ? "is-menu-open" : ""}`}>
      <Brand />

      <nav aria-label="เมนูหลัก" className="main-nav main-nav-desktop">
        {primaryLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
        <Link className="header-cta" href="/tap/soul_demo_7k3m9q2v">
          <Radio size={17} weight="bold" aria-hidden="true" />
          ลองแตะการ์ด
        </Link>
      </nav>

      <button
        aria-controls="mobile-primary-nav"
        aria-expanded={open}
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        className="nav-toggle"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={23} /> : <List size={23} />}
      </button>

      {open ? (
        <button
          aria-label="ปิดเมนู"
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}

      <nav
        aria-label="เมนูมือถือ"
        className={`main-nav main-nav-mobile ${open ? "is-open" : ""}`}
        id="mobile-primary-nav"
      >
        <p className="nav-mobile-label">สำรวจ</p>
        {primaryLinks.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link
          className="header-cta"
          href="/tap/soul_demo_7k3m9q2v"
          onClick={() => setOpen(false)}
        >
          <Radio size={17} weight="bold" aria-hidden="true" />
          ลองแตะการ์ด
        </Link>
        <p className="nav-mobile-label">เพิ่มเติม</p>
        {drawerExtra.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
