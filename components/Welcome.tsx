export default function Welcome() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Bem-vindo à Partum Brasil
            </span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Mais de{" "}
              <span className="text-primary">10 anos</span>{" "}
              protegendo quem trabalha
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              A Partum Brasil nasceu com uma missão clara: levar equipamentos de
              proteção individual de alta qualidade para trabalhadores e empresas
              de todo o Brasil.
            </p>

            <p className="text-gray-500 leading-relaxed mb-8">
              Somos especializados em fardamentos industriais e EPIs certificados,
              atendendo indústrias, construtoras, mineradoras e empresas dos mais
              variados segmentos. Cada produto que oferecemos passa por rigoroso
              controle de qualidade e possui CA válido pelo Ministério do Trabalho.
            </p>

            {/* Valores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "🏆", title: "Qualidade", desc: "Produtos certificados e aprovados" },
                { icon: "🤝", title: "Confiança", desc: "Mais de 5.000 clientes satisfeitos" },
                { icon: "🚀", title: "Agilidade", desc: "Entrega rápida para todo o Brasil" },
              ].map((v) => (
                <div key={v.title} className="bg-surface rounded-xl p-4 text-center">
                  <span className="text-2xl">{v.icon}</span>
                  <p className="font-bold text-gray-900 mt-2 text-sm">{v.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Card principal */}
            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Círculos decorativos */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -left-10 w-64 h-64 bg-white/5 rounded-full" />

              <div className="relative">
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2">Nossa missão</p>
                <p className="text-2xl font-bold leading-snug mb-6">
                  "Garantir a segurança de cada trabalhador com produtos de excelência e atendimento humanizado."
                </p>

                <div className="border-t border-white/20 pt-6 grid grid-cols-2 gap-6">
                  {[
                    { value: "10+", label: "Anos no mercado" },
                    { value: "5k+", label: "Clientes ativos" },
                    { value: "100%", label: "CA garantido" },
                    { value: "6", label: "Linhas de produto" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl font-extrabold text-accent">{s.value}</p>
                      <p className="text-white/60 text-sm mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Badge flutuante */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Produtos Certificados</p>
                <p className="text-xs text-gray-400">CA válido em todos os EPIs</p>
              </div>
            </div>

            {/* Badge flutuante 2 */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Entrega Nacional</p>
                <p className="text-xs text-gray-400">Para todo o Brasil</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
