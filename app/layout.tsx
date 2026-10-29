import type { Metadata } from "next";
import { Geist, Archivo } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { SITE } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Partum Brasil | EPIs e fardamentos profissionais",
    template: "%s | Partum Brasil",
  },
  description:
    "Distribuidora de EPIs e fardamentos profissionais em Camaçari (BA). Luvas, calçados de segurança, óculos, capacetes, máscaras e mais de 7 mil itens para orçamento.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    images: [{ url: "/hero.jpg", width: 2200, height: 944, alt: "Profissional com fardamento Partum Brasil" }],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${archivo.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow"
        >
          Pular para o conteúdo
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
