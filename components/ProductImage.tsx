"use client";

import { useState } from "react";
import Image from "next/image";
import { chaveIlustracao } from "@/lib/ilustracao-generica";

const categoryIcons: Record<string, string> = {
  luvas: "🧤",
  calcados: "👢",
  oculos: "🥽",
  couro: "🧥",
  mascaras: "😷",
  capacetes: "⛑️",
  diversos: "📦",
};

type Props = {
  code: string;
  imageCode?: string;
  name: string;
  category: string;
  size?: "card" | "large";
};

const extensions = ["webp", "jpg", "jpeg", "png"];

export default function ProductImage({ code, imageCode, name, category, size = "card" }: Props) {
  const effectiveCode = imageCode || code;
  const sanitizedCode = effectiveCode.replace(/[^a-zA-Z0-9_-]/g, "");
  const [extIndex, setExtIndex] = useState(0);

  const [genericaFalhou, setGenericaFalhou] = useState(false);

  const imgSrc = `/produtos/${sanitizedCode}.${extensions[extIndex]}`;
  const failed = extIndex >= extensions.length;

  /* Sem foto do produto: usa uma ilustração genérica (uniformes, tecidos etc.). */
  const chave = failed || !sanitizedCode ? chaveIlustracao(name) : null;
  if (chave && !genericaFalhou) {
    return (
      <div className={`relative bg-surface ${size === "large" ? "aspect-square w-full" : "h-28 w-full"}`}>
        <Image
          src={`/ilustracoes/${chave}.webp`}
          alt={name}
          fill
          unoptimized
          className={`object-contain ${size === "large" ? "p-8" : "p-3"}`}
          onError={() => setGenericaFalhou(true)}
        />
        {size === "large" ? (
          <p className="absolute bottom-2 left-2 right-2 text-center text-[11px] text-gray-500">
            Imagem ilustrativa. O produto real pode variar em modelo, cor e acabamento.
          </p>
        ) : (
          <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wide bg-white/90 text-gray-500 rounded px-1.5 py-0.5">
            Imagem ilustrativa
          </span>
        )}
      </div>
    );
  }

  if (failed || !sanitizedCode) {
    return (
      <div className={`flex flex-col items-center justify-center bg-surface text-center ${size === "large" ? "py-16 px-8 gap-4" : "h-28"}`}>
        <span className={size === "large" ? "text-8xl" : "text-5xl"}>
          {categoryIcons[category] ?? "📦"}
        </span>
        {size === "large" && (
          <p className="text-xs text-gray-400 mt-2">Imagem em breve</p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-surface ${size === "large" ? "aspect-square w-full" : "h-28 w-full"}`}>
      <Image
        src={imgSrc}
        alt={name}
        fill
        unoptimized
        className={`object-contain ${size === "large" ? "p-8" : "p-3"}`}
        onError={() => setExtIndex((i) => i + 1)}
      />
    </div>
  );
}
