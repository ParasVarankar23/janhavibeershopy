"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Save,
  Edit3,
  Loader2,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName || "",
          email: data.user.email || "",
          phoneNumber: data.user.phoneNumber || "",
          role: data.user.role || "",
        });
        setPreviewImage(data.user.profileImage?.url || "");
      } else {
        toast.error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // =========================
  // EDIT CLICK
  // =========================
  const handleEdit = () => {
    setIsEditing(true);
    toast.success("Edit mode enabled");
  };

  // =========================
  // CANCEL CLICK
  // =========================
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);

    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "",
      });
      setPreviewImage(user.profileImage?.url || "");
    }

    toast("Changes cancelled", {
      icon: "⚠️",
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updateData = new FormData();
      updateData.append("fullName", formData.fullName);
      updateData.append("email", formData.email);
      updateData.append("phoneNumber", formData.phoneNumber);
      updateData.append("role", formData.role);

      if (selectedImage) {
        updateData.append("profileImage", selectedImage);
      }

      const promise = fetch("/api/auth/profile", {
        method: "PUT",
        body: updateData,
        credentials: "include",
      }).then(async (res) => {
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update profile");
        }

        return data;
      });

      const data = await toast.promise(promise, {
        loading: "Updating profile...",
        success: "Profile updated successfully 🎉",
        error: (err) => err.message || "Failed to update profile",
      });

      setUser(data.user);
      setFormData({
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phoneNumber: data.user.phoneNumber || "",
        role: data.user.role || "",
      });
      setPreviewImage(data.user.profileImage?.url || "");
      setSelectedImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#f59e0b] text-lg font-semibold">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 md:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-[#f59e0b]/20 bg-white shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="px-6 md:px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="text-gray-500 mt-2 text-base md:text-lg">
                Manage your Janhavi Beer Shop admin details
              </p>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex flex-wrap items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#fbbf24] text-black font-semibold hover:bg-[#f59e0b] transition-all shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-60"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    form="profileForm"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#fbbf24] text-black font-semibold hover:bg-[#f59e0b] transition-all disabled:opacity-60 shadow-md"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* BODY */}
          <form
            id="profileForm"
            onSubmit={handleUpdateProfile}
            className="p-6 md:p-8"
          >
            {/* CENTER IMAGE */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#f59e0b] shadow-lg bg-gray-100">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-14 h-14 text-gray-400" />
                  </div>
                )}
              </div>

              {isEditing && (
                <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#f59e0b]/30 bg-[#fff7ed] text-[#d97706] cursor-pointer hover:bg-[#ffedd5] transition-all font-medium">
                  <Camera className="w-4 h-4" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-gray-900 outline-none transition-all ${isEditing
                        ? "bg-white border-[#f59e0b]/40 focus:border-[#f59e0b]"
                        : "bg-[#f8fafc] border-gray-200 text-gray-700 cursor-default"
                      }`}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-gray-900 outline-none transition-all ${isEditing
                        ? "bg-white border-[#f59e0b]/40 focus:border-[#f59e0b]"
                        : "bg-[#f8fafc] border-gray-200 text-gray-700 cursor-default"
                      }`}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-gray-900 outline-none transition-all ${isEditing
                        ? "bg-white border-[#f59e0b]/40 focus:border-[#f59e0b]"
                        : "bg-[#f8fafc] border-gray-200 text-gray-700 cursor-default"
                      }`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-[#f8fafc] border-gray-200 text-gray-500 outline-none cursor-not-allowed"
                    placeholder="Role"
                  />
                </div>
              </div>
            </div>

            {/* EDIT MODE INFO */}
            {isEditing && (
              <div className="mt-8 rounded-2xl border border-[#f59e0b]/20 bg-[#fff7ed] px-4 py-3">
                <p className="text-sm text-[#b45309] font-medium">
                  You are in edit mode. Update your profile details and click <span className="font-semibold">Save</span>.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}