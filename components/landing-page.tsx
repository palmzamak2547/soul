"use client";

import {
  ArrowRight,
  CheckCircle,
  CloudCheck,
  Coins,
  Fingerprint,
  Gift,
  GraduationCap,
  Lightning,
  LockKey,
  Radio,
  ShieldCheck,
  Sparkle,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const tapSteps = [
  { number: "01", title: "Tap", detail: "แตะ NFC หรือสแกน QR" },
  { number: "02", title: "Unlock", detail: "ตัวตนและเรื่องราวปรากฏ" },
  { number: "03", title: "Collect", detail: "เก็บ badge และ memory" },
  { number: "04", title: "Earn", detail: "รับ SOUL points จากกิจกรรม" },
  { number: "05", title: "Redeem", detail: "แลกรางวัลที่มีความหมาย" },
];

const timeline = [
  { year: "2026", label: "First day", detail: "ก้าวแรกในรั้วมหาวิทยาลัย", icon: Sparkle },
  { year: "2026", label: "Orientation", detail: "เพื่อนใหม่ ความทรงจำแรก", icon: UsersThree },
  { year: "2027", label: "Sports day", detail: "เสียงเชียร์ที่ยังได้ยินเสมอ", icon: Trophy },
  { year: "2030", label: "Graduation", detail: "บทหนึ่งจบ อีกบทกำลังเริ่ม", icon: GraduationCap },
  { year: "2056", label: "30th reunion", detail: "แตะอีกครั้ง ทุกอย่างกลับมา", icon: CloudCheck },
];

const pillars = [
  {
    icon: Fingerprint,
    eyebrow: "IDENTITY",
    title: "ตัวตนที่พกติดตัว",
    copy: "โปรไฟล์สาธารณะแบบ opt-in, รุ่น คณะ และความผูกพัน—โดยไม่เปิดเผยข้อมูลละเอียดอ่อน",
  },
  {
    icon: LockKey,
    eyebrow: "MEMORY",
    title: "ความทรงจำที่ค่อย ๆ เติบโต",
    copy: "การ์ดใบเดิม แต่เรื่องราว ภาพ และช่วงเวลาสำคัญเพิ่มขึ้นตลอดชีวิตมหาวิทยาลัย",
  },
  {
    icon: Gift,
    eyebrow: "BELONGING",
    title: "สิทธิ์ที่มีความหมาย",
    copy: "สะสม badge, points และรางวัลจากกิจกรรมจริง—ไม่ใช่แค่ของสะสมที่วางอยู่บนชั้น",
  },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content">
        <section className="hero" ref={heroRef}>
          <div className="hero-copy">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow-row"
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-dot" />
              <span>Stories of University Life</span>
              <span className="prototype-pill">Interactive prototype</span>
            </motion.div>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              A card you tap.
              <br />
              A lifetime you <em>unlock.</em>
            </motion.h1>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="hero-lede"
              initial={{ opacity: 0, y: 22 }}
              transition={{ duration: 0.65, delay: 0.18 }}
            >
              เปลี่ยนของที่ระลึกให้เป็นประตูสู่ตัวตน เรื่องราว และความทรงจำที่เติบโตไปพร้อมกับคุณ—แตะครั้งเดียว ไม่ต้องลงแอป
            </motion.p>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.28 }}
            >
              <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">
                <Radio size={20} weight="bold" aria-hidden="true" />
                ลอง Tap Experience
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </Link>
              <Link className="button button-ghost" href="/collections">
                ดูคอลเลกชัน
              </Link>
            </motion.div>
            <motion.div
              animate={{ opacity: 1 }}
              className="hero-trust"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.42 }}
            >
              <span><CheckCircle size={17} weight="fill" /> No app required</span>
              <span><ShieldCheck size={17} weight="fill" /> Privacy-first</span>
              <span><Lightning size={17} weight="fill" /> Under 7 seconds</span>
            </motion.div>
          </div>

          <motion.div className="hero-visual" style={{ y: imageY }}>
            <motion.div
              className="hero-image-frame"
              initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotateY: -2.5, rotateX: 1.5, scale: 1.012 }}
            >
              <Image
                alt="การ์ดสะสม SOUL สี rose-gold บนแท่นใส"
                fill
                priority
                sizes="(max-width: 900px) 92vw, 50vw"
                src="/assets/soul-card-hero.webp"
              />
              <div className="image-sheen" aria-hidden="true" />
            </motion.div>
            <div className="floating-note note-top">
              <span className="pulse-dot" />
              NFC READY
              <strong>Tap to remember</strong>
            </div>
            <div className="floating-note note-bottom">
              <span>LIMITED EDITION</span>
              <strong>088 / 500</strong>
            </div>
          </motion.div>
        </section>

        <section aria-label="คุณสมบัติหลัก" className="signal-strip">
          <span>ONE CARD</span>
          <span className="signal-mark">×</span>
          <span>A LIFETIME</span>
          <span className="signal-mark">×</span>
          <span>ZERO APPS</span>
          <span className="signal-mark">×</span>
          <span>MEMORIES THAT COMPOUND</span>
        </section>

        <section className="experience-section" id="experience">
          <div className="section-heading inverted">
            <Reveal>
              <p className="section-kicker">01 / THE TAP</p>
              <h2>From card to memory.<br /><em>Seven seconds. Zero apps.</em></h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="section-intro">
                NFC เปิด browser ด้วยลิงก์เฉพาะของการ์ด จากนั้น SOUL พาผู้ใช้เข้าสู่เรื่องราวโดยไม่ต้องติดตั้งอะไรเพิ่ม
              </p>
            </Reveal>
          </div>

          <div className="tap-rail">
            {tapSteps.map((step, index) => (
              <Reveal className="tap-step-wrap" delay={index * 0.06} key={step.number}>
                <div className="tap-step">
                  <span className="tap-number">{step.number}</span>
                  <div className="tap-icon" aria-hidden="true">
                    {index === 0 ? <Radio /> : index === 1 ? <Fingerprint /> : index === 2 ? <Trophy /> : index === 3 ? <Coins /> : <Gift />}
                  </div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
                {index < tapSteps.length - 1 && <ArrowRight className="rail-arrow" size={18} aria-hidden="true" />}
              </Reveal>
            ))}
          </div>

          <Reveal className="experience-callout">
            <div>
              <span className="mini-label">SEE IT IN MOTION</span>
              <h3>พร้อมปลดล็อกความทรงจำแรกหรือยัง?</h3>
            </div>
            <Link className="button button-light" href="/tap/soul_demo_7k3m9q2v">
              เริ่ม Tap Demo <ArrowRight size={18} weight="bold" />
            </Link>
          </Reveal>
        </section>

        <section className="memories-section" id="memories">
          <div className="section-heading">
            <Reveal>
              <p className="section-kicker">02 / THE MEMORY</p>
              <h2>The card never changes.<br /><em>The memories compound.</em></h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="section-intro">
                จากวันแรกจนถึง reunion ครั้งที่ 30 ทุกช่วงเวลามีที่อยู่ และเจ้าของเลือกได้ว่าอะไรเป็นสาธารณะหรือเป็นส่วนตัว
              </p>
            </Reveal>
          </div>

          <div className="memory-timeline">
            <div className="timeline-line" aria-hidden="true" />
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal className="timeline-item" delay={index * 0.07} key={`${item.year}-${item.label}`}>
                  <div className="timeline-node"><Icon size={20} weight="duotone" /></div>
                  <span className="timeline-year">{item.year}</span>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                  {index === timeline.length - 1 && <span className="timeline-future">THE STORY GOES ON</span>}
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="platform-section">
          <div className="section-heading compact">
            <Reveal>
              <p className="section-kicker">03 / THE PLATFORM</p>
              <h2>The card is the door.<br /><em>The platform is the building.</em></h2>
            </Reveal>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal className="pillar-card" delay={index * 0.08} key={pillar.eyebrow}>
                  <div className="pillar-top">
                    <span>{pillar.eyebrow}</span>
                    <Icon size={28} weight="duotone" aria-hidden="true" />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                  <span className="pillar-index">0{index + 1}</span>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="manifesto-section">
          <Reveal className="manifesto-copy">
            <span className="manifesto-mark">SOUL</span>
            <blockquote>
              “Thirty years after graduation,<br />a single tap brings back <em>every memory.</em>”
            </blockquote>
            <p>
              มหาวิทยาลัยเก็บองค์ความรู้ไว้เสมอ ถึงเวลาที่เราจะเก็บความรู้สึกของการได้เป็นส่วนหนึ่งไว้ด้วย
            </p>
          </Reveal>
          <Reveal className="manifesto-card" delay={0.1}>
            <Image
              alt="SOUL digital badge สีชมพูสำหรับคณะนิเทศศาสตร์"
              fill
              sizes="(max-width: 900px) 90vw, 38vw"
              src="/assets/communication-arts-badge.webp"
            />
            <div className="manifesto-card-overlay">
              <span>BADGE UNLOCKED</span>
              <strong>Faculty pride</strong>
            </div>
          </Reveal>
        </section>

        <section className="final-cta">
          <Reveal>
            <span className="section-kicker">YOUR MEMORY STARTS HERE</span>
            <h2>Every university has a soul.<br /><em>Let’s make it unforgettable.</em></h2>
            <div className="hero-actions centered">
              <Link className="button button-primary" href="/tap/soul_demo_7k3m9q2v">
                ลองประสบการณ์จริง <ArrowRight size={18} weight="bold" />
              </Link>
              <Link className="button button-ghost" href="/admin">
                เปิดหลังบ้าน
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
