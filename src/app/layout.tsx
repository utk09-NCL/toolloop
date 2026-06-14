import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TrackedLink } from "@/components/TrackedLink";
import { UserSwitcher } from "@/components/UserSwitcher";
import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import "@/app/globals.css";
import styles from "./layout.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s - ToolLoop",
    default: "ToolLoop - Borrow tools from neighbors",
  },
  description:
    "Borrow tools from people nearby. A community tool-lending webapp for listing, browsing, requesting, and returning shared neighborhood tools.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ToolLoop",
    title: "ToolLoop - Borrow tools from neighbors",
    description:
      "Borrow tools from people nearby. A community tool-lending webapp for listing, browsing, requesting, and returning shared neighborhood tools.",
    url: siteUrl,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
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
  description: "Borrow tools from people nearby. A community tool-lending webapp.",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [users, currentUser] = await Promise.all([
    db.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, avatarColor: true },
    }),
    getCurrentUser(),
  ]);

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
              <TrackedLink
                href={ROUTES.HOME}
                className={styles.logo}
                aria-label="ToolLoop home"
                label="logo"
                location="header"
              >
                <span className={styles.logoMark} aria-hidden="true">
                  ⬡
                </span>
                <span className={styles.logoText}>ToolLoop</span>
              </TrackedLink>
              <nav className={styles.nav} aria-label="Main navigation">
                <TrackedLink
                  href={ROUTES.BROWSE}
                  className={styles.navLink}
                  label="Browse"
                  location="header"
                >
                  Browse
                </TrackedLink>
                <TrackedLink
                  href={ROUTES.TOOL_NEW}
                  className={styles.navLink}
                  label="List a tool"
                  location="header"
                >
                  List a tool
                </TrackedLink>
                <TrackedLink
                  href={ROUTES.SAVED}
                  className={styles.navLink}
                  label="Saved"
                  location="header"
                >
                  Saved
                </TrackedLink>
                <TrackedLink
                  href={ROUTES.BORROWS}
                  className={styles.navLink}
                  label="Borrows"
                  location="header"
                >
                  Borrows
                </TrackedLink>
                <TrackedLink
                  href={ROUTES.DASHBOARD}
                  className={styles.navLink}
                  label="Dashboard"
                  location="header"
                >
                  Dashboard
                </TrackedLink>
              </nav>
              <div className={styles.headerActions}>
                <ThemeToggle />
                <UserSwitcher users={users} currentUserId={currentUser.id} />
              </div>
            </div>
          </header>
          <main className={styles.main} id="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
