"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pointsService } from "@/services/pointsService";
import { toast } from "sonner";
import type { PointsSummary, TierInfo } from "@/types/points";
import { 
  Zap, 
  Trophy, 
  Gift, 
  Crown, 
  Star, 
  Clock, 
  User, 
  Shield, 
  TrendingUp,
  CalendarCheck,
  Flame,
} from "lucide-react";
import { cn } from "@/utils/cn";

// --- Components ---

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <Card 
    className={cn(
      "overflow-hidden transition-all duration-200 border border-zinc-200 bg-white hover:border-zinc-300 shadow-sm rounded-2xl",
      className
    )}
    onClick={onClick}
  >
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
);

const TierProgress = ({ tierInfo, summary }: { tierInfo: TierInfo | null, summary: PointsSummary | null }) => {
  const currentPoints = summary?.balance || 0;
  const nextTierPoints = (tierInfo?.pointsToNextTier || 0) + currentPoints;
  const progress = nextTierPoints > 0 ? (currentPoints / nextTierPoints) * 100 : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1">Tier Progress</p>
          <p className="text-zinc-900 font-display font-bold text-sm">{progress.toFixed(0)}% to {tierInfo?.nextTier || 'Max Tier'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-[0.15em] mb-1">Points Needed</p>
          <p className="text-emerald-600 font-mono font-bold text-sm">{tierInfo?.pointsToNextTier || 'Unlocked'}</p>
        </div>
      </div>
      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-purple to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

// --- Tabs ---

function OverviewTab({ pointsSummary, tierInfo, onDailyClaim, isClaiming }: { pointsSummary: PointsSummary | null, tierInfo: TierInfo | null, onDailyClaim: () => void, isClaiming: boolean }) {
  const stats = [
    {
      label: "Current Balance",
      value: pointsSummary?.balance || 0,
      description: "Available Pts",
      icon: Zap,
      color: "text-brand-purple",
      bg: "bg-brand-purple/10"
    },
    {
      label: "Lifetime Earned",
      value: pointsSummary?.totalEarned || 0,
      description: "Total accumulation",
      icon: Trophy,
      color: "text-amber-700",
      bg: "bg-amber-50"
    },
    {
      label: "Redeemed Pts",
      value: pointsSummary?.totalRedeemed || 0,
      description: "Successfully spent",
      icon: Gift,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Member Tier",
      value: (tierInfo?.currentTier || "Bronze").charAt(0).toUpperCase() + (tierInfo?.currentTier || "Bronze").slice(1),
      description: "Current Rank",
      icon: Crown,
      color: "text-zinc-900",
      bg: "bg-zinc-100"
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {stats.map((stat) => (
           <GlassCard key={stat.label} className="p-6">
             <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border border-zinc-200 shrink-0", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-mono font-black text-zinc-950">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">{stat.description}</p>
                </div>
             </div>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="p-8 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center relative shrink-0">
                 <CalendarCheck className="text-amber-700" size={32} />
                 <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white">
                    <Zap size={10} className="text-white fill-white" />
                 </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-zinc-950 tracking-tight">Daily Login Streak</h3>
                <p className="text-zinc-600 font-sans text-sm mt-1">Claim your daily 100 points bonus now.</p>
              </div>
           </div>
           <Button 
            onClick={onDailyClaim}
            disabled={isClaiming}
            className="h-12 px-8 rounded-full bg-brand-purple text-white font-sans font-bold text-sm hover:bg-brand-purple/90 disabled:opacity-50 transition-all shadow-md shadow-brand-purple/20 active:scale-95 cursor-pointer"
           >
             {isClaiming ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Claim Bonus"}
           </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <GlassCard className="p-6 border-zinc-200 group hover:border-brand-purple/40">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-display font-bold text-zinc-950">Unlock Rewards</h3>
              <Gift className="text-brand-purple" size={20} />
           </div>
           <p className="text-sm text-zinc-600 font-sans leading-relaxed max-w-[280px] mb-6">
              Spend your accumulated points on exclusive digital assets, fee discounts, or gift cards.
           </p>
           <Button variant="outline" className="w-full border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 rounded-xl h-11 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer">
              View Rewards Shop
           </Button>
         </GlassCard>

         <GlassCard className="p-6 border-zinc-200 group hover:border-amber-400/40">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-display font-bold text-zinc-950">Tier Benefits</h3>
              <Flame className="text-amber-600" size={20} />
           </div>
           <p className="text-sm text-zinc-600 font-sans leading-relaxed max-w-[280px] mb-6">
              Your current {(tierInfo?.multiplier || 1).toFixed(1)}x multiplier applies to all trading activities.
           </p>
           <Button variant="outline" className="w-full border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 rounded-xl h-11 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer">
              Examine Multipliers
           </Button>
         </GlassCard>
      </div>
    </div>
  );
}

function EarnTab({ pointsConfig }: { pointsConfig: any }) {
  const activities = pointsConfig?.activities || {};
  
  const getIcon = (key: string) => {
    if (key.includes("staking")) return Clock;
    if (key.includes("referral")) return User;
    if (key.includes("transaction")) return Gift;
    if (key.includes("engagement")) return Star;
    return Zap;
  };

  const flattenActivities = (obj: any) => {
    const flat: any[] = [];
    Object.entries(obj).forEach(([group, acts]: [string, any]) => {
      Object.entries(acts).forEach(([key, value]) => {
        flat.push({
          group: group.charAt(0).toUpperCase() + group.slice(1),
          title: key.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
          points: value,
          icon: getIcon(group),
        });
      });
    });
    return flat;
  };

  const earnActivities = flattenActivities(activities);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {earnActivities.map((reward) => (
          <GlassCard
            key={`${reward.group}-${reward.title}`}
            className="p-6 group cursor-pointer hover:border-brand-purple/40 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-brand-purple/10 border border-brand-purple/20 rounded-xl flex items-center justify-center">
                 <reward.icon className="text-brand-purple" size={20} />
              </div>
              <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{reward.group}</p>
            </div>
            <h4 className="text-zinc-950 font-sans font-bold group-hover:text-brand-purple transition-colors mb-2">{reward.title}</h4>
            <div className="flex items-center gap-1">
               <span className="text-2xl font-mono font-black text-brand-purple">+{reward.points}</span>
               <span className="text-xs font-mono font-bold text-zinc-400 uppercase mb-1">Pts</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function RedeemTab() {
  const redeemRewards = [
    { title: "$5 Bonus Cash", cost: 500, label: "BONUS", color: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
    { title: "$10 Bonus Cash", cost: 1000, label: "BONUS", color: "bg-[#EEF8A8]/80 text-[#556000] border border-[#D0E244]/80" },
    { title: "Standard Debit Card", cost: 2500, label: "EQUIPMENT", color: "bg-purple-50 text-brand-purple border border-purple-200" },
    { title: "Metal Debit Card", cost: 15000, label: "EXCLUSIVE", color: "bg-zinc-900 text-white" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {redeemRewards.map((reward) => (
          <GlassCard key={reward.title} className="p-6 relative overflow-hidden flex flex-col justify-between h-[180px]">
             <div className={cn("absolute top-3 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase", reward.color)}>
                {reward.label}
             </div>
             
             <div>
                <h3 className="text-base font-display font-bold text-zinc-950 leading-tight mb-1">{reward.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-mono font-black text-zinc-950">{reward.cost.toLocaleString()}</span>
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase mb-0.5">Pts</span>
                </div>
             </div>

             <Button className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 font-sans font-bold text-xs uppercase tracking-wider h-10 rounded-xl cursor-pointer">
                Redeem Now
             </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function TiersTab({ tierInfo, pointsConfig }: { tierInfo: TierInfo | null, pointsConfig: any }) {
  const tiersData = pointsConfig?.tiers || {};
  const tiers = Object.entries(tiersData).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    key: name.toLowerCase(),
    pointsRequired: data.minPoints,
    multiplier: data.multiplier,
    perks: [`${(data.multiplier * 100 - 100).toFixed(0)}% Bonus Points`, "Exclusive Features", "Priority Access"],
  }));

  const getTierIconColor = (name: string) => {
    if (name.includes("Bronze")) return "text-amber-800";
    if (name.includes("Silver")) return "text-zinc-500";
    if (name.includes("Gold")) return "text-amber-600";
    if (name.includes("Platinum")) return "text-zinc-900";
    if (name.includes("Diamond")) return "text-brand-purple";
    return "text-zinc-900";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6">
        {tiers.map((tier) => {
          const isCurrent = tier.key === tierInfo?.currentTier;

          return (
            <GlassCard
              key={tier.name}
              className={cn(
                "p-8 bg-white border border-zinc-200 shadow-sm transition-all duration-300",
                isCurrent && "ring-2 ring-brand-purple border-brand-purple"
              )}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                 <div className="h-20 w-20 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-200 shadow-xs shrink-0">
                    <Crown size={40} className={getTierIconColor(tier.name)} />
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                          <h3 className="text-2xl font-display font-black text-zinc-950 tracking-tight">{tier.name} Tier</h3>
                          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">{tier.pointsRequired.toLocaleString()} Points Needed</p>
                       </div>
                       {isCurrent && (
                         <div className="px-3.5 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-mono font-bold uppercase tracking-wider">
                            Current Tier
                         </div>
                       )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                       {tier.perks.map(perk => (
                         <div key={perk} className="flex items-center gap-2 text-zinc-600 font-sans text-xs font-medium">
                            <Shield size={14} className="text-emerald-600 shrink-0" />
                            {perk}
                         </div>
                       ))}
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                       <span className="text-zinc-500">Earnings Multiplier</span>
                       <span className="text-zinc-950 font-mono text-base font-black">{tier.multiplier.toFixed(1)}x</span>
                    </div>
                 </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function URewards() {
  const [pointsSummary, setPointsSummary] = useState<PointsSummary | null>(null);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [pointsConfig, setPointsConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [points, tier, config] = await Promise.all([
        pointsService.getPointsSummary(),
        pointsService.getUserTier(),
        pointsService.getPointsConfig(),
      ]);

      setPointsSummary(points);
      setTierInfo(tier);
      setPointsConfig(config);
    } catch (error: any) {
      console.error("Failed to fetch rewards data:", error);
      toast.error(error?.response?.data?.message || "Internal server error. Please check back later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyClaim = async () => {
    setIsClaiming(true);
    try {
      const result = await pointsService.processDailyLogin();
      toast.success(result.message || `Handouts received! +${result.points || '100'} Pts`);
      
      // Refresh
      const points = await pointsService.getPointsSummary();
      setPointsSummary(points);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to claim points");
    } finally {
      setIsClaiming(false);
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: Trophy },
    { key: "earn", label: "Earn Pts", icon: TrendingUp },
    { key: "redeem", label: "Shop", icon: Gift },
    { key: "tiers", label: "Tiers", icon: Crown },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-3 border-brand-purple border-t-transparent" />
          <Zap className="absolute inset-0 m-auto text-brand-purple animate-pulse" size={20} />
        </div>
        <p className="text-zinc-500 font-mono font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Rewards...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
            Loyalty <span className="text-brand-purple">Rewards</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-[500px] font-sans leading-relaxed">
            Maximize your earnings with tiered multipliers and exclusive payouts. Every action inside StableBank builds your financial profile.
          </p>
        </div>

        <GlassCard className="border-zinc-200 px-6 py-5 min-w-[300px]">
           <TierProgress tierInfo={tierInfo} summary={pointsSummary} />
        </GlassCard>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* Modern Tab Switcher */}
        <div className="flex w-full items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200 sm:w-fit">
          {tabs.map((tab) => {
            const isSelected = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  isSelected ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                )}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {activeTab === "overview" && (
            <OverviewTab 
              pointsSummary={pointsSummary} 
              tierInfo={tierInfo} 
              onDailyClaim={handleDailyClaim} 
              isClaiming={isClaiming}
            />
          )}
          {activeTab === "earn" && <EarnTab pointsConfig={pointsConfig} />}
          {activeTab === "redeem" && <RedeemTab />}
          {activeTab === "tiers" && <TiersTab tierInfo={tierInfo} pointsConfig={pointsConfig} />}
        </div>
      </div>
    </div>
  );
}
