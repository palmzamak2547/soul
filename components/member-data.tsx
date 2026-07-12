"use client";

import { useEffect, useRef, useState } from "react";

export type MemoryPrivacy = "private" | "circle" | "public";

export type MemberProfile = {
  id: string;
  displayName: string;
  firstName: string;
  email: string;
  university: string;
  faculty: string;
  graduationYear: string;
  avatarInitials: string;
  soulPoints: number;
  memberSince: string;
  interests: string[];
};

export type MemberCard = {
  id: string;
  slug: string;
  name: string;
  series: string;
  serial: string;
  image: string;
  tone: "rose" | "night" | "cream";
  status: "verified" | "pending";
  ownedSince: string;
  memories: number;
  memoryGoal: number;
  points: number;
  lastTap: string;
};

export type MemberMemory = {
  id: string;
  cardId: string;
  title: string;
  body: string;
  date: string;
  displayDate: string;
  privacy: MemoryPrivacy;
  type: "photo" | "note" | "milestone";
  image?: string;
  location?: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  points: number;
  category: "digital" | "physical" | "experience";
  availability: string;
  accent: string;
};

export type Redemption = {
  id: string;
  rewardName: string;
  points: number;
  date: string;
  status: "ready" | "fulfilled" | "expired";
  code?: string;
};

export const demoProfile: MemberProfile = {
  id: "member_demo_pim",
  displayName: "พิมพ์ชนก ว.",
  firstName: "พิม",
  email: "pim.soul@example.com",
  university: "จุฬาลงกรณ์มหาวิทยาลัย",
  faculty: "คณะนิเทศศาสตร์",
  graduationYear: "2028",
  avatarInitials: "พว",
  soulPoints: 1240,
  memberSince: "10 กรกฎาคม 2026",
  interests: ["ศิลปะและการออกแบบ", "กิจกรรมมหาวิทยาลัย", "เรื่องเล่ารุ่นพี่"],
};

export const demoCards: MemberCard[] = [
  {
    id: "founder-088",
    slug: "soul-founder-2026",
    name: "SOUL Founder 2026",
    series: "FOUNDER SERIES",
    serial: "088 / 500",
    image: "/assets/soul-card-hero.webp",
    tone: "rose",
    status: "verified",
    ownedSince: "10 ก.ค. 2026",
    memories: 4,
    memoryGoal: 6,
    points: 860,
    lastTap: "วันนี้ 10:42",
  },
  {
    id: "commarts-023",
    slug: "communication-arts",
    name: "Communication Arts",
    series: "FACULTY SERIES",
    serial: "023 / 300",
    image: "/assets/communication-arts-badge.webp",
    tone: "night",
    status: "verified",
    ownedSince: "18 ส.ค. 2026",
    memories: 2,
    memoryGoal: 5,
    points: 380,
    lastTap: "18 ส.ค. 16:18",
  },
];

export const demoMemories: MemberMemory[] = [
  {
    id: "memory-first-tap",
    cardId: "founder-088",
    title: "วันที่การ์ดใบนี้เป็นของเรา",
    body: "แตะครั้งแรกหลังรับการ์ดจากทีม SOUL ความรู้สึกเหมือนได้เปิดกล่องความทรงจำที่ยังว่าง และพร้อมเติมเรื่องราวของเราเองลงไป",
    date: "2026-07-10",
    displayDate: "10 กรกฎาคม 2026",
    privacy: "private",
    type: "milestone",
    location: "จุฬาลงกรณ์มหาวิทยาลัย",
  },
  {
    id: "memory-first-project",
    cardId: "founder-088",
    title: "โปรเจกต์แรกที่ทำจนเช้า",
    body: "คืนที่ทุกคนอยู่ด้วยกันจนฟ้าสว่าง เหนื่อยมากแต่เป็นวันที่ทำให้รู้ว่าทีมที่ดีมีความหมายแค่ไหน",
    date: "2026-07-24",
    displayDate: "24 กรกฎาคม 2026",
    privacy: "circle",
    type: "photo",
    image: "/assets/og-soul.webp",
    location: "อาคารมงกุฎสมมติวงศ์",
  },
  {
    id: "memory-pink-day",
    cardId: "founder-088",
    title: "Pink Day — เราอยู่ตรงนี้ด้วยกัน",
    body: "เสียงเพลง รูปถ่าย และเข็มกลัดสีชมพู เป็นหลักฐานเล็ก ๆ ว่าครั้งหนึ่งเราเคยใช้พื้นที่นี้ร่วมกัน",
    date: "2026-08-13",
    displayDate: "13 สิงหาคม 2026",
    privacy: "public",
    type: "note",
    location: "ลานพระบรมรูปสองรัชกาล",
  },
  {
    id: "memory-future-letter",
    cardId: "founder-088",
    title: "จดหมายถึงตัวเองในวันรับปริญญา",
    body: "ถ้าวันนั้นมาถึง อย่าลืมกลับมาอ่านว่าเราเริ่มต้นด้วยความตื่นเต้นและกลัวพร้อมกันแค่ไหน",
    date: "2026-08-20",
    displayDate: "20 สิงหาคม 2026",
    privacy: "private",
    type: "note",
  },
  {
    id: "memory-faculty-welcome",
    cardId: "commarts-023",
    title: "Welcome home, CommArts",
    body: "วันแรกที่ได้ติดเข็มคณะและเจอเพื่อนทั้งรุ่น",
    date: "2026-08-18",
    displayDate: "18 สิงหาคม 2026",
    privacy: "circle",
    type: "milestone",
    location: "คณะนิเทศศาสตร์",
  },
  {
    id: "memory-studio",
    cardId: "commarts-023",
    title: "เสียงแรกในสตูดิโอ",
    body: "อัดงานชิ้นแรกผิดไปหลายรอบ แต่ทุกคนหัวเราะกันจนจบคลาส",
    date: "2026-08-26",
    displayDate: "26 สิงหาคม 2026",
    privacy: "private",
    type: "note",
  },
];

export const demoRewards: Reward[] = [
  {
    id: "reward-pin",
    name: "Pink Memento Pin",
    description: "เข็มกลัดโลหะรุ่นพิเศษสำหรับสมาชิก SOUL รับได้ที่จุดกิจกรรม",
    points: 300,
    category: "physical",
    availability: "เหลือ 48 ชิ้น",
    accent: "#e91e63",
  },
  {
    id: "reward-wallpaper",
    name: "Founder Motion Wallpaper",
    description: "วอลเปเปอร์เคลื่อนไหวเฉพาะหมายเลขการ์ดของคุณ",
    points: 120,
    category: "digital",
    availability: "รับได้ทันที",
    accent: "#4bd6ea",
  },
  {
    id: "reward-studio",
    name: "Archive Studio Session",
    description: "สิทธิ์เข้าชมคลังภาพและบันทึกเรื่องเล่าร่วมกับทีมมหาวิทยาลัย",
    points: 900,
    category: "experience",
    availability: "4 รอบในเดือนนี้",
    accent: "#b58c59",
  },
];

export const demoRedemptions: Redemption[] = [
  {
    id: "redeem-001",
    rewardName: "Founder Motion Wallpaper",
    points: 120,
    date: "18 สิงหาคม 2026",
    status: "fulfilled",
  },
  {
    id: "redeem-002",
    rewardName: "Pink Memento Pin",
    points: 300,
    date: "10 กรกฎาคม 2026",
    status: "ready",
    code: "SOUL-PINK-8842",
  },
];

export type ResourceState<T> = {
  data: T;
  loading: boolean;
  source: "api" | "demo";
  refresh: () => void;
};

export function useMemberResource<T>(endpoint: string, fallback: T): ResourceState<T> {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "demo">("demo");
  const [attempt, setAttempt] = useState(0);
  // Never put `fallback` in effect deps — callers often pass inline arrays/objects
  // (e.g. demoMemories.slice(0, 5)) which re-created every render and caused loops.
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = (await response.json()) as unknown;
        // Support both envelope { ok, data } (SOUL/Tipjai style) and bare JSON.
        const payload =
          raw &&
          typeof raw === "object" &&
          "ok" in raw &&
          (raw as { ok?: boolean }).ok === true &&
          "data" in raw
            ? ((raw as { data: T }).data as T)
            : (raw as T);
        if (active) {
          setData(payload);
          setSource("api");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        await new Promise((resolve) => window.setTimeout(resolve, 260));
        if (active) {
          setData(fallbackRef.current);
          setSource("demo");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, endpoint]);

  return { data, loading, source, refresh: () => setAttempt((value) => value + 1) };
}

export async function memberMutation<TBody, TResult>(
  endpoint: string,
  body: TBody,
  fallback: TResult,
  method: "POST" | "PATCH" | "DELETE" = "POST",
): Promise<{ data: TResult; source: "api" | "demo" }> {
  try {
    const response = await fetch(endpoint, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = (await response.json()) as unknown;
    const data =
      raw &&
      typeof raw === "object" &&
      "ok" in raw &&
      (raw as { ok?: boolean }).ok === true &&
      "data" in raw
        ? ((raw as { data: TResult }).data as TResult)
        : (raw as TResult);
    return { data, source: "api" };
  } catch {
    await new Promise((resolve) => window.setTimeout(resolve, 720));
    return { data: fallback, source: "demo" };
  }
}

export const privacyLabels: Record<MemoryPrivacy, { label: string; description: string }> = {
  private: { label: "เฉพาะฉัน", description: "มีเพียงคุณที่เปิดดูได้" },
  circle: { label: "SOUL Circle", description: "แชร์กับเจ้าของการ์ดในกลุ่มเดียวกัน" },
  public: { label: "สาธารณะ", description: "ปรากฏในเรื่องเล่าของคอลเลกชัน" },
};

export function cardById(id: string): MemberCard {
  return demoCards.find((card) => card.id === id) ?? demoCards[0];
}

export function memoryById(id: string): MemberMemory {
  return demoMemories.find((memory) => memory.id === id) ?? demoMemories[0];
}
