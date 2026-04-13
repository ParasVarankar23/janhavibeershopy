import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { emailOrPhone, password } = body;

        if (!emailOrPhone || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email/Phone and password are required",
                },
                { status: 400 }
            );
        }

        const identifier = emailOrPhone.trim();

        // Find user by email or phone number
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { phoneNumber: identifier },
            ],
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        // Check if Google account only
        if (user.authProvider === "google" && !user.password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This account uses Google login. Please continue with Google.",
                },
                { status: 400 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid password",
                },
                { status: 400 }
            );
        }

        // Generate token
        const token = generateToken(user);

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    authProvider: user.authProvider,
                },
            },
            { status: 200 }
        );

        // Set JWT cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false, // change to true in production
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("Login API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Login failed",
            },
            { status: 500 }
        );
    }
}