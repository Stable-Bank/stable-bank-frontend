"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Sparkles,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { adminService, AdminUser, LedgerEntry, SavingsSummary } from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40", className)}>
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
    <div className="flex animate-in fade-in flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            Admin Panel <span className="text-sm bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full font-bold border border-brand-purple/30 uppercase tracking-wider">Superuser</span>
          </h1>
          <p className="text-white/40 text-base max-w-[600px]">
            Audit off-chain virtual ledgers, monitor user deposits, manage administrative privileges, and review StableBank interactions.
          </p>
        </div>
        <Button
          onClick={fetchData}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12 border border-white/10 flex items-center gap-2"
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          Reload Data
        </Button>
      </div>

      {/* Overview stats cards */}
      {savings && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Users</span>
              <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Users size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">{users.length}</h2>
            <p className="text-sm text-white/40 mt-1">Registered accounts</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E9F2A3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Deposits</span>
              <div className="h-10 w-10 rounded-xl bg-[#E9F2A3]/10 flex items-center justify-center text-[#E9F2A3]">
                <Coins size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ${(savings.summary.totalDeposits || savings.summary.combinedSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-sm text-white/40 mt-1">
              USDC: ${savings.summary.totalUSDC.toLocaleString(undefined, { maximumFractionDigits: 2 })} | USDT: ${savings.summary.totalUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Utilizable Balance</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ${(savings.summary.utilizableBalance || ((savings.summary.totalDeposits || savings.summary.combinedSavings || 0) * 0.8)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-sm text-white/40 mt-1">80% available for yield allocation</p>
          </GlassCard>

          <GlassCard className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Required Reserve</span>
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <ShieldCheck size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              ${(savings.summary.requiredReserve || ((savings.summary.totalDeposits || savings.summary.combinedSavings || 0) * 0.2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-sm text-white/40 mt-1">20% liquidity buffer for safety</p>
          </GlassCard>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("ledger")}
          className={cn(
            "pb-4 text-base font-bold transition-all relative outline-none",
            activeTab === "ledger" ? "text-white" : "text-white/40 hover:text-white/60"
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
            "pb-4 text-base font-bold transition-all relative outline-none",
            activeTab === "savings" ? "text-white" : "text-white/40 hover:text-white/60"
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
            "pb-4 text-base font-bold transition-all relative outline-none",
            activeTab === "users" ? "text-white" : "text-white/40 hover:text-white/60"
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
          <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-white/5 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* TAB 1: LEDGER */}
          {activeTab === "ledger" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white">Off-chain Virtual Ledger Log</h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest shrink-0">Filter Type:</span>
                  <select
                    value={ledgerTypeFilter}
                    onChange={(e) => setLedgerTypeFilter(e.target.value)}
                    className="bg-[#0E121C] border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-medium outline-none focus:border-brand-purple transition-colors"
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
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">User / Email</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Type</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Asset</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Amount</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Counterparty (Stable Tag)</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Description</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Reference / Hash</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-white/40">
                          No ledger records found matching filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLedger.map((entry) => {
                        const isPositive = entry.amount > 0;
                        const isStableTag = entry.type === "transfer_in" || entry.type === "transfer_out";

                        return (
                          <tr key={entry._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">
                                  {entry.userId?.firstName ? `${entry.userId.firstName} ${entry.userId.lastName}` : "User"}
                                </span>
                                <span className="text-sm text-white/40">{entry.userId?.email || "unknown@stablebank"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-sm font-bold uppercase px-2.5 py-1 rounded-full border",
                                entry.type === "deposit" && "bg-green-500/10 text-green-400 border-green-500/20",
                                entry.type === "withdrawal" && "bg-red-500/10 text-red-400 border-red-500/20",
                                isStableTag && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                                entry.type === "reward" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                                entry.type === "fee" && "bg-white/5 text-white/60 border-white/10"
                              )}>
                                {entry.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-sm text-white">{entry.currency}</td>
                            <td className={cn("p-4 font-mono font-black text-sm", isPositive ? "text-green-400" : "text-red-400")}>
                              {isPositive ? "+" : ""}{entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </td>
                            <td className="p-4">
                              {entry.counterpartyId ? (
                                <div className="flex flex-col">
                                  <span className="text-sm font-mono text-[#E9F2A3] font-bold">
                                    @{entry.counterpartyId.bankTag || "no-tag"}
                                  </span>
                                  <span className="text-md text-white/30">{entry.counterpartyId.email}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-white/20">—</span>
                              )}
                            </td>
                            <td className="p-4 text-sm text-white/70 max-w-[200px] truncate" title={entry.description}>
                              {entry.description || "No description"}
                            </td>
                            <td className="p-4 font-mono text-sm text-white/40 max-w-[120px] truncate" title={entry.referenceId}>
                              {entry.referenceId ? (
                                <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                                  {entry.referenceId.substring(0, 10)}...
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="p-4 text-sm text-white/40">
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
              <h3 className="text-xl font-bold text-white">Deposits Leaderboard & Balances</h3>
              
              <GlassCard className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Rank</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">User / Email</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Stable Tag</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest text-right">USDC Virtual Balance</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest text-right">USDT Virtual Balance</th>
                      <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest text-right">Combined Deposits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savings.individualSavings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-white/40">
                          No deposit records found.
                        </td>
                      </tr>
                    ) : (
                      savings.individualSavings.map((saver, idx) => (
                        <tr key={saver.userId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold text-sm">
                            {idx === 0 ? (
                              <span className="text-yellow-400 flex items-center gap-1 font-black">🥇 1</span>
                            ) : idx === 1 ? (
                              <span className="text-slate-300 flex items-center gap-1 font-black">🥈 2</span>
                            ) : idx === 2 ? (
                              <span className="text-amber-600 flex items-center gap-1 font-black">🥉 3</span>
                            ) : (
                              <span className="text-white/40 pl-6">{idx + 1}</span>
                            )}
                          </td>
                          <td className="p-4 text-sm font-bold text-white">{saver.email}</td>
                          <td className="p-4 font-mono font-bold text-sm text-[#E9F2A3]">
                            {saver.bankTag ? `@${saver.bankTag}` : "—"}
                          </td>
                          <td className="p-4 font-mono text-sm text-white/70 text-right">
                            ${saver.usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-sm text-white/70 text-right">
                            ${saver.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-right font-black text-sm text-[#E9F2A3]">
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
                  <h3 className="text-xl font-bold text-white">Platform Users</h3>
                  
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input
                      type="text"
                      placeholder="Search email, stable tag, role..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full h-10 bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white outline-none focus:border-brand-purple transition-colors"
                    />
                  </div>
                </div>

                <GlassCard className="p-0 overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Email / Tag</th>
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Role</th>
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">KYC Status</th>
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Account Type</th>
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Status</th>
                        <th className="p-4 text-sm font-bold text-white/40 uppercase tracking-widest">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-white/40">
                            No users found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{user.email}</span>
                                <span className="text-sm text-[#E9F2A3] font-mono font-bold">
                                  {user.bankTag ? `@${user.bankTag}` : "no tag"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-sm font-bold px-2 py-0.5 rounded border uppercase",
                                user.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-white/5 text-white/60 border-white/10"
                              )}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                {user.kycStatus === "approved" ? (
                                  <>
                                    <CheckCircle size={14} className="text-green-500" />
                                    <span>Approved</span>
                                  </>
                                ) : user.kycStatus === "rejected" ? (
                                  <>
                                    <XCircle size={14} className="text-red-500" />
                                    <span>Rejected</span>
                                  </>
                                ) : user.kycStatus === "pending" ? (
                                  <>
                                    <Clock size={14} className="text-yellow-500" />
                                    <span>Pending</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={14} className="text-white/20" />
                                    <span className="text-white/40">Not Started</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-white/70 uppercase font-semibold">{user.accountType}</td>
                            <td className="p-4">
                              <span className={cn(
                                "h-2 w-2 rounded-full inline-block mr-2",
                                user.status === "active" ? "bg-green-500" : "bg-red-500"
                              )} />
                              <span className="text-sm text-white/70 capitalize">{user.status}</span>
                            </td>
                            <td className="p-4 text-sm text-white/40">
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
                  <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Promote Admin</h3>
                    <p className="text-sm text-white/40">Add administrative privileges</p>
                  </div>
                </div>

                <form onSubmit={handlePromote} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest">User Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white font-medium outline-none focus:border-brand-purple transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingPromote}
                    className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    {submittingPromote ? "Assigning..." : "Assign Admin Privilege"}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#E9F2A3]">
                    <Sparkles size={14} /> Security Advisory
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
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
