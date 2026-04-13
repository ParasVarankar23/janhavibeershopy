import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { generateOTP } from "@/lib/auth";
import { sendEmail } from "@/lib/emailService";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { action, email, otp, newPassword, confirmPassword } = body;

        if (!action) {
            return NextResponse.json(
                { success: false, message: "Action is required" },
                { status: 400 }
            );
        }

        // =========================
        // STEP 1: SEND OTP
        // =========================
        if (action === "send-otp") {
            if (!email) {
                return NextResponse.json(
                    { success: false, message: "Email is required" },
                    { status: 400 }
                );
            }

            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            const generatedOtp = generateOTP();

            user.forgotPasswordOtp = generatedOtp;
            user.forgotPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
            await user.save();

            await sendEmail({
                to: email,
                subject: "Password Reset OTP - Janhavi Beer Shop",
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="letter-spacing: 4px;">${generatedOtp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
          </div>
        `,
            });

            return NextResponse.json({
                success: true,
                step: 1,
                message: "OTP sent successfully to your email",
            });
        }

        // =========================
        // STEP 2: VERIFY OTP
        // =========================
        if (action === "verify-otp") {
            if (!email || !otp) {
                return NextResponse.json(
                    { success: false, message: "Email and OTP are required" },
                    { status: 400 }
                );
            }

            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            if (!user.forgotPasswordOtp || user.forgotPasswordOtp !== otp) {
                return NextResponse.json(
                    { success: false, message: "Invalid OTP" },
                    { status: 400 }
                );
            }

            if (
                !user.forgotPasswordOtpExpiry ||
                user.forgotPasswordOtpExpiry < new Date()
            ) {
                return NextResponse.json(
                    { success: false, message: "OTP expired" },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success: true,
                step: 2,
                message: "OTP verified successfully",
            });
        }

        // =========================
        // STEP 3: RESET PASSWORD
        // =========================
        if (action === "reset-password") {
            if (!email || !otp || !newPassword || !confirmPassword) {
                return NextResponse.json(
                    { success: false, message: "All fields are required" },
                    { status: 400 }
                );
            }

            if (newPassword !== confirmPassword) {
                return NextResponse.json(
                    { success: false, message: "Passwords do not match" },
                    { status: 400 }
                );
            }

            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            if (!user.forgotPasswordOtp || user.forgotPasswordOtp !== otp) {
                return NextResponse.json(
                    { success: false, message: "Invalid OTP" },
                    { status: 400 }
                );
            }

            if (
                !user.forgotPasswordOtpExpiry ||
                user.forgotPasswordOtpExpiry < new Date()
            ) {
                return NextResponse.json(
                    { success: false, message: "OTP expired" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            user.forgotPasswordOtp = null;
            user.forgotPasswordOtpExpiry = null;

            await user.save();

            return NextResponse.json({
                success: true,
                step: 3,
                message: "Password reset successfully",
            });
        }

        // =========================
        // INVALID ACTION
        // =========================
        return NextResponse.json(
            { success: false, message: "Invalid action type" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Forgot Password API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Forgot password process failed",
            },
            { status: 500 }
        );
    }
}