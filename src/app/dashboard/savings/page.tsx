"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, Plus, ArrowRight, X, ArrowLeft, Target, 
  AlertCircle, Lock, Unlock, ShieldAlert, 
  Calendar, TrendingUp, Wallet, Check, ChevronDown, Clock,
  Coins, Zap, CalendarDays, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { apiClient } from "@/config/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-xs rounded-3xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

/* -------------------------------------------------------------------------- */
/*                         CUSTOM DROPDOWN SELECTOR                           */
/* -------------------------------------------------------------------------- */
interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

function CustomDropdown({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 rounded-2xl px-4 flex items-center justify-between text-zinc-900 font-sans text-sm font-semibold transition-all cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          {selectedOpt?.icon}
          <span>{selectedOpt?.label}</span>
        </div>
        <ChevronDown size={16} className={cn("text-zinc-500 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between text-xs font-sans font-bold transition-colors cursor-pointer",
                value === opt.value
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              )}
            >
              <div className="flex items-center gap-2.5">
                {opt.icon}
                <div>
                  <p>{opt.label}</p>
                  {opt.description && <p className="text-[11px] font-normal text-zinc-500 font-sans">{opt.description}</p>}
                </div>
              </div>
              {value === opt.value && <Check size={16} className="text-brand-purple shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                  CUSTOM DURATION & MATURITY DATE PICKER                    */
/* -------------------------------------------------------------------------- */
function CustomDurationPicker({
  value,
  onChange,
  savingsType,
}: {
  value: string;
  onChange: (dateStr: string) => void;
  savingsType: "safelock" | "target";
}) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [selectedPresetDays, setSelectedPresetDays] = useState<number>(30);

  const safelockPresets = [
    { days: 30, label: "30 Days", apr: "15% APY" },
    { days: 60, label: "60 Days", apr: "15% APY" },
    { days: 90, label: "90 Days", apr: "15% APY" },
    { days: 180, label: "180 Days", apr: "18% APY" },
    { days: 365, label: "1 Year", apr: "22% APY" },
  ];

  const targetPresets = [
    { days: 30, label: "1 Month" },
    { days: 90, label: "3 Months" },
    { days: 180, label: "6 Months" },
    { days: 365, label: "1 Year" },
  ];

  const presets = savingsType === "safelock" ? safelockPresets : targetPresets;

  const handleSelectPreset = (days: number) => {
    setSelectedPresetDays(days);
    setMode("preset");
    const target = new Date();
    target.setDate(target.getDate() + days);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
  };

  // Set default preset date on mount if empty
  useEffect(() => {
    if (!value) {
      const target = new Date();
      target.setDate(target.getDate() + 30);
      const yyyy = target.getFullYear();
      const mm = String(target.getMonth() + 1).padStart(2, "0");
      const dd = String(target.getDate()).padStart(2, "0");
      onChange(`${yyyy}-${mm}-${dd}`);
    }
  }, [value, onChange]);

  const daysRemaining = value
    ? Math.max(0, Math.ceil((new Date(value).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const currentApr = savingsType === "safelock" 
    ? (daysRemaining <= 90 ? "15% APY" : daysRemaining <= 365 ? "18% APY" : "22% APY")
    : "12% APY";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
          {savingsType === "safelock" ? "Lock Duration & Maturity" : "Target Deadline"}
        </label>
        {savingsType === "safelock" && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {currentApr}
          </span>
        )}
      </div>

      {/* Preset duration pills */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {presets.map((p) => {
          const isSelected = mode === "preset" && selectedPresetDays === p.days;
          return (
            <button
              key={p.days}
              type="button"
              onClick={() => handleSelectPreset(p.days)}
              className={cn(
                "py-2 px-2.5 rounded-xl text-center border font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs flex flex-col items-center justify-center gap-0.5",
                isSelected
                  ? "bg-brand-purple text-white border-brand-purple shadow-sm scale-[1.02]"
                  : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
              )}
            >
              <span>{p.label}</span>
              {"apr" in p && <span className={cn("text-[9px] font-sans font-semibold", isSelected ? "text-purple-200" : "text-emerald-600")}>{(p as any).apr}</span>}
            </button>
          );
        })}
      </div>

      {/* Custom Date Input Toggle */}
      <div className="pt-1">
        <div className="relative flex items-center">
          <input
            type="date"
            value={value}
            min={new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0]}
            onChange={(e) => {
              setMode("custom");
              onChange(e.target.value);
            }}
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 pl-10 text-zinc-900 font-mono text-xs font-bold outline-none focus:border-brand-purple focus:bg-white transition-colors cursor-pointer"
          />
          <CalendarDays size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none" />
          <span className="absolute right-3.5 text-xs font-mono font-bold text-zinc-500 pointer-events-none">
            {value ? `${new Date(value).toLocaleDateString()} (${daysRemaining}d)` : "Select date"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         MAIN SAVINGS PAGE COMPONENT                        */
/* -------------------------------------------------------------------------- */
export default function SavingsPage() {
  const { user } = useAuth();
  const { balance, refresh: refreshBalance } = useBalance((user as any)?.primaryWalletAddress || user?.walletAddress);

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
    { id: "purple", value: "bg-brand-purple", label: "Purple" },
    { id: "emerald", value: "bg-emerald-600", label: "Emerald" },
    { id: "blue", value: "bg-blue-600", label: "Blue" },
    { id: "amber", value: "bg-amber-500 text-black", label: "Amber" },
    { id: "dark", value: "bg-zinc-800", label: "Obsidian" },
    { id: "rose", value: "bg-rose-600", label: "Rose" },
  ];

  const autosaveOptions: SelectOption[] = [
    { value: "none", label: "Manual Only", description: "Deposit on demand whenever you choose", icon: <Wallet size={16} className="text-zinc-500" /> },
    { value: "daily", label: "Daily Autosave", description: "Auto-debit fixed amount every 24 hours", icon: <Clock size={16} className="text-brand-purple" /> },
    { value: "weekly", label: "Weekly Autosave", description: "Auto-debit fixed amount every Monday", icon: <Calendar size={16} className="text-emerald-600" /> },
    { value: "monthly", label: "Monthly Autosave", description: "Auto-debit fixed amount on the 1st of every month", icon: <Coins size={16} className="text-amber-500" /> },
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
      const isMatured = selectedBucket.maturityDate ? (new Date() >= new Date(selectedBucket.maturityDate)) : false;
      return (isGoalCompleted || isMatured) ? 0 : amount * 0.025;
    }
    return 0; // safelock is locked completely, flex has no penalty fees
  };

  const withdrawAmount = selectedBucket ? selectedBucket.currentAmount : 0;
  const calculatedPenalty = getWithdrawalPenalty(withdrawAmount);
  const netWithdrawalAmount = Math.max(0, withdrawAmount - calculatedPenalty);

  // Totals calculations
  const totalSavings = buckets.reduce((sum, b) => sum + (b.currentAmount || 0), 0);
  const totalYield = buckets.reduce((sum, b) => sum + (b.yieldEarned || 0), 0);

  const fetchBuckets = async () => {
    try {
      const res: any = await apiClient.get("/savings");
      let list: any[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (Array.isArray(res?.data?.buckets)) {
        list = res.data.buckets;
      } else if (Array.isArray(res?.buckets)) {
        list = res.buckets;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (res && typeof res === "object") {
        const potential = res.data || res.buckets;
        if (Array.isArray(potential)) list = potential;
      }
      setBuckets(list);
    } catch (error) {
      console.error("Failed to fetch buckets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, [user]);

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

      toast.success("Savings account successfully created! Funds allocated.");
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
      toast.success(`Successfully deposited $${finalAmount.toFixed(2)} USD to ${selectedBucket.name}`);
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
        toast.success(`Withdrawal completed: $${netCredited.toFixed(2)} USD returned. Charged $${penalty.toFixed(2)} USD early breaking fee.`);
      } else {
        toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)} USD back to your spending wallet.`);
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
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 tracking-tight">
              StableSavings Hub
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Zap size={12} className="fill-emerald-600" />
              Up to 22% APY
            </span>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-[560px] font-sans mt-0.5">
            Automated compound interest vaults and disciplined savings buckets backed directly by Bridge.xyz multi-chain rails.
          </p>
        </div>

        <Button 
          onClick={() => { resetCreateForm(); setShowCreate(true); }}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl h-11 w-full md:w-auto px-6 shrink-0 shadow-md shadow-brand-purple/20 cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus size={18} />
          <span>Create Savings Account</span>
        </Button>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Savings Balance</span>
            <div className="h-10 w-10 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
              <PiggyBank size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-zinc-950">${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Locked & earning interest across all accounts</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Yield Interest Accrued</span>
            <div className="h-10 w-10 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-[#556000]">${totalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Accumulated daily compound earnings</p>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Available Spendable Balance</span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Wallet size={20} />
            </div>
          </div>
          <h3 className="text-3xl font-mono font-black text-zinc-950">${availableUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</h3>
          <p className="text-xs text-zinc-500 font-sans mt-2">Available for cards & transfers</p>
        </GlassCard>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {(["all", "piggybank", "safelock", "target", "flex"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-sans font-bold rounded-xl transition-all duration-200 cursor-pointer",
              filterTab === tab
                ? "bg-brand-purple text-white shadow-xs"
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
          Array(3).fill(0).map((_, i) => <div key={i} className="h-64 animate-pulse bg-zinc-100 rounded-3xl" />)
        ) : filteredBuckets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50 text-center">
            <div className="h-16 w-16 rounded-3xl bg-purple-50 text-brand-purple flex items-center justify-center border border-brand-purple/20 mb-4 shadow-2xs">
              <PiggyBank size={32} />
            </div>
            <h3 className="text-lg font-display font-bold text-zinc-900">No active savings accounts</h3>
            <p className="text-zinc-500 font-sans text-xs max-w-[320px] mt-1">
              Start building wealth with automated yield and disciplined savings targets.
            </p>
            <Button 
              onClick={() => { resetCreateForm(); setShowCreate(true); }}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-10 px-5 text-xs mt-4 shadow-sm cursor-pointer"
            >
              Create Account Now
            </Button>
          </div>
        ) : (
          filteredBuckets.map((bucket) => {
            const isSafeLock = bucket.savingsType === "safelock";
            const isTarget = bucket.savingsType === "target";
            const isPiggy = bucket.savingsType === "piggybank";
            const isFlex = bucket.savingsType === "flex";

            const progress = isTarget && bucket.targetAmount > 0 
              ? Math.min((bucket.currentAmount / bucket.targetAmount) * 100, 100) 
              : 0;
            const remaining = isTarget ? Math.max(0, bucket.targetAmount - bucket.currentAmount) : 0;

            const daysLeft = bucket.maturityDate 
              ? Math.max(0, Math.ceil((new Date(bucket.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
              : 0;

            return (
              <GlassCard key={bucket._id} className="flex flex-col gap-6 justify-between border-t-4 border-t-brand-purple hover:border-brand-purple/60 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs", bucket.color)}>
                      {isSafeLock ? <Lock size={20} /> : isPiggy ? <PiggyBank size={20} /> : isTarget ? <Target size={20} /> : <Unlock size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-zinc-950 leading-tight">{bucket.name}</h3>
                      <span className="text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                        {bucket.savingsType} • {bucket.interestRate * 100}% APY
                      </span>
                    </div>
                  </div>
                  {bucket.status === "completed" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      COMPLETED
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-2xl font-mono font-black text-zinc-950">${bucket.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    {isTarget && (
                      <span className="text-xs font-mono text-zinc-400 ml-1.5 font-bold">/ ${bucket.targetAmount.toLocaleString()} USD</span>
                    )}
                  </div>

                  {/* Target Savings Progress Bar */}
                  {isTarget && (
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
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
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-brand-purple" />
                        <span>Maturity:</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">
                        {new Date(bucket.maturityDate).toLocaleDateString()} {daysLeft > 0 ? `(${daysLeft}d left)` : "(Matured)"}
                      </span>
                    </div>
                  )}

                  {/* Piggybank Auto-save detail */}
                  {isPiggy && bucket.autosaveAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                      <span>Autosave:</span>
                      <span className="font-mono font-bold text-zinc-900">
                        ${bucket.autosaveAmount} ({bucket.autosaveFrequency})
                      </span>
                    </div>
                  )}

                  {/* Flex Account withdrawal count */}
                  {isFlex && (
                    <div className="flex items-center justify-between text-xs text-zinc-600 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
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
                    className="h-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-sans font-bold text-xs rounded-xl cursor-pointer shadow-2xs"
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

      {/* ========================================================================= */}
      {/*                    MODAL 1: CREATE SAVINGS ACCOUNT                        */}
      {/* ========================================================================= */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-zinc-950">
                    Create Savings Account
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Step {createStep} of 3 • {createStep === 1 ? "Select Product" : createStep === 2 ? "Configure Rules" : "Review Summary"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreate(false)} 
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* STEP 1: Product Selection */}
              {createStep === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                  <p className="text-xs font-sans text-zinc-600 leading-relaxed">
                    Choose the savings instrument that matches your financial timeline and yield goals:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Piggybank */}
                    <button
                      type="button"
                      onClick={() => { setSavingsType("piggybank"); setCreateStep(2); }}
                      className="p-4 text-left rounded-2xl border border-zinc-200 bg-zinc-50/80 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <PiggyBank size={22} className="text-brand-purple group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-brand-purple">18% APR</span>
                      </div>
                      <h4 className="font-display font-bold text-zinc-950 text-sm">Piggybank</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">
                        Disciplined daily/weekly savings. Free penalty-less withdrawals on quarterly dates.
                      </p>
                    </button>

                    {/* SafeLock */}
                    <button
                      type="button"
                      onClick={() => { setSavingsType("safelock"); setCreateStep(2); }}
                      className="p-4 text-left rounded-2xl border border-zinc-200 bg-zinc-50/80 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <Lock size={22} className="text-amber-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Up to 22%</span>
                      </div>
                      <h4 className="font-display font-bold text-zinc-950 text-sm">SafeLock</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">
                        Fixed-term lump-sum deposits. Strictly locked until maturity date with upfront interest option.
                      </p>
                    </button>

                    {/* Target Savings */}
                    <button
                      type="button"
                      onClick={() => { setSavingsType("target"); setCreateStep(2); }}
                      className="p-4 text-left rounded-2xl border border-zinc-200 bg-zinc-50/80 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <Target size={22} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">12% APR</span>
                      </div>
                      <h4 className="font-display font-bold text-zinc-950 text-sm">Target Goal</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">
                        Custom goal buckets for houses, travel, or gear. Withdraw fee-free once target is reached.
                      </p>
                    </button>

                    {/* Flex Wallet */}
                    <button
                      type="button"
                      onClick={() => { setSavingsType("flex"); setCreateStep(2); }}
                      className="p-4 text-left rounded-2xl border border-zinc-200 bg-zinc-50/80 hover:bg-purple-50/50 hover:border-brand-purple transition-all duration-200 space-y-2 group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <Unlock size={22} className="text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">12% APR</span>
                      </div>
                      <h4 className="font-display font-bold text-zinc-950 text-sm">Flex Wallet</h4>
                      <p className="text-xs text-zinc-500 font-sans leading-snug">
                        Emergency liquid reserve. High yield with flexible withdrawals (up to 4 free withdrawals/month).
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Configure Savings Details */}
              {createStep === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-brand-purple uppercase tracking-wider pb-1 border-b border-zinc-100">
                    <button onClick={() => setCreateStep(1)} className="hover:underline flex items-center gap-1 cursor-pointer">
                      <ArrowLeft size={13} /> Change Product
                    </button>
                    <span className="px-2 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple">{savingsType.toUpperCase()}</span>
                  </div>

                  {/* Account Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Account / Goal Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={savingsType === "target" ? "e.g. MacBook Pro M4 Fund" : "e.g. Rainy Day Reserve"}
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm font-medium shadow-2xs"
                    />
                  </div>

                  {/* Initial Deposit */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Initial Deposit (USD)</label>
                      <button 
                        type="button" 
                        onClick={() => setInitialDeposit(availableUSD)}
                        className="text-xs font-mono font-bold text-brand-purple hover:underline cursor-pointer"
                      >
                        Wallet: ${availableUSD.toFixed(2)} (Max)
                      </button>
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
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 text-zinc-900 font-mono text-sm font-bold outline-none focus:border-brand-purple focus:bg-white transition-colors shadow-2xs"
                    />

                    {/* Quick Amount Chips */}
                    <div className="flex items-center gap-2 pt-0.5">
                      {[50, 100, 250, 500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setInitialDeposit(Math.min(amt, availableUSD))}
                          className="flex-1 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          +${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SafeLock Specific: Custom Duration Picker & Payout Preference */}
                  {savingsType === "safelock" && (
                    <div className="space-y-4 pt-1">
                      <CustomDurationPicker 
                        value={maturityDate}
                        onChange={setMaturityDate}
                        savingsType="safelock"
                      />

                      {/* Interest Payout Preference Radio Cards */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Interest Payout Option</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setInterestPayout("maturity")}
                            className={cn(
                              "p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer shadow-2xs",
                              interestPayout === "maturity"
                                ? "bg-purple-50/50 border-brand-purple ring-2 ring-brand-purple/20 text-zinc-950"
                                : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                            )}
                          >
                            <span className="font-display font-bold text-xs">At Maturity</span>
                            <span className="text-[10px] font-sans text-zinc-500 leading-snug">Principal & interest released together upon unlock.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setInterestPayout("upfront")}
                            className={cn(
                              "p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer shadow-2xs",
                              interestPayout === "upfront"
                                ? "bg-purple-50/50 border-brand-purple ring-2 ring-brand-purple/20 text-zinc-950"
                                : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                            )}
                          >
                            <span className="font-display font-bold text-xs text-brand-purple flex items-center gap-1">
                              Upfront Instant <Zap size={11} className="fill-brand-purple" />
                            </span>
                            <span className="text-[10px] font-sans text-zinc-500 leading-snug">Full interest credited to wallet immediately upon locking.</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Piggybank Specific: Custom Autosave Dropdown */}
                  {savingsType === "piggybank" && (
                    <div className="space-y-4 pt-1 bg-zinc-50/80 p-4 border border-zinc-200 rounded-3xl">
                      <CustomDropdown
                        label="Autosave Frequency"
                        value={autosaveFrequency}
                        onChange={(val: any) => setAutosaveFrequency(val)}
                        options={autosaveOptions}
                      />

                      {autosaveFrequency !== "none" && (
                        <div className="space-y-1.5 animate-in fade-in duration-150">
                          <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Recurring Autosave Amount ($)</label>
                          <input
                            type="number"
                            min="1"
                            value={autosaveAmount}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setAutosaveAmount(isNaN(val) ? "" : Math.max(0, val));
                            }}
                            placeholder="e.g. 20.00"
                            className="w-full h-11 bg-white border border-zinc-200 rounded-2xl px-4 text-zinc-900 font-mono text-sm font-bold outline-none focus:border-brand-purple transition-colors shadow-2xs"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Target Savings Specific: Goal Target, Deadline & Colors */}
                  {savingsType === "target" && (
                    <div className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Goal Target Amount ($)</label>
                        <input
                          type="number"
                          min="1"
                          value={targetAmount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setTargetAmount(isNaN(val) ? "" : Math.max(0, val));
                          }}
                          placeholder="e.g. 5000.00"
                          className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 text-zinc-900 font-mono text-sm font-bold outline-none focus:border-brand-purple focus:bg-white transition-colors shadow-2xs"
                        />
                      </div>

                      <CustomDurationPicker 
                        value={maturityDate}
                        onChange={setMaturityDate}
                        savingsType="target"
                      />

                      {/* Custom Color Swatches */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Card Theme</label>
                        <div className="flex items-center gap-3">
                          {colors.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedColor(c.value)}
                              className={cn(
                                "h-8 w-8 rounded-full transition-all border-2 flex items-center justify-center cursor-pointer shadow-xs",
                                c.value.split(" ")[0],
                                selectedColor === c.value ? "border-zinc-950 scale-110 ring-2 ring-brand-purple/30" : "border-transparent opacity-70 hover:opacity-100"
                              )}
                            >
                              {selectedColor === c.value && <Check size={14} className="text-white" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => setCreateStep(3)} 
                    disabled={!name || (savingsType === "target" && (!targetAmount || targetAmount <= 0))}
                    className="w-full h-12 mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl flex items-center justify-between px-6 disabled:opacity-50 shadow-md shadow-brand-purple/20 cursor-pointer transition-transform hover:scale-[1.01]"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {/* STEP 3: Review & Launch Summary */}
              {createStep === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider pb-1 border-b border-zinc-100">
                    <button onClick={() => setCreateStep(2)} className="hover:underline flex items-center gap-1 cursor-pointer">
                      <ArrowLeft size={13} /> Edit Config
                    </button>
                    <span>• Confirmation</span>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-200/90 rounded-3xl p-5 space-y-3 font-mono text-xs shadow-2xs">
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Product Type</span>
                      <span className="font-bold text-zinc-950 uppercase">{savingsType}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Account Name</span>
                      <span className="font-bold text-zinc-950">{name}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Compound APY</span>
                      <span className="font-bold text-brand-purple">
                        {savingsType === "safelock" ? "Up to 22%" : savingsType === "piggybank" ? "18%" : "12%"} APY
                      </span>
                    </div>

                    {initialDeposit && Number(initialDeposit) > 0 && (
                      <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                        <span className="text-zinc-500 font-sans">Initial Deposit</span>
                        <span className="font-bold text-emerald-600">+${Number(initialDeposit).toFixed(2)} USD</span>
                      </div>
                    )}

                    {savingsType === "safelock" && (
                      <>
                        <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                          <span className="text-zinc-500 font-sans">Maturity Unlock Date</span>
                          <span className="font-bold text-zinc-900">{new Date(maturityDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                          <span className="text-zinc-500 font-sans">Interest Payout Preference</span>
                          <span className="font-bold text-zinc-900 uppercase">{interestPayout}</span>
                        </div>
                      </>
                    )}

                    {savingsType === "target" && (
                      <>
                        <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                          <span className="text-zinc-500 font-sans">Goal Target</span>
                          <span className="font-bold text-zinc-900">${Number(targetAmount).toLocaleString()} USD</span>
                        </div>
                        {maturityDate && (
                          <div className="flex justify-between border-b border-zinc-200 pb-2.5">
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
                      className="h-12 w-12 rounded-2xl border-zinc-200 hover:bg-zinc-100 text-zinc-700 p-0 shrink-0 cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </Button>
                    <Button 
                      onClick={handleCreateBucket} 
                      disabled={createLoading}
                      className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl shadow-md shadow-brand-purple/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {createLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Allocating Sub-Ledger...</span>
                        </>
                      ) : (
                        <span>Confirm & Launch Account</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                        MODAL 2: DEPOSIT FUNDS                             */}
      {/* ========================================================================= */}
      {showDepositModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-zinc-950">
                    Deposit to {selectedBucket.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    {selectedBucket.savingsType.toUpperCase()} • {selectedBucket.interestRate * 100}% APY
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowDepositModal(false); setDepositStep(1); }} 
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {depositStep === 1 ? (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                        Deposit Amount (USD)
                      </label>
                      <button 
                        type="button"
                        onClick={() => setDepositAmount(availableUSD)}
                        className="text-xs font-mono font-bold text-brand-purple hover:underline cursor-pointer"
                      >
                        Available: ${availableUSD.toFixed(2)} (Max)
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={depositAmount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setDepositAmount(isNaN(val) ? "" : Math.max(0, val));
                        }}
                        className={cn(
                          "w-full h-14 bg-zinc-50 border rounded-2xl px-4 pl-8 text-2xl font-mono font-black text-zinc-950 outline-none transition-colors",
                          isDepositInsufficient ? "border-red-500 focus:border-red-500 focus:bg-white" : "border-zinc-200 focus:border-brand-purple focus:bg-white"
                        )}
                        placeholder="0.00"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-zinc-400 text-lg">$</span>
                    </div>

                    {/* Percentage Quick Picks */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[0.25, 0.5, 0.75, 1].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDepositAmount(Number((availableUSD * pct).toFixed(2)))}
                          className="py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-mono font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          {pct === 1 ? "100% (Max)" : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isDepositInsufficient && (
                    <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-2xl">
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-sans leading-snug">
                        Insufficient spendable balance. You have ${availableUSD.toFixed(2)} USD in your primary wallet.
                      </p>
                    </div>
                  )}

                  {isExceedingGoal && !isDepositInsufficient && (
                    <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                      <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-sans leading-snug">
                        This deposit exceeds the remaining goal of ${remainingAmount.toFixed(2)} USD. It will be capped at ${remainingAmount.toFixed(2)} USD to complete the goal.
                      </p>
                    </div>
                  )}

                  {selectedBucket.savingsType === "target" && (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 font-mono text-xs shadow-2xs">
                      <div className="flex justify-between text-zinc-600 font-sans">
                        <span>Goal Progress</span>
                        <span>{((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-300", selectedBucket.color)}
                          style={{ width: `${Math.min((selectedBucket.currentAmount / selectedBucket.targetAmount) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500 pt-0.5">
                        <span>Target: ${selectedBucket.targetAmount.toLocaleString()} USD</span>
                        <span className="text-brand-purple font-bold">Remaining: ${remainingAmount.toFixed(2)} USD</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => {
                      if (!depositAmount || depositAmount <= 0) return toast.error("Enter a valid deposit amount");
                      setDepositStep(2);
                    }} 
                    disabled={!depositAmount || depositAmount <= 0 || isDepositInsufficient}
                    className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl flex items-center justify-between px-6 disabled:opacity-50 shadow-md shadow-brand-purple/20 cursor-pointer"
                  >
                    <span>Continue to Confirmation</span>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                  <div className="rounded-3xl border border-zinc-200/90 bg-zinc-50 p-5 space-y-3 font-mono text-xs shadow-2xs">
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Target Bucket</span>
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
                      <span className="text-zinc-500 font-sans">New Savings Balance</span>
                      <span className="font-bold text-zinc-950">${(selectedBucket.currentAmount + finalAmount).toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                      <span className="text-zinc-500 font-sans">Earn Loyalty Points</span>
                      <span className="font-bold text-brand-purple">+25 Pts</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setDepositStep(1)} 
                      variant="outline"
                      className="h-12 w-12 rounded-2xl border-zinc-200 hover:bg-zinc-100 text-zinc-700 p-0 shrink-0 cursor-pointer"
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Button 
                      onClick={handleDepositSubmit} 
                      disabled={depositLoading}
                      className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl shadow-md shadow-brand-purple/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {depositLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Allocating Deposit...</span>
                        </>
                      ) : (
                        <span>Confirm Deposit</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/*                        MODAL 3: WITHDRAW FUNDS                            */}
      {/* ========================================================================= */}
      {showWithdrawModal && selectedBucket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-extrabold text-zinc-950">
                    Withdrawal Summary
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Release funds from &quot;{selectedBucket.name}&quot;
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)} 
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Warnings based on product rules */}
              {selectedBucket.savingsType === "piggybank" && !isFreeQuarterlyDate() && (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-sans leading-snug">
                    <strong>Early Break Fee:</strong> Today is not a quarterly free withdrawal date (March 31, June 30, Sept 30, Dec 31). Withdrawing now incurs a <strong>2.5% penalty fee</strong>.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "target" && (selectedBucket.status !== "completed" && (!selectedBucket.maturityDate || new Date() < new Date(selectedBucket.maturityDate))) && (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-sans leading-snug">
                    <strong>Incomplete Goal:</strong> Target goal is not yet completed. Breaking early incurs a <strong>2.5% penalty fee</strong>.
                  </p>
                </div>
              )}

              {selectedBucket.savingsType === "flex" && (selectedBucket.withdrawalCountThisMonth >= 4) && (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-sans leading-snug">
                    <strong>Monthly Limit Reached:</strong> You have reached 4 withdrawals this month. Flex Wallet interest drops to <strong>0%</strong> for the remainder of the month.
                  </p>
                </div>
              )}

              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                This will withdraw your total bucket balance and credit it back to your primary spendable wallet immediately.
              </p>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 space-y-3 font-mono text-xs shadow-2xs">
                <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                  <span className="text-zinc-500 font-sans">Total Savings Balance</span>
                  <span className="font-bold text-zinc-950">${withdrawAmount.toFixed(2)} USD</span>
                </div>

                {calculatedPenalty > 0 && (
                  <div className="flex justify-between border-b border-zinc-200 pb-2.5">
                    <span className="text-red-600 font-sans">2.5% Penalty Fee</span>
                    <span className="font-bold text-red-600">-${calculatedPenalty.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between pt-0.5">
                  <span className="text-zinc-700 font-sans font-bold">Net Credited to Wallet</span>
                  <span className="font-bold text-emerald-600 text-sm">${netWithdrawalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowWithdrawModal(false)} 
                  variant="outline"
                  className="h-12 flex-1 border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 font-sans font-bold rounded-2xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleWithdrawSubmit} 
                  disabled={withdrawLoading || withdrawAmount <= 0}
                  className="h-12 flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-2xl shadow-md shadow-brand-purple/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {withdrawLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Releasing Funds...</span>
                    </>
                  ) : (
                    <span>Confirm & Withdraw</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

