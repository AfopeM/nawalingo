interface TierPricingOption {
  price: string;
  features: readonly string[];
}

export interface PricingTier {
  tier: string;
  single: TierPricingOption;
  group: TierPricingOption;
  isPopular?: boolean;
}

export const pricingTiers: readonly PricingTier[] = [
  {
    tier: "Weekly",
    single: {
      price: "$15",
      features: ["1 session", "40 mins per lesson", "1 learner"],
    },
    group: {
      price: "$14/person",
      features: [
        "1 session",
        "40 mins per lesson",
        "2-8 learners",
        "7% discount",
      ],
    },
  },
  {
    tier: "Monthly",
    single: {
      price: "$52",
      features: [
        "4 sessions",
        "40 mins per lesson",
        "1 learner",
        "13% discount",
      ],
    },
    group: {
      price: "$13/person",
      features: [
        "4 sessions",
        "40 mins per lesson",
        "2-8 learners",
        "13% discount",
      ],
    },
    isPopular: true,
  },
  {
    tier: "Full Course",
    single: {
      price: "$192",
      features: [
        "16 sessions",
        "40 mins per lesson",
        "1 learner",
        "20% discount",
      ],
    },
    group: {
      price: "$12/person",
      features: [
        "16 sessions",
        "40 mins per lesson",
        "2-8 learners",
        "20% discount",
      ],
    },
  },
] as const;
