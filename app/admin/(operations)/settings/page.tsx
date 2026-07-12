import type { Metadata } from "next";
import { OpsSettingsPanel } from "@/components/ops-settings-panel";

export const metadata: Metadata = { title: "Organization Settings" };

export default function SettingsPage() {
  return <OpsSettingsPanel />;
}

