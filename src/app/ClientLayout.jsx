"use client";

import { usePathname } from "next/navigation";

import PublicNavbar from "@/components/admin/PublicNavbar";
import Sidebar from "@/components/admin/Sidebar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AppToaster from "@/components/layout/AppToaster";

export default function ClientLayout({ children }) {
    const pathname = usePathname();

    const isAdminRoute = pathname.startsWith("/admin");

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <AppToaster />

            {isAdminRoute ? (
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Right Content Area */}
                    <div className="flex min-h-screen flex-1 flex-col">
                        <PublicNavbar />
                        <main className="flex-1 p-4 md:p-6">{children}</main>
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </>
            )}
        </div>
    );
}