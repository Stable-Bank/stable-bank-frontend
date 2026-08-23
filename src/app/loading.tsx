export default function Loading() {
  return (
    <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-purple/20" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-purple border-t-transparent animate-spin" />
        </div>
        <div className="flex items-center gap-2 text-zinc-950 font-sans">
          <span className="text-lg font-bold font-display">Loading</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}
