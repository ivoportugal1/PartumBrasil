import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    value: "10+",
    label: "Anos de experiência",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 3l7 3v5.5c0 4.2-2.9 8.1-7 9.5-4.1-1.4-7-5.3-7-9.5V6l7-3z"
      />
    ),
  },
  {
    value: "5.000+",
    label: "Clientes atendidos",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M17 20h5v-1a3 3 0 00-3-3h-1m-4 4H2v-1a5 5 0 015-5h4a5 5 0 015 5v1zm-2-12a3 3 0 11-6 0 3 3 0 016 0zm7 1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    ),
  },
  {
    value: "100%",
    label: "Entrega nacional",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 3.5a5 5 0 100 10 5 5 0 000-10zM9 13.5L7.5 21l4.5-2.2L16.5 21 15 13.5"
      />
    ),
  },
  {
    value: "24h",
    label: "Suporte online",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M4 13v-1a8 8 0 1116 0v1m-16 0v3a2 2 0 002 2h1v-6H6a2 2 0 00-2 2zm16 0v3a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2z"
      />
    ),
  },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative bg-primary-dark overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg.png"
          alt="Profissional com fardamento e EPI da Partum Brasil"
          fill
          className="object-cover object-left"
          priority
        />
        <div className="absolute inset-0 bg-primary-dark/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 via-primary-dark/20 to-primary-dark/50 lg:from-transparent lg:via-primary-dark/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-32 lg:pt-16 lg:pb-32">
        <div className="max-w-2xl lg:ml-[33%]">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-9 h-0.5 bg-accent-light rounded-full" />
            <span className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
              Especialistas em EPI&apos;s desde 2015
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            Segurança que{" "}
            <span className="text-accent-light">protege</span>{" "}
            quem faz acontecer
          </h1>

          <p className="text-base sm:text-lg text-white/75 mb-9 leading-relaxed max-w-lg">
            Equipamentos de proteção individual de alta qualidade para
            indústrias, construtoras e empresas de todo o Brasil. Qualidade,
            agilidade e atendimento especializado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#contato"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-primary-light text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Solicitar Orçamento
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#produtos"
              className="inline-flex items-center justify-center gap-2 bg-primary-dark/40 hover:bg-primary-dark/70 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-xl transition-all backdrop-blur-sm"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de indicadores flutuante */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-primary-dark/75 backdrop-blur-md border border-white/10 border-b-0 rounded-t-3xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-5 sm:px-8 py-6">
                <svg
                  className="w-8 h-8 text-accent-light shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {s.icon}
                </svg>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/65 text-xs sm:text-sm mt-1.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
