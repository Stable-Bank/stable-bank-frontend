"use client";

import { cn } from "@/utils/cn";
import { MessageCircleQuestion, Plus } from "lucide-react";
import React, { useState } from "react";

const faqData = [
  {
    question: "What is StableBank?",
    answer:
      "StableBank is a next-generation platform that allows you to securely store, send, and earn yield on your stablecoins without traditional banking fees.",
  },
  {
    question: "How do Fund Locks work?",
    answer:
      "You can 'lock' funds in your vault to remove them from your spendable balance. These locked funds earn yield, allowing your money to work for you. You can unlock them at any time, subject to a 24-hour cool-down period.",
  },
  {
    question: "What are Target Savings?",
    answer:
      "Target Savings allow you to set up recurring deposits into specific savings buckets. Each bucket is automatically allocated to a specific yield-generating pool, helping you reach your financial goals faster.",
  },
  {
    question: "How can I track my earnings?",
    answer:
      "Our Staking Dashboard provides a comprehensive view of all your yield-generating positions in one place, so you always know exactly how your funds are performing.",
  },
  {
    question: "Can I withdraw my money whenever I want?",
    answer:
      "Yes! You can manually withdraw or unstake your funds back to your spendable balance at any time, keeping in mind the standard 24-hour cool-down period for locked funds.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: (typeof faqData)[0];
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "group border-b border-white/10 transition-colors duration-300",
        isOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 px-4 sm:px-6 text-left focus:outline-none"
      >
        <span
          className={cn(
            "text-lg sm:text-xl font-medium transition-colors duration-300",
            isOpen ? "text-brand-yellow" : "text-brand-white group-hover:text-brand-purple"
          )}
        >
          {faq.question}
        </span>
        <div
          className={cn(
            "ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
            isOpen
              ? "border-brand-yellow bg-brand-yellow/10 rotate-45"
              : "border-white/20 bg-transparent group-hover:border-brand-purple group-hover:bg-brand-purple/10"
          )}
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isOpen ? "text-brand-yellow" : "text-white/60 group-hover:text-brand-purple"
            )}
          />
        </div>
      </button>
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-4 sm:px-6 text-base sm:text-lg text-white/70 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left Column: Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="flex w-fit items-center gap-2 rounded-3xl border border-solid border-white/30 px-4 py-2.5 font-sans text-sm sm:text-sm font-normal mb-6">
              <MessageCircleQuestion className="h-4 w-4 text-brand-purple" />
              <span>Got Questions?</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white mb-6 leading-tight">
              We&apos;ve got <br className="hidden lg:block" />
              <span className="text-brand-yellow">answers.</span>
            </h2>
            
            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-md">
              Everything you need to know about StableBank and how we are revolutionizing the way you manage your money. 
            </p>
            
            <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-brand-purple to-brand-yellow rounded-full" />
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
