"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white border border-zinc-200 shadow-xl rounded-3xl p-4 sm:p-6">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200 shadow-sm">
            <AlertCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-display font-extrabold text-zinc-950">Something Went Wrong</CardTitle>
          <CardDescription className="text-xs sm:text-sm font-sans text-zinc-600 leading-relaxed">
            We encountered an error while loading your dashboard. Your funds are
            safe and secure.
          </CardDescription>
          {error.digest && (
            <p className="text-xs text-zinc-400 font-mono mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3 mt-4">
          <Button
            onClick={reset}
            className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-11 shadow-md shadow-brand-purple/20 cursor-pointer text-sm"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sans font-bold rounded-full h-11 cursor-pointer text-sm" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
