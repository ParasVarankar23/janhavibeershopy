"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    ShieldCheck,
    ScanLine,
    Package2,
    BarChart3,
    Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailOrPhone || !password) {
            toast.error("Please enter email/phone and password");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emailOrPhone,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Login failed");
                return;
            }

            toast.success("Login successful");

            // Redirect to admin dashboard
            router.push("/admin");
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast("Google login route connect next 🔥");
    };

    return (
        <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-amber-50 via-white to-orange-50">
            <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid w-full overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-md lg:min-h-[620px] lg:grid-cols-2">
                    {/* Left Side Content */}
                    <div className="flex items-center justify-center border-b border-amber-100 bg-gradient-to-br from-white to-amber-50/30 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                        <div className="max-w-sm text-center lg:text-left">
                            {/* Brand */}
                            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
                                    <Package2 className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Janhavi</h2>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                                        Beer Shop
                                    </p>
                                </div>
                            </div>

                            {/* Tag */}
                            <div className="mb-5">
                                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Smart Shop Management
                                </span>
                            </div>

                            {/* Main Content */}
                            <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                Welcome Back
                            </h1>

                            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                                Access billing, barcode scanning, stock updates, and reports
                                from one clean and powerful dashboard built for Janhavi Beer Shop.
                            </p>

                            {/* Feature Points */}
                            <div className="mt-6 grid gap-3">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <ScanLine className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Fast barcode product scanning
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Secure login & trusted access
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <BarChart3 className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Manage reports and shop performance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                        <div className="w-full max-w-md">
                            {/* Heading */}
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Login
                                </h1>
                                <p className="mt-2 text-base text-slate-500">
                                    Enter your login credentials
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="mt-7 space-y-4">
                                {/* Email / Phone */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Email or Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={emailOrPhone}
                                        onChange={(e) => setEmailOrPhone(e.target.value)}
                                        placeholder="Enter email or phone number"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-amber-600 transition hover:text-amber-700"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4 py-1">
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <span className="text-sm font-medium text-slate-400">OR</span>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>

                                {/* Continue with Google */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                                >
                                    <FcGoogle className="h-5 w-5" />
                                    Continue with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}