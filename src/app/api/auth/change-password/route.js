import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { oldPassword, newPassword, confirmPassword } = await req.json();

        if (!oldPassword || !newPassword || !confirmPassword) {
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

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.authProvider === "google" && !user.password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google account has no local password. Please set one first.",
                },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Old password is incorrect" },
                { status: 400 }
            );
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Change password failed" },
            { status: 500 }
        );
    }
}