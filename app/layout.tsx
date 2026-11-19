import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
export const metadata: Metadata = { title: "TapFlow AI", description: "NFC and QR-powered business action page." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SessionProvider>{children}</SessionProvider></body></html>;
}