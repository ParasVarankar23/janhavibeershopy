"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Settings,
    LockKeyhole,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
    UserCircle2,
    Mail,
    Phone,
} from "lucide-react";

export default function page() {
    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "admin",
    });

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch profile
    useEffect(() => {
        let active = true;

        async function fetchProfile() {
            try {
                const res = await fetch("/api/auth/profile", {
                    method: "GET",
                    cache: "no-store",
                });

                const data = await res.json().catch(() => ({}));

                if (!res.ok || !data?.success) {
                    return;
                }

                const user = data.user || data.profile || {};

                if (active) {
                    setProfile({
                        fullName: user.fullName || user.name || "",
                        email: user.email || "",
                        phoneNumber: user.phoneNumber || "",
                        role: user.role || "admin",
                    });
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                if (active) setLoadingProfile(false);
            }
        }

        fetchProfile();

        return () => {
            active = false;
        };
    }, []);

    // Change password submit
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill all password fields");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            setLoadingPassword(true);

            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.success) {
                toast.error(data?.message || "Failed to change password");
                return;
            }

            toast.success(data?.message || "Password changed successfully");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <main className="space-y-6">
            {/* Page Header */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-600">
                            Janhavi Beer Shop
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                            Settings
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage your admin profile and securely change your password
                        </p>
                    </div>

                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                        <Settings size={26} />
                    </div>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* Profile Info Card */}
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                            <UserCircle2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
                            <p className="text-sm text-slate-500">
                                Your account details
                            </p>
                        </div>
                    </div>

                    {loadingProfile ? (
                        <div className="mt-6 space-y-4">
                            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-slate-500">
                                    <UserCircle2 size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Full Name
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {profile.fullName || "Admin User"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-slate-500">
                                    <Mail size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Email
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {profile.email || "No email"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-slate-500">
                                    <Phone size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Phone Number
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {profile.phoneNumber || "No phone number"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-amber-700">
                                    <ShieldCheck size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Role
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-amber-800 uppercase">
                                    {profile.role || "admin"}
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Change Password Card */}
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                            <LockKeyhole size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                            <p className="text-sm text-slate-500">
                                Update your account password securely
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                        {/* Old Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Old Password
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showOldPassword ? "text" : "password"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Enter old password"
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                >
                                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                New Password
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loadingPassword}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <Save size={18} />
                            {loadingPassword ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}