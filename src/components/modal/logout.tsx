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
    <DialogContent className="w-full !max-w-[400px] rounded-[20px] border-none bg-[#0E121C] px-[18px] py-5">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-5">
          <div className="flex aspect-square h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#FE0420] font-sans">
            <Power size={15} color="#ffffff" strokeWidth={2} />
          </div>
          <span>Are you sure you want to Log Out?</span>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-7">
        <DialogClose asChild>
          <Button
            type="button"
            disabled={loading}
            className="rounded-[20px] bg-[#1F2937] py-3 text-base font-medium"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-[20px] bg-[#FE0420] py-3 text-base font-medium"
        >
          {loading ? "Logging out..." : "Log Out"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
