import React from "react";

interface SectionCardProps {
  title: string;
  category?: string;
  variant?: "purple" | "yellow" | "emerald";
}

export default function SectionCard({ title, category, variant = "purple" }: SectionCardProps) {
  const dotColor = variant === "yellow" 
    ? "bg-[#96A40C]" 
    : variant === "emerald" 
      ? "bg-emerald-500" 
      : "bg-brand-purple";

  const pingColor = variant === "yellow" 
    ? "bg-[#B0BE19]/40" 
    : variant === "emerald" 
      ? "bg-emerald-500/30" 
      : "bg-brand-purple/30";

  const categoryColor = variant === "yellow"
    ? "text-[#556000]"
    : variant === "emerald"
      ? "text-emerald-700"
      : "text-brand-purple";

  const hoverBorder = variant === "yellow"
    ? "hover:border-[#B0BE19]/60"
    : variant === "emerald"
      ? "hover:border-emerald-500/50"
      : "hover:border-brand-purple/40";

  return (
    <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all ${hoverBorder}`}>
      <div className="relative flex h-2 w-2 items-center justify-center shrink-0">
        <span className={`absolute h-full w-full rounded-full ${pingColor} animate-ping`} />
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </div>
      {category && (
        <>
          <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${categoryColor}`}>
            {category}
          </span>
          <span className="text-zinc-300 font-mono text-xs select-none">{"//"}</span>
        </>
      )}
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-900">
        {title}
      </span>
    </div>
  );
}
