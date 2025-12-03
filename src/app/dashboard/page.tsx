import { Balances, UnifiedBalance } from "@/components/balance";

export default function UHome() {
  return (
    <div className="flex flex-col gap-7">
      <UnifiedBalance />
      <Balances />
    </div>
  );
}
