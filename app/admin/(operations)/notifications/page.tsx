import type { Metadata } from "next";
import { OpsNotificationsPanel } from "@/components/ops-notifications-panel";

export const metadata: Metadata = { title: "Operations Notifications" };

export default function NotificationsPage() {
  return <OpsNotificationsPanel />;
}

