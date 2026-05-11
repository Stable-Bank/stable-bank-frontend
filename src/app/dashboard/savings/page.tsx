"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Plus, ArrowRight, X, ArrowLeft, Target, Palette } from "lucide-react";
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

export default function SavingsPage() {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form states
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [selectedColor, setSelectedColor] = useState("bg-brand-purple");
  const [depositAmount, setDepositAmount] = useState<{ [key: string]: number | "" }>({});

  const colors = [
    { id: "purple", value: "bg-brand-purple" },
    { id: "yellow", value: "bg-brand-yellow text-black" },
    { id: "green", value: "bg-[#319F43]" },
    { id: "blue", value: "bg-blue-500" },
    { id: "red", value: "bg-red-500" },
  ];

  const fetchBuckets = async () => {
    try {
      const { data } = await apiClient.get("/savings");
      setBuckets(data.data);
    } catch (error) {
      console.error("Failed to fetch buckets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  const handleCreateBucket = async () => {
    if (!name || !targetAmount || targetAmount <= 0) return toast.error("Invalid input");
    try {
      await apiClient.post("/savings/bucket", { name, targetAmount, color: selectedColor });
      toast.success("Savings bucket created!");
      setShowCreate(false);
      setStep(1);
      setName("");
      setTargetAmount("");
      setSelectedColor("bg-brand-purple");
      fetchBuckets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Creation failed");
    }
  };

  const handleDeposit = async (id: string) => {
    const amount = depositAmount[id];
    if (!amount || amount <= 0) return toast.error("Invalid deposit amount");
    try {
      await apiClient.post(`/savings/${id}/deposit`, { amount });
      toast.success(`Deposited $${amount}`);
      setDepositAmount({ ...depositAmount, [id]: "" });
      fetchBuckets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Deposit failed");
    }
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-10 pb-20">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Target Savings
          </h1>
          <p className="text-brand-white/40 text-base max-w-[500px]">
            Set specific financial goals. Allocate yields or deposit manually to reach your target over time.
          </p>
        </div>
        <Button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-white text-black font-bold rounded-xl h-12"
        >
          <Plus size={18} className="mr-2" />
          New Bucket
        </Button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0E121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {step === 1 ? <Target size={20} className="text-brand-purple" /> : <PiggyBank size={20} className="text-brand-purple" />}
                {step === 1 ? "Goal Details" : "Financial Target"}
              </h3>
              <button onClick={() => { setShowCreate(false); setStep(1); }} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {step === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Goal Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Summer Vacation"
                      className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Palette size={14} /> Theme Color
                    </label>
                    <div className="flex items-center gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.value)}
                          className={cn(
                            "h-10 w-10 rounded-full transition-all duration-300 border-2",
                            color.value.split(" ")[0], // Get background color class
                            selectedColor === color.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      if (!name) return toast.error("Please enter a goal name");
                      setStep(2);
                    }} 
                    className="w-full h-14 mt-4 bg-white text-black hover:bg-white/90 font-bold rounded-xl flex items-center justify-between px-6"
                  >
                    Continue <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Target Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={targetAmount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setTargetAmount(isNaN(val) ? "" : Math.max(0, val));
                      }}
                      placeholder="0.00"
                      className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-4 text-2xl font-black text-white outline-none focus:border-brand-purple transition-colors"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => setStep(1)} 
                      variant="outline"
                      className="h-14 w-14 rounded-xl border-white/10 hover:bg-white/5 text-white p-0 shrink-0"
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Button 
                      onClick={handleCreateBucket} 
                      className="h-14 flex-1 bg-brand-purple hover:bg-brand-purple/90 font-bold rounded-xl"
                    >
                      Complete & Create
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array(3).fill(0).map((_, i) => <div key={i} className="h-64 animate-pulse bg-white/5 rounded-2xl" />)
        ) : buckets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <PiggyBank size={48} className="text-white/20 mb-4" />
            <p className="text-white/40 font-medium">No savings buckets yet.</p>
          </div>
        ) : (
          buckets.map((bucket) => {
            const progress = Math.min((bucket.currentAmount / bucket.targetAmount) * 100, 100);
            return (
              <GlassCard key={bucket._id} className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white", bucket.color)}>
                    <PiggyBank size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{bucket.name}</h3>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                      {bucket.status}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-black text-white">${bucket.currentAmount.toLocaleString()}</span>
                    <span className="text-sm text-white/40 font-medium">of ${bucket.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", bucket.color)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-right text-xs font-bold text-[#E9F2A3] mt-2">{progress.toFixed(1)}% Completed</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Amt"
                    value={depositAmount[bucket._id] ?? ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setDepositAmount({ ...depositAmount, [bucket._id]: isNaN(val) ? "" : Math.max(0, val) });
                    }}
                    className="w-20 h-10 bg-black/40 border border-white/10 rounded-lg px-2 text-sm text-white outline-none focus:border-brand-purple"
                  />
                  <Button 
                    onClick={() => handleDeposit(bucket._id)}
                    className="flex-1 h-10 bg-white/10 hover:bg-white/20 text-white font-bold text-sm"
                    disabled={bucket.status === "completed"}
                  >
                    Quick Deposit
                  </Button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
