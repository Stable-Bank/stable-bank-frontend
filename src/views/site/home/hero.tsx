import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import TextMarquee from "@/components/marquee";

export default function HeroHome() {
  return (
    <div className="py-10 px-4 sm:py-16 md:py-20">
      <div className="mx-auto flex w-fit items-center gap-2 rounded-3xl border border-solid border-white/50 px-3 py-2.5 font-sans text-xs sm:text-sm font-normal">
        <div className="aspect-square h-[9px] w-[9px] rounded-full bg-white" />
        <span>Decentralised </span>
      </div>

      <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#E5E5E5] px-4">
        All Stables, One Wallet
      </h1>

      <p className="text-brand-white mx-auto mt-5 max-w-[480px] text-center text-base sm:text-lg md:text-xl lg:text-[22px] font-normal px-4">
        Secure, scalable, and decentralized solutions for your digital
        assets—experience the future of financial freedom.
      </p>

      <div className="mt-8 sm:mt-10 md:mt-[46px] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 px-4">
        <Button className="text-brand-white h-[50px] sm:h-[55px] px-8 sm:px-[45px] text-lg sm:text-xl font-extrabold w-full sm:w-auto">
          Start Banking
        </Button>
        <Button className="sm:ml-[-4px] size-7 h-[50px] sm:h-[55px] !px-8 w-full sm:w-auto">
          <ArrowRight />
        </Button>
      </div>

      <div className="relative mx-auto flex h-fit justify-center overflow-hidden px-4">
        <Image
          src={"/images/svg/hero-home-phone.svg"}
          alt="phone"
          width={555}
          height={476}
          priority={true}
          draggable={false}
          className="relative z-[5] w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[555px] h-auto"
        />
        <p className="via-brand-yellow/10 absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-10% to-transparent bg-clip-text text-[80px] sm:text-[150px] md:text-[250px] lg:text-[350px] font-medium text-transparent whitespace-nowrap">
          StableBank
        </p>
      </div>

      <TextMarquee />
    </div>
  );
}
