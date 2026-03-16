"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  ChartNoAxesCombined,
  CornerRightDown,
  LockKeyhole,
  Shield,
  Zap,
} from "lucide-react";
import Slider from "@/components/slider/base";
import { earnService, EarnSummary, StakingOption, AimPlan } from "@/services/earnService";
import { toast } from "sonner";

// --- Components and Data ---

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="rounded-[10px] bg-gradient-to-r from-[#252670] to-[#4649D6] px-4 py-6">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="text-base text-[#E9E9E9]">{subtitle}</p>
  </div>
);

const StakeEarnTab = () => {
  const [selectedLock, setSelectedLock] = useState<number>(30);
  const [amount, setAmount] = useState<number>(100);
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

  const estimatedRewards = ((amount * selected.apy) / 100).toFixed(2);
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
    <div className="flex flex-col gap-10">
      <SectionHeader
        title="Stake & Earn"
        subtitle="Lock your tokens and earn rewards with competitive APY rates."
      />

      <div>
        <h3 className="text-2xl font-semibold text-[#E9F2A3]">
          Choose Lock Period
        </h3>
        <p className="text-sm text-[#E9E9E9]">
          Lock periods determine your APY. Longer locks yield higher returns.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {lockOptions.map((opt) => (
          <Card
            key={opt.days}
            className={`cursor-pointer !rounded-[14px] !bg-[#0E121C] p-3.5 !px-0 !py-0 transition-all duration-200 ease-linear ${
              selectedLock === opt.days
                ? "border[1.5px] border-[#4649D6]"
                : "border-[0.2px] border-white/60"
            }`}
            onClick={() => setSelectedLock(opt.days)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-2xl font-semibold">{opt.days} Days</p>
                <p className="text-base text-[#E9E9E9]">Min: ${opt.min}</p>
              </div>
              <p className="text-2xl font-bold text-[#319F43]">
                {opt.apy}%
                <span className="block text-sm font-normal text-[#E9E9E9]">
                  APY
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-[#E9F2A3]">Stake Amount</h3>
        <p className="text-base text-[#E9E9E9]">Amount to stake in USDC</p>
      </div>

      <div className="flex items-center rounded-[14px] border-[0.2px] border-solid border-white/60 bg-transparent px-6 py-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="hide-autofill flex-1 border-none bg-transparent text-2xl font-semibold text-[#E9E9E9] outline-none"
        />
        <span className="text-sm text-[#E9E9E9]">USDC</span>
      </div>

      <Card className="rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !px-0 !py-0">
        <CardContent className="flex flex-col gap-4 p-4">
          <h3 className="text-2xl font-semibold text-[#E9E9E9]">
            Reward Projection
          </h3>
          <div className="flex flex-col gap-2 text-base">
            <p className="flex justify-between">
              <span className="font-normal text-[#E9E9E9]">
                Estimated Rewards:
              </span>
              <span className="font-bold text-white">${estimatedRewards}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-normal text-[#E9E9E9]">Total Return:</span>
              <span className="font-bold text-white">${totalReturn}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-normal text-[#E9E9E9]">Lock Period:</span>
              <span className="font-bold text-white">{selected.days} days</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleStake}
        disabled={stakingLoading}
        className="text-brand-white bg-brand-purple flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold"
      >
        {stakingLoading ? "Staking..." : "Stake Now"}
      </Button>
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

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader
        title="AIM Plans"
        subtitle="Automated Investment Management tailored to risk profile."
      />

      <div className="flex flex-col gap-8">
        {plans.map((plan) => {
          const Icon = currentPlanIcon(plan.id);
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`flex w-full flex-col gap-5 rounded-[14px] bg-[#0E121C] px-[18px] py-3.5 text-[#E9E9E9] ${
                selectedPlan.id === plan.id
                  ? "border-[1.5px] border-[#4649D6]"
                  : "border-0 border-transparent"
              } cursor-pointer transition-all duration-200 ease-linear`}
            >
              <div className="flex h-[56px] w-[59px] items-center justify-center rounded-[10px] bg-[#252670]">
                <Icon size={32} color="#E9F2A3" />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-3xl font-semibold">{plan.name}</p>
                <p className="text-base font-normal">{plan.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold">Risk Level:</p>
                  <p className="">{plan.riskLevel}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-normal">Expected Return:</p>
                  <p className="text-sm font-normal">{plan.expectedReturn}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3.5 rounded-[14px] bg-[#0E121C] px-[18px] py-[30px] text-[#E9E9E9]">
        <h1 className="text-3xl font-bold">Investment Configuration</h1>

        <div className="flex flex-col gap-5">
          <p>Investment Amount</p>

          <div>
            <Slider min={100} max={10000} step={100} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <h2 className="text-2xl font-semibold">Portfolio Allocation</h2>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Bonds:</p>
              <p className="text-sm font-normal">40%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Stocks:</p>
              <p className="text-sm font-normal">50%</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Alternatives:</p>
              <p className="text-sm font-normal">10%</p>
            </div>
          </div>
        </div>
      </div>

      <Button className="text-brand-white bg-brand-purple flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold">
        Start AIM Plan
      </Button>
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
    <div className="flex flex-col gap-10">
      <SectionHeader
        title="Synthetic US Stocks"
        subtitle="Get exposure to US stocks with tokenized positions."
      />

      <div className="flex flex-col gap-2.5">
        <h2 className="text-[26px] font-semibold">Trending Stocks</h2>

        <div className="flex flex-col gap-6">
          {stocksLoading ? (
            <p className="text-white/60 text-base">Loading trending stocks...</p>
          ) : (
            trendingStocks.map((stock) => (
              <Card
                key={stock.symbol}
                className={`cursor-pointer !rounded-[14px] border-[0.2px] border-solid border-white/60 !bg-[#0E121C] p-3.5 !px-0 !py-0 transition-all duration-200 ease-linear`}
              >
                <CardContent className="flex flex-col gap-0.5 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold uppercase">
                      {stock.symbol}{" "}
                    </p>
                    <p className="text-2xl font-normal text-[#E9E9E9]">
                      ${stock.price}
                    </p>
                  </div>

                  <p className="flex items-center justify-between">
                    <span className="text-base font-normal">{stock.name}</span>
                    <span
                      className={`flex items-center gap-1 text-base font-bold ${stock.isPositive ? "text-[#319F43]" : "text-[#FE0420]"} `}
                    >
                      <ChartNoAxesCombined size={16} />
                      <span>{stock.changePercent}%</span>
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5 rounded-[14px] bg-[#0E121C] px-[18px] py-[30px]">
        <h2 className="text-3xl font-bold text-[#E9E9E9]">
          Buy Exposure: MSFT
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-medium text-[#E9E9E9]">
                Microsoft Corp.
              </p>
              <span
                className={`flex items-center gap-1 text-base font-bold text-[#319F43]`}
              >
                <ChartNoAxesCombined size={16} />
                <span>$5.67 (1.52)</span>
              </span>
            </div>
            <p className="text-2xl font-medium text-[#E9E9E9]">$378.45</p>
          </div>

          <div className="flex items-center rounded-[10px] border-[0.5px] border-solid border-white/60 bg-transparent px-6 py-2">
            <input
              type="number"
              placeholder="1000"
              className="hide-autofill flex-1 border-none bg-transparent text-2xl font-semibold text-[#E9E9E9] outline-none"
            />
            <span className="text-[22px] text-[#E9E9E9]">USDC</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <h2 className="text-2xl font-semibold">Position Summary</h2>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Shares:</p>
              <p className="text-xl font-normal">2.546</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Entry Price:</p>
              <p className="text-xl font-normal">$343.78</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base font-normal">Platform Fees:</p>
              <p className="text-xl font-normal">0.1%</p>
            </div>
          </div>
        </div>
      </div>

      <Button className="text-brand-white bg-brand-purple flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold">
        Buy Exposure
      </Button>
    </div>
  );
};

const tabs = [
  {
    key: "stake-earn",
    label: "Stake & Earn",
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
    label: "Synthetic Stocks",
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
    <div className="flex w-full max-w-[640px] flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#E9F2A3]">Earn</h1>
        <p className="text-brand-white text-sm font-normal">
          Grow your wealth through staking, automated investing, and synthetic
          assets.
        </p>
      </div>

      {!loading && summary && (
        <Card className="!rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !px-0 !py-0">
          <CardContent className="grid grid-cols-2 gap-4 p-5">
            <div>
              <p className="text-xs text-brand-white/60 uppercase">Total Invested</p>
              <p className="text-2xl font-bold text-white">
                ${(summary.totalInvestedUSD + summary.totalStakedUSD).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-brand-white/60 uppercase">Lifetime Earnings</p>
              <p className="text-2xl font-bold text-[#319F43]">
                +${summary.totalEarnedUSD.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border-[0.3px] border-solid border-white/60">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex w-full transform cursor-pointer items-center justify-center gap-1 p-3.5 text-[22px] font-medium transition duration-200 ease-linear ${
                tab.key === currentTab ? "bg-brand-purple" : "bg-transparent"
              }`}
              onClick={() => setCurrentTab(tab.key)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="transition duration-200 ease-linear transform-content">
          {tabs.map((tab) => {
            if (tab.key === currentTab) {
              return <tab.component key={tab.key} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
