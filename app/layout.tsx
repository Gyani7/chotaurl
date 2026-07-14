import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://chotaurl.pro";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "ChotaURL — Every link, working harder",
    template: "%s · ChotaURL",
  },
  description:
    "The free URL infrastructure for modern teams. Shorten, target, protect, and analyze every link without feature limits.",
  applicationName: "ChotaURL",
  keywords: [
    "URL shortener",
    "link analytics",
    "branded links",
    "QR codes",
    "UTM builder",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ChotaURL — Every link, working harder",
    description:
      "Unlimited smart links, advanced analytics, branded domains, and developer APIs. Free forever.",
    url: appUrl,
    siteName: "ChotaURL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChotaURL — Every link, working harder",
    description: "Premium link infrastructure, free forever.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07080b" },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ChotaURL",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free URL shortening, targeting, analytics, branded domains, and developer APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark'",
          }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
