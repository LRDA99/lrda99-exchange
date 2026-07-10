import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "LRDA99 XCHANGE", template: "%s | LRDA99 XCHANGE" },
  description: "Request manually confirmed cryptocurrency buy and sell quotes with NGN and supported currencies.",
  applicationName: "LRDA99 XCHANGE",
  robots: { index: true, follow: true },
  openGraph: { title: "LRDA99 XCHANGE", description: "Manual OTC cryptocurrency quote requests with human confirmation.", type: "website" },
  icons: { icon: "/favicon.svg" }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f1e7" }, { media: "(prefers-color-scheme: dark)", color: "#06112e" }] };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
