import React from "react";

export default function SectionCard({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-300/80 shadow-sm backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse" />
      <span className="font-mono text-xs uppercase tracking-wider text-zinc-800 font-semibold">
        {title}
      </span>
    </div>
  );
}
