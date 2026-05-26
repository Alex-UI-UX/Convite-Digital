import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

export const viewport: Viewport = {
  themeColor: "#3a2410",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Aniversário do José Rodrigo - Convite",
  description: "Venha comemorar o primeiro aninho do José Rodrigo! Confirme sua presença.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Convite",
  },
  openGraph: {
    title: "Aniversário do José Rodrigo",
    description: "Venha comemorar o primeiro aninho do José Rodrigo! Confirme sua presença.",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
