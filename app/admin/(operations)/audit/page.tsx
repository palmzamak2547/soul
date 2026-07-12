import type { Metadata } from "next";
import { OpsAuditPanel } from "@/components/ops-audit-panel";

export const metadata: Metadata = { title: "Audit Trail" };

export default function AuditPage() {
  return <OpsAuditPanel />;
}

