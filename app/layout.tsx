"use client";

import type { Metadata } from "next";
// import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { initializeStores } from "@/lib/store";
import { useEffect } from "react";
import { Inter, Noto_Sans_Georgian, Geist } from "next/font/google";

// Note: Metadata export doesn't work with 'use client'
// This is kept here as reference - metadata is moved to a separate metadata file if needed

// const _plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });
// const _lora = Lora({ subsets: ["latin"] });
// const _ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

// const fontSans = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// const fontSerif = Noto_Sans_Georgian({
//   subsets: ["latin"],
//   variable: "--font-serif",
// });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    initializeStores();
  }, []);

  return (
    <html lang="en" className="font-sans bg-background" suppressHydrationWarning>
      <head>
        <title>CRM Field Service Platform</title>
        <meta
          name="description"
          content="Enterprise-grade CRM, dispatch, and field service operations platform"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={`${geistSans.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
