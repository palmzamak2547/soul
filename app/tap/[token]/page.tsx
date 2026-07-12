import type { Metadata } from "next";
import { TapExperience } from "@/components/tap-experience";

export const metadata: Metadata = {
  title: "Tap Experience",
  description: "จำลองการปลดล็อก SOUL card ผ่าน NFC",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <TapExperience token={token} />;
}
