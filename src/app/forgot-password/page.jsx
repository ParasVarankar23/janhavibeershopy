"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    Mail,
    KeyRound,
    LockKeyhole,
    Package2,
    ShieldCheck,
    RefreshCcw,
    Eye,
    EyeOff,
    Loader2,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // STEP 1: Send OTP
    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "send-otp",
                    email,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Failed to send OTP");
                return;
            }

            toast.success(data.message || "OTP sent successfully");
            setStep(2);
        } catch (error) {
            console.error("Send OTP Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!email || !otp) {
            toast.error("Please enter OTP");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "verify-otp",
                    email,
                    otp,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "OTP verification failed");
                return;
            }

            toast.success(data.message || "OTP verified successfully");
            setStep(3);
        } catch (error) {
            console.error("Verify OTP Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 3: Reset Password
    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please enter new password and confirm password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "reset-password",
                    email,
                    otp,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Password reset failed");
                return;
            }

            toast.success(data.message || "Password reset successful");

            setTimeout(() => {
                router.push("/login");
            }, 1200);
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const prevStep = () => {
        if (step > 1 && !loading) {
            setStep(step - 1);
        }
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
                                    Password Recovery
                                </span>
                            </div>

                            {/* Main Content */}
                            <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                Reset Your Password in 3 Simple Steps
                            </h1>

                            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                                Securely recover your account by verifying your email, entering
                                the OTP, and setting a new password for your Janhavi Beer Shop dashboard.
                            </p>

                            {/* Feature Cards */}
                            <div className="mt-6 grid gap-3">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Verify your registered email
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Secure OTP verification process
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                        <RefreshCcw className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Update password quickly and safely
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                        <div className="w-full max-w-md">
                            {/* Heading */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Forgot Password
                                </h1>
                                <p className="mt-2 text-base text-slate-500">
                                    Complete the steps to reset your password
                                </p>
                            </div>

                            {/* Step Indicator */}
                            <div className="mt-6 flex items-center justify-between gap-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex flex-1 items-center">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${step >= item
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {item}
                                        </div>
                                        {item !== 3 && (
                                            <div
                                                className={`h-1 flex-1 rounded-full ${step > item ? "bg-amber-500" : "bg-slate-200"
                                                    }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Step Labels */}
                            <div className="mt-3 grid grid-cols-3 text-center text-xs font-medium text-slate-500">
                                <span>Email</span>
                                <span>OTP</span>
                                <span>Reset</span>
                            </div>

                            {/* Form Area */}
                            <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                {/* Step 1 */}
                                {step === 1 && (
                                    <div>
                                        <div className="mb-5">
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                Step 1: Verify Email
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter your registered email address to receive an OTP.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Step 2 */}
                                {step === 2 && (
                                    <div>
                                        <div className="mb-5">
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                Step 2: Enter OTP
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter the OTP sent to your registered email.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                OTP Code
                                            </label>
                                            <div className="relative">
                                                <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    placeholder="Enter 6-digit OTP"
                                                    maxLength={6}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                disabled={loading}
                                                className="w-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                Back
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={loading}
                                                className="flex w-1/2 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    "Verify OTP"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3 */}
                                {step === 3 && (
                                    <div>
                                        <div className="mb-5">
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                Step 3: Reset Password
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Enter your new password and confirm it.
                                            </p>
                                        </div>

                                        {/* New Password */}
                                        <div className="mb-4">
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
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
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
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                disabled={loading}
                                                className="w-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                Back
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleResetPassword}
                                                disabled={loading}
                                                className="flex w-1/2 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Resetting...
                                                    </>
                                                ) : (
                                                    "Reset Password"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Link */}
                            <p className="mt-6 text-center text-sm text-slate-500">
                                Remember your password?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-amber-600 transition hover:text-amber-700"
                                >
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}