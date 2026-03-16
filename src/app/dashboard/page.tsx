import { Balances, UnifiedBalance } from "@/components/balance";

export default function UHome() {
  return (
    <div className="flex flex-col gap-8 p-1 sm:p-2 lg:p-4 animate-in fade-in duration-700">
      <UnifiedBalance />
      <Balances />
    </div>
  );
}
