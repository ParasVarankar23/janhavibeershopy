"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Package2 } from "lucide-react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Stock", href: "/" },
        { name: "Login", href: "/" },
        { name: "Scan Beer", href: "/" },
        { name: "Reports", href: "/" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
                        <Package2 className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex flex-col leading-tight">
                        <span className="text-3xl font-bold text-slate-900">Janhavi</span>
                        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                            Beer Shop
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[17px] font-medium text-slate-700 transition hover:text-amber-600"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Button */}
                <div className="hidden lg:flex">
                    <Link
                        href="/login"
                        className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="inline-flex items-center justify-center rounded-xl border border-amber-200 p-2 text-amber-600 lg:hidden"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-amber-100 bg-white lg:hidden">
                    <div className="space-y-2 px-4 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-600"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}