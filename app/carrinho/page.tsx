import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartView from "@/components/CartView";

export const metadata = {
  title: "Lista de orçamento",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <Header />
      <CartView />
      <Footer />
    </>
  );
}
