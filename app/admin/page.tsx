import type { Metadata } from "next";
import { AdminConsole } from "@/components/admin-console";

export const metadata: Metadata = {
  title: "Control Center",
  description: "หลังบ้านตัวอย่างสำหรับบริหาร SOUL platform",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminConsole />;
}
