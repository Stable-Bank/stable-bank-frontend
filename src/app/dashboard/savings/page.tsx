"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, Plus, ArrowRight, X, ArrowLeft, Target, Palette, 
  AlertCircle, CheckCircle, Lock, Unlock, Zap, ShieldAlert, 
  Sparkles, Calendar, TrendingUp, Wallet 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { apiClient } from "@/config/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40", className)}>
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
    { id: "yellow", value: "bg-brand-yellow text-black" },
    { id: "green", value: "bg-[#319F43]" },
    { id: "blue", value: "bg-blue-500" },
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
    <div className="flex animate-in fade-in flex-col gap-10 pb-20">
      {/* Header & Main Cards */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            StableSavings Hub
          </h1>
          <p className="text-brand-white/40 text-base max-w-[500px]">
            Grow your crypto capital securely using high-yield savings products powered by smart contract ledgers.
          </p>
        </div>
        <Button 
          onClick={() => { resetCreateForm(); setShowCreate(true); }}
          className="bg-white text-black font-bold rounded-xl h-12 w-full md:w-auto px-6 shrink-0"
        >
          <Plus size={18} className="mr-2" />
          Create Savings Account
        </Button>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Savings Balance</span>
            <PiggyBank size={18} className="text-brand-purple" />
          </div>
          <h3 className="text-3xl font-black text-white">${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-sm text-white/40 mt-2">Allocated across all accounts</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Yield Interest Accrued</span>
            <TrendingUp size={18} className="text-brand-yellow" />
          </div>
          <h3 className="text-3xl font-black text-brand-yellow">${totalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-sm text-white/40 mt-2">Yield distributed to Flex account</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full blur-xl transition-all group-hover:scale-125" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Available Spendable Balance</span>
            <Wallet size={18} className="text-green-500" />
          </div>
          <h3 className="text-3xl font-black text-white">${availableUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</h3>
          <p className="text-sm text-white/40 mt-2">Spendable wallet USD balance</p>
        </GlassCard>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {(["all", "piggybank", "safelock", "target", "flex"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300",
              filterTab === tab
                ? "bg-white/10 text-white shadow-lg border border-white/10"
                : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
            )}
          >
            {tab === "all" ? "All Accounts" : tab === "piggybank" ? "Piggybank (18%)" : tab === "safelock" ? "SafeLock (Up to 22%)" : tab === "target" ? "Target Savings (12%)" : "Flex Wallet (12%)"}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-64 animate-pulse bg-white/5 rounded-2xl" />)
        ) : filteredBuckets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <PiggyBank size={48} className="text-white/20 mb-4" />
            <p className="text-white/40 font-medium">No savings accounts match this type.</p>
            <Button 
              onClick={() => { resetCreateForm(); setShowCreate(true); }}
              variant="link" 
              className="text-brand-purple font-bold mt-2"
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
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white", bucket.color)}>
                      {isSafeLock ? <Lock size={20} /> : isPiggy ? <PiggyBank size={20} /> : isTarget ? <Target size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{bucket.name}</h3>
                      <span className="text-md font-bold text-white/40 uppercase tracking-wider">
                        {bucket.savingsType} • {bucket.interestRate * 100}% APY
                      </span>
                    </div>
                  </div>
                  {bucket.status === "completed" && (
                    <CheckCircle size={18} className="text-brand-yellow animate-pulse" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-black text-white">${bucket.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    {isTarget && (
                      <span className="text-sm text-white/40 ml-1">of ${bucket.targetAmount.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Target Savings Progress Bar */}
                  {isTarget && (
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", bucket.color)}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-md text-white/40 font-bold">
                        <span>{progress.toFixed(1)}% Completed</span>
                        <span>${remaining.toFixed(2)} left</span>
                      </div>
                    </div>
                  )}

                  {/* SafeLock Maturity Indicators */}
                  {isSafeLock && bucket.maturityDate && (
                    <div className="flex items-center justify-between text-sm text-white/40 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand-purple" />
                        <span>Maturity Date:</span>
                      </div>
                      <span className="font-bold text-white">
                        {new Date(bucket.maturityDate).toLocaleDateString()} {daysLeft > 0 ? `(${daysLeft}d left)` : "(Matured)"}
                      </span>
                    </div>
                  )}

                  {/* Piggybank Auto-save detail */}
                  {isPiggy && bucket.autosaveAmount > 0 && (
                    <div className="flex items-center justify-between text-sm text-white/40 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <span>Autosave:</span>
                      <span className="font-bold text-white">
                        ${bucket.autosaveAmount} {bucket.autosaveFrequency}
                      </span>
                    </div>
                  )}

                  {/* Flex Account withdrawal count */}
                  {isFlex && (
                    <div className="flex items-center justify-between text-sm text-white/40 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                      <span>Withdrawals this month:</span>
                      <span className={cn("font-bold", bucket.withdrawalCountThisMonth >= 4 ? "text-red-500" : "text-white")}>
                        {bucket.withdrawalCountThisMonth || 0} / 4
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  <Button 
                    onClick={() => openDepositModal(bucket)}
                    className="h-10 bg-white/5 hover:bg-white/10 text-white border border-white/5 font-bold text-sm rounded-xl"
                    disabled={bucket.status === "completed" && isTarget}
                  >
                    Quick Deposit
                  </Button>
                  <Button 
                    onClick={() => openWithdrawModal(bucket)}
                    className="h-10 bg-white text-black hover:bg-white/90 font-bold text-sm rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0E121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-brand-purple" />
                Create Savings Account
              </h3>
              <button onClick={() => { setShowCreate(false); }} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors">
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
                      className="p-5 text-left rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-brand-purple/5 hover:border-brand-purple/30 transition-all duration-300 space-y-2 group"
                    >
                      <PiggyBank size={24} className="text-brand-purple group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white text-lg">Piggybank</h4>
                      <p className="text-md text-white/40 leading-snug">Core disciplined saving. 18% APY. Free withdrawals only on quarterly days.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("safelock"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-brand-purple/5 hover:border-brand-purple/30 transition-all duration-300 space-y-2 group"
                    >
                      <Lock size={24} className="text-brand-yellow group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white text-lg">SafeLock</h4>
                      <p className="text-md text-white/40 leading-snug">Fixed term lump-sum savings. Up to 22% APY. Strictly locked until maturity.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("target"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-brand-purple/5 hover:border-brand-purple/30 transition-all duration-300 space-y-2 group"
                    >
                      <Target size={24} className="text-[#319F43] group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white text-lg">Target Savings</h4>
                      <p className="text-md text-white/40 leading-snug">Goal-oriented buckets. 12% APY. Set deadline and penalty if broken early.</p>
                    </button>

                    <button
                      onClick={() => { setSavingsType("flex"); setCreateStep(2); }}
                      className="p-5 text-left rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-brand-purple/5 hover:border-brand-purple/30 transition-all duration-300 space-y-2 group"
                    >
                      <Unlock size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white text-lg">Flex Wallet</h4>
                      <p className="text-md text-white/40 leading-snug">Flexible emergency cash. 12% APY. Interest drops to 0% if withdrawn &gt;4 times/mo.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Configure Savings Details */}
              {createStep === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-widest mb-2">
                    <button onClick={() => setCreateStep(1)} className="hover:text-white flex items-center gap-1 transition-colors">
                      <ArrowLeft size={12} /> Back to Products
                    </button>
                    <span>• Config: {savingsType.toUpperCase()}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-md font-bold text-white/40 uppercase tracking-wider">Account Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={savingsType === "target" ? "e.g. Dream House" : "e.g. Personal Stash"}
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                    />
                  </div>

                  {/* Initial Deposit (Applicable for all) */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-md font-bold text-white/40 uppercase tracking-wider">Initial Deposit (USD)</label>
                      <span className="text-md font-bold text-brand-purple">Wallet Balance: {availableUSD.toFixed(2)}</span>
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
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                    />
                  </div>

                  {/* SafeLock Specific Details */}
                  {savingsType === "safelock" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-md font-bold text-white/40 uppercase tracking-wider">Maturity Unlock Date</label>
                        <input
                          type="date"
                          value={maturityDate}
                          onChange={(e) => setMaturityDate(e.target.value)}
                          className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-md font-bold text-white/40 uppercase tracking-wider">Interest Payout Preference</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setInterestPayout("maturity")}
                            className={cn(
                              "h-12 rounded-xl border font-bold text-sm transition-all",
                              interestPayout === "maturity" ? "bg-white text-black border-white" : "bg-black/40 text-white/40 border-white/10 hover:border-white/20"
                            )}
                          >
                            Pay at Maturity
                          </button>
                          <button
                            type="button"
                            onClick={() => setInterestPayout("upfront")}
                            className={cn(
                              "h-12 rounded-xl border font-bold text-sm transition-all",
                              interestPayout === "upfront" ? "bg-white text-black border-white" : "bg-black/40 text-white/40 border-white/10 hover:border-white/20"
                            )}
                          >
                            Pay Upfront (Immediate)
                          </button>
                        </div>
                        <p className="text-[9px] text-white/30 leading-snug mt-1">
                          {interestPayout === "upfront" 
                            ? "Interest will be calculated and paid to your wallet immediately upon locking."
                            : "Accumulated interest will be released to your wallet together with your principal when it matures."}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Piggybank Specific Details */}
                  {savingsType === "piggybank" && (
                    <div className="grid grid-cols-2 gap-3 bg-white/[0.01] p-4 border border-white/5 rounded-2xl">
                      <div className="space-y-2">
                        <label className="text-md font-bold text-white/40 uppercase tracking-wider">Autosave Amount</label>
                        <input
                          type="number"
                          value={autosaveAmount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setAutosaveAmount(isNaN(val) ? "" : Math.max(0, val));
                          }}
                          placeholder="0.00"
                          className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-md font-bold text-white/40 uppercase tracking-wider">Autosave Frequency</label>
                        <select
                          value={autosaveFrequency}
                          onChange={(e: any) => setAutosaveFrequency(e.target.value)}
                          className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
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
                        <div className="space-y-2">
                          <label className="text-md font-bold text-white/40 uppercase tracking-wider">Target Goal ($)</label>
                          <input
                            type="number"
                            value={targetAmount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setTargetAmount(isNaN(val) ? "" : Math.max(0, val));
                            }}
                            placeholder="e.g. 5000"
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-md font-bold text-white/40 uppercase tracking-wider">Target Date</label>
                          <input
                            type="date"
                            value={maturityDate}
                            onChange={(e) => setMaturityDate(e.target.value)}
                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white font-medium outline-none focus:border-brand-purple transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-md font-bold text-white/40 uppercase tracking-wider">Color Theme</label>
                        <div className="flex items-center gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => setSelectedColor(color.value)}
                              className={cn(
                                "h-8 w-8 rounded-full transition-all duration-300 border-2",
                                color.value.split(" ")[0], 
                                selectedColor === color.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
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
                    className="w-full h-12 mt-4 bg-white text-black hover:bg-white/90 font-bold rounded-xl flex items-center justify-between px-6 disabled:opacity-50"
                  >
                    Review & Confirm <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {/* Step 3: Confirmation Summary */}
              {createStep === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-purple uppercase tracking-widest mb-2">
                    <button onClick={() => setCreateStep(2)} className="hover:text-white flex items-center gap-1 transition-colors">
                      <ArrowLeft size={12} /> Back to Config
                    </button>
                    <span>• Review Summary</span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">Product Type</span>
                      <span className="font-bold text-white uppercase">{savingsType}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">Account Name</span>
                      <span className="font-bold text-white">{name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                      <span className="text-white/40">Interest Rate</span>
                      <span className="font-bold text-brand-yellow">
                        {savingsType === "safelock" ? "Up to 22%" : savingsType === "piggybank" ? "18%" : "12%"} APY
                      </span>
                    </div>
                    
                    {initialDeposit && Number(initialDeposit) > 0 && (
                      <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                        <span className="text-white/40">Initial Deposit</span>
                        <span className="font-bold text-[#E9F2A3]">${Number(initialDeposit).toFixed(2)} USD</span>
                      </div>
                    )}

                    {savingsType === "safelock" && (
                      <>
                        <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                          <span className="text-white/40">Maturity Date</span>
                          <span className="font-bold text-white">{new Date(maturityDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                          <span className="text-white/40">Interest Payout</span>
                          <span className="font-bold text-white uppercase">{interestPayout}</span>
                        </div>
                      </>
                    )}

                    {savingsType === "target" && (
                      <>
                        <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                          <span className="text-white/40">Goal Target</span>
                          <span className="font-bold text-white">${Number(targetAmount).toLocaleString()} USD</span>
                        </div>
                        {maturityDate && (
                          <div className="flex justify-between border-b border-white/5 pb-2 text-sm">
                            <span className="text-white/40">Target Deadline</span>
                            <span className="font-bold text-white">{new Date(maturityDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setCreateStep(2)} 
                      variant="outline"
                      className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 text-white p-0 shrink-0"
                    >
                      <ArrowLeft size={16} />
                    </Button>
                    <Button 
                      onClick={handleCreateBucket} 
                      disabled={createLoading}
                      className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 font-bold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0E121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PiggyBank size={20} className="text-brand-purple" />
                Deposit to {selectedBucket.name}
              </h3>
              <button 
                onClick={() => { setShowDepositModal(false); setDepositStep(1); }} 
                className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {depositStep === 1 ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-white/40 uppercase tracking-widest">
                        Amount (USD)
                      </label>
                      <button 
                        onClick={() => setDepositAmount(availableUSD)}
                        className="text-sm font-bold text-brand-purple hover:text-brand-purple/80 transition-colors"
                      >
                        Available: {availableUSD.toFixed(2)} USD (Max)
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
                        "w-full h-14 bg-black/40 border rounded-xl px-4 text-2xl font-black text-white outline-none transition-colors",
                        isDepositInsufficient ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-brand-purple"
                      )}
                      placeholder="0.00"
                    />
                  </div>

                  {isDepositInsufficient && (
                    <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-md text-red-500/80 leading-snug">
                        Insufficient balance. You need {finalAmount.toFixed(2)} USD, but you only have {availableUSD.toFixed(2)} USD.
                      </p>
                    </div>
                  )}

                  {isExceedingGoal && !isDepositInsufficient && (
                    <div className="flex items-start gap-3 p-3 bg-brand-yellow/5 border border-brand-yellow/10 rounded-xl">
                      <AlertCircle size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                      <p className="text-md text-brand-yellow/80 leading-snug">
                        This deposit exceeds the remaining goal of {remainingAmount.toFixed(2)} USD. It will be capped at exactly {remainingAmount.toFixed(2)} USD to complete the goal.
                      </p>
                    </div>
                  )}

                  {selectedBucket.savingsType === "target" && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                      <div className="flex justify-between text-sm text-white/60">
                        <span>Current Target Progress</span>
                        <span>{((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-300", selectedBucket.color)}
                          style={{ width: `${Math.min((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-white/40 pt-1">
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
                    className="w-full h-14 bg-white text-black hover:bg-white/90 font-bold rounded-xl flex items-center justify-between px-6 disabled:opacity-50"
                  >
                    Continue to Confirmation <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/40">Savings Bucket</span>
                      <span className="text-sm font-bold text-white">{selectedBucket.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/40">Deposit Amount</span>
                      <span className="text-sm font-bold text-[#E9F2A3]">
                        +${finalAmount.toFixed(2)} USD
                        {isExceedingGoal && <span className="ml-1 text-sm text-brand-yellow font-normal">(Capped)</span>}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/40">New Projected Balance</span>
                      <span className="text-sm font-bold text-white">${(selectedBucket.currentAmount + finalAmount).toFixed(2)} USD</span>
                    </div>
                    
                    {selectedBucket.savingsType === "target" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-white/40">
                          <span>Projected Goal Progress</span>
                          <span className="text-[#E9F2A3] font-bold">
                            {Math.min(((selectedBucket.currentAmount + finalAmount) / selectedBucket.targetAmount) * 100, 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
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
                      className="h-14 w-14 rounded-xl border-white/10 hover:bg-white/5 text-white p-0 shrink-0"
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Button 
                      onClick={handleDepositSubmit} 
                      disabled={depositLoading}
                      className="h-14 flex-1 bg-brand-purple hover:bg-brand-purple/90 font-bold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0E121C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert size={20} className="text-brand-purple" />
                Confirm Withdrawal
              </h3>
              <button 
                onClick={() => { setShowWithdrawModal(false); }} 
                className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Warning Messages based on Savings rules */}
              {selectedBucket.savingsType === "piggybank" && !isFreeQuarterlyDate() && (
                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-md text-red-500/80 leading-snug">
                    <strong>Breaking Penalty:</strong> Today is not a designated quarterly withdrawal day. Withdrawing now incurs a <strong>2.5% penalty breaking fee</strong> on the withdrawn amount.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "target" && (selectedBucket.status !== "completed" || (selectedBucket.maturityDate && new Date() < new Date(selectedBucket.maturityDate))) && (
                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-md text-red-500/80 leading-snug">
                    <strong>Early Break Warning:</strong> Your goal target is either incomplete or the deadline hasn't passed. Breaking early forfeits yield and charges a <strong>2.5% penalty breaking fee</strong>.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "flex" && (selectedBucket.withdrawalCountThisMonth >= 4) && (
                <div className="flex items-start gap-3 p-3 bg-brand-yellow/5 border border-brand-yellow/10 rounded-xl">
                  <AlertCircle size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                  <p className="text-md text-brand-yellow/80 leading-snug">
                    <strong>Interest Loss Alert:</strong> You have reached your limit of 4 withdrawals this month. Withdrawing again will drop your Flex Wallet interest rate to <strong>0%</strong> for the current month.
                  </p>
                </div>
              )}

              <p className="text-sm text-white/50 leading-relaxed">
                You are about to make a <strong>total withdrawal</strong> from your savings account <strong>"{selectedBucket.name}"</strong>. This will empty the account and transfer the funds back to your spendable wallet balance.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/40">Total Savings Balance</span>
                  <span className="text-sm font-bold text-white">${withdrawAmount.toFixed(2)} USD</span>
                </div>

                {calculatedPenalty > 0 && (
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-sm text-red-500/80">2.5% Breaking Fee</span>
                    <span className="text-sm font-bold text-red-500">-${calculatedPenalty.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-white/40">Net Credited to Wallet</span>
                  <span className="text-sm font-bold text-[#E9F2A3]">${netWithdrawalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowWithdrawModal(false)} 
                  variant="outline"
                  className="h-14 flex-1 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdrawSubmit} 
                  disabled={withdrawLoading || withdrawAmount <= 0}
                  className="h-14 flex-1 bg-brand-purple hover:bg-brand-purple/90 font-bold rounded-xl"
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
