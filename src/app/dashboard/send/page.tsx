"use client";

import UProfileCard from "@/components/cards/u/profile";
import { Search } from "lucide-react";
import { transferService } from "@/services/transferService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { UserProfile } from "@/types/user";

export default function USend() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent transfer recipients on mount
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const history = await transferService.getTransferHistory();
        // Extract unique recipients from history
        const uniqueRecipients = Array.isArray(history)
          ? history
              .filter((t) => t.toBankTag)
              .reduce((acc: any[], transfer) => {
            if (!acc.find((u) => u.bankTag === transfer.toBankTag)) {
              acc.push({
                id: transfer.toUserId || 0,
                username: transfer.toBankTag || "",
                bankTag: transfer.toBankTag || "",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${transfer.toBankTag}`,
                bgColor: "from-purple-500 to-blue-500",
              });
            }
            return acc;
          }, [])
              .slice(0, 12) : []; // Limit to 12 recent users

        setRecentUsers(uniqueRecipients);
      } catch (error) {
        console.error("Failed to fetch recent users:", error);
        // Set empty array on error
        setRecentUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  // Search users as user types
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await transferService.searchUsers(searchQuery);
        // Transform results to UserProfile format
        const profiles: UserProfile[] = Array.isArray(results) ? results.map((result: any) => ({
          id: result.id || result.userId,
          username: result.bankTag || result.displayName || "Unknown",
          bankTag: result.bankTag,
          displayName: result.displayName,
          avatar: result.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.bankTag}`,
          bgColor: result.bgColor || "from-gray-500 to-gray-700",
        })) : [];
        setSearchResults(profiles);
      } catch (error: any) {
        console.error("Search failed:", error);
        toast.error(error?.message || "Search failed");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const displayUsers = searchQuery.trim() ? searchResults : recentUsers;

  return (
    <div className="flex w-full max-w-full lg:max-w-[678px] flex-col gap-4 sm:gap-5">
      <h1 className="text-xl sm:text-2xl font-semibold">Send Token</h1>

      <div className="flex items-center gap-2 rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-[#0E121C] px-3 sm:px-3.5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white/60">
        <Search size={16} className="sm:w-5 sm:h-5 shrink-0" />
        <input
          type="text"
          placeholder="Search by BankTag or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="hide-autofill h-full w-full border-0 bg-inherit ring-0 outline-0 text-xs sm:text-sm text-white placeholder:text-white/60"
        />
      </div>

      <div className="space-y-4 sm:space-y-5">
        {isLoading || isSearching ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
          </div>
        ) : displayUsers.length > 0 ? (
          <div>
            <h2 className="mb-1.5 sm:mb-2 text-sm sm:text-base font-medium">
              {searchQuery.trim() ? "Search Results" : "Recent Recipients"}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {displayUsers.map((user) => (
                <UProfileCard 
                  key={user.id} 
                  user={{
                    id: user.id,
                    username: user.username || user.bankTag || "Unknown",
                    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.bankTag}`,
                    bgColor: user.bgColor || "from-purple-500 to-blue-500",
                  }} 
                />
              ))}
            </div>
          </div>
        ) : searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-white/60">No users found</p>
            <p className="text-sm text-white/40">Try searching with a different BankTag</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-white/60">No recent recipients</p>
            <p className="text-sm text-white/40">Start sending to see your recent recipients here</p>
          </div>
        )}
      </div>
    </div>
  );
}
