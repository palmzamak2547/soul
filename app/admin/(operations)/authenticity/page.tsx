import type { Metadata } from "next";
import { OpsAuthenticityPanel } from "@/components/ops-authenticity-panel";

export const metadata: Metadata = { title: "NFC Authenticity" };

export default function AuthenticityPage() {
  return <OpsAuthenticityPanel />;
}

