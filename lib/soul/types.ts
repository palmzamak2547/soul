export type CardRarity = "signature" | "rare" | "limited";

export type CardStatus = "active" | "paused";

export type RewardKind = "digital_keepsake" | "immersive_preview";

export interface CardEdition {
  readonly number: number;
  readonly size: number;
  readonly label: string;
}

export interface CollectibleCardRecord {
  readonly id: string;
  readonly publicToken: string;
  readonly slug: string;
  readonly titleTh: string;
  readonly titleEn: string;
  readonly collection: string;
  readonly chapter: string;
  readonly rarity: CardRarity;
  readonly status: CardStatus;
  readonly edition: CardEdition;
  readonly visual: {
    readonly imageUrl: string;
    readonly accent: string;
    readonly glow: string;
  };
  readonly memory: {
    readonly eyebrow: string;
    readonly headline: string;
    readonly excerpt: string;
    readonly year: string;
  };
  readonly traits: readonly string[];
  readonly rewardIds: readonly string[];
  readonly issuedAt: string;
  readonly prototypeAnalytics: {
    readonly taps: number;
    readonly rewardClaims: number;
    readonly lastTapAt: string;
  };
}

export interface RewardRecord {
  readonly id: string;
  readonly titleTh: string;
  readonly titleEn: string;
  readonly description: string;
  readonly kind: RewardKind;
  readonly availability: "prototype";
  readonly artworkUrl: string;
}

export type PublicReward = Omit<RewardRecord, "availability"> & {
  readonly availability: "prototype_only";
};

export type PublicCollectibleCard = Omit<
  CollectibleCardRecord,
  "publicToken" | "rewardIds" | "prototypeAnalytics"
> & {
  readonly rewards: readonly PublicReward[];
};

export interface NfcPrototypeAssurance {
  readonly tagFamily: "NTAG216";
  readonly mode: "static_demo_token";
  readonly tokenMatched: boolean;
  readonly cryptographicAuthenticity: false;
  readonly ownershipGranted: false;
  readonly limitations: readonly string[];
}

export type CardTokenResolution =
  | {
      readonly status: "resolved";
      readonly card: PublicCollectibleCard;
      readonly nfc: NfcPrototypeAssurance;
    }
  | {
      readonly status: "not_found";
      readonly nfc: NfcPrototypeAssurance;
    };

export interface PrototypeRedemption {
  readonly status: "prototype_recorded";
  readonly confirmationCode: string;
  readonly recordedAt: string;
  readonly card: {
    readonly id: string;
    readonly slug: string;
    readonly titleTh: string;
  };
  readonly reward: PublicReward;
  readonly ownership: {
    readonly granted: false;
    readonly reason: "tap_is_not_proof_of_ownership";
  };
  readonly fulfillment: {
    readonly productionEntitlementCreated: false;
    readonly message: string;
  };
}

export interface PrototypeRedeemInput {
  readonly cardToken: string;
  readonly rewardId: string;
  readonly idempotencyKey: string;
}

export type PrototypeRedeemRepositoryResult =
  | {
      readonly kind: "created" | "replayed";
      readonly redemption: PrototypeRedemption;
    }
  | { readonly kind: "idempotency_conflict" }
  | { readonly kind: "card_not_found" }
  | { readonly kind: "reward_not_found" }
  | { readonly kind: "reward_not_eligible" };

export interface AdminOverview {
  readonly generatedAt: string;
  readonly environment: "fictional_prototype";
  readonly metrics: {
    readonly issuedCards: number;
    readonly totalTaps: number;
    readonly prototypeRewardClaims: number;
    readonly activeCollections: number;
  };
  readonly cards: readonly {
    readonly id: string;
    readonly slug: string;
    readonly titleTh: string;
    readonly editionSize: number;
    readonly status: CardStatus;
    readonly taps: number;
    readonly prototypeRewardClaims: number;
    readonly lastTapAt: string;
  }[];
  readonly recentActivity: readonly {
    readonly id: string;
    readonly type: "tap" | "prototype_reward" | "collection_publish";
    readonly label: string;
    readonly occurredAt: string;
  }[];
  readonly privacy: {
    readonly containsPersonalData: false;
    readonly note: string;
  };
}

