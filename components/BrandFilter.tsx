"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Brand = { name: string; count: number };

export default function BrandFilter({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("marca") ?? "";

  if (brands.length === 0) return null;

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set("marca", value);
    else sp.delete("marca");
    sp.delete("page");
    const query = sp.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="relative shrink-0">
      <select
        value={current}
        onChange={onChange}
        aria-label="Filtrar por marca"
        className="appearance-none w-full sm:w-52 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
      >
        <option value="">Todas as marcas</option>
        {brands.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name} ({b.count})
          </option>
        ))}
      </select>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M10 12h4M9 16h6" />
      </svg>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
