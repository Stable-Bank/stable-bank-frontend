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
  const { user, fetchUser, updateUser } = useAuth();
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

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Avatar size must be less than 1MB");
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
    <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-white/50">Manage your account preferences and security settings.</p>
      </div>

      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "profile" ? "bg-brand-purple text-white shadow-lg" : "text-white/40 hover:text-white"
          )}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "security" ? "bg-brand-purple text-white shadow-lg" : "text-white/40 hover:text-white"
          )}
        >
          Security
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6 p-8 bg-[#121826] border border-white/10 rounded-3xl">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-brand-purple/20 bg-white/5">
                <Image
                  src={
                    user?.avatarUrl 
                      ? `${backendUrl}${user.avatarUrl}`
                      : `/images/svg/default-avatar.svg`
                  }
                  alt="avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-brand-purple rounded-full text-white shadow-xl hover:scale-110 transition-transform"
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
              <h3 className="font-bold text-lg text-white">${user?.bankTag || "Member"}</h3>
              <p className="text-sm text-white/40">Registered Member</p>
            </div>

            <div className="w-full h-px bg-white/10" />
            
            <p className="text-xs text-center text-white/30 leading-relaxed">
              Max file size is 1MB. Supported formats: JPG, PNG, SVG.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleProfileUpdate} className="lg:col-span-2 flex flex-col gap-6 p-8 bg-[#121826] border border-white/10 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/60">First Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-purple transition-colors" size={18} />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/60">Last Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-purple transition-colors" size={18} />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/60">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-purple transition-colors" size={18} />
                <input
                  type="email"
                  value={profileData.email}
                  disabled // Recommended to disable email edit for now or handle via separate flow
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 text-white/40 outline-none transition-all cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/60">StableTag (BankTag)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple font-bold">$</span>
                <input
                  type="text"
                  value={profileData.bankTag}
                  onChange={(e) => setProfileData({ ...profileData, bankTag: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  placeholder="username"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-8 pr-4 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                />
              </div>
              <p className="text-[11px] text-white/30">Your unique identifier for receiving transfers. Alphanumeric characters only.</p>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-brand-purple/20 transition-all active:scale-[0.98]"
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
            <div className="p-8 bg-brand-purple/10 border border-brand-purple/20 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-purple rounded-2xl">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-xl text-white">Security Status</h3>
              </div>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Protect your account by enabling Two-Factor Authentication and keeping your password updated.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-white">2FA Authentication</span>
                  <span className="text-xs text-white/40">Secure your withdrawals</span>
                </div>
                <button
                  onClick={handleToggle2FA}
                  disabled={loading}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300",
                    user?.is2FAEnabled ? "bg-brand-purple" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                    user?.is2FAEnabled ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div className="p-6 bg-[#121826] border border-white/10 rounded-3xl flex flex-col gap-4">
               <div className="flex items-center gap-3 text-white/60 text-sm">
                 <CheckCircle2 size={16} className="text-green-500" />
                 <span>Regular security audits</span>
               </div>
               <div className="flex items-center gap-3 text-white/60 text-sm">
                 <CheckCircle2 size={16} className="text-green-500" />
                 <span>Hardware security modules</span>
               </div>
               <div className="flex items-center gap-3 text-white/60 text-sm">
                 <AlertCircle size={16} className="text-yellow-500" />
                 <span>Email alerts for new logins</span>
               </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="lg:col-span-3 flex flex-col gap-6 p-8 bg-[#121826] border border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock size={20} className="text-brand-purple" />
              Change Password
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/60">Current Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-5 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-white/5 my-2" />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/60">New Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-5 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/60">Confirm New Password</label>
              <div className="relative group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                  placeholder="Repeat new password"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-5 text-white focus:border-brand-purple/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-brand-purple/20 transition-all active:scale-[0.98]"
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
