"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Send, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40", className)}>
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
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
          Broadcast Memo <span className="text-sm bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full font-bold border border-brand-purple/30 uppercase tracking-wider">System Alert</span>
        </h1>
        <p className="text-white/40 text-base">
          Send a push notification and virtual inbox alert to all registered users of the StableBank platform in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Memo Form */}
        <div className="md:col-span-2">
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled System Upgrade or New High-Yield Vaults"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-medium outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Notification Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-medium outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                >
                  <option value="system">System Notification</option>
                  <option value="security">Security Alert</option>
                  <option value="promotion">Promo / Announcement</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-md font-bold text-white/40 uppercase tracking-widest block">Detailed Message Body</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft your announcement message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white font-medium outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-brand-purple/10"
              >
                <Send size={16} />
                {submitting ? "Broadcasting..." : "Broadcast Memo Now"}
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-100" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#E9F2A3]">
                <Sparkles size={14} /> Real-time Delivery
              </div>
              <p className="text-md text-white/50 leading-relaxed">
                Memos are stored in each user's notification list and pushed instantly to all online users using Server-Sent Events (SSE).
              </p>
              <p className="text-md text-white/50 leading-relaxed">
                Make sure formatting, tone, and information are verified before clicking broadcast.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="border-red-500/10">
            <div className="relative space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
                <ShieldAlert size={14} /> Attention
              </div>
              <p className="text-md text-white/50 leading-relaxed">
                This action is non-reversible. Standard system notifications cannot be withdrawn from user inboxes once sent.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
