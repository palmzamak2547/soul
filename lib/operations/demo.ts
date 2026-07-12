export const demoUsers = [
  { id: "usr_01", name: "Nalin Charoen", email: "nalin@example.test", organization: "Chulalongkorn University", role: "Owner", status: "Active", lastActiveAt: "2026-07-10T10:42:00.000Z", mfa: true },
  { id: "usr_02", name: "Mira S.", email: "mira@example.test", organization: "Faculty of Communication Arts", role: "Editor", status: "Active", lastActiveAt: "2026-07-10T09:18:00.000Z", mfa: true },
  { id: "usr_03", name: "Kawin Demo", email: "kawin@example.test", organization: "SOUL Operations", role: "Support", status: "Invited", lastActiveAt: "2026-07-08T13:20:00.000Z", mfa: false },
] as const;

export const demoCardBatches = [
  { id: "batch_0726", collection: "Communication Arts · First Light", chip: "NTAG424 DNA", quantity: 500, provisioned: 492, failed: 8, status: "Quality check", createdAt: "2026-07-08T08:30:00.000Z", operator: "Mira S." },
  { id: "batch_0727", collection: "Centenary Hall · Echoes", chip: "NTAG424 DNA", quantity: 250, provisioned: 250, failed: 0, status: "Ready", createdAt: "2026-07-09T04:15:00.000Z", operator: "Nalin Charoen" },
] as const;

export const demoAuthenticity = [
  { id: "alert_91", cardId: "SOUL-COMM-0142", collection: "First Light", severity: "Critical", signal: "Counter replay", status: "Open", location: "Bangkok / Singapore", occurredAt: "2026-07-10T09:44:00.000Z", tapCount: 17, evidence: ["Same SUN counter observed from two regions", "42-second travel interval"] },
  { id: "alert_92", cardId: "SOUL-HALL-0044", collection: "Echoes", severity: "Medium", signal: "Velocity spike", status: "Investigating", location: "Bangkok", occurredAt: "2026-07-10T07:31:00.000Z", tapCount: 26, evidence: ["26 taps within 4 minutes"] },
] as const;

export const demoModeration = [
  { id: "mem_review_01", author: "Member 284", title: "Our final studio night", excerpt: "A note from the last critique before graduation…", collection: "First Light", mediaType: "Photo", reason: "New public memory", status: "Pending", submittedAt: "2026-07-10T08:42:00.000Z", privacy: "Public" },
  { id: "mem_review_02", author: "Member 118", title: "เสียงที่หอประชุม", excerpt: "บันทึกช่วงเวลาที่เราได้ขึ้นเวทีด้วยกัน…", collection: "Echoes", mediaType: "Text", reason: "Community report", status: "Escalated", submittedAt: "2026-07-09T15:18:00.000Z", privacy: "Members" },
] as const;

export const demoRewards = {
  rewards: [
    { id: "reward_rose_pin", name: "SOUL Rose Pin", type: "Physical", points: 240, stock: 86, reserved: 12, status: "Active" },
    { id: "reward_archive", name: "Archive Afterglow", type: "Digital", points: 80, stock: 9999, reserved: 34, status: "Active" },
    { id: "reward_backstage", name: "Backstage Memory Walk", type: "Experience", points: 420, stock: 24, reserved: 18, status: "Active" },
  ],
  redemptions: [
    { id: "red_0181", reward: "SOUL Rose Pin", user: "Member 284", quantity: 1, status: "Packing", createdAt: "2026-07-10T07:14:00.000Z", fulfillment: "Delivery" },
    { id: "red_0180", reward: "Backstage Memory Walk", user: "Member 118", quantity: 1, status: "Ready for pickup", createdAt: "2026-07-09T14:24:00.000Z", fulfillment: "Pickup" },
  ],
};

export const demoAudit = [
  { id: "audit_7001", actor: "Nalin Charoen", actorRole: "Owner", action: "batch.exported", resource: "card_batch", resourceId: "batch_0726", ip: "pseudonymized:4gP…", occurredAt: "2026-07-10T10:01:00.000Z", outcome: "Success", metadata: "CSV manifest · 500 rows" },
  { id: "audit_7000", actor: "Mira S.", actorRole: "Editor", action: "memory.escalated", resource: "memory", resourceId: "mem_review_02", ip: "pseudonymized:Hm2…", occurredAt: "2026-07-09T15:22:00.000Z", outcome: "Success", metadata: "Escalated for owner review" },
] as const;

export const demoOrganization = {
  name: "SOUL · Chulalongkorn University",
  slug: "chula-soul",
  domain: "soul.chula.example",
  supportEmail: "soul-support@example.test",
  locale: "th-TH",
  timezone: "Asia/Bangkok",
  retentionDays: 730,
  requireMfa: true,
  allowPublicMemories: true,
  brandColor: "#ff3f78",
  updatedAt: "2026-07-10T04:00:00.000Z",
};

export const demoNotifications = {
  items: [
    { id: "note_1", title: "Possible cloned card", description: "SOUL-COMM-0142 produced a replayed counter.", category: "Security", priority: "Urgent", read: false, createdAt: "2026-07-10T09:44:00.000Z", href: "/admin/authenticity" },
    { id: "note_2", title: "Two memories await review", description: "Public memories are ready for moderation.", category: "Moderation", priority: "High", read: false, createdAt: "2026-07-10T08:42:00.000Z", href: "/admin/moderation" },
  ],
  preferences: { email: true, push: false, security: true, dailyDigest: true },
};

export function cloneDemo<T>(value: T): T {
  return structuredClone(value);
}
