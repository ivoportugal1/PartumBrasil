/* Conjunto único de ícones vetoriais (traço 1.75, 24x24), no estilo Lucide.
   Usar sempre estes em vez de emojis ou paths soltos nos componentes. */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>
);
export const IconChevronDown = (p: P) => (
  <Base {...p}><path d="m6 9 6 6 6-6" /></Base>
);
export const IconChevronRight = (p: P) => (
  <Base {...p}><path d="m9 6 6 6-6 6" /></Base>
);
export const IconChevronLeft = (p: P) => (
  <Base {...p}><path d="m15 6-6 6 6 6" /></Base>
);
export const IconArrowRight = (p: P) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);
export const IconMenu = (p: P) => (
  <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>
);
export const IconX = (p: P) => (
  <Base {...p}><path d="M18 6 6 18M6 6l12 12" /></Base>
);
export const IconClipboard = (p: P) => (
  <Base {...p}>
    <rect x="8" y="2.5" width="8" height="4" rx="1" />
    <path d="M16 4.5h2a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </Base>
);
export const IconClipboardCheck = (p: P) => (
  <Base {...p}>
    <rect x="8" y="2.5" width="8" height="4" rx="1" />
    <path d="M16 4.5h2a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </Base>
);
export const IconPhone = (p: P) => (
  <Base {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Base>
);
export const IconMail = (p: P) => (
  <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Base>
);
export const IconMapPin = (p: P) => (
  <Base {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Base>
);
export const IconShield = (p: P) => (
  <Base {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></Base>
);
export const IconShieldCheck = (p: P) => (
  <Base {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Base>
);
export const IconFileText = (p: P) => (
  <Base {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h6" />
  </Base>
);
export const IconLayers = (p: P) => (
  <Base {...p}><path d="m12 2 10 5-10 5L2 7Z" /><path d="m2 12 10 5 10-5M2 17l10 5 10-5" /></Base>
);
export const IconTag = (p: P) => (
  <Base {...p}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </Base>
);
export const IconPackage = (p: P) => (
  <Base {...p}>
    <path d="m16.5 9.4-9-5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" />
    <path d="M3.3 7 12 12l8.7-5M12 22V12" />
  </Base>
);
export const IconInfo = (p: P) => (
  <Base {...p}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></Base>
);
export const IconCheck = (p: P) => (
  <Base {...p}><path d="M20 6 9 17l-5-5" /></Base>
);
export const IconPlus = (p: P) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);
export const IconMinus = (p: P) => (
  <Base {...p}><path d="M5 12h14" /></Base>
);
export const IconTrash = (p: P) => (
  <Base {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Base>
);
export const IconLoader = (p: P) => (
  <Base {...p} className={`animate-spin ${p.className ?? ""}`}><path d="M21 12a9 9 0 1 1-6.2-8.6" /></Base>
);
export const IconSliders = (p: P) => (
  <Base {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></Base>
);
export const IconFilter = (p: P) => (
  <Base {...p}><path d="M22 3H2l8 9.5V19l4 2v-8.5Z" /></Base>
);
export const IconImageOff = (p: P) => (
  <Base {...p}>
    <path d="m2 2 20 20M10.4 10.4a2 2 0 0 0 2.2 2.2M21 15l-3.1-3.1M3 3v16a2 2 0 0 0 2 2h14M8.5 3H19a2 2 0 0 1 2 2v10.5" />
  </Base>
);
export const IconBuilding = (p: P) => (
  <Base {...p}>
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </Base>
);
export const IconClock = (p: P) => (
  <Base {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Base>
);
export const IconInstagram = (p: P) => (
  <Base {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4ZM17.5 6.5h.01" />
  </Base>
);

/* Glyph oficial do WhatsApp (preenchido, como a marca exige) */
export function IconWhatsApp({ size = 20, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* Ícones por categoria do catálogo (usados no menu, nos filtros e no fallback de imagem) */
export const IconGlove = (p: P) => (
  <Base {...p}>
    <path d="M7 12V5.5a1.5 1.5 0 0 1 3 0V11M10 11V4a1.5 1.5 0 0 1 3 0v7M13 11V5a1.5 1.5 0 0 1 3 0v7" />
    <path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 5 14.5V11a1.5 1.5 0 0 1 2 0" />
  </Base>
);
export const IconBoot = (p: P) => (
  <Base {...p}>
    <path d="M6 3h6v8l6 3a3 3 0 0 1 2 2.8V19H4V4a1 1 0 0 1 2-1Z" />
    <path d="M4 19v2h16v-2M12 11h-3M12 8H9" />
  </Base>
);
export const IconGoggles = (p: P) => (
  <Base {...p}>
    <path d="M2 9.5A2.5 2.5 0 0 1 4.5 7h15A2.5 2.5 0 0 1 22 9.5v3a3.5 3.5 0 0 1-3.5 3.5H16a2 2 0 0 1-1.8-1.1L13 12.5h-2l-1.2 2.4A2 2 0 0 1 8 16H5.5A3.5 3.5 0 0 1 2 12.5Z" />
  </Base>
);
export const IconApron = (p: P) => (
  <Base {...p}>
    <path d="M9 3a3 3 0 0 0 6 0M8 3v5L5 9l1 12h12l1-12-3-1V3" />
    <path d="M9 14h6" />
  </Base>
);
export const IconMask = (p: P) => (
  <Base {...p}>
    <path d="M4 9c2.5-1.5 5-2.2 8-2.2S17.5 7.5 20 9v3c0 4-3.6 7-8 7s-8-3-8-7Z" />
    <path d="M4 10 2 8M20 10l2-2M9 12h6M9 15h6" />
  </Base>
);
export const IconHardHat = (p: P) => (
  <Base {...p}>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1Z" />
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3" />
  </Base>
);
export const IconWrench = (p: P) => (
  <Base {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9Z" />
  </Base>
);

export const categoryIcon: Record<string, (p: P) => React.ReactElement> = {
  luvas: IconGlove,
  calcados: IconBoot,
  oculos: IconGoggles,
  couro: IconApron,
  mascaras: IconMask,
  capacetes: IconHardHat,
  diversos: IconWrench,
};
