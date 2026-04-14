"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Boxes,
    Layers3,
    ShoppingCart,
    IndianRupee,
    CalendarDays,
    TrendingUp,
    Package,
    Loader2,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const FILTER_OPTIONS = [
    { label: "Today", value: "today" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
    { label: "Specific Date", value: "date" },
];

// Nice dashboard colors for pie chart
const PIE_COLORS = [
    "#f59e0b",
    "#f97316",
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#10b981",
    "#6366f1",
];

export default function page() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("monthly");
    const [specificDate, setSpecificDate] = useState("");

    const fetchDashboard = async (selectedFilter = filter, selectedDate = specificDate) => {
        try {
            setLoading(true);

            let url = `/api/dashboard?filter=${selectedFilter}`;

            if (selectedFilter === "date" && selectedDate) {
                url += `&date=${selectedDate}`;
            }

            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setDashboard(data);
            } else {
                toast.error(data.message || "Failed to fetch dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while loading dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard("monthly", "");
    }, []);

    const handleFilterChange = (value) => {
        setFilter(value);

        if (value !== "date") {
            setSpecificDate("");
            fetchDashboard(value, "");
        }
    };

    const handleApplySpecificDate = () => {
        if (!specificDate) {
            toast.error("Please select a date");
            return;
        }

        fetchDashboard("date", specificDate);
    };

    const summary = dashboard?.summary || {};
    const categoryWiseProducts = dashboard?.categoryWiseProducts || [];
    const revenueTrend = dashboard?.revenueTrend || [];
    const topSellingProducts = dashboard?.topSellingProducts || [];
    const recentSales = dashboard?.recentSales || [];

    return (
        <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen">
            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Monitor your Janhavi Beer Shop performance, revenue and inventory
                </p>
            </div>

            {/* ========================================================= */}
            {/* FILTER BAR */}
            {/* ========================================================= */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm mb-6">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleFilterChange(item.value)}
                                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${filter === item.value
                                        ? "bg-[#f59e0b] text-white"
                                        : "bg-[#f8fafc] text-gray-700 border border-gray-200 hover:border-[#f59e0b]"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {filter === "date" && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="date"
                                value={specificDate}
                                onChange={(e) => setSpecificDate(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                            />
                            <button
                                onClick={handleApplySpecificDate}
                                className="px-5 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                            >
                                Apply Date
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-[#f59e0b] text-lg font-semibold">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Loading dashboard...
                    </div>
                </div>
            ) : (
                <>
                    {/* ========================================================= */}
                    {/* SUMMARY CARDS */}
                    {/* ========================================================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                        <StatCard
                            title="Total Products"
                            value={summary.totalProducts || 0}
                            icon={<Boxes className="w-6 h-6" />}
                            bg="bg-[#fff7ed]"
                            text="text-[#ea580c]"
                        />

                        <StatCard
                            title="Total Categories"
                            value={summary.totalCategories || 0}
                            icon={<Layers3 className="w-6 h-6" />}
                            bg="bg-[#eff6ff]"
                            text="text-[#2563eb]"
                        />

                        <StatCard
                            title={`Sales (${filter === "date" ? "Selected Date" : filter})`}
                            value={summary.filteredSalesCount || 0}
                            icon={<ShoppingCart className="w-6 h-6" />}
                            bg="bg-[#ecfdf5]"
                            text="text-[#059669]"
                        />

                        <StatCard
                            title={`Revenue (${filter === "date" ? "Selected Date" : filter})`}
                            value={`₹${summary.filteredRevenue || 0}`}
                            icon={<IndianRupee className="w-6 h-6" />}
                            bg="bg-[#faf5ff]"
                            text="text-[#7c3aed]"
                        />
                    </div>

                    {/* ========================================================= */}
                    {/* SECONDARY CARDS */}
                    {/* ========================================================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                                <h3 className="text-lg font-bold text-gray-900">All-Time Revenue</h3>
                            </div>
                            <p className="text-3xl font-extrabold text-[#ea580c]">
                                ₹{summary.totalRevenueAllTime || 0}
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <CalendarDays className="w-5 h-5 text-[#2563eb]" />
                                <h3 className="text-lg font-bold text-gray-900">All-Time Sales</h3>
                            </div>
                            <p className="text-3xl font-extrabold text-[#2563eb]">
                                {summary.totalSalesAllTime || 0}
                            </p>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* CHARTS ROW 1 */}
                    {/* ========================================================= */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                        {/* REVENUE TREND */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Revenue Trend
                            </h3>

                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#f59e0b"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* SALES COUNT CHART */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Sales Count Trend
                            </h3>

                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="salesCount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* CHARTS ROW 2 */}
                    {/* ========================================================= */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                        {/* CATEGORY PIE CHART */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Category-wise Products
                            </h3>

                            <div className="h-[360px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryWiseProducts}
                                            dataKey="count"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            label
                                        >
                                            {categoryWiseProducts.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* CATEGORY STOCK BAR */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Category-wise Stock
                            </h3>

                            <div className="h-[360px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryWiseProducts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="stock" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* TABLES / LISTS */}
                    {/* ========================================================= */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* TOP SELLING PRODUCTS */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Top Selling Products
                            </h3>

                            {topSellingProducts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                                    No sales data available for selected filter
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topSellingProducts.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8fafc] border border-gray-100 p-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {item.productName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Qty Sold: {item.quantitySold}
                                                </p>
                                            </div>
                                            <p className="font-bold text-[#ea580c]">₹{item.revenue}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RECENT SALES */}
                        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Recent Sales
                            </h3>

                            {recentSales.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                                    No recent sales found
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentSales.map((sale) => (
                                        <div
                                            key={sale._id}
                                            className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {sale.customerName || "Walk-in Customer"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {sale.items?.length || 0} items • {sale.paymentMethod.toUpperCase()}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-[#ea580c]">₹{sale.totalAmount}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, bg, text }) {
    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${bg} ${text} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}