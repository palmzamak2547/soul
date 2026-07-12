/**
 * Demo member payloads shaped exactly for UI consumers.
 * Keep API responses isomorphic with component types to avoid runtime crashes.
 */

export const memberDemoProfile = {
  id: "member_demo_pim",
  displayName: "พิมพ์ชนก ว.",
  firstName: "พิม",
  email: "pim.soul@example.test",
  university: "จุฬาลงกรณ์มหาวิทยาลัย",
  faculty: "คณะนิเทศศาสตร์",
  graduationYear: "2028",
  avatarInitials: "พว",
  soulPoints: 1240,
  memberSince: "10 กรกฎาคม 2026",
  interests: ["ศิลปะและการออกแบบ", "กิจกรรมมหาวิทยาลัย", "เรื่องเล่ารุ่นพี่"],
};

export const memberDemoCards = [
  {
    id: "founder-088",
    slug: "soul-founder-2026",
    name: "SOUL Founder 2026",
    series: "FOUNDER SERIES",
    serial: "088 / 500",
    image: "/assets/soul-card-hero.webp",
    tone: "rose" as const,
    status: "verified" as const,
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
    tone: "night" as const,
    status: "verified" as const,
    ownedSince: "18 ส.ค. 2026",
    memories: 2,
    memoryGoal: 5,
    points: 380,
    lastTap: "18 ส.ค. 16:18",
  },
];

export const memberDemoMemories = [
  {
    id: "memory-first-tap",
    cardId: "founder-088",
    title: "วันที่การ์ดใบนี้เป็นของเรา",
    body: "แตะครั้งแรกหลังรับการ์ดจากทีม SOUL และเริ่มบันทึกเรื่องราวของเราเอง",
    date: "2026-07-10",
    displayDate: "10 กรกฎาคม 2026",
    privacy: "private" as const,
    type: "milestone" as const,
    location: "จุฬาลงกรณ์มหาวิทยาลัย",
  },
  {
    id: "memory-first-project",
    cardId: "founder-088",
    title: "โปรเจกต์แรกที่ทำจนเช้า",
    body: "คืนที่ทุกคนอยู่ด้วยกันจนฟ้าสว่าง เหนื่อยมากแต่มีความหมาย",
    date: "2026-07-24",
    displayDate: "24 กรกฎาคม 2026",
    privacy: "circle" as const,
    type: "photo" as const,
    image: "/assets/og-soul.webp",
    location: "อาคารมงกุฎสมมติวงศ์",
  },
  {
    id: "memory-pink-day",
    cardId: "founder-088",
    title: "Pink Day — เราอยู่ตรงนี้ด้วยกัน",
    body: "เสียงเพลง รูปถ่าย และเข็มกลัดสีชมพู เก็บวันนั้นไว้ในคอลเลกชัน",
    date: "2026-08-13",
    displayDate: "13 สิงหาคม 2026",
    privacy: "public" as const,
    type: "note" as const,
    location: "ลานพระบรมรูปสองรัชกาล",
  },
  {
    id: "memory-faculty-welcome",
    cardId: "commarts-023",
    title: "Welcome home, CommArts",
    body: "วันแรกที่ได้ติดเข็มคณะและเจอเพื่อนทั้งรุ่น",
    date: "2026-08-18",
    displayDate: "18 สิงหาคม 2026",
    privacy: "circle" as const,
    type: "milestone" as const,
    location: "คณะนิเทศศาสตร์",
  },
];

/** Flat settings shape consumed by MemberSettingsPage — NOT nested privacy object. */
export const memberDemoSettings = {
  defaultPrivacy: "private" as const,
  analytics: true,
  marketing: false,
  emailMemoryReminders: true,
  emailRewards: true,
  pushTapAlerts: true,
  productUpdates: false,
  sessions: [
    {
      id: "session-current",
      device: "Chrome · Windows",
      location: "Bangkok, TH",
      lastActive: "กำลังใช้งาน",
      current: true,
    },
    {
      id: "session-mobile",
      device: "Safari · iPhone",
      location: "Bangkok, TH",
      lastActive: "เมื่อวาน 21:14",
      current: false,
    },
  ],
};

export const memberDemoRewardWallet = {
  balance: 1240,
  tier: "Pink Member",
  rewards: [
    {
      id: "reward-pin",
      name: "Pink Memento Pin",
      description: "เข็มกลัดโลหะรุ่นพิเศษสำหรับสมาชิก SOUL",
      points: 300,
      category: "physical" as const,
      availability: "เหลือ 48 ชิ้น",
      accent: "#e91e63",
    },
    {
      id: "reward-wallpaper",
      name: "Founder Motion Wallpaper",
      description: "วอลเปเปอร์เคลื่อนไหวเฉพาะหมายเลขการ์ดของคุณ",
      points: 120,
      category: "digital" as const,
      availability: "รับได้ทันที",
      accent: "#4bd6ea",
    },
    {
      id: "reward-studio",
      name: "Archive Studio Session",
      description: "สิทธิ์เข้าชมคลังภาพและบันทึกเรื่องเล่าร่วมกับทีมมหาวิทยาลัย",
      points: 900,
      category: "experience" as const,
      availability: "4 รอบในเดือนนี้",
      accent: "#b5874d",
    },
  ],
  redemptions: [
    {
      id: "redeem-001",
      rewardName: "Founder Motion Wallpaper",
      points: 120,
      date: "18 สิงหาคม 2026",
      status: "fulfilled" as const,
    },
    {
      id: "redeem-002",
      rewardName: "Pink Memento Pin",
      points: 300,
      date: "10 กรกฎาคม 2026",
      status: "ready" as const,
      code: "SOUL-PINK-8842",
    },
  ],
};
