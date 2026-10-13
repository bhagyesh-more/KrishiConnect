import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";
import React from "react";

export const metadata: Metadata = {
  title: "कृषीकनेक्ट — KrishiConnect | Digital Agriculture Platform",
  description:
    "शेतकऱ्यांना जोडा, एकत्र वाढा — Farmer-First Multilingual Agricultural Platform for Maharashtra & India",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KrishiConnect",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#185C37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <head>
        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) {
                      console.log('[KrishiConnect PWA] ServiceWorker registered with scope:', reg.scope);
                    },
                    function(err) {
                      console.log('[KrishiConnect PWA] ServiceWorker registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-krishi-warmIvory text-krishi-textMain flex flex-col antialiased">
        <I18nProvider>
          <OfflineIndicator />
          <div className="flex-1 flex flex-col">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
