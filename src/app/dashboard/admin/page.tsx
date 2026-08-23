"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  Coins,
  Search,
  Sparkles,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService, AdminUser, LedgerEntry, SavingsSummary } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-sm rounded-2xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "ledger" | "savings">("ledger");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [savings, setSavings] = useState<SavingsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Search/Filter states
  const [userQuery, setUserQuery] = useState("");
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>("all");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [submittingPromote, setSubmittingPromote] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, ledgerData, savingsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getLedger(),
        adminService.getSavings(),
      ]);
      setUsers(usersData);
      setLedger(ledgerData);
      setSavings(savingsData);
    } catch (error: any) {
      console.error("Failed to load admin dashboard data", error);
      toast.error(error.message || "Unauthorized or failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail) return toast.error("Please enter a user email");
    setSubmittingPromote(true);
    try {
      const response = await adminService.promoteUser(promoteEmail);
      toast.success(response.message || "User promoted to admin!");
      setPromoteEmail("");
      fetchData(); // Reload users list
    } catch (error: any) {
      toast.error(error.message || "Failed to promote user.");
    } finally {
      setSubmittingPromote(false);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const q = userQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.bankTag && u.bankTag.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const filteredLedger = ledger.filter((l) => {
    if (ledgerTypeFilter === "all") return true;
    if (ledgerTypeFilter === "stable_tags") {
      // Stable tags transfers are internal transfers (transfer_in or transfer_out)
      return l.type === "transfer_in" || l.type === "transfer_out";
    }
    return l.type === ledgerTypeFilter;
  });

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight flex items-center gap-3">
            Admin Panel <span className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-mono font-bold border border-brand-purple/20 uppercase tracking-wider">Superuser</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-[600px] font-sans">
            Audit off-chain virtual ledgers, monitor user deposits, manage administrative privileges, and review StableBank interactions.
          </p>
        </div>
        <Button
          onClick={fetchData}
          disabled={loading}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-11 px-5 flex items-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          Reload Data
        </Button>
      </div>

      {/* Overview stats cards */}
      {savings && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Users</span>
              <div className="h-9 w-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                <Users size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">{users.length}</h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">Registered accounts</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Deposits</span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Coins size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
              ${(savings.summary.totalDeposits || savings.summary.combinedSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              USDC: ${savings.summary.totalUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })} | USDT: ${savings.summary.totalUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Utilizable Balance</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-emerald-600 tracking-tight">
              ${(savings.summary.utilizableBalance || ((savings.summary.totalDeposits || savings.summary.combinedSavings || 0) * 0.8)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">80% available for yield allocation</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Required Reserve</span>
              <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <ShieldCheck size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-red-600 tracking-tight">
              ${(savings.summary.requiredReserve || ((savings.summary.totalDeposits || savings.summary.combinedSavings || 0) * 0.2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">20% liquidity buffer for safety</p>
          </GlassCard>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button
          onClick={() => setActiveTab("ledger")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "ledger" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={18} /> Internal Ledger Audit
          </span>
          {activeTab === "ledger" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("savings")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "savings" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <TrendingUp size={18} /> Deposits Leaderboard
          </span>
          {activeTab === "savings" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "users" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <Users size={18} /> Users & Admin Privileges
          </span>
          {activeTab === "users" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          
          {/* TAB 1: LEDGER */}
          {activeTab === "ledger" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-display font-bold text-zinc-950">Off-chain Virtual Ledger Log</h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">Filter Type:</span>
                  <select
                    value={ledgerTypeFilter}
                    onChange={(e) => setLedgerTypeFilter(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs font-sans font-semibold text-zinc-800 outline-none focus:border-brand-purple transition-colors cursor-pointer"
                  >
                    <option value="all">All Operations</option>
                    <option value="stable_tags">Stable Tag Transfers</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="transfer_out">Transfers Out</option>
                    <option value="transfer_in">Transfers In</option>
                    <option value="reward">Rewards</option>
                    <option value="fee">Fees</option>
                  </select>
                </div>
              </div>

              <GlassCard className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">User / Email</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Counterparty (Stable Tag)</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Description</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Reference / Hash</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500 font-sans text-sm">
                          No ledger records found matching filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLedger.map((entry) => {
                        const isPositive = entry.amount > 0;
                        const isStableTag = entry.type === "transfer_in" || entry.type === "transfer_out";

                        return (
                          <tr key={entry._id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-zinc-950 text-sm">
                                  {entry.userId?.firstName ? `${entry.userId.firstName} ${entry.userId.lastName}` : "User"}
                                </span>
                                <span className="text-xs text-zinc-500 font-sans">{entry.userId?.email || "unknown@stablebank"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border",
                                entry.type === "deposit" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                entry.type === "withdrawal" && "bg-red-50 text-red-700 border-red-200",
                                isStableTag && "bg-purple-50 text-brand-purple border-purple-200",
                                entry.type === "reward" && "bg-amber-50 text-amber-700 border-amber-200",
                                entry.type === "fee" && "bg-zinc-100 text-zinc-700 border-zinc-200"
                              )}>
                                {entry.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-xs text-zinc-900">{entry.currency}</td>
                            <td className={cn("p-4 font-mono font-bold text-xs", isPositive ? "text-emerald-600" : "text-red-600")}>
                              {isPositive ? "+" : ""}{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </td>
                            <td className="p-4">
                              {entry.counterpartyId ? (
                                <div className="flex flex-col">
                                  <span className="text-xs font-mono text-brand-purple font-bold">
                                    @{entry.counterpartyId.bankTag || "no-tag"}
                                  </span>
                                  <span className="text-xs text-zinc-400 font-sans">{entry.counterpartyId.email}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-400">—</span>
                              )}
                            </td>
                            <td className="p-4 text-xs text-zinc-600 max-w-[200px] truncate font-sans" title={entry.description}>
                              {entry.description || "No description"}
                            </td>
                            <td className="p-4 font-mono text-xs text-zinc-400 max-w-[120px] truncate" title={entry.referenceId}>
                              {entry.referenceId ? (
                                <span className="flex items-center gap-1 hover:text-zinc-900 cursor-pointer transition-colors">
                                  {entry.referenceId.substring(0, 10)}...
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="p-4 text-xs font-mono text-zinc-500">
                              {new Date(entry.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* TAB 2: DEPOSITS REVIEW */}
          {activeTab === "savings" && savings && (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-display font-bold text-zinc-950">Deposits Leaderboard & Balances</h3>
              
              <GlassCard className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Rank</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">User / Email</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Stable Tag</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">USDC Virtual Balance</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">USDT Virtual Balance</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">Combined Deposits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savings.individualSavings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans text-sm">
                          No deposit records found.
                        </td>
                      </tr>
                    ) : (
                      savings.individualSavings.map((saver, idx) => (
                        <tr key={saver.userId} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-xs">
                            {idx === 0 ? (
                              <span className="text-amber-600 flex items-center gap-1 font-bold">🥇 1</span>
                            ) : idx === 1 ? (
                              <span className="text-zinc-500 flex items-center gap-1 font-bold">🥈 2</span>
                            ) : idx === 2 ? (
                              <span className="text-amber-800 flex items-center gap-1 font-bold">🥉 3</span>
                            ) : (
                              <span className="text-zinc-400 pl-6">{idx + 1}</span>
                            )}
                          </td>
                          <td className="p-4 text-sm font-sans font-bold text-zinc-950">{saver.email}</td>
                          <td className="p-4 font-mono font-bold text-xs text-brand-purple">
                            {saver.bankTag ? `@${saver.bankTag}` : "—"}
                          </td>
                          <td className="p-4 font-mono text-xs text-zinc-600 text-right">
                            ${saver.usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-xs text-zinc-600 text-right">
                            ${saver.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-right font-black text-xs text-emerald-600">
                            ${saver.totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* TAB 3: USERS & ADMIN PRIVILEGES */}
          {activeTab === "users" && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Left Side: Users List */}
              <div className="flex flex-col gap-6 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-display font-bold text-zinc-950">Platform Users</h3>
                  
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search email, stable tag, role..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <GlassCard className="p-0 overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Email / Tag</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">KYC Status</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Account Type</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans text-sm">
                            No users found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-sans font-bold text-zinc-950">{user.email}</span>
                                <span className="text-xs text-brand-purple font-mono font-bold">
                                  {user.bankTag ? `@${user.bankTag}` : "no tag"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase",
                                user.role === "admin" ? "bg-red-50 text-red-700 border-red-200" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                              )}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-xs font-sans font-semibold text-zinc-900">
                                {user.kycStatus === "approved" ? (
                                  <>
                                    <CheckCircle size={14} className="text-emerald-600" />
                                    <span>Approved</span>
                                  </>
                                ) : user.kycStatus === "rejected" ? (
                                  <>
                                    <XCircle size={14} className="text-red-600" />
                                    <span>Rejected</span>
                                  </>
                                ) : user.kycStatus === "pending" ? (
                                  <>
                                    <Clock size={14} className="text-amber-600" />
                                    <span>Pending</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={14} className="text-zinc-400" />
                                    <span className="text-zinc-400">Not Started</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-mono text-zinc-600 uppercase font-semibold">{user.accountType}</td>
                            <td className="p-4">
                              <span className={cn(
                                "h-2 w-2 rounded-full inline-block mr-2",
                                user.status === "active" ? "bg-emerald-500" : "bg-red-500"
                              )} />
                              <span className="text-xs text-zinc-600 font-sans capitalize">{user.status}</span>
                            </td>
                            <td className="p-4 text-xs font-mono text-zinc-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </GlassCard>
              </div>

              {/* Right Side: Promotion Action Tool */}
              <GlassCard className="w-full lg:w-96 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-zinc-950">Promote Admin</h3>
                    <p className="text-xs text-zinc-500 font-sans">Add administrative privileges</p>
                  </div>
                </div>

                <form onSubmit={handlePromote} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">User Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingPromote}
                    className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    {submittingPromote ? "Assigning..." : "Assign Admin Privilege"}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                    <Sparkles size={14} /> Security Advisory
                  </div>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    Administrators gain write access to fraud alerts, watchlist modifications, and are allowed to authorize/reject platform operations. Only promote trusted team members.
                  </p>
                </div>
              </GlassCard>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
