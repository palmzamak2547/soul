"use client";

import { List, Radio, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";

const links = [
  { href: "/#experience", label: "ประสบการณ์" },
  { href: "/#memories", label: "ความทรงจำ" },
  { href: "/collections", label: "คอลเลกชัน" },
  { href: "/universities", label: "มหาวิทยาลัย" },
  { href: "/member/wallet", label: "Member" },
  { href: "/admin", label: "Control Center" },
];

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header ${dark ? "is-dark" : ""}`}>
      <Brand />
      <nav aria-label="เมนูหลัก" className={`main-nav ${open ? "is-open" : ""}`}>
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link className="header-cta" href="/tap/soul_demo_7k3m9q2v" onClick={() => setOpen(false)}>
          <Radio size={17} weight="bold" aria-hidden="true" />
          ลองแตะการ์ด
        </Link>
      </nav>
      <button
        aria-expanded={open}
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        className="nav-toggle"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={23} /> : <List size={23} />}
      </button>
    </header>
  );
}
