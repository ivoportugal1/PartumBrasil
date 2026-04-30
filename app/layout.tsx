import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Partum Brasil | Equipamentos de Proteção Individual",
  description:
    "Especializada em EPIs de alta qualidade. Luvas, óculos, capacetes, máscaras e muito mais. Entrega para todo o Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
