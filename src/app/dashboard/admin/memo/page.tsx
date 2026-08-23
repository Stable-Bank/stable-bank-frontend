"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-sm rounded-2xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function AdminMemoPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("system");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      return toast.error("Please fill in all fields.");
    }

    setSubmitting(true);
    try {
      const response = await adminService.sendMemo(title, message);
      if (response.success) {
        toast.success(response.message || "Memo broadcasted successfully!");
        setTitle("");
        setMessage("");
      } else {
        toast.error("Failed to broadcast memo.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Failed to broadcast memo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight flex items-center gap-3">
          Broadcast Memo <span className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-mono font-bold border border-brand-purple/20 uppercase tracking-wider">System Alert</span>
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-[600px] font-sans">
          Send a push notification and virtual inbox alert to all registered users of the StableBank platform in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Memo Form */}
        <div className="md:col-span-2">
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled System Upgrade or New High-Yield Vaults"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs sm:text-sm text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Notification Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs sm:text-sm text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-all cursor-pointer"
                >
                  <option value="system">System Notification</option>
                  <option value="security">Security Alert</option>
                  <option value="promotion">Promo / Announcement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Detailed Message Body</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft your announcement message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs sm:text-sm text-zinc-900 font-sans outline-none focus:border-brand-purple focus:bg-white transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                <Send size={16} />
                {submitting ? "Broadcasting..." : "Broadcast Memo Now"}
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden group border-indigo-100 bg-indigo-50/40">
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                <Sparkles size={14} /> Real-time Delivery
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                Memos are stored in each user&apos;s notification list and pushed instantly to all online users using Server-Sent Events (SSE).
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                Make sure formatting, tone, and information are verified before clicking broadcast.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-red-200 bg-red-50/40">
            <div className="relative space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
                <ShieldAlert size={14} /> Attention
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
                This action is non-reversible. Standard system notifications cannot be withdrawn from user inboxes once sent.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
