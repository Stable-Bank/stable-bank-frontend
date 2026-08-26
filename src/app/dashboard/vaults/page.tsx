"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Clock, Plus, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { apiClient } from "@/config/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-sm rounded-2xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function VaultsPage() {
  const { user } = useAuth();
  const { balance, refresh: refreshBalance } = useBalance((user as any)?.primaryWalletAddress || user?.walletAddress);
  
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [lockLoading, setLockLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const usdcToken = balance?.chains
    ?.flatMap((c: any) => c.tokens)
    ?.find((t: any) => t.symbol.toUpperCase() === "USDC");
  const availableUSDC = usdcToken ? parseFloat(usdcToken.balance) || 0 : 0;

  const isInsufficient = amount !== "" && amount > availableUSDC;

  const fetchVaults = async () => {
    try {
      const res = await apiClient.get("/vault");
      if (Array.isArray(res)) {
        setVaults(res);
      } else if (res && Array.isArray(res.data)) {
        setVaults(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch vaults", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const handleLock = async () => {
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    if (amount > availableUSDC) return toast.error("Insufficient balance");
    
    setLockLoading(true);
    try {
      await apiClient.post("/vault/lock", { amount });
      toast.success(`Locked $${amount} successfully!`);
      setAmount("");
      setShowCreate(false);
      fetchVaults();
      refreshBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to lock funds");
    } finally {
      setLockLoading(false);
    }
  };

  const handleRequestUnlock = async (id: string) => {
    try {
      await apiClient.post(`/vault/${id}/request-unlock`);
      toast.success("Unlock requested. 24h cooldown started.");
      fetchVaults();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request unlock");
    }
  };

  const handleWithdraw = async (id: string) => {
    try {
      await apiClient.post(`/vault/${id}/withdraw`);
      toast.success("Funds withdrawn to spendable balance.");
      fetchVaults();
      refreshBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to withdraw");
    }
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
            Fund Vaults
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-[500px] font-sans leading-relaxed">
            Lock away your funds to avoid spending them, and earn base yield. You can request to unlock them at any time (24h cooldown applies).
          </p>
        </div>
        <Button 
          onClick={() => setShowCreate(true)}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-11 shrink-0 shadow-md shadow-brand-purple/20 cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Lock Funds
        </Button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-display font-extrabold text-zinc-950 flex items-center gap-2">
                <Lock size={20} className="text-brand-purple" />
                Lock Funds
              </h3>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                    Amount (USDC)
                  </label>
                  <button 
                    onClick={() => setAmount(availableUSDC)}
                    className="text-xs font-mono font-bold text-brand-purple hover:underline cursor-pointer"
                  >
                    Available: {availableUSDC.toFixed(2)} USDC (Max)
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAmount(isNaN(val) ? "" : Math.max(0, val));
                  }}
                  className={cn(
                    "w-full h-14 bg-zinc-50 border rounded-2xl px-4 text-2xl font-mono font-black text-zinc-950 outline-none transition-colors",
                    isInsufficient ? "border-red-500 focus:border-red-500 focus:bg-white" : "border-zinc-200 focus:border-brand-purple focus:bg-white"
                  )}
                  placeholder="0.00"
                />
              </div>

              {isInsufficient ? (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-sans leading-snug">
                    Insufficient balance. You only have {availableUSDC.toFixed(2)} USDC available in your wallet.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-sans leading-snug">
                    Unlocking funds takes exactly 24 hours from the time of request for security purposes.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleLock}
                disabled={lockLoading || !amount || amount <= 0 || isInsufficient}
                className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full shadow-md shadow-brand-purple/20 disabled:opacity-50 cursor-pointer"
              >
                {lockLoading ? "Locking..." : "Lock in Vault"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-zinc-950 mb-4">Your Vaults</h3>
          {loading ? (
             <div className="animate-pulse h-32 bg-zinc-100 rounded-2xl border border-zinc-200" />
          ) : vaults.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-10 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                <Lock size={32} className="text-zinc-300 mb-4" />
                <p className="text-zinc-500 font-sans font-medium text-sm">No locked funds yet.</p>
             </div>
          ) : (
            vaults.map((vault) => (
              <GlassCard key={vault._id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0",
                      vault.status === "locked" ? "bg-purple-50 text-brand-purple border-purple-200" :
                      vault.status === "unlocking" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-emerald-50 text-emerald-600 border-emerald-200"
                    )}>
                      {vault.status === "locked" ? <Lock size={20} /> : vault.status === "unlocking" ? <Clock size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-2xl font-mono font-black text-zinc-950">${vault.amount.toLocaleString()}</h4>
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                        Status: <span className={cn(
                          vault.status === "locked" ? "text-brand-purple" : vault.status === "unlocking" ? "text-amber-700" : "text-emerald-600"
                        )}>{vault.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {vault.status === "locked" && (
                      <Button 
                        onClick={() => handleRequestUnlock(vault._id)}
                        variant="outline"
                        className="border-zinc-200 text-zinc-800 hover:bg-zinc-100 font-sans font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Request Unlock
                      </Button>
                    )}
                    {vault.status === "unlocking" && (
                       <div className="text-right">
                          <p className="text-xs font-mono text-zinc-400">Available at:</p>
                          <p className="text-xs font-mono font-bold text-zinc-900">{new Date(vault.unlockAvailableAt).toLocaleString()}</p>
                       </div>
                    )}
                    {vault.status === "unlocked" && (
                      <Button 
                        onClick={() => handleWithdraw(vault._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
      </div>
    </div>
  );
}
