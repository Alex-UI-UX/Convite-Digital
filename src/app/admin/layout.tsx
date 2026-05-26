import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Convite Admin",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <RegisterSW />
    </SessionProvider>
  );
}
