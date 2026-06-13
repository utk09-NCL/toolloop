import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import styles from "./layout.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s - ToolLoop",
    default: "ToolLoop - Borrow tools from your neighbors",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ToolLoop",
  description: "ToolLoop - Borrow tools from your neighbors. A community tool-lending webapp.",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <a href="/" className={styles.logo}>
                ToolLoop
              </a>
            </div>
          </header>
          <main id="main-content" className={styles.main}>
            {children}
          </main>
          <footer>
            <div>
              <p>&copy; {new Date().getFullYear()} ToolLoop. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
