import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { generateToken } from "@/lib/auth";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
    try {
        await connectDB();

        const { credential } = await req.json();

        if (!credential) {
            return NextResponse.json(
                { success: false, message: "Google credential missing" },
                { status: 400 }
            );
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const fullName = payload.name;
        const googleId = payload.sub;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName,
                email,
                phoneNumber: "N/A",
                password: "",
                authProvider: "google",
                googleId,
                isVerified: true,
            });
        } else {
            user.authProvider = "google";
            user.googleId = googleId;
            user.isVerified = true;
            await user.save();
        }

        const token = generateToken(user);

        const response = NextResponse.json({
            success: true,
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Google login failed" },
            { status: 500 }
        );
    }
}