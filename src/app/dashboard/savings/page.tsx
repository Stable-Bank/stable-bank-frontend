"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, Plus, ArrowRight, X, ArrowLeft, Target, 
  AlertCircle, CheckCircle, Lock, Unlock, ShieldAlert, 
  Calendar, TrendingUp, Wallet 
} from "lucide-react";
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

export default function SavingsPage() {
  const { user } = useAuth();
  const { balance, refresh: refreshBalance } = useBalance(user?.walletAddress);

  const [buckets, setBuckets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "piggybank" | "safelock" | "target" | "flex">("all");

  // Create Savings Account Wizard States
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1); // 1: Select Type, 2: Configure, 3: Confirm
  const [savingsType, setSavingsType] = useState<"piggybank" | "safelock" | "target" | "flex">("piggybank");
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [maturityDate, setMaturityDate] = useState("");
  const [interestPayout, setInterestPayout] = useState<"upfront" | "maturity">("maturity");
  const [initialDeposit, setInitialDeposit] = useState<number | "">("");
  const [autosaveAmount, setAutosaveAmount] = useState<number | "">("");
  const [autosaveFrequency, setAutosaveFrequency] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [selectedColor, setSelectedColor] = useState("bg-brand-purple");
  const [createLoading, setCreateLoading] = useState(false);

  // Deposit Modal States
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<any | null>(null);
  const [depositStep, setDepositStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState<number | "">("");
  const [depositLoading, setDepositLoading] = useState(false);

  // Withdrawal Modal States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const colors = [
    { id: "purple", value: "bg-brand-purple" },
    { id: "yellow", value: "bg-amber-500 text-black" },
    { id: "green", value: "bg-emerald-600" },
    { id: "dark", value: "bg-zinc-800" },
    { id: "red", value: "bg-red-500" },
  ];

  const availableUSD = balance?.totalUSD || 0;

  // Deposit validations
  const remainingAmount = selectedBucket ? Math.max(0, selectedBucket.targetAmount - selectedBucket.currentAmount) : 0;
  const finalAmount = (depositAmount !== "" && selectedBucket) ? (selectedBucket.savingsType === "target" ? Math.min(Number(depositAmount), remainingAmount) : Number(depositAmount)) : 0;
  const isDepositInsufficient = finalAmount > availableUSD;
  const isExceedingGoal = (depositAmount !== "" && selectedBucket && selectedBucket.savingsType === "target") ? Number(depositAmount) > remainingAmount : false;

  // Withdrawal validations & stats
  const isFreeQuarterlyDate = () => {
    const today = new Date();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    return (m === 3 && d === 31) || (m === 6 && d === 30) || (m === 9 && d === 30) || (m === 12 && d === 31);
  };

  const getWithdrawalPenalty = (amount: number) => {
    if (!selectedBucket) return 0;
    if (selectedBucket.savingsType === "piggybank") {
      return isFreeQuarterlyDate() ? 0 : amount * 0.025;
    }
    if (selectedBucket.savingsType === "target") {
      const isGoalCompleted = selectedBucket.status === "completed" || selectedBucket.currentAmount >= selectedBucket.targetAmount;
      const isMatured = selectedBucket.maturityDate ? (new Date() >= new Date(selectedBucket.maturityDate)) : true;
      return (isGoalCompleted && isMatured) ? 0 : amount * 0.025;
    }
    return 0; // safelock is locked completely, flex has no penalty fees (just interest consequences)
  };

  const withdrawAmount = selectedBucket ? selectedBucket.currentAmount : 0;
  const calculatedPenalty = getWithdrawalPenalty(withdrawAmount);
  const netWithdrawalAmount = Math.max(0, withdrawAmount - calculatedPenalty);

  // Totals calculations
  const totalSavings = buckets.reduce((sum, b) => sum + (b.currentAmount || 0), 0);
  const totalYield = buckets.reduce((sum, b) => sum + (b.yieldEarned || 0), 0);

  const fetchBuckets = async () => {
    try {
      const res = await apiClient.get("/savings");
      if (Array.isArray(res)) {
        setBuckets(res);
      } else if (res && Array.isArray(res.data)) {
        setBuckets(res.data);
      }
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
    if (!name) return toast.error("Please enter a goal/account name");
    
    // Validations based on type
    if (savingsType === "safelock") {
      if (!maturityDate) return toast.error("Maturity date is required for SafeLock");
      const mDate = new Date(maturityDate);
      if (mDate <= new Date()) return toast.error("Maturity date must be in the future");
      const diffDays = Math.ceil(Math.abs(mDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 10) return toast.error("SafeLock duration must be at least 10 days");
    }

    if (savingsType === "target") {
      if (!targetAmount || targetAmount <= 0) return toast.error("Target amount is required");
    }

    if (initialDeposit && initialDeposit > availableUSD) {
      return toast.error("Initial deposit exceeds available USD balance");
    }

    setCreateLoading(true);
    try {
      await apiClient.post("/savings/bucket", {
        name,
        savingsType,
        targetAmount: targetAmount || 0,
        color: selectedColor,
        maturityDate: maturityDate || undefined,
        interestPayout: savingsType === "safelock" ? interestPayout : "none",
        initialDeposit: initialDeposit || 0,
        autosaveAmount: autosaveAmount || 0,
        autosaveFrequency: autosaveFrequency || "none"
      });

      toast.success("Savings account successfully created!");
      setShowCreate(false);
      resetCreateForm();
      fetchBuckets();
      refreshBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create savings account");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetCreateForm = () => {
    setCreateStep(1);
    setName("");
    setTargetAmount("");
    setMaturityDate("");
    setInterestPayout("maturity");
    setInitialDeposit("");
    setAutosaveAmount("");
    setAutosaveFrequency("none");
    setSelectedColor("bg-brand-purple");
  };

  const openDepositModal = (bucket: any) => {
    setSelectedBucket(bucket);
    setDepositAmount("");
    setDepositStep(1);
    setShowDepositModal(true);
  };

  const handleDepositSubmit = async () => {
    if (!selectedBucket || finalAmount <= 0) return toast.error("Invalid amount");
    if (finalAmount > availableUSD) return toast.error("Insufficient balance");

    setDepositLoading(true);
    try {
      await apiClient.post(`/savings/${selectedBucket._id}/deposit`, { amount: finalAmount });
      toast.success(`Successfully deposited $${finalAmount.toFixed(2)} USD`);
      setShowDepositModal(false);
      fetchBuckets();
      refreshBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Deposit failed");
    } finally {
      setDepositLoading(false);
    }
  };

  const openWithdrawModal = (bucket: any) => {
    setSelectedBucket(bucket);
    setShowWithdrawModal(true);
  };

  const handleWithdrawSubmit = async () => {
    if (!selectedBucket || withdrawAmount <= 0) return toast.error("Invalid withdrawal balance");

    setWithdrawLoading(true);
    try {
      const res: any = await apiClient.post(`/savings/${selectedBucket._id}/withdraw`);
      const netCredited = res?.data?.netCredited ?? (withdrawAmount - calculatedPenalty);
      const penalty = res?.data?.penaltyAmount ?? calculatedPenalty;

      if (penalty > 0) {
        toast.success(`Withdrawal successful. $${netCredited.toFixed(2)} USD credited. Charged $${penalty.toFixed(2)} USD breaking fee.`);
      } else {
        toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)} USD`);
      }

      setShowWithdrawModal(false);
      fetchBuckets();
      refreshBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const filteredBuckets = buckets.filter(b => {
    if (filterTab === "all") return true;
    return b.savingsType === filterTab;
  });

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header & Main Cards */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
            StableSavings Hub
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-[500px] font-sans">
            Grow your crypto capital securely using high-yield savings products powered by smart contract ledgers.
          </p>
        </div>
        <Button 
          onClick={() => { resetCreateForm(); setShowCreate(true); }}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-11 w-full md:w-auto px-6 shrink-0 shadow-md shadow-brand-purple/20 cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Create Savings Account
        </Button>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Savings Balance</span>
            <div className="h-9 w-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
              <PiggyBank size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-zinc-950">${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Allocated across all accounts</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Yield Interest Accrued</span>
            <div className="h-9 w-9 rounded-xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-[#556000]">${totalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Yield distributed to Flex account</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Available Spendable Balance</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Wallet size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-zinc-950">${availableUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Spendable wallet USD balance</p>
        </GlassCard>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {(["all", "piggybank", "safelock", "target", "flex"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-sans font-bold rounded-xl transition-all duration-200 cursor-pointer",
              filterTab === tab
                ? "bg-brand-purple text-white shadow-sm"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
            )}
          >
            {tab === "all" ? "All Accounts" : tab === "piggybank" ? "Piggybank (18%)" : tab === "safelock" ? "SafeLock (Up to 22%)" : tab === "target" ? "Target Savings (12%)" : "Flex Wallet (12%)"}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-64 animate-pulse bg-zinc-100 rounded-2xl" />)
        ) : filteredBuckets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50">
            <PiggyBank size={48} className="text-zinc-300 mb-4" />
            <p className="text-zinc-600 font-sans font-medium text-sm">No savings accounts match this type.</p>
            <Button 
              onClick={() => { resetCreateForm(); setShowCreate(true); }}
              variant="link" 
              className="text-brand-purple font-bold mt-2 cursor-pointer font-sans"
            >
              Create one now
            </Button>
          </div>
        ) : (
          filteredBuckets.map((bucket) => {
            const isSafeLock = bucket.savingsType === "safelock";
            const isTarget = bucket.savingsType === "target";
            const isPiggy = bucket.savingsType === "piggybank";
            const isFlex = bucket.savingsType === "flex";

            const progress = isTarget ? Math.min((bucket.currentAmount / bucket.targetAmount) * 100, 100) : 0;
            const remaining = isTarget ? Math.max(0, bucket.targetAmount - bucket.currentAmount) : 0;

            const daysLeft = bucket.maturityDate 
              ? Math.max(0, Math.ceil((new Date(bucket.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
              : 0;

            return (
              <GlassCard key={bucket._id} className="flex flex-col gap-6 justify-between border-t-2 border-t-brand-purple">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0", bucket.color)}>
                      {isSafeLock ? <Lock size={20} /> : isPiggy ? <PiggyBank size={20} /> : isTarget ? <Target size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-zinc-950 leading-tight">{bucket.name}</h3>
                      <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        {bucket.savingsType} • {bucket.interestRate * 100}% APY
                      </span>
                    </div>
                  </div>
                  {bucket.status === "completed" && (
                    <CheckCircle size={18} className="text-emerald-600 animate-pulse" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-mono font-black text-zinc-950">${bucket.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    {isTarget && (
                      <span className="text-xs font-mono text-zinc-400 ml-1">of ${bucket.targetAmount.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Target Savings Progress Bar */}
                  {isTarget && (
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", bucket.color)}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-mono text-zinc-500 font-bold">
                        <span>{progress.toFixed(1)}% Completed</span>
                        <span>${remaining.toFixed(2)} left</span>
                      </div>
                    </div>
                  )}

                  {/* SafeLock Maturity Indicators */}
                  {isSafeLock && bucket.maturityDate && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand-purple" />
                        <span>Maturity Date:</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">
                        {new Date(bucket.maturityDate).toLocaleDateString()} {daysLeft > 0 ? `(${daysLeft}d left)` : "(Matured)"}
                      </span>
                    </div>
                  )}

                  {/* Piggybank Auto-save detail */}
                  {isPiggy && bucket.autosaveAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <span>Autosave:</span>
                      <span className="font-mono font-bold text-zinc-900">
                        ${bucket.autosaveAmount} {bucket.autosaveFrequency}
                      </span>
                    </div>
                  )}

                  {/* Flex Account withdrawal count */}
                  {isFlex && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                      <span>Withdrawals this month:</span>
                      <span className={cn("font-mono font-bold", bucket.withdrawalCountThisMonth >= 4 ? "text-red-600" : "text-zinc-900")}>
                        {bucket.withdrawalCountThisMonth || 0} / 4
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
                  <Button 
                    onClick={() => openDepositModal(bucket)}
                    className="h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-sans font-bold text-xs rounded-xl cursor-pointer"
                    disabled={bucket.status === "completed" && isTarget}
                  >
                    Quick Deposit
                  </Button>
                  <Button 
                    onClick={() => openWithdrawModal(bucket)}
                    className="h-10 bg-brand-purple text-white hover:bg-brand-purple/90 font-sans font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    disabled={isSafeLock && daysLeft > 0}
                  >
                    {isSafeLock && daysLeft > 0 ? "Locked" : "Withdraw"}
                  </Button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Create Account Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-display font-extrabold text-zinc-950 flex items-center gap-2">
                <PiggyBank size={20} className="text-brand-purple" />
                Create Savings Account
              </h3>
              <button onClick={() => { setShowCreate(false); }} className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Select Type */}
              {createStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setSavingsType("piggybank"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer"
                    >
                      <PiggyBank size={24} className="text-brand-purple group-hover:scale-105 transition-transform" />
                      <h4 className="font-display font-bold text-zinc-950 text-base">Piggybank</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">Core disciplined saving. 18% APY. Free withdrawals only on quarterly days.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("safelock"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer"
                    >
                      <Lock size={24} className="text-amber-600 group-hover:scale-105 transition-transform" />
                      <h4 className="font-display font-bold text-zinc-950 text-base">SafeLock</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">Fixed term lump-sum savings. Up to 22% APY. Strictly locked until maturity.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("target"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer"
                    >
                      <Target size={24} className="text-emerald-600 group-hover:scale-105 transition-transform" />
                      <h4 className="font-display font-bold text-zinc-950 text-base">Target Savings</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">Goal-oriented buckets. 12% APY. Set deadline and penalty if broken early.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("flex"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer"
                    >
                      <Unlock size={24} className="text-brand-purple group-hover:scale-105 transition-transform" />
                      <h4 className="font-display font-bold text-zinc-950 text-base">Flex Wallet</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">Flexible emergency cash. 12% APY. Interest drops to 0% if withdrawn &gt;4 times/mo.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Configure Savings Details */}
              {createStep === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider mb-2">
                    <button onClick={() => setCreateStep(1)} className="hover:underline flex items-center gap-1 cursor-pointer">
                      <ArrowLeft size={12} /> Back to Products
                    </button>
                    <span>• Config: {savingsType.toUpperCase()}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Account Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={savingsType === "target" ? "e.g. Dream House" : "e.g. Personal Stash"}
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm"
                    />
                  </div>

                  {/* Initial Deposit (Applicable for all) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Initial Deposit (USD)</label>
                      <span className="text-xs font-mono font-bold text-brand-purple">Wallet Balance: ${availableUSD.toFixed(2)}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={initialDeposit}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setInitialDeposit(isNaN(val) ? "" : Math.max(0, val));
                      }}
                      placeholder="0.00"
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-zinc-900 font-mono outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm"
                    />
                  </div>

                  {/* SafeLock Specific Details */}
                  {savingsType === "safelock" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Maturity Unlock Date</label>
                        <input
                          type="date"
                          value={maturityDate}
                          onChange={(e) => setMaturityDate(e.target.value)}
                          className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Interest Payout Preference</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setInterestPayout("maturity")}
                            className={cn(
                              "h-11 rounded-xl border font-sans font-bold text-xs transition-all cursor-pointer",
                              interestPayout === "maturity" ? "bg-brand-purple text-white border-brand-purple shadow-xs" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                            )}
                          >
                            Pay at Maturity
                          </button>
                          <button
                            type="button"
                            onClick={() => setInterestPayout("upfront")}
                            className={cn(
                              "h-11 rounded-xl border font-sans font-bold text-xs transition-all cursor-pointer",
                              interestPayout === "upfront" ? "bg-brand-purple text-white border-brand-purple shadow-xs" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                            )}
                          >
                            Pay Upfront (Immediate)
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-sans leading-snug mt-1">
                          {interestPayout === "upfront" 
                            ? "Interest will be calculated and paid to your wallet immediately upon locking."
                            : "Accumulated interest will be released to your wallet together with your principal when it matures."}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Piggybank Specific Details */}
                  {savingsType === "piggybank" && (
                    <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-4 border border-zinc-200 rounded-2xl">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Autosave Amount</label>
                        <input
                          type="number"
                          value={autosaveAmount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setAutosaveAmount(isNaN(val) ? "" : Math.max(0, val));
                          }}
                          placeholder="0.00"
                          className="w-full h-10 bg-white border border-zinc-200 rounded-xl px-3 text-zinc-900 font-mono outline-none focus:border-brand-purple transition-colors text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Autosave Frequency</label>
                        <select
                          value={autosaveFrequency}
                          onChange={(e: any) => setAutosaveFrequency(e.target.value)}
                          className="w-full h-10 bg-white border border-zinc-200 rounded-xl px-3 text-zinc-900 font-sans outline-none focus:border-brand-purple transition-colors text-sm cursor-pointer"
                        >
                          <option value="none">Manual Only</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Target Savings Specific Details */}
                  {savingsType === "target" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Target Goal ($)</label>
                          <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setTargetAmount(isNaN(val) ? "" : Math.max(0, val));
                            }}
                            placeholder="e.g. 5000"
                            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-zinc-900 font-mono outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Target Date</label>
                          <input
                            type="date"
                            value={maturityDate}
                            onChange={(e) => setMaturityDate(e.target.value)}
                            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Color Theme</label>
                        <div className="flex items-center gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => setSelectedColor(color.value)}
                              className={cn(
                                "h-8 w-8 rounded-full transition-all duration-200 border-2 cursor-pointer",
                                color.value.split(" ")[0], 
                                selectedColor === color.value ? "border-zinc-900 scale-110 shadow-xs" : "border-transparent opacity-60 hover:opacity-100"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button 
                    onClick={() => setCreateStep(3)} 
                    disabled={!name}
                    className="w-full h-12 mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-between px-6 disabled:opacity-50 shadow-md shadow-brand-purple/20 cursor-pointer"
                  >
                    Review & Confirm <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {/* Step 3: Confirmation Summary */}
              {createStep === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider mb-2">
                    <button onClick={() => setCreateStep(2)} className="hover:underline flex items-center gap-1 cursor-pointer">
                      <ArrowLeft size={12} /> Back to Config
                    </button>
                    <span>• Review Summary</span>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                      <span className="text-zinc-500 font-sans">Product Type</span>
                      <span className="font-bold text-zinc-950 uppercase">{savingsType}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                      <span className="text-zinc-500 font-sans">Account Name</span>
                      <span className="font-bold text-zinc-950">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2">
                      <span className="text-zinc-500 font-sans">Interest Rate</span>
                      <span className="font-bold text-brand-purple">
                        {savingsType === "safelock" ? "Up to 22%" : savingsType === "piggybank" ? "18%" : "12%"} APY
                      </span>
                    </div>
                    
                    {initialDeposit && Number(initialDeposit) > 0 && (
                      <div className="flex justify-between border-b border-zinc-200 pb-2">
                        <span className="text-zinc-500 font-sans">Initial Deposit</span>
                        <span className="font-bold text-emerald-600">${Number(initialDeposit).toFixed(2)} USD</span>
                      </div>
                    )}

                    {savingsType === "safelock" && (
                      <>
                        <div className="flex justify-between border-b border-zinc-200 pb-2">
                          <span className="text-zinc-500 font-sans">Maturity Date</span>
                          <span className="font-bold text-zinc-900">{new Date(maturityDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-200 pb-2">
                          <span className="text-zinc-500 font-sans">Interest Payout</span>
                          <span className="font-bold text-zinc-900 uppercase">{interestPayout}</span>
                        </div>
                      </>
                    )}

                    {savingsType === "target" && (
                      <>
                        <div className="flex justify-between border-b border-zinc-200 pb-2">
                          <span className="text-zinc-500 font-sans">Goal Target</span>
                          <span className="font-bold text-zinc-900">${Number(targetAmount).toLocaleString()} USD</span>
                        </div>
                        {maturityDate && (
                          <div className="flex justify-between border-b border-zinc-200 pb-2">
                            <span className="text-zinc-500 font-sans">Target Deadline</span>
                            <span className="font-bold text-zinc-900">{new Date(maturityDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setCreateStep(2)} 
                      variant="outline"
                      className="h-12 w-12 rounded-full border-zinc-200 hover:bg-zinc-100 text-zinc-700 p-0 shrink-0 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </Button>
                    <Button 
                      onClick={handleCreateBucket} 
                      disabled={createLoading}
                      className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full shadow-md shadow-brand-purple/20 cursor-pointer"
                    >
                      {createLoading ? "Creating..." : "Confirm & Launch"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-display font-extrabold text-zinc-950 flex items-center gap-2">
                <PiggyBank size={20} className="text-brand-purple" />
                Deposit to {selectedBucket.name}
              </h3>
              <button 
                onClick={() => { setShowDepositModal(false); setDepositStep(1); }} 
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {depositStep === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                        Amount (USD)
                      </label>
                      <button 
                        onClick={() => setDepositAmount(availableUSD)}
                        className="text-xs font-mono font-bold text-brand-purple hover:underline cursor-pointer"
                      >
                        Available: ${availableUSD.toFixed(2)} USD (Max)
                      </button>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={depositAmount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setDepositAmount(isNaN(val) ? "" : Math.max(0, val));
                      }}
                      className={cn(
                        "w-full h-14 bg-zinc-50 border rounded-2xl px-4 text-2xl font-mono font-black text-zinc-950 outline-none transition-colors",
                        isDepositInsufficient ? "border-red-500 focus:border-red-500 focus:bg-white" : "border-zinc-200 focus:border-brand-purple focus:bg-white"
                      )}
                      placeholder="0.00"
                    />
                  </div>

                  {isDepositInsufficient && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-sans leading-snug">
                        Insufficient balance. You need {finalAmount.toFixed(2)} USD, but you only have {availableUSD.toFixed(2)} USD.
                      </p>
                    </div>
                  )}

                  {isExceedingGoal && !isDepositInsufficient && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-sans leading-snug">
                        This deposit exceeds the remaining goal of {remainingAmount.toFixed(2)} USD. It will be capped at exactly {remainingAmount.toFixed(2)} USD to complete the goal.
                      </p>
                    </div>
                  )}

                  {selectedBucket.savingsType === "target" && (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 font-mono text-xs">
                      <div className="flex justify-between text-zinc-600 font-sans">
                        <span>Current Target Progress</span>
                        <span>{((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-300", selectedBucket.color)}
                          style={{ width: `${Math.min((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                        <span>Goal Target: ${selectedBucket.targetAmount.toLocaleString()} USD</span>
                        <span className="text-brand-purple font-bold">Remaining: ${remainingAmount.toFixed(2)} USD left</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => {
                      if (!depositAmount || depositAmount <= 0) return toast.error("Enter a valid deposit amount");
                      setDepositStep(2);
                    }} 
                    disabled={!depositAmount || depositAmount <= 0 || isDepositInsufficient}
                    className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-between px-6 disabled:opacity-50 shadow-md shadow-brand-purple/20 cursor-pointer"
                  >
                    Continue to Confirmation <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Savings Bucket</span>
                      <span className="font-bold text-zinc-950">{selectedBucket.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Deposit Amount</span>
                      <span className="font-bold text-emerald-600">
                        +${finalAmount.toFixed(2)} USD
                        {isExceedingGoal && <span className="ml-1 text-xs text-amber-700 font-normal font-sans">(Capped)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">New Projected Balance</span>
                      <span className="font-bold text-zinc-950">${(selectedBucket.currentAmount + finalAmount).toFixed(2)} USD</span>
                    </div>
                    
                    {selectedBucket.savingsType === "target" && (
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-zinc-500 font-sans">
                          <span>Projected Goal Progress</span>
                          <span className="text-brand-purple font-bold">
                            {Math.min(((selectedBucket.currentAmount + finalAmount) / selectedBucket.targetAmount) * 100, 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-300", selectedBucket.color)}
                            style={{ width: `${Math.min(((selectedBucket.currentAmount + finalAmount) / selectedBucket.targetAmount) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setDepositStep(1)} 
                      variant="outline"
                      className="h-12 w-12 rounded-full border-zinc-200 hover:bg-zinc-100 text-zinc-700 p-0 shrink-0 cursor-pointer"
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Button 
                      onClick={handleDepositSubmit} 
                      disabled={depositLoading}
                      className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full shadow-md shadow-brand-purple/20 cursor-pointer"
                    >
                      {depositLoading ? "Depositing..." : "Confirm Deposit"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h3 className="text-xl font-display font-extrabold text-zinc-950 flex items-center gap-2">
                <ShieldAlert size={20} className="text-brand-purple" />
                Confirm Withdrawal
              </h3>
              <button 
                onClick={() => { setShowWithdrawModal(false); }} 
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Warning Messages based on Savings rules */}
              {selectedBucket.savingsType === "piggybank" && !isFreeQuarterlyDate() && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-sans leading-snug">
                    <strong>Breaking Penalty:</strong> Today is not a designated quarterly withdrawal day. Withdrawing now incurs a <strong>2.5% penalty breaking fee</strong> on the withdrawn amount.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "target" && (selectedBucket.status !== "completed" || (selectedBucket.maturityDate && new Date() < new Date(selectedBucket.maturityDate))) && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-sans leading-snug">
                    <strong>Early Break Warning:</strong> Your goal target is either incomplete or the deadline hasn&apos;t passed. Breaking early forfeits yield and charges a <strong>2.5% penalty breaking fee</strong>.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "flex" && (selectedBucket.withdrawalCountThisMonth >= 4) && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-sans leading-snug">
                    <strong>Interest Loss Alert:</strong> You have reached your limit of 4 withdrawals this month. Withdrawing again will drop your Flex Wallet interest rate to <strong>0%</strong> for the current month.
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                You are about to make a <strong>total withdrawal</strong> from your savings account <strong>&quot;{selectedBucket.name}&quot;</strong>. This will empty the account and transfer the funds back to your spendable wallet balance.
              </p>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                  <span className="text-zinc-500 font-sans">Total Savings Balance</span>
                  <span className="font-bold text-zinc-950">${withdrawAmount.toFixed(2)} USD</span>
                </div>

                {calculatedPenalty > 0 && (
                  <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                    <span className="text-red-600 font-sans">2.5% Breaking Fee</span>
                    <span className="font-bold text-red-600">-${calculatedPenalty.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                  <span className="text-zinc-500 font-sans">Net Credited to Wallet</span>
                  <span className="font-bold text-emerald-600">${netWithdrawalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowWithdrawModal(false)} 
                  variant="outline"
                  className="h-12 flex-1 border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-sans font-bold rounded-full cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdrawSubmit} 
                  disabled={withdrawLoading || withdrawAmount <= 0}
                  className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full shadow-md shadow-brand-purple/20 cursor-pointer"
                >
                  {withdrawLoading ? "Withdrawing..." : "Confirm & Empty"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
