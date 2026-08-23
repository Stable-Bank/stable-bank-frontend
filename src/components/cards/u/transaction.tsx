import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type TransactionCardProps = {
  timestamp: string;
  from: {
    name: string;
    avatar: string;
    amount: string;
    bank: string;
  };
  to: {
    name: string;
    avatar: string;
    amount: string;
    token: string;
    bank: string;
  };
};

export default function TransactionCard({
  timestamp,
  from,
  to,
}: TransactionCardProps) {
  return (
    <Card className="w-full !gap-0 rounded-2xl border border-zinc-200 bg-white !px-0 !py-0 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between bg-zinc-50 border-b border-zinc-200 px-6 py-3 text-xs font-mono font-medium">
        <span className="text-zinc-600">{timestamp}</span>
        <button className="text-brand-purple hover:underline font-bold cursor-pointer">Routing</button>
      </div>

      <CardContent className="grid grid-cols-3 !px-5 !pt-6 !pb-6 items-center">
        <div className="flex items-center gap-3">
          <Image
            src={from.avatar}
            alt={from.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover border border-zinc-200"
          />
          <div>
            <p className="text-brand-purple font-mono text-base font-bold">
              {from.amount}
            </p>
            <p className="text-zinc-600 font-sans text-xs">{from.bank}</p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <ArrowRight className="text-zinc-400 h-5 w-5" />
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={to.avatar}
            alt={to.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-cover border border-zinc-200"
          />
          <div>
            <p className="text-base font-mono font-bold text-emerald-600">
              {to.amount} {to.token}
            </p>
            <p className="text-zinc-600 font-sans text-xs">{to.bank}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
