import UProfileCard from "@/components/cards/u/profile";
import UConfirmTransaction from "@/components/modal/confirm-transaction";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { topUsers } from "@/lib/dummy";

export default async function USendTo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex w-full max-w-[675px] flex-col gap-5">
      <h1 className="text-2xl font-semibold text-[#E9F2A3]">Send to</h1>
      <div className="h-[144px] w-[132px]">
        <UProfileCard
          user={topUsers.filter((user) => user.id === Number(id))[0]}
          clickable={false}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-[20px] bg-[#0E121C] px-6 py-9 text-sm font-semibold text-white/60">
        <input
          type="number"
          placeholder="Amount"
          className="hide-autofill h-full w-full border-b border-solid border-white/60 bg-inherit pb-3 ring-0 outline-0 hover:border-[#4649D6] focus:border-[#4649D6]"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-[20px] bg-[#0E121C] px-6 py-9 text-sm font-semibold text-white/60">
        <textarea
          placeholder="Add Remark"
          className="hide-autofill h-full w-full resize-none border-0 bg-inherit ring-0 outline-0"
        />
      </div>

      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button className="text-brand-white bg-brand-purple flex h-12 cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold">
            Continue
          </Button>
        </DialogTrigger>
        <UConfirmTransaction />
      </Dialog>
    </div>
  );
}
