import type { Metadata } from "next";
import { OpsUsersPanel } from "@/components/ops-users-panel";

export const metadata: Metadata = { title: "Users & Roles" };

export default function UsersPage() {
  return <OpsUsersPanel />;
}

