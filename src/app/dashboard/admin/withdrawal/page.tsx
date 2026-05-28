"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ShieldAlert, Sparkles, ExternalLink, Network } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function AdminWithdrawalPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("bsc");
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
        if (response.hash) {
          setTxHash(response.hash);
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
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
          Operational Withdrawal <span className="text-sm bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full font-bold border border-brand-purple/30 uppercase tracking-wider">On-chain</span>
        </h1>
        <p className="text-white/40 text-base">
          Withdraw USDC funds directly from the StableBank Operator smart wallet on-chain for liquidity or operational reasons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Recipient EVM Address</label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-mono outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-medium outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                  >
                    <option value="bsc">BSC Testnet (Default)</option>
                    <option value="polygon">Polygon Amoy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Amount (USDC)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-mono outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-brand-purple/10"
              >
                <ArrowUp size={16} />
                {submitting ? "Processing Transaction..." : "Withdraw Funds"}
              </Button>
            </form>
          </GlassCard>

          {/* Success Transaction Details */}
          {txHash && (
            <GlassCard className="border-green-500/20 bg-green-500/[0.02]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-green-400">
                  <Sparkles size={16} /> On-chain Transaction Completed
                </div>
                <p className="text-md text-white/60">
                  Funds have been successfully sent from the operator wallet on the blockchain.
                </p>
                <div className="flex items-center gap-2 bg-black/30 border border-white/5 p-3 rounded-xl font-mono text-[11px] text-white/80 overflow-x-auto">
                  <span>Tx Hash: {txHash}</span>
                </div>
                <a
                  href={network === "bsc" ? `https://testnet.bscscan.com/tx/${txHash}` : `https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-md text-[#E9F2A3] hover:underline font-bold self-start mt-1"
                >
                  View on Blockchain Explorer <ExternalLink size={12} />
                </a>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-100" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#E9F2A3]">
                <Network size={14} /> Operator Liquidity
              </div>
              <p className="text-md text-white/50 leading-relaxed">
                This transaction executes standard ERC-20 `transfer` directly on-chain using the operator private keys configured on the backend server.
              </p>
              <p className="text-md text-white/50 leading-relaxed">
                Ensure the operator wallet has sufficient gas token (BNB/POL) to process the transfer.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-red-500/10">
            <div className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
                <ShieldAlert size={14} /> Attention
              </div>
              <p className="text-md text-white/50 leading-relaxed">
                EVM blockchain transfers are completely final and cannot be reversed under any circumstances once broadcasted.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
