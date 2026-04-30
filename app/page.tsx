import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Categories from "@/components/Categories";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Welcome />
        <Categories />
        <Features />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
