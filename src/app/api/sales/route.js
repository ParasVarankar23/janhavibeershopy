import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

import User from "@/models/user.model";
import Product from "@/models/product.model";
import Sale from "@/models/sales.model";

// ======================================================
// GET ALL SALES
// ======================================================
export async function GET() {
    try {
        await connectDB();

        const sales = await Sale.find()
            .populate("soldBy", "fullName email")
            .populate("items.productId", "productName category image")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                count: sales.length,
                sales,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET SALES ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch sales",
            },
            { status: 500 }
        );
    }
}

// ======================================================
// CREATE SALE
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

        const body = await req.json();

        const {
            customerName = "",
            customerPhone = "",
            items = [],
            paymentMethod = "cash",
        } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "At least one product is required" },
                { status: 400 }
            );
        }

        const saleItems = [];
        let totalAmount = 0;

        // Validate all items + reduce stock
        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || Number(quantity) <= 0) {
                return NextResponse.json(
                    { success: false, message: "Invalid sale item data" },
                    { status: 400 }
                );
            }

            const product = await Product.findById(productId);

            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Product not found for ID: ${productId}`,
                    },
                    { status: 404 }
                );
            }

            if (product.stock < Number(quantity)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Insufficient stock for ${product.productName}. Available: ${product.stock}`,
                    },
                    { status: 400 }
                );
            }

            const qty = Number(quantity);
            const price = Number(product.price);
            const lineTotal = qty * price;

            saleItems.push({
                productId: product._id,
                productName: product.productName,
                quantity: qty,
                priceAtSale: price,
                lineTotal,
            });

            totalAmount += lineTotal;
        }

        // Deduct stock after validation
        for (const item of saleItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        const newSale = await Sale.create({
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            items: saleItems,
            totalAmount,
            paymentMethod,
            soldBy: admin._id,
        });

        const populatedSale = await Sale.findById(newSale._id)
            .populate("soldBy", "fullName email")
            .populate("items.productId", "productName category image");

        return NextResponse.json(
            {
                success: true,
                message: "Sale created successfully",
                sale: populatedSale,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE SALE ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create sale",
            },
            { status: 500 }
        );
    }
}

// ======================================================
// DELETE SALE (OPTIONAL)
// If deleted, stock will be restored
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
        const saleId = searchParams.get("saleId");

        if (!saleId) {
            return NextResponse.json(
                { success: false, message: "Sale ID is required" },
                { status: 400 }
            );
        }

        const sale = await Sale.findById(saleId);

        if (!sale) {
            return NextResponse.json(
                { success: false, message: "Sale not found" },
                { status: 404 }
            );
        }

        // Restore stock
        for (const item of sale.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: item.quantity },
            });
        }

        await Sale.findByIdAndDelete(saleId);

        return NextResponse.json(
            {
                success: true,
                message: "Sale deleted and stock restored successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE SALE ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to delete sale",
            },
            { status: 500 }
        );
    }
}