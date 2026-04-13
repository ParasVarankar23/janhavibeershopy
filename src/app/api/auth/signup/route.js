import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/emailService";

// Generate password like: Paras4242!
function generateCustomPassword(fullName) {
    const firstName = fullName.trim().split(" ")[0] || "User";

    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const symbols = "!@#$%";
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    return `${firstName}${randomNumber}${randomSymbol}`;
}

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { fullName, email, phoneNumber } = body;

        if (!fullName || !email || !phoneNumber) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Full name, email, and phone number are required",
                },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists by email
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists with this email",
                },
                { status: 400 }
            );
        }

        // Optional: check if phone already exists
        const existingPhone = await User.findOne({ phoneNumber });

        if (existingPhone) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists with this phone number",
                },
                { status: 400 }
            );
        }

        // Generate custom password
        const plainPassword = generateCustomPassword(fullName);

        // Hash password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Create user
        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            phoneNumber,
            password: hashedPassword,
            role: "admin",
            authProvider: "local",
        });

        // Send password to email
        await sendEmail({
            to: normalizedEmail,
            subject: "Your Login Credentials - Janhavi Beer Shop",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
          <h2 style="color: #f59e0b;">Welcome to Janhavi Beer Shop</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your account has been created successfully.</p>

          <div style="margin: 20px 0; padding: 16px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px;">
            <p style="margin: 0 0 8px;"><strong>Full Name:</strong> ${fullName}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${normalizedEmail}</p>
            <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${phoneNumber}</p>
            <p style="margin: 0;"><strong>Password:</strong> ${plainPassword}</p>
          </div>

          <p>Please use this password to login.</p>
          <p>For security, please change your password after first login.</p>

          <br />
          <p>Thanks,<br />Janhavi Beer Shop</p>
        </div>
      `,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully. Password sent to email.",
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Signup failed",
            },
            { status: 500 }
        );
    }
}