"use client";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Power } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function LogoutModal() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="w-full !max-w-[400px] rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-2xl text-zinc-950">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-4">
          <div className="flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
            <Power size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-zinc-950">Are you sure you want to Log Out?</span>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
        <DialogClose asChild>
          <Button
            type="button"
            disabled={loading}
            className="rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 h-11 text-sm font-sans font-bold cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-full bg-red-600 hover:bg-red-700 text-white h-11 text-sm font-sans font-bold shadow-md shadow-red-600/20 cursor-pointer"
        >
          {loading ? "Logging out..." : "Log Out"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
