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

const TierProgress = ({ tierInfo, summary }: { tierInfo: TierInfo | null, summary: PointsSummary | null }) => {
  const currentPoints = summary?.balance || 0;
  const nextTierPoints = (tierInfo?.pointsToNextTier || 0) + currentPoints;
  const progress = nextTierPoints > 0 ? (currentPoints / nextTierPoints) * 100 : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Tier Progress</p>
          <p className="text-white font-bold">{progress.toFixed(0)}% to {tierInfo?.nextTier || 'Max Tier'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Points Needed</p>
          <p className="text-[#319F43] font-black">{tierInfo?.pointsToNextTier || 'Unlocked'}</p>
        </div>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-purple to-[#319F43] rounded-full transition-all duration-1000 ease-out" 
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
      color: "text-brand-yellow",
      bg: "bg-brand-yellow/10"
    },
    {
      label: "Redeemed Pts",
      value: pointsSummary?.totalRedeemed || 0,
      description: "Successfully spent",
      icon: Gift,
      color: "text-[#319F43]",
      bg: "bg-[#319F43]/10"
    },
    {
      label: "Member Tier",
      value: (tierInfo?.currentTier || "Bronze").charAt(0).toUpperCase() + (tierInfo?.currentTier || "Bronze").slice(1),
      description: "Current Rank",
      icon: Crown,
      color: "text-white",
      bg: "bg-white/10"
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {stats.map((stat) => (
           <GlassCard key={stat.label} className="p-6">
             <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{stat.description}</p>
                </div>
             </div>
           </GlassCard>
         ))}
      </div>

      <GlassCard className="p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-purple/10 blur-3xl -mr-10 -mt-10 group-hover:bg-brand-purple/20 transition-all duration-700" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-[#E9F2A3]/10 border border-[#E9F2A3]/20 rounded-3xl flex items-center justify-center relative">
                 <CalendarCheck className="text-[#E9F2A3]" size={32} />
                 <div className="absolute -top-1 -right-1 h-5 w-5 bg-[#319F43] rounded-full flex items-center justify-center border-2 border-[#0E121C]">
                    <Zap size={10} className="text-white fill-white" />
                 </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Daily Login Streak</h3>
                <p className="text-white/40 text-sm mt-1">Claim your daily 100 points bonus now.</p>
              </div>
           </div>
           <Button 
            onClick={onDailyClaim}
            disabled={isClaiming}
            className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl shadow-white/5 active:scale-95"
           >
             {isClaiming ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" /> : "Claim Bonus"}
           </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <GlassCard className="p-6 border-brand-purple/20 group hover:border-brand-purple/40">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white">Unlock Rewards</h3>
              <Gift className="text-brand-purple" size={20} />
           </div>
           <p className="text-sm text-white/40 leading-relaxed max-w-[200px] mb-6">
              Spend your accumulated points on exclusive digital assets, fee discounts, or gift cards.
           </p>
           <Button variant="outline" className="w-full border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl h-11 text-xs uppercase font-bold tracking-widest">
              View Rewards Shop
           </Button>
         </GlassCard>

         <GlassCard className="p-6 border-[#E9F2A3]/20 group hover:border-[#E9F2A3]/40">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white">Tier Benefits</h3>
              <Flame className="text-brand-yellow" size={20} />
           </div>
           <p className="text-sm text-white/40 leading-relaxed max-w-[200px] mb-6">
              Your current {(tierInfo?.multiplier || 1).toFixed(1)}x multiplier applies to all trading activities.
           </p>
           <Button variant="outline" className="w-full border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-xl h-11 text-xs uppercase font-bold tracking-widest">
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
        {earnActivities.map((reward, i) => (
          <GlassCard
            key={`${reward.group}-${reward.title}`}
            className="p-6 group cursor-pointer hover:border-brand-purple/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-brand-purple/10 border border-brand-purple/20 rounded-xl flex items-center justify-center">
                 <reward.icon className="text-brand-purple" size={20} />
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{reward.group}</p>
            </div>
            <h4 className="text-white font-bold group-hover:text-brand-purple transition-colors mb-2">{reward.title}</h4>
            <div className="flex items-center gap-1">
               <span className="text-2xl font-black text-[#E9F2A3]">+{reward.points}</span>
               <span className="text-[10px] font-bold text-[#E9F2A3]/60 uppercase mb-1">Pts</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function RedeemTab() {
  const redeemRewards = [
    { title: "$5 Bonus Cash", cost: 500, label: "BONUS", color: "bg-blue-500" },
    { title: "$10 Bonus Cash", cost: 1000, label: "BONUS", color: "bg-brand-purple" },
    { title: "Standard Debit Card", cost: 2500, label: "EQUIPMENT", color: "bg-brand-yellow" },
    { title: "Metal Debit Card", cost: 15000, label: "EXCLUSIVE", color: "bg-white" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {redeemRewards.map((reward) => (
          <GlassCard key={reward.title} className="p-6 relative overflow-hidden flex flex-col justify-between h-[180px]">
             <div className={cn("absolute top-3 right-3 text-[8px] font-black px-2 py-0.5 rounded text-black uppercase", reward.color)}>
                {reward.label}
             </div>
             
             <div>
                <h3 className="text-lg font-bold text-white leading-tight mb-1">{reward.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black text-white">{reward.cost.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase mb-0.5">Pts</span>
                </div>
             </div>

             <Button className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-widest h-10 rounded-lg">
                Redeem Now
             </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function TiersTab({ tierInfo, pointsConfig, pointsSummary }: { tierInfo: TierInfo | null, pointsConfig: any, pointsSummary: PointsSummary | null }) {
  const currentPoints = pointsSummary?.balance || 0;
  const tiersData = pointsConfig?.tiers || {};
  const tiers = Object.entries(tiersData).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    key: name.toLowerCase(),
    pointsRequired: data.minPoints,
    multiplier: data.multiplier,
    perks: [`${(data.multiplier * 100 - 100).toFixed(0)}% Bonus Points`, "Exclusive Features", "Priority Access"],
  }));

  const getTierGradient = (name: string) => {
    if (name.includes("Bronze")) return "from-[#CD7F32]/40 to-black/40 border-[#CD7F32]/20";
    if (name.includes("Silver")) return "from-[#C0C0C0]/40 to-black/40 border-[#C0C0C0]/20";
    if (name.includes("Gold")) return "from-[#FFD700]/30 to-black/40 border-[#FFD700]/20";
    if (name.includes("Platinum")) return "from-[#E5E4E2]/20 to-black/40 border-[#E5E4E2]/20";
    if (name.includes("Diamond")) return "from-blue-500/20 to-black/40 border-blue-500/20";
    return "from-white/10 to-black/40 border-white/5";
  };

  const getTierIconColor = (name: string) => {
    if (name.includes("Bronze")) return "text-[#CD7F32]";
    if (name.includes("Silver")) return "text-[#C0C0C0]";
    if (name.includes("Gold")) return "text-[#FFD700]";
    if (name.includes("Platinum")) return "text-[#E5E4E2]";
    if (name.includes("Diamond")) return "text-blue-400";
    return "text-white";
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
                "p-8 bg-gradient-to-br transition-all duration-500",
                getTierGradient(tier.name),
                isCurrent && "ring-2 ring-brand-purple/40 border-brand-purple/40"
              )}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                 <div className="h-24 w-24 rounded-full bg-black/40 flex items-center justify-center border border-white/5 shadow-2xl shrink-0">
                    <Crown size={48} className={getTierIconColor(tier.name)} />
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                          <h3 className="text-3xl font-black text-white tracking-tighter">{tier.name} Tier</h3>
                          <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{tier.pointsRequired.toLocaleString()} Points Needed</p>
                       </div>
                       {isCurrent && (
                         <div className="px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple text-xs font-black uppercase tracking-widest">
                            Current Tier
                         </div>
                       )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                       {tier.perks.map(perk => (
                         <div key={perk} className="flex items-center gap-2 text-white/60 text-sm font-medium">
                            <Shield size={14} className="text-[#319F43] shrink-0" />
                            {perk}
                         </div>
                       ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-tighter">
                       <span className="text-white/40">Earnings Multiplier</span>
                       <span className="text-white text-lg font-black">{tier.multiplier.toFixed(1)}x</span>
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
          <div className="h-20 w-20 animate-spin rounded-full border-2 border-brand-purple border-t-transparent shadow-xl shadow-brand-purple/20" />
          <Zap className="absolute inset-0 m-auto text-brand-purple animate-pulse" size={24} />
        </div>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] animate-pulse">Synchronizing Rewards...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col gap-12 pb-20 max-w-[1000px]">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[30%] left-[15%] h-[400px] w-[400px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[350px] w-[350px] rounded-full bg-brand-yellow/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
            Loyalty <span className="text-brand-purple">Rewards</span>
          </h1>
          <p className="text-brand-white/40 text-base max-w-[500px] font-medium leading-relaxed">
            Maximize your earnings with tiered multipliers and exclusive payouts. Every action inside StableBank builds your financial profile.
          </p>
        </div>

        <GlassCard className="!bg-white/[0.03] border-white/10 px-8 py-6 min-w-[320px]">
           <TierProgress tierInfo={tierInfo} summary={pointsSummary} />
        </GlassCard>
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        {/* Modern Tab Switcher */}
        <div className="flex w-full items-center p-1.5 rounded-3xl bg-[#0E121C]/80 border border-white/5 backdrop-blur-xl sm:w-fit lg:min-w-[480px]">
          {tabs.map((tab) => {
            const isSelected = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden",
                  isSelected ? "text-white" : "text-white/30 hover:text-white/60"
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-purple shadow-lg shadow-brand-purple/40 animate-in fade-in zoom-in-95 duration-300" />
                )}
                <tab.icon size={14} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
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
          {activeTab === "tiers" && <TiersTab tierInfo={tierInfo} pointsConfig={pointsConfig} pointsSummary={pointsSummary} />}
        </div>
      </div>
    </div>
  );
}
