import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Balance Card Skeleton */}
      <Card className="bg-white border border-zinc-200 shadow-sm rounded-3xl">
        <CardHeader>
          <div className="h-6 w-32 bg-zinc-100 animate-pulse rounded-lg" />
          <div className="h-10 w-48 bg-zinc-100 animate-pulse rounded-xl mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-zinc-100 animate-pulse rounded" />
                <div className="h-6 w-24 bg-zinc-100 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border border-zinc-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 bg-zinc-100 animate-pulse rounded-full" />
                <div className="h-4 w-16 bg-zinc-100 animate-pulse rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions Skeleton */}
      <Card className="bg-white border border-zinc-200 shadow-sm rounded-3xl">
        <CardHeader>
          <div className="h-6 w-40 bg-zinc-100 animate-pulse rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-zinc-200 animate-pulse rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-200 animate-pulse rounded" />
                    <div className="h-3 w-24 bg-zinc-200 animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-5 w-20 bg-zinc-200 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
