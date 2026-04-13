import Link from "next/link";
import {
  ArrowRight,
  ScanLine,
  ShoppingCart,
  PackageSearch,
  BarChart3,
  ShieldCheck,
  Clock3,
  BadgeIndianRupee,
} from "lucide-react";

export default function page() {
  const features = [
    {
      title: "Barcode Scanning",
      description:
        "Quickly scan beer bottles and instantly add products to billing with fast barcode support.",
      icon: ScanLine,
      href: "/scan",
    },
    {
      title: "Smart Billing",
      description:
        "Generate bills quickly with accurate pricing, quantity handling, and smooth checkout process.",
      icon: ShoppingCart,
      href: "/billing",
    },
    {
      title: "Stock Management",
      description:
        "Track available stock, low stock alerts, and maintain all beer inventory in one place.",
      icon: PackageSearch,
      href: "/stock",
    },
    {
      title: "Sales Reports",
      description:
        "Monitor daily sales, revenue summaries, and performance reports for better shop management.",
      icon: BarChart3,
      href: "/reports",
    },
  ];

  const stats = [
    { label: "Fast Billing", value: "1-Click" },
    { label: "Stock Tracking", value: "24/7" },
    { label: "Barcode Support", value: "Instant" },
    { label: "Daily Reports", value: "Auto" },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Accurate Inventory",
      text: "Avoid manual mistakes and keep your stock records updated in real time.",
    },
    {
      icon: Clock3,
      title: "Save Time",
      text: "Reduce billing time during busy shop hours with quick barcode-based checkout.",
    },
    {
      icon: BadgeIndianRupee,
      title: "Increase Sales Control",
      text: "Track product movement, monitor sales, and manage profits more effectively.",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute right-10 top-32 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-52 w-52 rounded-full bg-yellow-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-10 lg:grid-cols-2 lg:px-8">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Premium Beer Shop Management
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-5xl">
              Manage Your{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 bg-clip-text text-transparent">
                Beer Shop
              </span>{" "}
              with Smart Billing & Barcode Scan
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Janhavi Beer Shop helps you manage billing, scan bottles instantly,
              track stock, and monitor sales reports — all in one powerful and
              simple dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/billing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105"
              >
                Start Billing
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/scan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-white px-6 py-3 text-sm font-semibold text-amber-700 transition-all duration-300 hover:bg-amber-50"
              >
                <ScanLine className="h-4 w-4" />
                Scan Product
              </Link>
            </div>

            {/* Stats */}
            <div className="py-4 md:py-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"
                >
                  <p className="text-xl font-bold text-amber-600">{item.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Hero Card */}
          <div className="relative">
            <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today’s Overview</p>
                  <h3 className="text-2xl font-bold text-gray-900">Shop Dashboard</h3>
                </div>
                <div className="rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                  Live
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                  <p className="text-sm text-gray-500">Today Sales</p>
                  <h4 className="mt-2 text-2xl font-bold text-gray-900">₹18,450</h4>
                  <p className="mt-1 text-xs text-emerald-600">+12% from yesterday</p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white p-5">
                  <p className="text-sm text-gray-500">Products Scanned</p>
                  <h4 className="mt-2 text-2xl font-bold text-gray-900">126</h4>
                  <p className="mt-1 text-xs text-amber-600">Fast barcode entries</p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white p-5">
                  <p className="text-sm text-gray-500">Bills Generated</p>
                  <h4 className="mt-2 text-2xl font-bold text-gray-900">43</h4>
                  <p className="mt-1 text-xs text-sky-600">Smooth checkout flow</p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-white p-5">
                  <p className="text-sm text-gray-500">Low Stock Alerts</p>
                  <h4 className="mt-2 text-2xl font-bold text-gray-900">08</h4>
                  <p className="mt-1 text-xs text-red-500">Need refill soon</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                <p className="text-sm text-gray-600">
                  Smart dashboard for billing, barcode scanning, stock control,
                  and daily sales tracking for Janhavi Beer Shop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Core Features
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything You Need to Run Your Beer Shop
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            From instant barcode scanning to stock management and sales reports,
            Janhavi Beer Shop software makes your daily operations simple and fast.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-3xl border border-amber-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition group-hover:bg-amber-200">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {feature.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600">
                  Open Module
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-amber-100 bg-amber-50/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Why Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for Faster Shop Operations
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-100 bg-gradient-to-r from-white to-amber-50 p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Get Started
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to Manage Janhavi Beer Shop Smarter?
              </h2>
              <p className="mt-4 max-w-xl text-gray-600">
                Start with billing, scan products instantly, and keep track of
                your stock without manual confusion.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                href="/billing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              >
                Open Billing
                <ShoppingCart className="h-4 w-4" />
              </Link>

              <Link
                href="/stock"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-white px-6 py-3 text-sm font-semibold text-amber-700 transition-all duration-300 hover:bg-amber-50"
              >
                View Stock
                <PackageSearch className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}