"use client";

import {
  ArrowRight,
  CardsThree,
  ChartLineUp,
  Check,
  CheckCircle,
  ClipboardText,
  Coins,
  DownloadSimple,
  Fingerprint,
  Gift,
  LockKey,
  MagnifyingGlass,
  Pulse,
  Radio,
  ShieldCheck,
  SignOut,
  Sparkle,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Brand } from "./brand";

type AdminCard = {
  id: string;
  slug: string;
  titleTh: string;
  editionSize: number;
  status: string;
  taps: number;
  prototypeRewardClaims: number;
  lastTapAt: string;
};

type AdminOverview = {
  generatedAt: string;
  environment: string;
  metrics: {
    issuedCards: number;
    totalTaps: number;
    prototypeRewardClaims: number;
    activeCollections: number;
  };
  cards: AdminCard[];
  recentActivity: { id: string; type: string; label: string; occurredAt: string }[];
  privacy: { containsPersonalData: boolean; note: string };
};

type AuthState = "checking" | "signed-out" | "signed-in";
type Tab = "overview" | "cards" | "content" | "rewards" | "security";

const navigation: { id: Tab; label: string; icon: typeof ChartLineUp }[] = [
  { id: "overview", label: "Overview", icon: ChartLineUp },
  { id: "cards", label: "Cards & NFC", icon: CardsThree },
  { id: "content", label: "Content", icon: ClipboardText },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const contentSeed = [
  { id: "story-01", title: "จดหมายถึงนิสิตรุ่นต่อไป", collection: "SOUL Founder 2026", status: "Scheduled", date: "18 Aug 2026" },
  { id: "story-02", title: "หนึ่งวันในงานบอล", collection: "Communication Arts", status: "Review", date: "22 Aug 2026" },
  { id: "story-03", title: "ภาพจากหอประวัติ — ตัวอย่าง", collection: "University Archive", status: "Rights check", date: "Unscheduled" },
];

const rewardsSeed = [
  { name: "Pink Memento Pin", cost: 300, stock: 48, state: "Prototype only" },
  { name: "Reunion Badge", cost: 600, stock: 0, state: "Locked" },
  { name: "Founder Wallpaper", cost: 120, stock: 999, state: "Digital" },
];

function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error("AUTH_FAILED");
      onSignedIn();
    } catch {
      setState("error");
    }
  }

  return (
    <main className="admin-login" id="main-content">
      <div className="admin-login-brand"><Brand /></div>
      <section className="login-card" aria-labelledby="admin-login-title">
        <div className="login-icon" aria-hidden="true"><LockKey size={28} weight="duotone" /></div>
        <p className="section-kicker">SOUL / CONTROL CENTER</p>
        <h1 id="admin-login-title">เข้าสู่ระบบผู้ดูแล</h1>
        <p>
          พื้นที่นี้ใช้ข้อมูลสมมติเพื่อสาธิตการดูแลการ์ด เนื้อหา และรางวัล
          — session เป็น HttpOnly และหมดอายุอัตโนมัติ
        </p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="admin-access-code">
            รหัสเข้าถึง
            <input
              autoComplete="current-password"
              autoFocus
              id="admin-access-code"
              onChange={(event) => {
                setPassword(event.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="กรอกรหัสจากผู้ดูแลระบบ"
              required
              type="password"
              value={password}
            />
          </label>
          {state === "error" ? (
            <div className="login-error" role="alert">
              <WarningCircle size={17} aria-hidden="true" />
              รหัสไม่ถูกต้องหรือ session ตั้งค่าไม่ครบ ลองอีกครั้ง
            </div>
          ) : null}
          <button className="button button-primary button-full" disabled={state === "loading" || password.length === 0} type="submit">
            {state === "loading" ? "กำลังตรวจสอบ…" : "เข้าสู่ Control Center"}
            {state !== "loading" && <ArrowRight size={18} weight="bold" aria-hidden="true" />}
          </button>
        </form>
        <div className="login-security">
          <ShieldCheck size={17} weight="fill" aria-hidden="true" />
          ไม่เก็บรหัสใน browser · ใช้เฉพาะผู้ดูแลที่ได้รับอนุญาต
        </div>
      </section>
      <div className="login-footer-links">
        <Link className="login-back" href="/">← กลับหน้าหลัก</Link>
        <Link className="login-back" href="/tap/soul_demo_7k3m9q2v">ลอง tap demo</Link>
      </div>
    </main>
  );
}

export function AdminConsole() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [data, setData] = useState<AdminOverview | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [published, setPublished] = useState<string[]>([]);
  const [provisioned, setProvisioned] = useState(false);

  const loadOverview = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      if (response.status === 401) {
        setAuth("signed-out");
        return;
      }
      if (!response.ok) throw new Error("LOAD_FAILED");
      const payload = await response.json();
      setData(payload.data);
      setAuth("signed-in");
    } catch {
      setAuth("signed-out");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/overview", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) throw new Error("LOAD_FAILED");
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        if (!payload) {
          setAuth("signed-out");
          return;
        }
        setData(payload.data);
        setAuth("signed-in");
      })
      .catch(() => {
        if (!cancelled) setAuth("signed-out");
      });
    return () => { cancelled = true; };
  }, []);

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setData(null);
    setAuth("signed-out");
  }

  const filteredCards = useMemo(
    () => (data?.cards ?? []).filter((card) => `${card.titleTh} ${card.slug} ${card.status}`.toLowerCase().includes(query.toLowerCase())),
    [data?.cards, query],
  );

  if (auth === "checking") {
    return <main className="admin-checking" id="main-content"><div className="tap-spinner" /><span>กำลังตรวจ session…</span></main>;
  }

  if (auth === "signed-out") {
    return <AdminLogin onSignedIn={() => void loadOverview()} />;
  }

  const metrics = data?.metrics ?? { issuedCards: 0, totalTaps: 0, prototypeRewardClaims: 0, activeCollections: 0 };
  const metricCards = [
    { label: "Issued cards", value: metrics.issuedCards.toLocaleString(), change: "+12.4%", icon: CardsThree },
    { label: "Total taps", value: metrics.totalTaps.toLocaleString(), change: "+24.8%", icon: Radio },
    { label: "Reward claims", value: metrics.prototypeRewardClaims.toLocaleString(), change: "+8.1%", icon: Gift },
    { label: "Active collections", value: metrics.activeCollections.toLocaleString(), change: "Live", icon: Sparkle },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand compact />
        <span className="admin-product-label">CONTROL CENTER</span>
        <nav aria-label="เมนูหลังบ้าน">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button aria-current={activeTab === item.id ? "page" : undefined} className={activeTab === item.id ? "is-active" : ""} key={item.id} onClick={() => setActiveTab(item.id)} type="button">
                <Icon size={19} weight={activeTab === item.id ? "fill" : "regular"} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-demo-badge"><span /> Demo environment</div>
          <button onClick={signOut} type="button"><SignOut size={18} /> ออกจากระบบ</button>
        </div>
      </aside>

      <main className="admin-main" id="main-content">
        <header className="admin-topbar">
          <div><span className="mini-label">SOUL OPERATIONS</span><h1>{navigation.find((item) => item.id === activeTab)?.label}</h1></div>
          <div className="admin-top-actions">
            <span className="data-chip"><ShieldCheck size={15} weight="fill" /> FICTIONAL DEMO DATA</span>
            <Link href="/tap/soul_demo_7k3m9q2v" target="_blank">Open experience <ArrowRight size={15} /></Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} initial={{ opacity: 0, y: 10 }} key="overview">
              <section className="admin-metric-grid">
                {metricCards.map((item) => {
                  const Icon = item.icon;
                  return <article key={item.label}><div className="metric-icon"><Icon size={22} weight="duotone" /></div><span>{item.label}</span><strong>{item.value}</strong><small>{item.change} <span>vs previous demo period</span></small></article>;
                })}
              </section>

              <section className="admin-overview-grid">
                <article className="admin-panel activity-panel">
                  <div className="panel-heading"><div><span className="mini-label">TAP ACTIVITY</span><h2>Moments being unlocked</h2></div><select aria-label="ช่วงเวลา" defaultValue="7d"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select></div>
                  <div className="activity-chart" aria-label="กราฟจำนวน tap เจ็ดวัน">
                    {[42, 58, 45, 72, 68, 91, 79].map((value, index) => <div key={index}><span style={{ height: `${value}%` }} /><small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</small></div>)}
                  </div>
                  <div className="chart-legend"><span><i className="legend-pink" /> NFC taps</span><strong>+24.8% this week</strong></div>
                </article>

                <article className="admin-panel live-panel">
                  <div className="panel-heading"><div><span className="mini-label">LIVE SIGNALS</span><h2>Recent activity</h2></div><Pulse size={21} weight="duotone" /></div>
                  <div className="activity-list">
                    {(data?.recentActivity ?? []).slice(0, 5).map((item) => (
                      <div key={item.id}><span className={`activity-type type-${item.type}`}><Radio size={14} /></span><div><strong>{item.label}</strong><small>{new Date(item.occurredAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}</small></div></div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="admin-panel collection-health">
                <div className="panel-heading"><div><span className="mini-label">COLLECTION HEALTH</span><h2>Cards in circulation</h2></div><button onClick={() => setActiveTab("cards")} type="button">View registry <ArrowRight size={15} /></button></div>
                <div className="health-table"><div className="health-head"><span>Collection</span><span>Status</span><span>Issued</span><span>Taps</span><span>Last activity</span></div>{(data?.cards ?? []).slice(0, 4).map((card) => <div className="health-row" key={card.id}><span><i className="collection-avatar">{card.titleTh.slice(0, 1)}</i><strong>{card.titleTh}</strong></span><span><i className="status-dot" /> {card.status}</span><span>{card.editionSize}</span><span>{card.taps.toLocaleString()}</span><span>{new Date(card.lastTapAt).toLocaleDateString("th-TH")}</span></div>)}</div>
              </section>
            </motion.div>
          )}

          {activeTab === "cards" && (
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} key="cards">
              <section className="admin-split">
                <article className="admin-panel card-registry">
                  <div className="panel-heading"><div><span className="mini-label">CARD REGISTRY</span><h2>การ์ดและสถานะ NFC</h2></div><div className="table-search"><MagnifyingGlass size={16} /><input aria-label="ค้นหาการ์ด" onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหา collection…" value={query} /></div></div>
                  <div className="registry-table"><div className="registry-head"><span>Collection</span><span>Edition</span><span>Status</span><span>Taps</span></div>{filteredCards.map((card) => <div className="registry-row" key={card.id}><span><strong>{card.titleTh}</strong><small>{card.slug}</small></span><span>{card.editionSize}</span><span><i className="status-dot" /> {card.status}</span><span>{card.taps}</span></div>)}</div>
                </article>
                <article className="admin-panel provision-panel">
                  <span className="mini-label">PROVISIONING LAB</span><h2>จำลองออกการ์ดใหม่</h2><p>สร้าง opaque token แยกจาก serial และเก็บเฉพาะ hash ของ nonce ใน production</p>
                  <div className={`provision-card ${provisioned ? "is-done" : ""}`}><Fingerprint size={36} weight="duotone" /><span>{provisioned ? "TOKEN CREATED" : "READY TO PROVISION"}</span><strong>{provisioned ? "soul_••••••••9q2v" : "NTAG216 · DEMO"}</strong></div>
                  <button className="button button-primary button-full" disabled={provisioned} onClick={() => setProvisioned(true)} type="button">{provisioned ? <><Check size={18} /> Provisioned in demo</> : <>Generate demo token <ArrowRight size={18} /></>}</button>
                  <small className="panel-warning"><WarningCircle size={15} /> NTAG216 signed URL ป้องกันการเดา แต่ไม่ป้องกันการ clone tag</small>
                </article>
              </section>
            </motion.div>
          )}

          {activeTab === "content" && (
            <motion.section animate={{ opacity: 1 }} className="admin-panel content-panel" initial={{ opacity: 0 }} key="content">
              <div className="panel-heading"><div><span className="mini-label">CONTENT OPERATIONS</span><h2>Stories & release schedule</h2></div><button className="outline-action" type="button"><DownloadSimple size={16} /> Export review list</button></div>
              <div className="content-table"><div className="content-head"><span>Story</span><span>Collection</span><span>Release</span><span>Status</span><span>Action</span></div>{contentSeed.map((item) => { const isPublished = published.includes(item.id); return <div className="content-row" key={item.id}><span><strong>{item.title}</strong><small>{item.id}</small></span><span>{item.collection}</span><span>{item.date}</span><span className={`content-status status-${(isPublished ? "published" : item.status).toLowerCase().replaceAll(" ", "-")}`}>{isPublished ? "Published in demo" : item.status}</span><span><button disabled={isPublished || item.status === "Rights check"} onClick={() => setPublished((value) => [...value, item.id])} type="button">{isPublished ? <Check size={16} /> : "Publish"}</button></span></div>; })}</div>
              <div className="rights-banner"><ShieldCheck size={23} weight="duotone" /><div><strong>Rights status blocks publishing by design</strong><p>Archive และ UGC ทุกชิ้นต้องมี consent/license ก่อนเข้าสู่ public memory timeline</p></div></div>
            </motion.section>
          )}

          {activeTab === "rewards" && (
            <motion.div animate={{ opacity: 1 }} className="reward-admin-grid" initial={{ opacity: 0 }} key="rewards">
              {rewardsSeed.map((reward) => <article className="admin-panel reward-admin-card" key={reward.name}><div className="reward-admin-icon"><Coins size={24} weight="duotone" /></div><span className="mini-label">{reward.state}</span><h2>{reward.name}</h2><div className="reward-admin-meta"><span><strong>{reward.cost}</strong> points</span><span><strong>{reward.stock}</strong> stock</span></div><button type="button">Manage prototype <ArrowRight size={15} /></button></article>)}
              <article className="admin-panel reward-policy"><ShieldCheck size={28} weight="duotone" /><h2>Ownership gate</h2><p>Tap session เปิด public story ได้ แต่ไม่อนุญาตการแลกรางวัลจริง ที่อยู่จัดส่ง หรือ token transfer</p><ul><li><CheckCircle weight="fill" /> Owner auth required</li><li><CheckCircle weight="fill" /> Idempotency key</li><li><CheckCircle weight="fill" /> Append-only ledger</li></ul></article>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div animate={{ opacity: 1 }} className="security-grid" initial={{ opacity: 0 }} key="security">
              {[{ icon: LockKey, title: "Signed sessions", copy: "HttpOnly · SameSite=Strict · expiring HMAC session" }, { icon: Fingerprint, title: "Opaque tap links", copy: "Random token แยกจาก serial และไม่ใช้ UID เป็น ownership" }, { icon: ShieldCheck, title: "Privacy boundary", copy: "Public DTO ไม่มี student ID, raw IP, token hash หรือข้อมูลใบสมัคร" }, { icon: UsersThree, title: "Role-ready model", copy: "เตรียมแยกสิทธิ university, faculty, editor และ support" }].map((item) => { const Icon = item.icon; return <article className="admin-panel security-card" key={item.title}><Icon size={28} weight="duotone" /><span className="security-ok"><CheckCircle size={15} weight="fill" /> ACTIVE IN PROTOTYPE</span><h2>{item.title}</h2><p>{item.copy}</p></article>; })}
              <article className="admin-panel security-wide"><div><span className="mini-label">PRODUCTION HARDENING</span><h2>สิ่งที่ต้องเพิ่มก่อนเปิดกับผู้ใช้จริง</h2></div><div className="hardening-list"><span>NTAG 424 DNA / anti-replay</span><span>Distributed rate limiting</span><span>University SSO + RBAC</span><span>Postgres audit ledger</span><span>Media rights workflow</span><span>Backup & export policy</span></div></article>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
