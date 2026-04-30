import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative bg-primary overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg.png"
          alt="Trabalhadores com EPIs"
          fill
          className="object-cover object-left-top sm:object-top"
          priority
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-primary/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="inline-block bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Especialistas em EPIs desde 2015
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Segurança que{" "}
            <span className="text-accent">protege</span>{" "}
            quem faz acontecer
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Equipamentos de proteção individual de alta qualidade para
            indústrias, construtoras e empresas de todo o Brasil.
            Qualidade, agilidade e atendimento especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#contato"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Solicitar Orçamento
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#produtos"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-primary-dark/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10+", label: "Anos de experiência" },
              { value: "5.000+", label: "Clientes atendidos" },
              { value: "100%", label: "Entrega nacional" },
              { value: "24h", label: "Suporte online" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-accent">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
