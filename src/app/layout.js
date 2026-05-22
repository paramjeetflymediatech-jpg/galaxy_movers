import { Inter } from "next/font/google";
import "./globals.css";
import { getPageMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export async function generateMetadata() {
  const seoData = await getPageMetadata('/');
  if (!seoData) {
    return {
      title: "Galaxy Movers Canada | Stress-Free Moving",
      description: "Canada's most trusted moving company. Local & long distance moving."
    };
  }

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      canonical: seoData.canonical_url || undefined,
    },
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
  };
}

export default async function RootLayout({ children }) {
  const seoData = await getPageMetadata('/');

  return (
    <html lang="en" className="scroll-smooth h-full" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: seoData?.header_scripts}} >
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col antialiased bg-white text-gray-900`} suppressHydrationWarning>
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Dynamic Server-Side Footer Script Injection */}
        {seoData?.footer_scripts && (
          <div dangerouslySetInnerHTML={{ __html: seoData.footer_scripts }} />
        )}
      </body>
    </html>
  );
}
