import type {
  CollectibleCardRecord,
  RewardRecord,
} from "@/lib/soul/types";

/**
 * Fictional prototype content only. It intentionally contains no student,
 * alumni, staff, email, phone, device, or account data.
 */
export const FICTIONAL_REWARDS = [
  {
    id: "reward-pink-sky-wallpaper",
    titleTh: "Pink Sky — Digital Keepsake",
    titleEn: "Pink Sky Digital Keepsake",
    description:
      "ภาพที่ระลึกดิจิทัลฉบับต้นแบบสำหรับทดลองประสบการณ์หลังแตะการ์ด",
    kind: "digital_keepsake",
    availability: "prototype",
    artworkUrl: "/assets/og-soul.webp",
  },
  {
    id: "reward-memory-orbit-preview",
    titleTh: "Memory Orbit — Immersive Preview",
    titleEn: "Memory Orbit Immersive Preview",
    description:
      "ตัวอย่างฉากความทรงจำแบบ immersive โดยยังไม่สร้างสิทธิ์ใช้งานจริง",
    kind: "immersive_preview",
    availability: "prototype",
    artworkUrl: "/assets/soul-card-hero.webp",
  },
  {
    id: "reward-chamchuri-soundscape",
    titleTh: "Chamchuri Soundscape",
    titleEn: "Chamchuri Soundscape",
    description:
      "ตัวอย่าง soundscape ดิจิทัลที่ออกแบบเพื่อสำรวจแนวคิดของ SOUL",
    kind: "digital_keepsake",
    availability: "prototype",
    artworkUrl: "/assets/soul-card-hero.webp",
  },
] as const satisfies readonly RewardRecord[];

export const FICTIONAL_CARDS = [
  {
    id: "card-first-light-026",
    publicToken: "soul_demo_7k3m9q2v",
    slug: "first-light",
    titleTh: "แสงแรกแห่งจามจุรี",
    titleEn: "First Light",
    collection: "Pink Memento — Genesis",
    chapter: "Chapter 01 · The Beginning",
    rarity: "signature",
    status: "active",
    edition: { number: 26, size: 250, label: "026 / 250" },
    visual: {
      imageUrl: "/assets/soul-card-hero.webp",
      accent: "#F36AA9",
      glow: "#FFB5D6",
    },
    memory: {
      eyebrow: "A fictional Chula-inspired memory",
      headline: "เมื่อพื้นที่เดิมเก็บความรู้สึกใหม่ไว้ได้เสมอ",
      excerpt:
        "ความทรงจำต้นแบบที่เชื่อมวัตถุจริงกับเรื่องเล่าดิจิทัลอย่างเรียบง่ายและอบอุ่น",
      year: "Prototype 2026",
    },
    traits: ["Pink Hour", "First Chapter", "Signature Foil"],
    rewardIds: [
      "reward-pink-sky-wallpaper",
      "reward-memory-orbit-preview",
    ],
    issuedAt: "2026-06-18T09:00:00.000Z",
    prototypeAnalytics: {
      taps: 1284,
      rewardClaims: 386,
      lastTapAt: "2026-07-10T07:32:00.000Z",
    },
  },
  {
    id: "card-after-rain-088",
    publicToken: "soul_demo_h4p8x2nd",
    slug: "after-rain",
    titleTh: "จามจุรีหลังฝน",
    titleEn: "After Rain",
    collection: "Pink Memento — Genesis",
    chapter: "Chapter 02 · Quiet Green",
    rarity: "rare",
    status: "active",
    edition: { number: 88, size: 300, label: "088 / 300" },
    visual: {
      imageUrl: "/assets/soul-card-hero.webp",
      accent: "#64D7B1",
      glow: "#C6F7E7",
    },
    memory: {
      eyebrow: "A fictional Chula-inspired memory",
      headline: "กลิ่นฝน เสียงใบไม้ และทางเดินที่คุ้นเคย",
      excerpt:
        "บททดลองเล่าเรื่องสถานที่ผ่านสี เสียง และจังหวะเล็ก ๆ หลังการแตะ NFC",
      year: "Prototype 2026",
    },
    traits: ["Rain Note", "Green Archive", "Rare"],
    rewardIds: ["reward-chamchuri-soundscape"],
    issuedAt: "2026-06-22T09:00:00.000Z",
    prototypeAnalytics: {
      taps: 864,
      rewardClaims: 219,
      lastTapAt: "2026-07-10T06:48:00.000Z",
    },
  },
  {
    id: "card-pink-twilight-013",
    publicToken: "soul_demo_m9r2f6kt",
    slug: "pink-twilight",
    titleTh: "ชมพูยามเย็น",
    titleEn: "Pink Twilight",
    collection: "Soul of Campus — Preview",
    chapter: "Chapter 00 · Preview",
    rarity: "limited",
    status: "active",
    edition: { number: 13, size: 200, label: "013 / 200" },
    visual: {
      imageUrl: "/assets/soul-card-hero.webp",
      accent: "#A98BFF",
      glow: "#E5D9FF",
    },
    memory: {
      eyebrow: "A fictional Chula-inspired memory",
      headline: "หนึ่งช่วงเวลาที่พกกลับไปได้",
      excerpt:
        "การ์ดต้นแบบที่สำรวจว่าของที่ระลึกจะเติบโตเป็นพื้นที่เก็บความทรงจำได้อย่างไร",
      year: "Prototype 2026",
    },
    traits: ["Twilight", "Preview Drop", "Limited"],
    rewardIds: ["reward-pink-sky-wallpaper"],
    issuedAt: "2026-07-01T09:00:00.000Z",
    prototypeAnalytics: {
      taps: 592,
      rewardClaims: 148,
      lastTapAt: "2026-07-10T05:54:00.000Z",
    },
  },
  {
    id: "card-reunion-echo-041",
    publicToken: "soul_demo_r3u9n1on",
    slug: "reunion-echo",
    titleTh: "เสียงก้องรุ่น",
    titleEn: "Reunion Echo",
    collection: "Reunion Capsule — Prototype",
    chapter: "Chapter 30 · Coming Home",
    rarity: "rare",
    status: "active",
    edition: { number: 41, size: 200, label: "041 / 200" },
    visual: {
      imageUrl: "/assets/soul-card-hero.webp",
      accent: "#E8A04A",
      glow: "#FFE0B5",
    },
    memory: {
      eyebrow: "A fictional alumni memory",
      headline: "เมื่อรุ่นเดียวกันกลับมาเจอกันอีกครั้ง",
      excerpt:
        "ต้นแบบ reunion capsule ที่เก็บเสียง ภาพ และข้อความจากเพื่อนในรุ่นโดยไม่เปิดเผย PII",
      year: "Prototype 2026",
    },
    traits: ["Reunion", "Alumni", "Rare Foil"],
    rewardIds: [
      "reward-memory-orbit-preview",
      "reward-chamchuri-soundscape",
    ],
    issuedAt: "2026-07-08T09:00:00.000Z",
    prototypeAnalytics: {
      taps: 311,
      rewardClaims: 74,
      lastTapAt: "2026-07-12T10:12:00.000Z",
    },
  },
] as const satisfies readonly CollectibleCardRecord[];

export const FICTIONAL_RECENT_ACTIVITY = [
  {
    id: "activity-001",
    type: "tap",
    label: "First Light ถูกเปิดผ่าน demo token",
    occurredAt: "2026-07-10T07:32:00.000Z",
  },
  {
    id: "activity-002",
    type: "prototype_reward",
    label: "บันทึกการทดลองรับ Pink Sky Digital Keepsake",
    occurredAt: "2026-07-10T07:28:00.000Z",
  },
  {
    id: "activity-003",
    type: "tap",
    label: "After Rain ถูกเปิดผ่าน demo token",
    occurredAt: "2026-07-10T06:48:00.000Z",
  },
  {
    id: "activity-004",
    type: "collection_publish",
    label: "เผยแพร่ Soul of Campus — Preview ในสภาพแวดล้อมต้นแบบ",
    occurredAt: "2026-07-09T12:00:00.000Z",
  },
  {
    id: "activity-005",
    type: "tap",
    label: "Reunion Echo ถูกเปิดผ่าน demo token",
    occurredAt: "2026-07-12T10:12:00.000Z",
  },
] as const satisfies readonly {
  id: string;
  type: "tap" | "prototype_reward" | "collection_publish";
  label: string;
  occurredAt: string;
}[];

