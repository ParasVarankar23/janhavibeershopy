import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
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

        const user = await User.findById(decoded.id).select("-password -signupOtp -forgotPasswordOtp");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch profile" },
            { status: 500 }
        );
    }
}