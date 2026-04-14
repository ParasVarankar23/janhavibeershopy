"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    Camera,
    Upload,
    ScanLine,
    Save,
    Package,
    IndianRupee,
    Boxes,
    Tag,
    Loader2,
    RefreshCcw,
} from "lucide-react";

const CATEGORY_OPTIONS = [
    "Beer",
    "Whisky",
    "Rum",
    "Vodka",
    "Wine",
    "Snacks",
    "Soft Drinks",
    "Water",
    "Other",
];

export default function page() {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [isScanning, setIsScanning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        productName: "",
        category: "Other",
        price: "",
        stock: "",
    });

    const [scanMeta, setScanMeta] = useState({
        confidence: 0,
        notes: "",
    });

    const handleImageChange = (file) => {
        if (!file) return;

        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));

        // reset extracted fields when new image selected
        setFormData({
            productName: "",
            category: "Other",
            price: "",
            stock: "",
        });

        setScanMeta({
            confidence: 0,
            notes: "",
        });
    };

    const handleScan = async () => {
        if (!selectedImage) {
            toast.error("Please upload or capture an image first");
            return;
        }

        try {
            setIsScanning(true);

            const fd = new FormData();
            fd.append("image", selectedImage);

            const res = await fetch("/api/scan", {
                method: "POST",
                body: fd,
                credentials: "include",
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Failed to scan image");
                return;
            }

            const scanned = data.data;

            setFormData((prev) => ({
                ...prev,
                productName: scanned.productName || "",
                category: scanned.category || "Other",
                price: scanned.price ? String(scanned.price) : "",
            }));

            setScanMeta({
                confidence: scanned.confidence || 0,
                notes: scanned.notes || "",
            });

            toast.success("Product details detected successfully");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while scanning");
        } finally {
            setIsScanning(false);
        }
    };

    const handleSaveProduct = async () => {
        if (!selectedImage) {
            toast.error("Please select product image");
            return;
        }

        if (!formData.productName || !formData.category || !formData.price || !formData.stock) {
            toast.error("Please fill all product details");
            return;
        }

        try {
            setIsSaving(true);

            const fd = new FormData();
            fd.append("productName", formData.productName);
            fd.append("category", formData.category);
            fd.append("price", formData.price);
            fd.append("stock", formData.stock);
            fd.append("image", selectedImage);

            const res = await fetch("/api/product", {
                method: "POST",
                body: fd,
                credentials: "include",
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Failed to save product");
                return;
            }

            toast.success("Product added successfully");

            setSelectedImage(null);
            setPreviewUrl("");
            setFormData({
                productName: "",
                category: "Other",
                price: "",
                stock: "",
            });
            setScanMeta({
                confidence: 0,
                notes: "",
            });

            if (fileInputRef.current) fileInputRef.current.value = "";
            if (cameraInputRef.current) cameraInputRef.current.value = "";
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while saving product");
        } finally {
            setIsSaving(false);
        }
    };

    const resetAll = () => {
        setSelectedImage(null);
        setPreviewUrl("");
        setFormData({
            productName: "",
            category: "Other",
            price: "",
            stock: "",
        });
        setScanMeta({
            confidence: 0,
            notes: "",
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Scan Product</h1>
                <p className="text-gray-500 mt-1">
                    Upload or capture a product image to auto-detect product details
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* LEFT: IMAGE PANEL */}
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#f59e0b] flex items-center justify-center">
                            <ScanLine className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Product Scanner</h2>
                            <p className="text-sm text-gray-500">Upload image or take a photo</p>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-3xl p-4 bg-[#f8fafc]">
                        <div className="aspect-[4/3] rounded-3xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Product Preview"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center px-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#fff7ed] text-[#f59e0b] flex items-center justify-center mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="font-semibold text-gray-700">No image selected</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload a product image or capture from camera
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                Upload Image
                            </button>

                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all"
                            >
                                <Camera className="w-5 h-5" />
                                Take Photo
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                        />

                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => handleImageChange(e.target.files?.[0])}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={handleScan}
                                disabled={isScanning}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#10b981] text-white font-semibold hover:bg-[#059669] transition-all disabled:opacity-50"
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <ScanLine className="w-5 h-5" />
                                        Scan Product
                                    </>
                                )}
                            </button>

                            <button
                                onClick={resetAll}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* AI Result */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-[#f8fafc] border border-gray-200 p-4">
                            <p className="text-sm text-gray-500">AI Confidence</p>
                            <p className="text-2xl font-bold text-[#f59e0b] mt-1">
                                {scanMeta.confidence || 0}%
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#f8fafc] border border-gray-200 p-4">
                            <p className="text-sm text-gray-500">AI Notes</p>
                            <p className="text-sm font-medium text-gray-700 mt-1 line-clamp-3">
                                {scanMeta.notes || "No notes yet"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: PRODUCT FORM */}
                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Detected Product Details</h2>
                            <p className="text-sm text-gray-500">
                                Review AI result and update manually if needed
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name
                            </label>
                            <div className="relative">
                                <Package className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, productName: e.target.value }))
                                    }
                                    placeholder="Enter product name"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                            </label>
                            <div className="relative">
                                <Tag className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                                    }
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                                >
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price
                                </label>
                                <div className="relative">
                                    <IndianRupee className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, price: e.target.value }))
                                        }
                                        placeholder="Enter price"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Stock
                                </label>
                                <div className="relative">
                                    <Boxes className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, stock: e.target.value }))
                                        }
                                        placeholder="Enter stock quantity"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#fff7ed] border border-[#fed7aa] p-4">
                            <p className="text-sm text-[#9a3412] font-medium">
                                AI can suggest details, but please verify product name, category and price before saving.
                            </p>
                        </div>

                        <button
                            onClick={handleSaveProduct}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving Product...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Product
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}