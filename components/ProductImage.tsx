"use client";

import { useState } from "react";
import Image from "next/image";
import { chaveIlustracao } from "@/lib/ilustracao-generica";
import { categoryIcon } from "./icons";

type Props = {
  code: string;
  imageCode?: string;
  name: string;
  category: string;
  size?: "card" | "large";
};

const extensions = ["webp", "jpg", "jpeg", "png"];

/* Resolve a imagem do produto: foto real em public/produtos → ilustração
   genérica (marcada como ilustrativa) → ícone da categoria. A área tem
   proporção fixa para não haver salto de layout. */
export default function ProductImage({ code, imageCode, name, category, size = "card" }: Props) {
  const effectiveCode = imageCode || code;
  const sanitizedCode = effectiveCode.replace(/[^a-zA-Z0-9_-]/g, "");
  const [extIndex, setExtIndex] = useState(0);
  const [genericaFalhou, setGenericaFalhou] = useState(false);

  const imgSrc = `/produtos/${sanitizedCode}.${extensions[extIndex]}`;
  const failed = extIndex >= extensions.length;
  const large = size === "large";
  const frame = `relative w-full bg-white ${large ? "aspect-square" : "aspect-[4/3]"}`;
  const pad = large ? "p-10" : "p-4";

  /* Sem foto do produto: usa uma ilustração genérica (uniformes, EPIs etc.). */
  const chave = failed || !sanitizedCode ? chaveIlustracao(name) : null;
  if (chave && !genericaFalhou) {
    return (
      <div className={frame}>
        <Image
          src={`/ilustracoes/${chave}.webp`}
          alt={`${name} (imagem ilustrativa)`}
          fill
          unoptimized
          sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"}
          className={`object-contain ${pad} opacity-90`}
          onError={() => setGenericaFalhou(true)}
        />
        {large ? (
          <p className="absolute inset-x-4 bottom-3 text-center text-[11px] text-muted">
            Imagem ilustrativa. O produto real pode variar em modelo, cor e acabamento.
          </p>
        ) : (
          <span className="absolute left-2 top-2 rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted ring-1 ring-line">
            Ilustrativa
          </span>
        )}
      </div>
    );
  }

  if (failed || !sanitizedCode) {
    const Icon = categoryIcon[category];
    return (
      <div className={`${frame} flex flex-col items-center justify-center gap-2 bg-surface text-line`}>
        {Icon ? <Icon size={large ? 64 : 36} /> : null}
        {large && <p className="text-xs text-muted">Foto em breve</p>}
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={imgSrc}
        alt={name}
        fill
        unoptimized
        sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"}
        className={`object-contain ${pad}`}
        onError={() => setExtIndex((i) => i + 1)}
      />
    </div>
  );
}
