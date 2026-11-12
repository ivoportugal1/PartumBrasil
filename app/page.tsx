import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Novidades from "@/components/Novidades";
import Parceiros from "@/components/Parceiros";
import Sobre from "@/components/Sobre";
import CtaBand from "@/components/CtaBand";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Atendimento from "@/components/Atendimento";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Categories />
        <Novidades />
        <Parceiros />
        <Sobre />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <Atendimento />
    </>
  );
}
