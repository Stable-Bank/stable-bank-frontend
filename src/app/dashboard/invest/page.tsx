"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  CornerRightDown,
  LockKeyhole,
  Shield,
  Zap,
  TrendingUp,
  Info,
  ArrowUpRight,
} from "lucide-react";
import Slider from "@/components/slider/base";
import { earnService, EarnSummary, StakingOption, AimPlan } from "@/services/earnService";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// --- Components ---

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <Card 
    className={cn(
      "overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md hover:border-white/10 hover:bg-[#0E121C]/70 shadow-2xl shadow-black/40",
      className
    )}
    onClick={onClick}
  >
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
);

const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon?: any;
}) => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#252670] to-[#12123a] p-8 border border-white/10 shadow-lg">
    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-brand-purple/20 blur-3xl" />
    <div className="relative flex items-start gap-4">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/10 shadow-inner">
          <Icon className="text-[#E9F2A3]" size={24} />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-white/60 mt-1 max-w-[400px] leading-relaxed">{subtitle}</p>
      </div>
    </div>
  </div>
);

const StakeEarnTab = () => {
  const [selectedLock, setSelectedLock] = useState<number>(30);
  const [amount, setAmount] = useState<number>(0);
  const [lockOptions, setLockOptions] = useState<StakingOption[]>([
    { days: 30, min: 100, apy: 8.5 },
    { days: 90, min: 250, apy: 12.3 },
    { days: 180, min: 500, apy: 16.8 },
    { days: 365, min: 500, apy: 16.8 },
  ]);
  const [stakingLoading, setStakingLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await earnService.getStakingOptions();
        if (options && options.length > 0) {
          setLockOptions(options);
          setSelectedLock(options[0].days);
        }
      } catch (error) {
        console.error("Failed to fetch staking options:", error);
      }
    };
    fetchOptions();
  }, []);

  const selected = lockOptions.find((opt) => opt.days === selectedLock) || lockOptions[0];

  const estimatedRewards = ((amount * (selected.apy / 100)) * (selected.days / 365)).toFixed(2);
  const totalReturn = (amount + parseFloat(estimatedRewards)).toFixed(2);

  const handleStake = async () => {
    if (amount < selected.min) {
      toast.error(`Minimum amount to stake is $${selected.min}`);
      return;
    }
    setStakingLoading(true);
    try {
      await earnService.stakeTokens({
        tokenId: "65cf68e7f8e3f2a1b0c9d8e7", // Placeholder
        amount,
        lockPeriodInDays: selected.days,
        apy: selected.apy,
      });
      toast.success("Staking successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Staking failed");
    } finally {
      setStakingLoading(false);
    }
  };

  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col gap-10">
      <SectionHeader
        title="Stake & Earn"
        subtitle="Lock your tokens and earn rewards with competitive APY rates based on commitment length."
        icon={LockKeyhole}
      />

      <div className="space-y-4">
        <label className="text-lg font-semibold text-[#E9F2A3] flex items-center gap-2">
          Choose Lock Period
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lockOptions.map((opt) => (
            <GlassCard
              key={opt.days}
              className={cn(
                "group cursor-pointer p-5 transition-all duration-300",
                selectedLock === opt.days
                  ? "border-brand-purple ring-2 ring-brand-purple/20 bg-brand-purple/5"
                  : "hover:bg-white/[0.02]"
              )}
              onClick={() => setSelectedLock(opt.days)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">{opt.days} Days</span>
                  {selectedLock === opt.days && <Shield size={14} className="text-brand-purple" />}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-white">
                    {opt.apy}<span className="text-lg text-brand-purple ml-0.5">%</span>
                  </span>
                  <span className="text-xs text-brand-white/40 mb-1">APY</span>
                </div>
                <p className="text-xs text-white/40 font-medium">Min: ${opt.min}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-lg font-semibold text-[#E9F2A3]">Stake Amount</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-white/40 font-bold">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-20 py-5 bg-[#0E121C] border border-white/10 rounded-2xl text-2xl font-bold text-white outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-all placeholder:text-white/10"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-sm font-bold text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-lg">USDC</span>
              </div>
            </div>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-[#319F43]" />
              Reward Projection
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-white/40 underline decoration-dotted underline-offset-4 cursor-help" title="Based on current APY for the selected period">Estimated Rewards</span>
                <span className="text-white text-lg font-bold">+ ${estimatedRewards}</span>
              </div>
              <div className="h-px bg-white/5 w-full" />
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-white/40">Total Return</span>
                <span className="text-[#319F43] text-2xl font-bold">${totalReturn}</span>
              </div>
              <div className="mt-4 flex items-start gap-2 p-3 bg-brand-purple/5 border border-brand-purple/10 rounded-xl">
                <Info size={16} className="text-brand-purple shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/40 leading-tight">
                  Tokens will be locked for {selected.days} days from the time of staking. Early withdrawal may incur penalties.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:pt-11 flex flex-col gap-6">
          <Button 
            onClick={handleStake}
            disabled={stakingLoading}
            className="group relative h-20 w-full overflow-hidden rounded-3xl bg-brand-purple px-8 text-xl font-bold text-white shadow-xl shadow-brand-purple/20 transition-all hover:-translate-y-1 hover:shadow-brand-purple/30 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="flex items-center justify-center gap-3">
              {stakingLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Zap className="text-brand-yellow fill-brand-yellow" size={24} />
                  Stake Now
                </>
              )}
            </span>
          </Button>

          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Liquidity</p>
              <p className="text-white font-semibold">High</p>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Risk Factor</p>
              <p className="text-white font-semibold flex items-center gap-1 justify-center">
                <Shield size={12} className="text-[#319F43]" />
                Low
              </p>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Asset type</p>
              <p className="text-white font-semibold">Stable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AimPlansTab = () => {
  const [plans, setPlans] = useState<AimPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<AimPlan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await earnService.getAimPlans();
        if (data && data.length > 0) {
          setPlans(data);
          setSelectedPlan(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch AIM plans:", error);
      }
    };
    fetchPlans();
  }, []);

  if (!selectedPlan) return null;

  const currentPlanIcon = (id: string) => {
    if (id.includes("conservative")) return Shield;
    if (id.includes("growth")) return Zap;
    return CornerRightDown;
  };

  const getRiskColor = (level: string) => {
    if (level.toLowerCase().includes("low")) return "text-[#319F43]";
    if (level.toLowerCase().includes("high")) return "text-[#FE0420]";
    return "text-[#FFA500]";
  };

  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col gap-10">
      <SectionHeader
        title="AIM Plans"
        subtitle="Automated Investment Management tailored to your personalized risk profile and financial goals."
        icon={CornerRightDown}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = currentPlanIcon(plan.id);
          const isSelected = selectedPlan.id === plan.id;
          return (
            <GlassCard
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={cn(
                "group relative overflow-hidden transition-all duration-500",
                isSelected
                  ? "border-brand-purple ring-2 ring-brand-purple/20 shadow-[0_0_30px_-10px_rgba(70,73,214,0.3)]"
                  : "hover:-translate-y-2"
              )}
            >
              <div className="p-6 flex flex-col gap-6">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500",
                  isSelected ? "bg-brand-purple text-white shadow-lg" : "bg-white/5 text-white/40"
                )}>
                  <Icon size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{plan.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-xs font-bold text-white/30 tracking-widest uppercase">Target</span>
                    <span className="text-lg font-bold text-[#E9F2A3]">{plan.expectedReturn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/30 tracking-widest uppercase">Risk</span>
                    <span className={cn("text-sm font-bold", getRiskColor(plan.riskLevel))}>{plan.riskLevel}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
           <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9F2A3] text-black text-sm">1</span>
              Configure Investment
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Amount to Invest</label>
                  <p className="text-4xl font-black text-white">$0</p>
                </div>
                <div className="px-2">
                  <Slider min={100} max={10000} step={100} />
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Portfolio Allocation</h4>
                <div className="space-y-4">
                   {[
                    { label: "Bonds", value: "0%", color: "bg-blue-500" },
                    { label: "Stocks", value: "0%", color: "bg-brand-purple" },
                    { label: "Alternatives", value: "0%", color: "bg-[#E9F2A3]" }
                   ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", item.color)} style={{ width: item.value }} />
                      </div>
                    </div>
                   ))}
                </div>
              </div>
            </div>
           </GlassCard>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
            <GlassCard className="p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple text-white text-sm">2</span>
                  Plan Summary
                </h3>
                
                <p className="text-sm text-white/60 leading-relaxed italic">
                  {"\""}The {selectedPlan.name} is designed for investors seeking {selectedPlan.expectedReturn === "low" ? "stability" : "growth"} while maintaining {selectedPlan.riskLevel} levels of volatility.{"\""}
                </p>

                <div className="space-y-4 bg-white/5 rounded-2xl p-6 border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Fee structure</span>
                    <span className="text-sm font-bold text-white">0.25% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Rebalancing</span>
                    <span className="text-sm font-bold text-white">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Liquidity</span>
                    <span className="text-sm font-bold text-[#319F43]">T + 1</span>
                  </div>
                </div>
              </div>

              <Button className="mt-8 h-16 w-full rounded-2xl bg-white text-black font-bold text-lg hover:bg-white/90 shadow-xl shadow-white/5 transition-all active:scale-95">
                Confirm & Start AIM
              </Button>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};

const SyntheticStocksTab = () => {
  const [trendingStocks, setTrendingStocks] = useState<any[]>([]);
  const [stocksLoading, setStocksLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await earnService.getTrendingStocks();
        setTrendingStocks(data);
      } catch (error) {
        console.error("Failed to fetch trending stocks:", error);
      } finally {
        setStocksLoading(false);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col gap-10">
      <SectionHeader
        title="Synthetic US Stocks"
        subtitle="Get instantaneous, tokenized exposure to top US equity markets with decentralized settlements."
        icon={ChartLine}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Trending Stocks
            <TrendingUp size={20} className="text-[#319F43]" />
          </h2>
          <button className="text-xs font-bold text-brand-purple uppercase tracking-widest hover:underline decoration-2">View Exchange</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocksLoading ? (
            Array(3).fill(0).map((_, i) => (
              <GlassCard key={i} className="h-[120px] animate-pulse bg-white/5"><div /></GlassCard>
            ))
          ) : (
            trendingStocks.map((stock) => (
              <GlassCard
                key={stock.symbol}
                className="group cursor-pointer p-6 hover:translate-x-1"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-black text-white uppercase group-hover:text-brand-purple transition-colors">{stock.symbol}</h4>
                      <p className="text-xs font-medium text-white/30 truncate max-w-[120px]">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${stock.price}</p>
                      <div className={cn(
                        "flex items-center justify-end gap-1 text-sm font-bold",
                        stock.isPositive ? "text-[#319F43]" : "text-[#FE0420]"
                      )}>
                        {stock.isPositive ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                        {stock.changePercent}%
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <img src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c52e.png" alt="MSFT" className="h-6 w-6 grayscale opacity-60" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Microsoft Corp. (MSFT)</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#319F43] bg-[#319F43]/10 px-2 py-0.5 rounded-md">0.00%</span>
                    <span className="text-[10px] text-white/20 uppercase font-bold">NASDAQ • TRADING HOURS OPEN</span>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-black text-white">$0.00</p>
            </div>

            <div className="h-48 w-full bg-gradient-to-b from-brand-purple/10 to-transparent rounded-2xl mb-8 flex items-center justify-center border border-white/5 relative overflow-hidden">
               {/* Simplified chart visual */}
               <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,80 Q25,70 40,75 T70,40 T100,50 L100,100 L0,100 Z" fill="url(#grad)" />
                 <path d="M0,80 Q25,70 40,75 T70,40 T100,50" fill="none" stroke="#4649D6" strokeWidth="2" />
                 <defs>
                   <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" style={{ stopColor: "#4649D6", stopOpacity: 0.3 }} />
                     <stop offset="100%" style={{ stopColor: "#4649D6", stopOpacity: 0 }} />
                   </linearGradient>
                 </defs>
               </svg>
               <span className="text-white/20 text-xs font-bold uppercase tracking-widest relative z-10">Historical Data Preview</span>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Investment Amount</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-2xl font-bold text-white outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-brand-purple text-xs font-bold text-white">MAX</button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-8 h-full space-y-8">
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {[
                  { label: "Est. Shares", value: "0.000", sub: "MSFT" },
                  { label: "Execution Price", value: "$0.00", sub: "Real-time" },
                  { label: "Trading Fee", value: "0.0%", sub: "Included" }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/40 mb-1">{item.label}</span>
                      <span className="text-[10px] font-bold text-brand-purple uppercase">{item.sub}</span>
                    </div>
                    <span className="text-xl font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-2xl">
                <ArrowUpRight size={20} className="text-brand-yellow shrink-0" />
                <p className="text-[10px] text-brand-yellow/80 leading-snug">
                  You are opening a synthetic long position. You do not own the underlying stock directly.
                </p>
              </div>
            </div>

            <Button className="h-16 w-full rounded-2xl bg-brand-purple text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(70,73,214,0.4)] transition-all">
              Initiate Position
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const tabs = [
  {
    key: "stake-earn",
    label: "Staking",
    icon: LockKeyhole,
    component: StakeEarnTab,
  },
  {
    key: "aim-plans",
    label: "AIM Plans",
    icon: CornerRightDown,
    component: AimPlansTab,
  },
  {
    key: "synthetic-stocks",
    label: "Stocks",
    icon: ChartLine,
    component: SyntheticStocksTab,
  },
];

// --- Main Page Component ---

export default function UInvest() {
  const [currentTab, setCurrentTab] = useState("stake-earn");
  const [summary, setSummary] = useState<EarnSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await earnService.getEarnSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch earn summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col gap-12 pb-20">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[300px] w-[300px] rounded-full bg-brand-yellow/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
            Invest <span className="text-[#E9F2A3]">&</span> Earn
          </h1>
          <p className="text-brand-white/40 text-base max-w-[500px] font-medium leading-relaxed">
            Harness the power of institutional-grade financial tools, now fully decentralized and accessible 24/7.
          </p>
        </div>

        <div className="flex items-center gap-4">
           {!loading && summary && (
            <GlassCard className="!bg-white/[0.03] border-white/10 px-6 py-4">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Portfolio</span>
                  <p className="text-2xl font-black text-white">
                    ${(summary.totalInvestedUSD + summary.totalStakedUSD).toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#319F43] uppercase tracking-[0.2em] mb-1">Growth</span>
                  <p className="text-2xl font-black text-[#319F43]">
                    +${summary.totalEarnedUSD.toLocaleString()}
                  </p>
                </div>
              </div>
            </GlassCard>
           )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        {/* Modern Tab Switcher */}
        <div className="flex w-full items-center p-1.5 rounded-3xl bg-[#0E121C]/80 border border-white/5 backdrop-blur-xl sm:w-fit lg:min-w-[480px]">
          {tabs.map((tab) => {
            const isSelected = tab.key === currentTab;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500 overflow-hidden",
                  isSelected ? "text-white" : "text-white/30 hover:text-white/60"
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-purple shadow-lg shadow-brand-purple/40 animate-in fade-in zoom-in-95 duration-300" />
                )}
                <tab.icon size={18} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {tabs.map((tab) => (
            currentTab === tab.key && (
              <div key={tab.key}>
                <tab.component />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
