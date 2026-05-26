import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#3a2410",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Aniversário do José Rodrigo - Convite",
  description: "Venha comemorar o primeiro aninho do José Rodrigo! Confirme sua presença.",
  openGraph: {
    title: "Aniversário do José Rodrigo",
    description: "Venha comemorar o primeiro aninho do José Rodrigo! Confirme sua presença.",
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
      </body>
    </html>
  );
}
