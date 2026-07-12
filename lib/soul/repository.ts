import { createHash } from "node:crypto";

import {
  FICTIONAL_CARDS,
  FICTIONAL_RECENT_ACTIVITY,
  FICTIONAL_REWARDS,
} from "@/lib/soul/seed";
import type {
  AdminOverview,
  CollectibleCardRecord,
  PrototypeRedeemInput,
  PrototypeRedeemRepositoryResult,
  PrototypeRedemption,
  PublicCollectibleCard,
  PublicReward,
  RewardRecord,
} from "@/lib/soul/types";

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1_000;
const MAX_IDEMPOTENCY_ENTRIES = 2_000;

interface IdempotencyEntry {
  readonly requestFingerprint: string;
  readonly redemption: PrototypeRedemption;
  readonly expiresAt: number;
}

export interface SoulRepository {
  findCardByPublicToken(
    token: string,
  ): Promise<CollectibleCardRecord | null>;
  findRewardById(id: string): Promise<RewardRecord | null>;
  listRewardsForCard(card: CollectibleCardRecord): Promise<PublicReward[]>;
  toPublicCard(card: CollectibleCardRecord): Promise<PublicCollectibleCard>;
  redeemPrototype(
    input: PrototypeRedeemInput,
  ): Promise<PrototypeRedeemRepositoryResult>;
  getAdminOverview(): Promise<AdminOverview>;
}

export class InMemorySoulRepository implements SoulRepository {
  private readonly redemptions = new Map<string, IdempotencyEntry>();

  findCardByPublicToken(
    token: string,
  ): Promise<CollectibleCardRecord | null> {
    const card = FICTIONAL_CARDS.find(
      (candidate) => candidate.publicToken === token,
    );
    return Promise.resolve(card ?? null);
  }

  findRewardById(id: string): Promise<RewardRecord | null> {
    const reward = FICTIONAL_REWARDS.find((candidate) => candidate.id === id);
    return Promise.resolve(reward ?? null);
  }

  async listRewardsForCard(
    card: CollectibleCardRecord,
  ): Promise<PublicReward[]> {
    const rewards = await Promise.all(
      card.rewardIds.map((rewardId) => this.findRewardById(rewardId)),
    );

    return rewards
      .filter((reward): reward is RewardRecord => reward !== null)
      .map(toPublicReward);
  }

  async toPublicCard(
    card: CollectibleCardRecord,
  ): Promise<PublicCollectibleCard> {
    return {
      id: card.id,
      slug: card.slug,
      titleTh: card.titleTh,
      titleEn: card.titleEn,
      collection: card.collection,
      chapter: card.chapter,
      rarity: card.rarity,
      status: card.status,
      edition: card.edition,
      visual: card.visual,
      memory: card.memory,
      traits: card.traits,
      issuedAt: card.issuedAt,
      rewards: await this.listRewardsForCard(card),
    };
  }

  async redeemPrototype(
    input: PrototypeRedeemInput,
  ): Promise<PrototypeRedeemRepositoryResult> {
    const now = Date.now();
    this.pruneIdempotencyEntries(now);

    const requestFingerprint = fingerprintRedemption(input);
    const idempotencyLookupKey = hashIdempotencyKey(input.idempotencyKey);
    const existing = this.redemptions.get(idempotencyLookupKey);
    if (existing && existing.expiresAt > now) {
      if (existing.requestFingerprint !== requestFingerprint) {
        return { kind: "idempotency_conflict" };
      }
      return { kind: "replayed", redemption: existing.redemption };
    }

    const card = await this.findCardByPublicToken(input.cardToken);
    if (!card) return { kind: "card_not_found" };

    const reward = await this.findRewardById(input.rewardId);
    if (!reward) return { kind: "reward_not_found" };
    if (!card.rewardIds.includes(reward.id)) {
      return { kind: "reward_not_eligible" };
    }

    const redemption: PrototypeRedemption = {
      status: "prototype_recorded",
      confirmationCode: prototypeConfirmationCode(input, card.id),
      recordedAt: new Date(now).toISOString(),
      card: {
        id: card.id,
        slug: card.slug,
        titleTh: card.titleTh,
      },
      reward: toPublicReward(reward),
      ownership: {
        granted: false,
        reason: "tap_is_not_proof_of_ownership",
      },
      fulfillment: {
        productionEntitlementCreated: false,
        message:
          "บันทึกผลการทดลองแล้ว การแตะการ์ดไม่ใช่หลักฐานความเป็นเจ้าของและยังไม่สร้างสิทธิ์รางวัลจริง",
      },
    };

    this.redemptions.set(idempotencyLookupKey, {
      requestFingerprint,
      redemption,
      expiresAt: now + IDEMPOTENCY_TTL_MS,
    });

    return { kind: "created", redemption };
  }

  getAdminOverview(): Promise<AdminOverview> {
    const issuedCards = FICTIONAL_CARDS.reduce(
      (sum, card) => sum + card.edition.size,
      0,
    );
    const totalTaps = FICTIONAL_CARDS.reduce(
      (sum, card) => sum + card.prototypeAnalytics.taps,
      0,
    );
    const prototypeRewardClaims = FICTIONAL_CARDS.reduce(
      (sum, card) => sum + card.prototypeAnalytics.rewardClaims,
      0,
    );

    return Promise.resolve({
      generatedAt: new Date().toISOString(),
      environment: "fictional_prototype",
      metrics: {
        issuedCards,
        totalTaps,
        prototypeRewardClaims,
        activeCollections: new Set(
          FICTIONAL_CARDS.map((card) => card.collection),
        ).size,
      },
      cards: FICTIONAL_CARDS.map((card) => ({
        id: card.id,
        slug: card.slug,
        titleTh: card.titleTh,
        editionSize: card.edition.size,
        status: card.status,
        taps: card.prototypeAnalytics.taps,
        prototypeRewardClaims: card.prototypeAnalytics.rewardClaims,
        lastTapAt: card.prototypeAnalytics.lastTapAt,
      })),
      recentActivity: FICTIONAL_RECENT_ACTIVITY.map((event) => ({ ...event })),
      privacy: {
        containsPersonalData: false,
        note: "ต้นแบบนี้ใช้เฉพาะข้อมูลสมมติและสถิติรวม ไม่เก็บ PII หรือข้อมูลระบุตัวบุคคล",
      },
    });
  }

  private pruneIdempotencyEntries(now: number): void {
    for (const [key, entry] of this.redemptions) {
      if (entry.expiresAt <= now) this.redemptions.delete(key);
    }

    while (this.redemptions.size >= MAX_IDEMPOTENCY_ENTRIES) {
      const oldestKey = this.redemptions.keys().next().value as
        | string
        | undefined;
      if (!oldestKey) break;
      this.redemptions.delete(oldestKey);
    }
  }
}

function toPublicReward(reward: RewardRecord): PublicReward {
  return {
    id: reward.id,
    titleTh: reward.titleTh,
    titleEn: reward.titleEn,
    description: reward.description,
    kind: reward.kind,
    artworkUrl: reward.artworkUrl,
    availability: "prototype_only",
  };
}

function fingerprintRedemption(input: PrototypeRedeemInput): string {
  return createHash("sha256")
    .update(`${input.cardToken}\u0000${input.rewardId}`)
    .digest("hex");
}

function hashIdempotencyKey(idempotencyKey: string): string {
  return createHash("sha256").update(idempotencyKey, "utf8").digest("hex");
}

function prototypeConfirmationCode(
  input: PrototypeRedeemInput,
  cardId: string,
): string {
  const suffix = createHash("sha256")
    .update(
      `soul-prototype\u0000${input.idempotencyKey}\u0000${cardId}\u0000${input.rewardId}`,
    )
    .digest("hex")
    .slice(0, 10)
    .toUpperCase();
  return `SOUL-DEMO-${suffix}`;
}

let repositorySingleton: SoulRepository | undefined;

/** Lazy initialization keeps future external clients build-safe on Vercel. */
export function getSoulRepository(): SoulRepository {
  repositorySingleton ??= new InMemorySoulRepository();
  return repositorySingleton;
}
