"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User as UserIcon, 
  Lock, 
  ShieldCheck, 
  Camera, 
  Mail, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bankTag: user?.bankTag || "",
  });

  // Update profile data when user context changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bankTag: user.bankTag || "",
      });
    }
  }, [user]);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.patch("/users/profile", profileData);
      toast.success("Profile updated successfully!");
      if (response.user) {
        updateUser(response.user);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiClient.patch("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Avatar size must be less than 3MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const response = await apiClient.post("/users/avatar", formData);
      toast.success("Avatar uploaded successfully!");
      if (response.avatarUrl) {
        updateUser({ avatarUrl: response.avatarUrl });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      const response = await apiClient.patch("/users/toggle-2fa", { enabled: !user?.is2FAEnabled });
      toast.success(`2FA ${!user?.is2FAEnabled ? "enabled" : "disabled"}!`);
      if (response) {
        updateUser({ is2FAEnabled: !user?.is2FAEnabled });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to toggle 2FA");
    } finally {
      setLoading(false);
    }
  };

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '');

  return (
    <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-zinc-950">Settings</h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex gap-1 p-1 bg-zinc-100 border border-zinc-200 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "px-6 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer",
            activeTab === "profile" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "px-6 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all cursor-pointer",
            activeTab === "security" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
          )}
        >
          Security
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6 p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-brand-purple/20 bg-zinc-100">
                <Image
                  src={
                    user?.avatarUrl 
                      ? `${backendUrl}${user.avatarUrl}`
                      : `/images/svg/default-avatar.svg`
                  }
                  alt="avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-brand-purple rounded-full text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={18} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden" 
              />
            </div>
            
            <div className="text-center">
              <h3 className="font-display font-bold text-lg text-zinc-950">${user?.bankTag || "Member"}</h3>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Registered Member</p>
            </div>

            <div className="w-full h-px bg-zinc-100" />
            
            <p className="text-xs text-center text-zinc-500 font-sans leading-relaxed">
              Max file size is 3MB. Supported formats: JPG, PNG, SVG.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleProfileUpdate} className="lg:col-span-2 flex flex-col gap-6 p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">First Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-purple transition-colors" size={18} />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 pl-11 pr-4 text-zinc-900 font-sans focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Last Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-purple transition-colors" size={18} />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 pl-11 pr-4 text-zinc-900 font-sans focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  value={profileData.email}
                  disabled // Recommended to disable email edit for now or handle via separate flow
                  className="w-full h-11 rounded-xl bg-zinc-100 border border-zinc-200 pl-11 pr-4 text-zinc-500 font-sans outline-none cursor-not-allowed text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">StableTag (BankTag)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple font-bold text-sm">$</span>
                <input
                  type="text"
                  value={profileData.bankTag}
                  onChange={(e) => setProfileData({ ...profileData, bankTag: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  placeholder="username"
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 pl-8 pr-4 text-zinc-900 font-mono focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">Your unique identifier for receiving transfers. Alphanumeric characters only.</p>
            </div>

            <div className="mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-8 h-11 font-sans font-bold shadow-md shadow-brand-purple/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Security Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-8 bg-purple-50/60 border border-brand-purple/20 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-purple rounded-2xl">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <h3 className="font-display font-bold text-xl text-zinc-950">Security Status</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans mb-6 leading-relaxed">
                Protect your account by enabling Two-Factor Authentication and keeping your password updated.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-mono font-bold text-zinc-900 uppercase">2FA Authentication</span>
                  <span className="text-xs text-zinc-500 font-sans">Secure your withdrawals</span>
                </div>
                <button
                  onClick={handleToggle2FA}
                  disabled={loading}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
                    user?.is2FAEnabled ? "bg-brand-purple" : "bg-zinc-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300",
                    user?.is2FAEnabled ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col gap-4">
               <div className="flex items-center gap-3 text-zinc-700 font-sans text-xs">
                 <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                 <span>Regular security audits</span>
               </div>
               <div className="flex items-center gap-3 text-zinc-700 font-sans text-xs">
                 <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                 <span>Hardware security modules</span>
               </div>
               <div className="flex items-center gap-3 text-zinc-700 font-sans text-xs">
                 <AlertCircle size={16} className="text-amber-600 shrink-0" />
                 <span>Email alerts for new logins</span>
               </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="lg:col-span-3 flex flex-col gap-6 p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <h3 className="text-xl font-display font-extrabold text-zinc-950 flex items-center gap-2">
              <Lock size={20} className="text-brand-purple" />
              Change Password
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Current Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-zinc-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-zinc-100 my-1" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">New Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-zinc-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                  placeholder="Repeat new password"
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-zinc-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-zinc-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-8 h-11 font-sans font-bold shadow-md shadow-brand-purple/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
