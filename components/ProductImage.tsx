"use client";

import { useState } from "react";
import Image from "next/image";

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

  const imgSrc = `/produtos/${sanitizedCode}.${extensions[extIndex]}`;
  const failed = extIndex >= extensions.length;

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
