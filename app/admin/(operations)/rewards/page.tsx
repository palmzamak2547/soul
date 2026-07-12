import type { Metadata } from "next";
import { OpsRewardsPanel } from "@/components/ops-rewards-panel";

export const metadata: Metadata = { title: "Rewards & Redemptions" };

export default function RewardsPage() {
  return <OpsRewardsPanel />;
}

