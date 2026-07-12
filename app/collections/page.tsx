import type { Metadata } from "next";
import { CollectionsPage } from "@/components/collections-page";

export const metadata: Metadata = {
  title: "Collections",
  description: "สำรวจคอลเลกชันการ์ด SOUL และทดลอง personalization",
};

export default function Page() {
  return <CollectionsPage />;
}
