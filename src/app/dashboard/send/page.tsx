import UProfileCard from "@/components/cards/u/profile";
import { topSenders, topUsers } from "@/lib/dummy";
import { Search } from "lucide-react";

export default function USend() {
  return (
    <div className="flex w-full max-w-[678px] flex-col gap-5">
      <h1 className="text-2xl font-semibold">Send Token</h1>

      <div className="flex items-center gap-2 rounded-[20px] bg-[#0E121C] px-3.5 py-4 text-sm font-semibold text-white/60">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search Networks"
          className="hide-autofill h-full w-full border-0 bg-inherit ring-0 outline-0"
        />
      </div>

      <div className="space-y-5">
        <div>
          <h2 className="mb-1.5 text-base font-medium">Top Users</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {topUsers.map((user) => (
              <UProfileCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-1.5 text-base font-medium">Top Sender</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {topSenders.map((user) => (
              <UProfileCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
