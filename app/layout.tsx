import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Mate",
  description: "One search, one trip. AI-powered travel planning."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
