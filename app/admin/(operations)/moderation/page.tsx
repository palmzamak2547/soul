import type { Metadata } from "next";
import { OpsModerationPanel } from "@/components/ops-moderation-panel";

export const metadata: Metadata = { title: "Memory Moderation" };

export default function ModerationPage() {
  return <OpsModerationPanel />;
}

