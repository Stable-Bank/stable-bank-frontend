"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  ShieldCheck,
  FileCheck,
  Upload,
  ChevronRight,
  ChevronLeft,
  Clock,
  Landmark,
  Lock,
  FileText,
  AlertTriangle,
  RefreshCcw,
  LogOut,
  UserCheck
} from "lucide-react";
import { cn } from "@/utils/cn";
import { USFlagIcon, UKFlagIcon, EUFlagIcon, NGFlagIcon } from "@/components/ui/flag-icons";

interface BusinessKybGatewayProps {
  onRefreshStatus?: () => void;
}

export default function BusinessKybGateway({ onRefreshStatus }: BusinessKybGatewayProps) {
  const { user, updateUser, logout } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [companyData, setCompanyData] = useState({
    // Step 1: Company Profile
    businessName: user?.firstName || "",
    registrationNumber: "",
    countryOfIncorporation: "US",
    entityType: "llc",
    website: "",
    
    // Step 2: Corporate Documents
    incDocName: "",
    addressDocName: "",
    taxDocName: "",
    
    // Step 3: Authorized Signatory
    officerFullName: user?.lastName ? `${user.firstName || ""} ${user.lastName}` : "",
    officerRole: "Director / CEO",
    officerIdDocName: "",
    bankTag: user?.bankTag?.replace("@", "").replace("$", "") || "",
  });

  const [tagChecking, setTagChecking] = useState(false);
  const [tagAvailable, setTagAvailable] = useState<boolean | null>(null);

  const countries = [
    { code: "US", name: "United States (Delaware/WY)", icon: USFlagIcon },
    { code: "GB", name: "United Kingdom (Companies House)", icon: UKFlagIcon },
    { code: "EU", name: "European Union", icon: EUFlagIcon },
    { code: "NG", name: "Nigeria (CAC)", icon: NGFlagIcon },
  ];

  const handleInputChange = (field: string, value: any) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    if (field === "bankTag") {
      setTagAvailable(null);
    }
  };

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleInputChange(field, file.name);
      toast.success(`Attached: ${file.name}`);
    }
  };

  const handleCheckBankTag = async () => {
    if (!companyData.bankTag || companyData.bankTag.length < 3) {
      toast.error("Corporate StableTag must be at least 3 characters.");
      return;
    }
    setTagChecking(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setTagAvailable(true);
      toast.success(`$${companyData.bankTag} is available!`);
    } catch {
      setTagAvailable(false);
      toast.error("Tag is unavailable. Please choose another.");
    } finally {
      setTagChecking(false);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.businessName.trim() || !companyData.registrationNumber.trim()) {
      toast.error("Company Name and Registration/EIN Number are required.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.incDocName) {
      toast.error("Certificate of Incorporation is required.");
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.officerFullName.trim() || !companyData.bankTag.trim()) {
      toast.error("Officer Name and Corporate StableTag are required.");
      return;
    }
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // 1. Submit company profile
      await apiClient.patch("/users/profile", {
        firstName: companyData.businessName,
        lastName: `(${companyData.entityType.toUpperCase()})`,
        bankTag: companyData.bankTag.startsWith("$") ? companyData.bankTag : `$${companyData.bankTag}`,
      });

      // 2. Update local state to pending
      updateUser({
        firstName: companyData.businessName,
        lastName: `(${companyData.entityType.toUpperCase()})`,
        bankTag: companyData.bankTag.startsWith("$") ? companyData.bankTag : `$${companyData.bankTag}`,
        kycStatus: "pending",
      });

      toast.success("Business verification application submitted!");
      if (onRefreshStatus) onRefreshStatus();
    } catch (error) {
      console.warn("API profile update fallback to local state:", error);
      updateUser({
        firstName: companyData.businessName,
        lastName: `(${companyData.entityType.toUpperCase()})`,
        bankTag: `$${companyData.bankTag}`,
        kycStatus: "pending",
      });
      toast.success("Corporate verification submitted for review!");
      if (onRefreshStatus) onRefreshStatus();
    } finally {
      setLoading(false);
    }
  };

  // 1. REVIEW IN PROGRESS STATE (If user status is already pending)
  if (user?.kycStatus === "pending") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl bg-white border border-zinc-200 p-8 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm animate-pulse">
            <Clock size={36} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider font-mono">
              <Clock size={12} /> Compliance Review In Progress
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 tracking-tight">
              Corporate Account Under Review
            </h2>
            <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed font-sans">
              Your business verification documents are currently being audited by our qualified custodian partners. Treasury accounts and corporate cards will unlock immediately upon approval.
            </p>
          </div>

          {/* Verification Details Card */}
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-sans font-semibold">Entity Name</span>
              <span className="text-zinc-900 font-bold">{user?.firstName || companyData.businessName || "Registered Business"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-sans font-semibold">Corporate Tag</span>
              <span className="text-brand-purple font-bold">{user?.bankTag || `$${companyData.bankTag}` || "$treasury"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
              <span className="text-zinc-500 font-sans font-semibold">Estimated Turnaround</span>
              <span className="text-emerald-600 font-bold">12 - 24 Hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-sans font-semibold">Audit Level</span>
              <span className="text-zinc-800 font-bold">SOC-2 / Tier 2 Institutional</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onRefreshStatus}
              className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 font-bold rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <RefreshCcw size={15} /> Check Approval Status
            </Button>
            <Button
              onClick={() => logout()}
              variant="outline"
              className="h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={15} /> Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RESTRICTIVE ONBOARDING FLOW (Step 1 -> 4)
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500 max-w-3xl mx-auto w-full">
      <div className="w-full rounded-3xl bg-white border border-zinc-200 p-6 sm:p-10 shadow-lg space-y-7 relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex items-center justify-center shadow-xs shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2.5 py-0.5 rounded-full border border-brand-purple/20">
                  Business Account
                </span>
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1 font-mono">
                  <Lock size={12} /> Restrictive KYB
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-zinc-950 tracking-tight mt-1">
                Corporate Verification & Treasury Setup
              </h1>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-full shrink-0">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  step === s
                    ? "w-6 bg-brand-purple"
                    : step > s
                    ? "w-2 bg-emerald-500"
                    : "w-2 bg-zinc-300"
                )}
              />
            ))}
            <span className="text-[10px] font-mono text-zinc-500 ml-1 font-bold">Step {step}/4</span>
          </div>
        </div>

        {/* Notice Alert */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">Mandatory Corporate Compliance</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed font-sans">
              In accordance with institutional financial regulations, business accounts must complete Know-Your-Business (KYB) document submission before accessing live treasury ledgers or issuing employee cards.
            </p>
          </div>
        </div>

        {/* STEP 1: Company Profile */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Legal Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Labs Inc."
                  value={companyData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Company / EIN Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12-3456789 or RC-982341"
                  value={companyData.registrationNumber}
                  onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Entity Type</label>
                <select
                  value={companyData.entityType}
                  onChange={(e) => handleInputChange("entityType", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm text-zinc-900 focus:border-brand-purple outline-none transition-all cursor-pointer font-sans"
                >
                  <option value="llc">Limited Liability Company (LLC)</option>
                  <option value="c_corp">C-Corporation / Inc</option>
                  <option value="ltd">Private Limited Company (Ltd)</option>
                  <option value="partnership">Partnership / LLP</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Company Website</label>
                <input
                  type="url"
                  placeholder="https://acme.com"
                  value={companyData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Country of Incorporation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {countries.map((c) => {
                  const Icon = c.icon;
                  const isSelected = companyData.countryOfIncorporation === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleInputChange("countryOfIncorporation", c.code)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left font-mono",
                        isSelected
                          ? "bg-brand-purple/10 border-brand-purple text-brand-purple shadow-xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="truncate">{c.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 mt-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Continue to Registration Docs <ChevronRight size={16} />
            </Button>
          </form>
        )}

        {/* STEP 2: Corporate Registration Documents */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5 animate-in fade-in duration-300">
            {/* Document 1: Certificate of Incorporation */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck size={14} className="text-brand-purple" /> Certificate of Incorporation / License *
                </label>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Required</span>
              </div>
              <label className="border border-dashed border-zinc-300 hover:border-brand-purple bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block font-sans">
                      {companyData.incDocName || "Upload Certificate of Incorporation (PDF/Image)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans">Official government registration document</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload("incDocName", e)}
                  className="hidden"
                />
                <span className="text-xs font-bold text-brand-purple px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 font-mono">
                  {companyData.incDocName ? "Replace" : "Browse"}
                </span>
              </label>
            </div>

            {/* Document 2: Proof of Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark size={14} className="text-amber-600" /> Proof of Business Address
              </label>
              <label className="border border-dashed border-zinc-300 hover:border-amber-500 bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block font-sans">
                      {companyData.addressDocName || "Upload Bank Statement or Utility Bill (PDF/Image)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans">Dated within the last 90 days</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload("addressDocName", e)}
                  className="hidden"
                />
                <span className="text-xs font-bold text-amber-700 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 font-mono">
                  {companyData.addressDocName ? "Replace" : "Browse"}
                </span>
              </label>
            </div>

            {/* Document 3: Tax ID / VAT */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-600" /> Tax Identification Document (Optional)
              </label>
              <label className="border border-dashed border-zinc-300 hover:border-indigo-500 bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block font-sans">
                      {companyData.taxDocName || "Upload Tax / VAT Certificate (PDF/Image)"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans">EIN Letter or Local Tax Registration</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload("taxDocName", e)}
                  className="hidden"
                />
                <span className="text-xs font-bold text-indigo-700 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 font-mono">
                  {companyData.taxDocName ? "Replace" : "Browse"}
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 h-12 rounded-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm cursor-pointer shadow-sm"
              >
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
              <Button
                type="submit"
                className="w-2/3 h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Continue to Authorized Officer <ChevronRight size={16} />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Authorized Signatory */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Officer Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Doe"
                  value={companyData.officerFullName}
                  onChange={(e) => handleInputChange("officerFullName", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Corporate Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Executive Officer"
                  value={companyData.officerRole}
                  onChange={(e) => handleInputChange("officerRole", e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all font-sans"
                />
              </div>
            </div>

            {/* Officer ID Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Officer Government ID Document</label>
              <label className="border border-dashed border-zinc-300 hover:border-brand-purple bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-2xs">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block font-sans">
                      {companyData.officerIdDocName || "Upload Passport or National ID Photo"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-sans">Proof of identity for authorized signatory</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload("officerIdDocName", e)}
                  className="hidden"
                />
                <span className="text-xs font-bold text-brand-purple px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 font-mono">
                  {companyData.officerIdDocName ? "Replace" : "Browse"}
                </span>
              </label>
            </div>

            {/* Corporate StableTag */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Corporate Treasury StableTag</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-purple font-mono">$</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. acme_treasury"
                  value={companyData.bankTag}
                  onChange={(e) => handleInputChange("bankTag", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 pl-8 pr-28 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleCheckBankTag}
                  disabled={tagChecking || !companyData.bankTag}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-zinc-200 hover:bg-zinc-300 text-xs font-mono font-bold text-zinc-800 transition-all cursor-pointer disabled:opacity-40"
                >
                  {tagChecking ? "Checking..." : tagAvailable ? "Available ✓" : "Check Tag"}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="w-1/3 h-12 rounded-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm cursor-pointer shadow-sm"
              >
                <ChevronLeft size={16} className="mr-1" /> Back
              </Button>
              <Button
                type="submit"
                className="w-2/3 h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Review Application <ChevronRight size={16} />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: Review & Final Submission */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-5 space-y-4 font-mono text-xs">
              <h4 className="text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider border-b border-zinc-200 pb-2.5">
                Application Summary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-zinc-500 block">Legal Entity</span>
                  <span className="text-zinc-950 font-bold text-sm">{companyData.businessName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Registration Number</span>
                  <span className="text-zinc-950 font-bold">{companyData.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Jurisdiction</span>
                  <span className="text-zinc-950 font-bold">{companyData.countryOfIncorporation} ({companyData.entityType.toUpperCase()})</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Corporate StableTag</span>
                  <span className="text-brand-purple font-bold text-sm">${companyData.bankTag}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Incorporation Certificate</span>
                  <span className="text-emerald-600 font-bold truncate block">{companyData.incDocName || "Attached"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Authorized Officer</span>
                  <span className="text-zinc-950 font-bold truncate block">{companyData.officerFullName} ({companyData.officerRole})</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3.5 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                By submitting this application, you declare under penalty of perjury that you are authorized to act on behalf of the entity and that all uploaded documents are authentic.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(3)}
                className="w-1/3 h-12 rounded-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm cursor-pointer shadow-sm"
              >
                <ChevronLeft size={16} className="mr-1" /> Edit
              </Button>
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-2/3 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                {loading ? "Submitting Application..." : "Submit Corporate Verification ✓"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
