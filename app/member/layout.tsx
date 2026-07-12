import type { Metadata } from "next";
import { MemberShell } from "@/components/member-shell";

export const metadata: Metadata = {
  title: "Member space",
  robots: { index: false, follow: false },
};

export default function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MemberShell>{children}</MemberShell>;
}
