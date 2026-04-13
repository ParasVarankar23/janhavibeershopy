import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            {
                success: true,
                message: "Logout successful",
            },
            { status: 200 }
        );

        // Clear JWT cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: false, // make true in production (https)
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("Logout API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Logout failed",
            },
            { status: 500 }
        );
    }
}