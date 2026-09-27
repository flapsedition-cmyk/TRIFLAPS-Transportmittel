import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRIFLAPS Transportmittel",
  description:
    "Gioco di carte multilingue con Flaps: tedesco, italiano e inglese.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
