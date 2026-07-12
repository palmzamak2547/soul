import type { Metadata } from "next";
import type { ReactNode } from "react";
import { OpsAdminShell } from "@/components/ops-admin-shell";

export const metadata: Metadata = {
  title: "Operations",
  description: "SOUL production operations and governance console",
  robots: { index: false, follow: false },
};

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return <OpsAdminShell>{children}</OpsAdminShell>;
}

