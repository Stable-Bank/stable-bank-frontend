import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/brand/brand-logo";

export default function GetStarted() {
  return (
    <div className="bg-white relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-zinc-950">
      {/* Mobile Background Image with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src={"/images/png/get-started-img.png"}
          alt="get started background"
          fill
          className="object-cover object-center opacity-10"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-start justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          <div className="w-full">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo />
            </Link>
          </div>
          <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-800 uppercase tracking-wider shadow-sm">
                <span className="aspect-square h-2 w-2 rounded-full bg-brand-purple" />
                <span>
                  Decentralised
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-tight text-zinc-950">
                Welcome To <br />
                <span className="text-brand-purple">Stablebank</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] font-normal text-zinc-600 font-sans">
                Secure, scalable, and decentralized solutions for your digital
                assets. Experience the future of financial freedom.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
              <Link
                href="/signup"
                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-6 sm:px-8 py-3 sm:py-[11px] text-base sm:text-lg lg:text-[20px] font-bold text-center shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 rounded-full border-[1.5px] border-solid px-6 sm:px-8 py-3 sm:py-[11px] text-base sm:text-lg lg:text-[20px] font-semibold text-center shadow-sm transition-all"
              >
                Sign-In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Image Section */}
      <div className="hidden lg:block relative">
        <Image
          src={"/images/png/get-started-img.png"}
          alt="get started img"
          fill
          className="rounded-l-[20px] object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
