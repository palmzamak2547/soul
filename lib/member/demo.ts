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
  { id: "founder-088", slug: "soul-founder-2026", name: "SOUL Founder 2026", series: "FOUNDER SERIES", serial: "088 / 500", image: "/assets/soul-card-hero.webp", tone: "rose", status: "verified", ownedSince: "10 ก.ค. 2026", memories: 4, memoryGoal: 6, points: 860, lastTap: "วันนี้ 10:42" },
  { id: "commarts-023", slug: "communication-arts", name: "Communication Arts", series: "FACULTY SERIES", serial: "023 / 300", image: "/assets/communication-arts-badge.webp", tone: "night", status: "verified", ownedSince: "18 ส.ค. 2026", memories: 2, memoryGoal: 5, points: 380, lastTap: "18 ส.ค. 16:18" },
];

export const memberDemoMemories = [
  { id: "memory-first-tap", cardId: "founder-088", title: "วันที่การ์ดใบนี้เป็นของเรา", body: "แตะครั้งแรกหลังรับการ์ดจากทีม SOUL และเริ่มบันทึกเรื่องราวของเราเอง", date: "2026-07-10", displayDate: "10 กรกฎาคม 2026", privacy: "private", type: "milestone", location: "จุฬาลงกรณ์มหาวิทยาลัย" },
  { id: "memory-first-project", cardId: "founder-088", title: "โปรเจกต์แรกที่ทำจนเช้า", body: "คืนที่ทุกคนอยู่ด้วยกันจนฟ้าสว่าง เหนื่อยมากแต่มีความหมาย", date: "2026-07-24", displayDate: "24 กรกฎาคม 2026", privacy: "circle", type: "photo", image: "/assets/og-soul.webp", location: "อาคารมงกุฎสมมติวงศ์" },
  { id: "memory-pink-day", cardId: "founder-088", title: "Pink Day — เราอยู่ตรงนี้ด้วยกัน", body: "เสียงเพลง รูปถ่าย และเข็มกลัดสีชมพู เก็บวันนั้นไว้ในคอลเลกชัน", date: "2026-08-13", displayDate: "13 สิงหาคม 2026", privacy: "public", type: "note", location: "ลานพระบรมรูปสองรัชกาล" },
  { id: "memory-faculty-welcome", cardId: "commarts-023", title: "Welcome home, CommArts", body: "วันแรกที่ได้ติดเข็มคณะและเจอเพื่อนทั้งรุ่น", date: "2026-08-18", displayDate: "18 สิงหาคม 2026", privacy: "circle", type: "milestone", location: "คณะนิเทศศาสตร์" },
];

export const memberDemoRewardWallet = {
  balance: 1240,
  rewards: [
    { id: "reward-pin", name: "Pink Memento Pin", description: "เข็มกลัดโลหะรุ่นพิเศษสำหรับสมาชิก SOUL", points: 300, category: "physical", availability: "เหลือ 48 ชิ้น", accent: "#e91e63" },
    { id: "reward-wallpaper", name: "Founder Motion Wallpaper", description: "วอลเปเปอร์เคลื่อนไหวเฉพาะหมายเลขการ์ดของคุณ", points: 120, category: "digital", availability: "รับได้ทันที", accent: "#4bd6ea" },
    { id: "reward-studio", name: "Archive Studio Session", description: "สิทธิ์เข้าชมคลังภาพและบันทึกเรื่องเล่าร่วมกับทีมมหาวิทยาลัย", points: 900, category: "experience", availability: "4 รอบในเดือนนี้", accent: "#b58c59" },
  ],
  redemptions: [
    { id: "redeem-001", rewardName: "Founder Motion Wallpaper", points: 120, date: "18 สิงหาคม 2026", status: "fulfilled" },
    { id: "redeem-002", rewardName: "Pink Memento Pin", points: 300, date: "10 กรกฎาคม 2026", status: "ready", code: "SOUL-PINK-8842" },
  ],
};

export const memberDemoSettings = {
  privacy: { defaultMemoryVisibility: "private", allowCircleDiscovery: true, analytics: true },
  notifications: { product: true, rewards: true, security: true, marketing: false },
  security: { mfaEnabled: true, activeSessions: 2, lastPasswordChange: "2026-07-10T04:00:00.000Z" },
};
