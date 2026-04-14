import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { verifyToken } from "@/lib/auth";
import {
    uploadAssetToCloudinary,
    deleteCloudinaryImage,
} from "@/lib/cloudinary";

// ======================================================
// GET ALL PRODUCTS
// ======================================================
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find()
            .populate("addedBy", "fullName email")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                count: products.length,
                products,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch products",
            },
            { status: 500 }
        );
    }
}

// ======================================================
// ADD PRODUCT
// ======================================================
export async function POST(req) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Token missing." },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded?.id) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const admin = await User.findById(decoded.id);

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Admin not found" },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        const productName = formData.get("productName");
        const price = formData.get("price");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const imageFile = formData.get("image");

        if (!productName || !price || !stock || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product name, price, stock, and category are required",
                },
                { status: 400 }
            );
        }

        let uploadedImage = null;

        // Upload image if provided
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            uploadedImage = await uploadAssetToCloudinary({
                buffer,
                folder: "janhavi-shop/products",
                mimeType: imageFile.type,
                resourceType: "image",
            });
        }

        const newProduct = await Product.create({
            productName: productName.trim(),
            price: Number(price),
            stock: Number(stock),
            category: category.trim(),
            image: {
                url: uploadedImage?.secure_url || "",
                public_id: uploadedImage?.public_id || "",
            },
            addedBy: admin._id,
        });

        const populatedProduct = await Product.findById(newProduct._id).populate(
            "addedBy",
            "fullName email"
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product added successfully",
                product: populatedProduct,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to add product",
            },
            { status: 500 }
        );
    }
}

// ======================================================
// UPDATE PRODUCT
// ======================================================
export async function PUT(req) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Token missing." },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded?.id) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const productId = formData.get("productId");
        const productName = formData.get("productName");
        const price = formData.get("price");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const imageFile = formData.get("image");

        if (!productId) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        // Update text fields
        if (productName) product.productName = productName.trim();
        if (price !== null && price !== "") product.price = Number(price);
        if (stock !== null && stock !== "") product.stock = Number(stock);
        if (category) product.category = category.trim();

        // Update image if new image provided
        if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadedImage = await uploadAssetToCloudinary({
                buffer,
                folder: "janhavi-shop/products",
                mimeType: imageFile.type,
                resourceType: "image",
            });

            // Delete old image
            if (product.image?.public_id) {
                await deleteCloudinaryImage(product.image.public_id);
            }

            product.image = {
                url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id,
            };
        }

        await product.save();

        const updatedProduct = await Product.findById(product._id).populate(
            "addedBy",
            "fullName email"
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                product: updatedProduct,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to update product",
            },
            { status: 500 }
        );
    }
}

// ======================================================
// DELETE PRODUCT
// ======================================================
export async function DELETE(req) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized. Token missing." },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded?.id) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { success: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        // Delete Cloudinary image
        if (product.image?.public_id) {
            await deleteCloudinaryImage(product.image.public_id);
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to delete product",
            },
            { status: 500 }
        );
    }
}