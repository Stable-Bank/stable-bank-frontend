"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Clock, Zap, Plus, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { apiClient } from "@/config/axios";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function VaultsPage() {
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [lockLoading, setLockLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const fetchVaults = async () => {
    try {
      const { data } = await apiClient.get("/vault");
      setVaults(data.data);
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
    setLockLoading(true);
    try {
      await apiClient.post("/vault/lock", { amount });
      toast.success(`Locked $${amount} successfully!`);
      setAmount("");
      setShowCreate(false);
      fetchVaults();
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to withdraw");
    }
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-10 pb-20">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Fund Vaults
          </h1>
          <p className="text-brand-white/40 text-base max-w-[500px]">
            Lock away your funds to avoid spending them, and earn base yield. You can request to unlock them at any time (24h cooldown applies).
          </p>
        </div>
        <Button 
          onClick={() => setShowCreate(true)}
          className="bg-white text-black font-bold rounded-xl h-12 shrink-0"
        >
          <Plus size={18} className="mr-2" />
          Lock Funds
        </Button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0E121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock size={20} className="text-brand-purple" />
                Lock Funds
              </h3>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Amount (USDC)</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAmount(isNaN(val) ? "" : Math.max(0, val));
                  }}
                  className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-2xl font-black text-white outline-none focus:border-brand-purple transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-start gap-3 p-3 bg-brand-yellow/5 border border-brand-yellow/10 rounded-xl">
                <AlertCircle size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                <p className="text-[10px] text-brand-yellow/80 leading-snug">
                  Unlocking funds takes exactly 24 hours from the time of request for security purposes.
                </p>
              </div>

              <Button 
                onClick={handleLock}
                disabled={lockLoading || !amount || amount <= 0}
                className="w-full h-14 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl"
              >
                {lockLoading ? "Locking..." : "Lock in Vault"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white mb-6">Your Vaults</h3>
          {loading ? (
             <div className="animate-pulse h-32 bg-white/5 rounded-2xl" />
          ) : vaults.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <Lock size={32} className="text-white/20 mb-4" />
                <p className="text-white/40 font-medium">No locked funds yet.</p>
             </div>
          ) : (
            vaults.map((vault) => (
              <GlassCard key={vault._id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center",
                      vault.status === "locked" ? "bg-brand-purple/20 text-brand-purple" :
                      vault.status === "unlocking" ? "bg-brand-yellow/20 text-brand-yellow" :
                      "bg-[#319F43]/20 text-[#319F43]"
                    )}>
                      {vault.status === "locked" ? <Lock size={20} /> : vault.status === "unlocking" ? <Clock size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white">${vault.amount.toLocaleString()}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                        Status: <span className={cn(
                          vault.status === "locked" ? "text-brand-purple" : vault.status === "unlocking" ? "text-brand-yellow" : "text-[#319F43]"
                        )}>{vault.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {vault.status === "locked" && (
                      <Button 
                        onClick={() => handleRequestUnlock(vault._id)}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5"
                      >
                        Request Unlock
                      </Button>
                    )}
                    {vault.status === "unlocking" && (
                       <div className="text-right">
                          <p className="text-xs text-white/40">Available at:</p>
                          <p className="text-sm font-bold text-white">{new Date(vault.unlockAvailableAt).toLocaleString()}</p>
                       </div>
                    )}
                    {vault.status === "unlocked" && (
                      <Button 
                        onClick={() => handleWithdraw(vault._id)}
                        className="bg-[#319F43] hover:bg-[#319F43]/80 text-white"
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
