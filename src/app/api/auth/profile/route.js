import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { verifyToken } from "@/lib/auth";
import { uploadAssetToCloudinary, deleteCloudinaryImage } from "@/lib/cloudinary";

// =======================
// GET PROFILE
// =======================
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

        const user = await User.findById(decoded.id).select(
            "-password -forgotPasswordOtp -forgotPasswordOtpExpiry"
        );

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

// =======================
// UPDATE PROFILE
// =======================
export async function PUT(req) {
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

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        const fullName = formData.get("fullName");
        const email = formData.get("email");
        const phoneNumber = formData.get("phoneNumber");
        const role = formData.get("role");
        const profileImageFile = formData.get("profileImage");

        // Check email if changed
        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email: email.toLowerCase().trim(),
                _id: { $ne: user._id },
            });

            if (existingUser) {
                return NextResponse.json(
                    { success: false, message: "Email already in use" },
                    { status: 400 }
                );
            }
        }

        // Update fields
        if (fullName) user.fullName = fullName.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (phoneNumber) user.phoneNumber = phoneNumber.trim();
        if (role) user.role = role.trim();

        // Update profile image
        if (profileImageFile && typeof profileImageFile === "object" && profileImageFile.size > 0) {
            const bytes = await profileImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadedImage = await uploadAssetToCloudinary({
                buffer,
                folder: "janhavi-shop/users/profile-images",
                mimeType: profileImageFile.type,
                resourceType: "image",
            });

            // Delete old image if exists
            if (user.profileImage?.public_id) {
                await deleteCloudinaryImage(user.profileImage.public_id);
            }

            user.profileImage = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
            };
        }

        await user.save();

        const updatedUser = await User.findById(user._id).select(
            "-password -forgotPasswordOtp -forgotPasswordOtpExpiry"
        );

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}