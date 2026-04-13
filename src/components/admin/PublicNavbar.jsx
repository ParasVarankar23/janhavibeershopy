"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PublicNavbar({ onMenuClick = () => { } }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("Admin");
  const [profileImage, setProfileImage] = useState("");

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutCountdown, setLogoutCountdown] = useState(8);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Fetch profile
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.success) return;

        const user = data.user || data.profile || {};
        const name = String(user.fullName || user.name || "").trim();
        const photo = String(user.profileImage || user.photoUrl || "").trim();

        if (active) {
          setFullName(name || "Admin");
          setProfileImage(photo || "");

          const onlyFirstName = name ? name.split(" ")[0] : "Admin";
          setFirstName(onlyFirstName);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // Outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout countdown effect
  useEffect(() => {
    if (!showLogoutModal) return;

    setLogoutCountdown(8);

    const intervalId = setInterval(() => {
      setLogoutCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          void performLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showLogoutModal]);

  // Search pages
  const handleSearch = (q) => {
    const s = String(q || "").trim().toLowerCase();
    if (!s) return;

    if (s.includes("dashboard")) return router.push("/admin");
    if (s.includes("product")) return router.push("/admin/products");
    if (s.includes("scan")) return router.push("/admin/scan");
    if (s.includes("sale")) return router.push("/admin/sales");
    if (s.includes("profile")) return router.push("/admin/profile");
    if (s.includes("notification")) return router.push("/admin/notifications");
    if (s.includes("setting")) return router.push("/admin/settings");

    toast("No matching page found");
  };

  // Real logout function
  const performLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (data?.success) {
        toast.success("Logout successful");
      } else {
        toast.success("Logged out");
      }

      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch { }

      setShowLogoutModal(false);
      setShowProfileMenu(false);
      setNotifOpen(false);

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong");

      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } catch { }

      setShowLogoutModal(false);
      router.replace("/login");
    }
  };

  // Open modal
  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  return (
    <>
      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-600">
                  Janhavi Beer Shop
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Confirm Logout
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  You will be logged out automatically in{" "}
                  {logoutCountdown > 0 ? `${logoutCountdown} seconds` : "..."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${(logoutCountdown / 8) * 100}%` }}
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Stay Logged In
              </button>

              <button
                type="button"
                onClick={performLogout}
                className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="px-3 py-3 sm:px-5 lg:px-6">
          <div className="flex flex-col gap-3">
            {/* Top Row */}
            <div className="flex items-center justify-between gap-3">
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={onMenuClick}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu size={18} />
                </button>

                <div className="min-w-0">
                  <p className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600 sm:block">
                    Janhavi Beer Shop
                  </p>

                  <p className="truncate text-sm font-medium text-slate-600 sm:mt-1 sm:text-base">
                    Welcome,{" "}
                    <span className="font-semibold text-slate-900">
                      {firstName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Center Search */}
              <div className="hidden flex-1 justify-center xl:flex">
                <div className="w-full max-w-[620px]">
                  <div className="mx-auto flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-amber-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-100">
                    <input
                      type="text"
                      placeholder="Search pages (dashboard, products, sales...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch(searchQuery);
                        }
                      }}
                      className="w-full min-w-[220px] bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSearch(searchQuery)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                      aria-label="Search"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Notifications */}
                <div className="relative" ref={notifMenuRef}>
                  <button
                    type="button"
                    onClick={() => setNotifOpen((prev) => !prev)}
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-amber-600"
                  >
                    <Bell size={18} />
                    <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white">
                      3
                    </span>
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-[300px] rounded-3xl border border-slate-200 bg-white shadow-2xl">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-bold text-slate-900">
                          Notifications
                        </p>
                        <p className="text-xs text-slate-500">
                          Latest updates from Janhavi Beer Shop
                        </p>
                      </div>

                      <div className="space-y-3 px-4 py-4">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-sm font-medium text-slate-800">
                            New stock added
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            24 beer items added to inventory.
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-sm font-medium text-slate-800">
                            Daily sales updated
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Today sales report is ready.
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setNotifOpen(false);
                            router.push("/admin/notifications");
                          }}
                          className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:bg-slate-50 sm:gap-3 sm:px-3"
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-amber-500 text-white shadow-md">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt={fullName || "Profile"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>

                    <div className="hidden min-w-0 text-left md:block">
                      <p className="max-w-[120px] truncate text-sm font-semibold text-slate-900 lg:max-w-[160px]">
                        {fullName || "Admin User"}
                      </p>
                      <p className="text-xs text-slate-500">Admin</p>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`hidden text-slate-500 transition md:block ${showProfileMenu ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 z-50 mt-3 w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/admin/profile");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <User size={16} />
                        View Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push("/admin/settings");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Settings size={16} />
                        Settings
                      </button>

                      <div className="my-2 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="block xl:hidden">
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-amber-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-100">
                <Search size={16} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }
                  }}
                  className="w-full min-w-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}