import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

import Product from "@/models/product.model";
import Sale from "@/models/sales.model";

function getDateRange(filter, specificDate) {
    const now = new Date();
    let startDate = null;
    let endDate = new Date(now);

    switch (filter) {
        case "today": {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        case "weekly": {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        case "monthly": {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        case "yearly": {
            startDate = new Date(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        case "date": {
            if (!specificDate) {
                return { startDate: null, endDate: null };
            }

            startDate = new Date(specificDate);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(specificDate);
            endDate.setHours(23, 59, 59, 999);
            break;
        }

        default: {
            // default monthly
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
    }

    return { startDate, endDate };
}

function formatLabel(date, filter) {
    const d = new Date(date);

    if (filter === "today" || filter === "date") {
        return d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (filter === "weekly") {
        return d.toLocaleDateString("en-IN", {
            weekday: "short",
        });
    }

    if (filter === "monthly") {
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });
    }

    if (filter === "yearly") {
        return d.toLocaleDateString("en-IN", {
            month: "short",
        });
    }

    return d.toLocaleDateString("en-IN");
}

export async function GET(req) {
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
        const filter = searchParams.get("filter") || "monthly";
        const specificDate = searchParams.get("date") || "";

        const { startDate, endDate } = getDateRange(filter, specificDate);

        const saleMatch = startDate && endDate
            ? { createdAt: { $gte: startDate, $lte: endDate } }
            : {};

        // ======================================================
        // TOTAL COUNTS (ALL TIME)
        // ======================================================
        const totalProducts = await Product.countDocuments();
        const totalSalesAllTime = await Sale.countDocuments();

        const distinctCategories = await Product.distinct("category");
        const totalCategories = distinctCategories.length;

        const allTimeRevenueAgg = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalRevenueAllTime = allTimeRevenueAgg[0]?.totalRevenue || 0;

        // ======================================================
        // FILTERED SALES + REVENUE
        // ======================================================
        const filteredSalesCount = await Sale.countDocuments(saleMatch);

        const filteredRevenueAgg = await Sale.aggregate([
            { $match: saleMatch },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const filteredRevenue = filteredRevenueAgg[0]?.totalRevenue || 0;

        // ======================================================
        // CATEGORY-WISE PRODUCTS
        // ======================================================
        const categoryWiseProducts = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    stock: { $sum: "$stock" },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1,
                    stock: 1,
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        // ======================================================
        // REVENUE TREND (GROUPING BASED ON FILTER)
        // ======================================================
        let groupId = null;

        if (filter === "today" || filter === "date") {
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
                hour: { $hour: "$createdAt" },
            };
        } else if (filter === "weekly" || filter === "monthly") {
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            };
        } else if (filter === "yearly") {
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            };
        }

        const revenueTrendAgg = await Sale.aggregate([
            { $match: saleMatch },
            {
                $group: {
                    _id: groupId,
                    revenue: { $sum: "$totalAmount" },
                    salesCount: { $sum: 1 },
                    createdAt: { $min: "$createdAt" },
                },
            },
            {
                $sort: { createdAt: 1 },
            },
        ]);

        const revenueTrend = revenueTrendAgg.map((item) => ({
            label: formatLabel(item.createdAt, filter),
            revenue: item.revenue,
            salesCount: item.salesCount,
        }));

        // ======================================================
        // TOP SELLING PRODUCTS (FROM FILTERED SALES)
        // ======================================================
        const topSellingProducts = await Sale.aggregate([
            { $match: saleMatch },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productName",
                    quantitySold: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.lineTotal" },
                },
            },
            {
                $project: {
                    _id: 0,
                    productName: "$_id",
                    quantitySold: 1,
                    revenue: 1,
                },
            },
            {
                $sort: { quantitySold: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        // ======================================================
        // RECENT SALES
        // ======================================================
        const recentSales = await Sale.find()
            .populate("soldBy", "fullName")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return NextResponse.json(
            {
                success: true,
                summary: {
                    totalProducts,
                    totalCategories,
                    totalSalesAllTime,
                    totalRevenueAllTime,
                    filteredSalesCount,
                    filteredRevenue,
                },
                categoryWiseProducts,
                revenueTrend,
                topSellingProducts,
                recentSales,
                filter,
                specificDate,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch dashboard data",
            },
            { status: 500 }
        );
    }
}