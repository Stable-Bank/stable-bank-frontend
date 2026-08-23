import { Metadata } from "next";
import Image from "next/image";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "StableBank | Authentication",
  description:
    "Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.",
  icons: {
    icon: "/images/brand/favicon.svg",
  },
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 md:px-8">
      {/* Decorative Cards - Hidden on mobile, visible on tablet+ */}
      <Image
        src={"/images/svg/signup-card-1.svg"}
        alt="img"
        width={420}
        height={160}
        className="absolute top-[15%] left-0 h-[100px] w-auto object-fill object-center hidden md:block lg:h-[160px]"
      />
      <Image
        src={"/images/svg/signup-card-2.svg"}
        alt="img"
        width={420}
        height={160}
        className="absolute top-[75%] left-0 h-[120px] w-auto object-fill object-center hidden md:block lg:h-[200px]"
      />
      <Image
        src={"/images/svg/signup-card-3.svg"}
        alt="img"
        width={420}
        height={160}
        className="absolute top-[15%] right-0 h-[120px] w-auto object-fill object-center hidden md:block lg:h-[200px]"
      />
      <Image
        src={"/images/svg/signup-card-4.svg"}
        alt="img"
        width={420}
        height={160}
        className="absolute top-[75%] right-0 h-[150px] w-auto object-fill object-center hidden md:block lg:h-[250px]"
      />

      {/* Logo */}
      <Image
        src={"/images/brand/full-logo-purple.svg"}
        alt="stable bank logo"
        width={300}
        height={35}
        className="absolute top-6 sm:top-10 md:top-14 left-1/2 h-[20px] sm:h-[24px] md:h-[26px] w-auto -translate-x-1/2 transform"
      />

      {/* Form Container */}
      <div className="flex w-full max-w-[460px] flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32">
        {children}
      </div>
    </div>
  );
}
