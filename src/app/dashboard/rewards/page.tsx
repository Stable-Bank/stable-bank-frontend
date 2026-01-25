"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { pointsService } from "@/services/pointsService";
import { referralService } from "@/services/referralService";
import { toast } from "sonner";
import type { PointsSummary, TierInfo } from "@/types/points";
import type { ReferralStats } from "@/types/referral";

export default function URewards() {
  const [pointsSummary, setPointsSummary] = useState<PointsSummary | null>(null);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [points, tier] = await Promise.all([
          pointsService.getPointsSummary(),
          pointsService.getUserTier(),
        ]);

        setPointsSummary(points);
        setTierInfo(tier);
      } catch (error: any) {
        console.error("Failed to fetch rewards data:", error);
        toast.error(error?.message || "Failed to load rewards data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDailyClaim = async () => {
    setIsClaiming(true);
    try {
      const result = await pointsService.processDailyLogin();
      toast.success(result.message || `Claimed ${result.points} points!`);

      // Refresh points summary
      const points = await pointsService.getPointsSummary();
      setPointsSummary(points);
    } catch (error: any) {
      console.error("Failed to claim daily points:", error);
      toast.error(error?.message || "Failed to claim points");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-10">
      <div>
        <h1 className="text-brand-yellow text-2xl font-semibold">
          Rewards Dashboard
        </h1>
        <p className="text-sm font-normal">
          Track your points, level up and unlock amazing rewards.
        </p>
      </div>

      <div className="bg-brand-purple flex w-full justify-between rounded-[12px]">
        <div className="flex w-[70%] flex-col gap-11 px-5 py-7">
          <div>
            <p className="text-base font-semibold capitalize">
              {tierInfo?.currentTier || "Bronze"} Member
            </p>
            <p className="mt-1 text-5xl font-bold">
              {pointsSummary?.balance || 0} Pts
            </p>
            <p className="text-base font-medium">
              {tierInfo?.pointsToNextTier
                ? `${tierInfo.pointsToNextTier} points to ${tierInfo.nextTier}`
                : "Earn more points and enjoy exclusive benefits!"}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[8px] bg-white/25 px-4 py-3">
            <div>
              <p className="text-xl font-bold">Daily Login Bonus</p>
              <p className="text-base font-medium">
                Claim your daily points
              </p>
            </div>
            <div>
              <Button
                onClick={handleDailyClaim}
                disabled={isClaiming}
                className="text-brand-white bg-brand-purple flex h-11 w-full cursor-pointer items-center justify-center rounded-[4px] px-5 text-base font-semibold disabled:opacity-50"
              >
                {isClaiming ? "Claiming..." : "Claim"}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <Image
            src={"/images/placeholder/reward-dash-img.svg"}
            alt="reward img"
            width={300}
            height={300}
            className="h-full w-full rounded-r-[12px] object-cover object-top-right"
          />
        </div>
      </div>

      <Tabs
        pointsSummary={pointsSummary}
        tierInfo={tierInfo}
        referralStats={referralStats}
      />
    </div>
  );
}

const tabsArr = [
  { label: "Overview", value: "overview", component: OverviewTab },
  { label: "Earn", value: "earn", component: EarnTab },
  { label: "Redeem", value: "redeem", component: RedeemTab },
  { label: "Tiers", value: "tiers", component: TiersTab },
];

interface TabsProps {
  pointsSummary: PointsSummary | null;
  tierInfo: TierInfo | null;
  referralStats: ReferralStats | null;
}

const Tabs = ({ pointsSummary, tierInfo, referralStats }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(tabsArr[0].value);
  return (
    <div className="flex flex-col gap-12">
      <div className="grid w-full grid-cols-4 rounded-[10px] bg-[#0E121C] px-3.5 py-1.5">
        {tabsArr.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
            }}
            className={`h-16 transform rounded-[10px] text-[26px] transition-all duration-200 ease-linear ${activeTab === tab.value ? "bg-[#4649D6] px-4 font-semibold" : "bg-transparent font-normal"}`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="transform transition-all duration-200 ease-linear">
        {activeTab === "overview" && <OverviewTab pointsSummary={pointsSummary} />}
        {activeTab === "earn" && <EarnTab />}
        {activeTab === "redeem" && <RedeemTab />}
        {activeTab === "tiers" && <TiersTab tierInfo={tierInfo} />}
      </div>
    </div>
  );
};

import { Zap, Trophy, Gift, Crown } from "lucide-react";

// Overview stats for rewards dashboard
// const overviewStats = [
  {
    label: "Points Balance",
    value: 2673,
    description: "Available to spend",
    icon: Zap,
    color: "#4649D6",
  },
  {
    label: "Total Earned",
    value: 12450,
    description: "Lifetime Points",
    icon: Trophy,
    color: "#CA8A04",
  },
  {
    label: "Points Redeemed",
    value: 9603,
    description: "Total Spent",
    icon: Gift,
    color: "#319F43",
  },
  {
    label: "Current Tier",
    value: "Gold",
    description: "Member level",
    icon: Crown,
    color: "#EA580C",
  },
];

function OverviewTab({ pointsSummary }: { pointsSummary: PointsSummary | null }) {
  const stats = [
    {
      label: "Points Balance",
      value: pointsSummary?.balance || 0,
      description: "Available to spend",
      icon: Zap,
      color: "#4649D6",
    },
    {
      label: "Total Earned",
      value: pointsSummary?.totalEarned || 0,
      description: "Lifetime Points",
      icon: Trophy,
      color: "#CA8A04",
    },
    {
      label: "Points Redeemed",
      value: pointsSummary?.totalRedeemed || 0,
      description: "Total Spent",
      icon: Gift,
      color: "#319F43",
    },
    {
      label: "Current Tier",
      value: pointsSummary?.tier ? pointsSummary.tier.charAt(0).toUpperCase() + pointsSummary.tier.slice(1) : "Bronze",
      description: "Member level",
      icon: Crown,
      color: "#EA580C",
    },
  ];

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[29px]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] px-5 py-3`}
            style={{ color: stat.color }}
          >
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-[#E9E9E9]">
                {stat.label}
              </span>
              <span className="text-[28px] font-semibold">{stat.value}</span>
              <span className="text-base font-normal text-[#E9E9E9]">
                {stat.description}
              </span>
            </div>

            <div className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-[#1F2937]">
              <stat.icon size={31} />
            </div>
          </div>
        ))}
      </div>

      <Button className="text-brand-white bg-brand-purple flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold">
        Redeem Points
      </Button>
    </div>
  );
}

import { Star, Clock, User } from "lucide-react";

const rewards = [
  {
    title: "Make a purchase",
    points: "1 Point per $1",
    icon: Gift,
  },
  {
    title: "Write a review",
    points: "50 points",
    icon: Star,
  },
  {
    title: "Daily Login",
    points: "10 points",
    icon: Clock,
  },
  {
    title: "Complete Profile",
    points: "100 points",
    icon: User,
  },
];

function EarnTab() {
  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-brand-yellow text-2xl font-semibold">
        How to Earn Points
      </h2>

      <div className="flex flex-col gap-12">
        {rewards.map((reward) => (
          <div
            key={reward.title}
            className="flex items-center gap-8 rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] px-5 py-4"
          >
            <div className="bg-brand-purple flex aspect-square h-[52px] w-[52px] items-center justify-center rounded-[6px]">
              <reward.icon size={32} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-[#E9E9E9]">
                {reward.title}
              </p>
              <p className="text-brand-purple text-[28px] font-semibold">
                {reward.points}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const redeemRewards = [
  {
    title: "$5 off Coupon",
    cost: 500,
    type: "coupon",
    value: 5,
  },
  {
    title: "$10 Off Coupon",
    cost: 1000,
    type: "coupon",
    value: 10,
  },
  {
    title: "Exclusive Product",
    cost: 2500,
    type: "product",
  },
];

function RedeemTab() {
  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-brand-yellow text-2xl font-semibold">
        Redeem Rewards
      </h2>
      <div className="flex flex-col gap-8">
        {redeemRewards.map((reward) => (
          <div
            key={reward.title}
            className="flex flex-col gap-3 rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] px-5 py-6 text-[#E9E9E9]"
          >
            <h3 className="text-2xl font-semibold">{reward.title}</h3>
            <div className="flex justify-between">
              <p className="text-brand-purple text-[28px] font-semibold">
                {reward.cost}
              </p>
              <p className="text-base font-normal">{reward.type}</p>
            </div>

            <Button className="text-brand-white bg-brand-purple mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold">
              Redeem Points
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Membership tiers configuration
// const membershipTiers = [
  {
    name: "Bronze",
    pointsRequired: 0,
    perks: ["5% bonus points", "Basic Support", "Welcome gift"],
    icon: "/images/svg/membership-icon-bronze.svg",
  },
  {
    name: "Gold",
    pointsRequired: 2500,
    perks: ["15% bonus points", "VIP Support", "Free shipping"],
    isCurrent: true,
    icon: "/images/svg/membership-icon-gold.svg",
  },
];

function TiersTab({ tierInfo }: { tierInfo: TierInfo | null }) {
  type TierName = "bronze" | "silver" | "gold" | "platinum" | "diamond";
  const [activeTier, setActiveTier] = useState<TierName>(
    (tierInfo?.currentTier as TierName) || "bronze"
  );

  function handleTierClick(tierName: string) {
    setActiveTier(tierName as TierName);
  }

  // Default tiers if not loaded from backend
  const defaultTiers = [
    {
      name: "Bronze",
      pointsRequired: 0,
      perks: ["5% bonus points", "Basic Support", "Welcome gift"],
      icon: "/images/svg/membership-icon-bronze.svg",
    },
    {
      name: "Gold",
      pointsRequired: 2500,
      perks: ["15% bonus points", "VIP Support", "Free shipping"],
      icon: "/images/svg/membership-icon-gold.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-brand-yellow text-2xl font-semibold">
        Membership Tiers
      </h2>

      <div className="flex flex-col gap-9">
        {defaultTiers.map((tier) => {
          const isCurrentTier = tier.name.toLowerCase() === activeTier.toLowerCase();

          return (
            <div
              key={tier.name}
              onClick={() => handleTierClick(tier.name.toLowerCase())}
              className={`flex transform flex-col gap-3 rounded-[14px] border-[0.2px] border-solid bg-[#0E121C] p-7 text-[#E9E9E9] transition-all duration-200 ease-linear cursor-pointer ${isCurrentTier ? "border-brand-purple" : "border-white/60"}`}
            >
              <div className="mx-auto flex flex-col items-center gap-2">
                <Image
                  src={tier.icon}
                  alt="tier icon"
                  width={84}
                  height={84}
                  className="aspect-square"
                />
                <p className="text-3xl font-semibold">{tier.name}</p>
                <p className="text-base font-normal">
                  {tier.pointsRequired} points required
                </p>
              </div>

              <ul className="text-[22px] font-normal">
                {tier.perks.map((perk) => (
                  <li key={perk} className="ml-7 list-disc">
                    {perk}
                  </li>
                ))}
              </ul>

              {isCurrentTier && (
                <Button className="text-brand-white bg-brand-purple mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold transition-all duration-200 ease-linear transform">
                  Current Tier
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
