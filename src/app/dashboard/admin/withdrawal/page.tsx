"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ShieldAlert, CheckCircle2, ExternalLink, Network } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-sm rounded-2xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function AdminWithdrawalPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("polygon");
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      return toast.error("Please enter a valid recipient address and amount.");
    }

    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      return toast.error("Invalid EVM recipient address.");
    }

    setSubmitting(true);
    setTxHash(null);
    try {
      const response = await adminService.withdrawOperational(recipient, parseFloat(amount), network);
      if (response.success) {
        toast.success(response.message || "Withdrawal completed successfully!");
        setRecipient("");
        setAmount("");
        if ((response as any).hash) {
          setTxHash((response as any).hash);
        }
      } else {
        toast.error("Withdrawal failed.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to process withdrawal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight flex items-center gap-3">
          Operational Withdrawal <span className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-mono font-bold border border-brand-purple/20 uppercase tracking-wider">On-chain</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-[600px] font-sans">
          Withdraw USDC funds directly from the StableBank Operator smart wallet on-chain for liquidity or operational reasons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Recipient EVM Address</label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs sm:text-sm text-zinc-900 font-mono outline-none focus:border-brand-purple focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs sm:text-sm text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="polygon">Polygon Amoy (Default)</option>
                    <option value="base">Base Sepolia</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Amount (USDC)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs sm:text-sm text-zinc-900 font-mono outline-none focus:border-brand-purple focus:bg-white transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                <ArrowUp size={16} />
                {submitting ? "Processing Transaction..." : "Withdraw Funds"}
              </Button>
            </form>
          </GlassCard>

          {/* Success Transaction Details */}
          {txHash && (
            <GlassCard className="border-emerald-200 bg-emerald-50/40">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
                  <CheckCircle2 size={16} /> On-chain Transaction Completed
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-sans">
                  Funds have been successfully sent from the operator wallet on the blockchain.
                </p>
                <div className="flex items-center gap-2 bg-white border border-zinc-200 p-3 rounded-xl font-mono text-xs text-zinc-800 overflow-x-auto shadow-2xs">
                  <span>Tx Hash: {txHash}</span>
                </div>
                <a
                  href={network === "base" ? `https://sepolia.basescan.org/tx/${txHash}` : `https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-brand-purple hover:underline font-mono font-bold self-start mt-1"
                >
                  View on Blockchain Explorer <ExternalLink size={12} />
                </a>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden group border-indigo-100 bg-indigo-50/40">
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                <Network size={14} /> Operator Liquidity
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                This transaction executes standard ERC-20 `transfer` directly on-chain using the operator private keys configured on the backend server.
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                Ensure the operator wallet has sufficient gas token (BNB/POL) to process the transfer.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-red-200 bg-red-50/40">
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
                <ShieldAlert size={14} /> Attention
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                EVM blockchain transfers are completely final and cannot be reversed under any circumstances once broadcasted.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
