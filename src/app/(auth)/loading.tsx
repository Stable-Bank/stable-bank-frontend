export default function AuthLoading() {
  return (
    <div className="bg-zinc-50 relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-zinc-950">
      {/* Mobile Background with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-center justify-center gap-10">
          {/* Logo Skeleton */}
          <div className="w-full">
            <div className="h-9 w-[300px] bg-zinc-200 animate-pulse rounded-xl" />
          </div>

          {/* Form Skeleton */}
          <div className="flex w-full flex-col gap-6">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-zinc-200 animate-pulse rounded-xl" />
              <div className="h-4 w-full bg-zinc-200 animate-pulse rounded-lg" />
            </div>

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-zinc-200 animate-pulse rounded" />
                  <div className="h-12 w-full bg-zinc-200 animate-pulse rounded-xl" />
                </div>
              ))}
            </div>

            <div className="h-12 w-full bg-brand-purple/20 animate-pulse rounded-full" />
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-brand-purple animate-bounce" />
          </div>
        </div>
      </div>

      {/* Desktop Image Section */}
      <div className="hidden lg:block relative bg-zinc-100" />
    </div>
  );
}
