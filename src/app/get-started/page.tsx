import Image from "next/image";
import Link from "next/link";

export default function GetStarted() {
  return (
    <div className="bg-brand-black relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-white">
      {/* Mobile Background Image with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src={"/images/png/get-started-img.png"}
          alt="get started background"
          fill
          className="object-cover object-center opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/90 to-brand-black" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-center justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          <div className="w-full">
            <Image
              src={"/images/brand/logo-full.svg"}
              alt="stable bank logo"
              width={300}
              height={35}
              className="h-7 sm:h-8 md:h-9 w-auto"
            />
          </div>
          <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              <div className="flex w-fit items-center gap-2 rounded-3xl border border-solid border-white px-3 py-2.5 font-sans">
                <span className="aspect-square h-[9px] w-[9px] rounded-full bg-white" />
                <span className="text-xs sm:text-sm font-normal">
                  Decentralised
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                Welcome To <br />
                <span className="text-brand-purple">Stablebank</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] font-normal">
                Secure, scalable, and decentralized solutions for your digital
                assets—experience the future of financial freedom.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
              <Link
                href="/signup"
                className="bg-brand-purple rounded-[40px] px-6 sm:px-8 py-3 sm:py-[11px] text-base sm:text-lg lg:text-[22px] font-semibold text-center"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="border-brand-purple rounded-[40px] border-[1.5px] border-solid px-6 sm:px-8 py-3 sm:py-[11px] text-base sm:text-lg lg:text-[22px] font-semibold text-center"
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
