import { useState, useEffect, useCallback, useRef } from "react";
import { web3Service } from "@/services/web3Service";
import type { UnifiedBalance } from "@/types/wallet";

// Shared balance state across components
let sharedBalance: UnifiedBalance | null = null;
let sharedError: string | null = null;
let sharedLoading = false;
const listeners: Set<() => void> = new Set();

// Notify all listeners of state change
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// Fetch balance (shared across all components)
let fetchPromise: Promise<void> | null = null;
const fetchSharedBalance = async (walletAddress: string) => {
  // If already fetching, return existing promise
  if (fetchPromise) return fetchPromise;

  sharedLoading = true;
  sharedError = null;
  notifyListeners();

  fetchPromise = (async () => {
    try {
      const data = await web3Service.getUnifiedBalance(walletAddress);
      sharedBalance = data;
      sharedError = null;
    } catch (err: any) {
      console.error("Failed to fetch balance:", err);
      if (err?.status !== 401) {
        sharedError = err?.message || "Failed to load balance";
      }
    } finally {
      sharedLoading = false;
      fetchPromise = null;
      notifyListeners();
    }
  })();

  return fetchPromise;
};

export const useBalance = (walletAddress?: string) => {
  const [, forceUpdate] = useState({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Force component re-render when shared state changes
  const handleUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    // Subscribe to updates
    listeners.add(handleUpdate);

    return () => {
      // Unsubscribe on unmount
      listeners.delete(handleUpdate);
    };
  }, [handleUpdate]);

  useEffect(() => {
    if (!walletAddress) {
      // Clear interval if no wallet address
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchSharedBalance(walletAddress);

    // Set up auto-refresh (only one interval for all components)
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (walletAddress) {
          fetchSharedBalance(walletAddress);
        }
      }, 30000); // 30 seconds
    }

    return () => {
      // Clean up interval when component unmounts
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [walletAddress]);

  const refresh = useCallback(async () => {
    if (walletAddress) {
      await fetchSharedBalance(walletAddress);
    }
  }, [walletAddress]);

  return {
    balance: sharedBalance,
    isLoading: sharedLoading,
    error: sharedError,
    refresh,
  };
};
