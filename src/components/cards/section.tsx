import React from "react";

interface SectionCardProps {
  title: string;
  category?: string;
}

export default function SectionCard({ title, category }: SectionCardProps) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_0_0_1px_rgba(70,73,214,0.06)] backdrop-blur-md transition-all hover:border-brand-purple/40">
      <div className="relative flex h-2 w-2 items-center justify-center shrink-0">
        <span className="absolute h-full w-full rounded-full bg-brand-purple/30 animate-ping" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
      </div>
      {category && (
        <>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-purple">
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
