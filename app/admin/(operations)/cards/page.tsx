import type { Metadata } from "next";
import { OpsCardsPanel } from "@/components/ops-cards-panel";

export const metadata: Metadata = { title: "Card Inventory" };

export default function CardsPage() {
  return <OpsCardsPanel />;
}

