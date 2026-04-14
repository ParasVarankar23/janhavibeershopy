"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  IndianRupee,
  Boxes,
  Tag,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  "All",
  "Beer",
  "Whisky",
  "Wine",
  "Vodka",
  "Rum",
  "Brandy",
  "Snacks",
  "Soft Drinks",
  "Other",
];

export default function page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [addForm, setAddForm] = useState({
    productName: "",
    price: "",
    stock: "",
    category: "",
  });

  const [editForm, setEditForm] = useState({
    productId: "",
    productName: "",
    price: "",
    stock: "",
    category: "",
  });

  const [addImage, setAddImage] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState("");

  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/product", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // FILTERED PRODUCTS
  // =========================================================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.productName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || product.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, filterCategory]);

  // =========================================================
  // HANDLE ADD INPUT CHANGE
  // =========================================================
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE EDIT INPUT CHANGE
  // =========================================================
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE ADD IMAGE
  // =========================================================
  const handleAddImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAddImage(file);
    setAddImagePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // HANDLE EDIT IMAGE
  // =========================================================
  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================
  const openAddModal = () => {
    setAddForm({
      productName: "",
      price: "",
      stock: "",
      category: "",
    });
    setAddImage(null);
    setAddImagePreview("");
    setIsAddModalOpen(true);
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAddForm({
      productName: "",
      price: "",
      stock: "",
      category: "",
    });
    setAddImage(null);
    setAddImagePreview("");
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================
  const openEditModal = (product) => {
    setEditForm({
      productId: product._id,
      productName: product.productName || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
    });

    setEditImage(null);
    setEditImagePreview(product.image?.url || "");
    setIsEditModalOpen(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({
      productId: "",
      productName: "",
      price: "",
      stock: "",
      category: "",
    });
    setEditImage(null);
    setEditImagePreview("");
  };

  // =========================================================
  // ADD PRODUCT
  // =========================================================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !addForm.productName.trim() ||
      !addForm.price ||
      !addForm.stock ||
      !addForm.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("productName", addForm.productName);
      formData.append("price", addForm.price);
      formData.append("stock", addForm.stock);
      formData.append("category", addForm.category);

      if (addImage) {
        formData.append("image", addImage);
      }

      const promise = fetch("/api/product", {
        method: "POST",
        body: formData,
        credentials: "include",
      }).then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to add product");
        }
        return data;
      });

      const data = await toast.promise(promise, {
        loading: "Adding product...",
        success: "Product added successfully 🎉",
        error: (err) => err.message || "Failed to add product",
      });

      setProducts((prev) => [data.product, ...prev]);
      closeAddModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE PRODUCT
  // =========================================================
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !editForm.productId ||
      !editForm.productName.trim() ||
      editForm.price === "" ||
      editForm.stock === "" ||
      !editForm.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("productId", editForm.productId);
      formData.append("productName", editForm.productName);
      formData.append("price", editForm.price);
      formData.append("stock", editForm.stock);
      formData.append("category", editForm.category);

      if (editImage) {
        formData.append("image", editImage);
      }

      const promise = fetch("/api/product", {
        method: "PUT",
        body: formData,
        credentials: "include",
      }).then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to update product");
        }
        return data;
      });

      const data = await toast.promise(promise, {
        loading: "Updating product...",
        success: "Product updated successfully ✨",
        error: (err) => err.message || "Failed to update product",
      });

      setProducts((prev) =>
        prev.map((item) =>
          item._id === data.product._id ? data.product : item
        )
      );

      closeEditModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(productId);

      const promise = fetch(`/api/product?productId=${productId}`, {
        method: "DELETE",
        credentials: "include",
      }).then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to delete product");
        }
        return data;
      });

      await toast.promise(promise, {
        loading: "Deleting product...",
        success: "Product deleted successfully 🗑️",
        error: (err) => err.message || "Failed to delete product",
      });

      setProducts((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen">
      {/* ========================================================= */}
      {/* PAGE HEADER */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your Janhavi Beer Shop inventory
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold shadow-md hover:bg-[#ea580c] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* ========================================================= */}
      {/* FILTER BAR */}
      {/* ========================================================= */}
      <div className="bg-white border border-gray-200 rounded-3xl p-4 md:p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* SEARCH */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
            />
          </div>

          {/* FILTER */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-right">
          <span className="text-sm text-gray-500">
            Total: <span className="font-semibold">{filteredProducts.length}</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRODUCTS GRID */}
      {/* ========================================================= */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-[#f59e0b] text-lg font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading products...
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No products found</h3>
          <p className="text-gray-500 mt-2 mb-5">
            Start by adding your first product to inventory.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* IMAGE */}
              <div className="w-full h-52 rounded-2xl overflow-hidden bg-[#f8fafc] border border-gray-100 mb-4">
                {product.image?.url ? (
                  <img
                    src={product.image.url}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>

              {/* TITLE + CATEGORY */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {product.productName}
                </h3>
                <p className="text-gray-500 mt-1">{product.category}</p>
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-3">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {product.price}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-3">
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <p
                    className={`font-bold ${Number(product.stock) <= 5 ? "text-red-500" : "text-green-600"
                      }`}
                  >
                    {product.stock}
                  </p>
                </div>
              </div>

              {/* ADDED BY */}
              <div className="mb-5">
                <p className="text-xs text-gray-400">Added by</p>
                <p className="text-sm text-gray-700 font-medium">
                  {product.addedBy?.fullName || "Admin"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  disabled={deletingId === product._id}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  {deletingId === product._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Add a new product to your inventory
                </p>
              </div>
              <button
                onClick={closeAddModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT SIDE IMAGE */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-[#fffaf0]">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Image
                </label>

                <label className="w-full h-[320px] rounded-3xl border-2 border-dashed border-[#f59e0b]/40 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-[#f59e0b] transition-all">
                  {addImagePreview ? (
                    <img
                      src={addImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <Upload className="w-12 h-12 text-[#f59e0b] mb-3" />
                      <p className="font-semibold text-gray-800">Click to upload product image</p>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG, WEBP supported
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* RIGHT SIDE FORM */}
              <div className="p-6">
                <div className="space-y-5">
                  {/* PRODUCT NAME */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="productName"
                        value={addForm.productName}
                        onChange={handleAddChange}
                        placeholder="Enter product name"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="category"
                        value={addForm.category}
                        onChange={handleAddChange}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.filter((item) => item !== "All").map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={addForm.price}
                        onChange={handleAddChange}
                        placeholder="Enter price"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>

                  {/* STOCK */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={addForm.stock}
                        onChange={handleAddChange}
                        placeholder="Enter stock quantity"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Update your product details
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT SIDE IMAGE */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-[#fffaf0]">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Image
                </label>

                <label className="w-full h-[320px] rounded-3xl border-2 border-dashed border-[#f59e0b]/40 bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-[#f59e0b] transition-all">
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <Upload className="w-12 h-12 text-[#f59e0b] mb-3" />
                      <p className="font-semibold text-gray-800">Click to change product image</p>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG, WEBP supported
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* RIGHT SIDE FORM */}
              <div className="p-6">
                <div className="space-y-5">
                  {/* PRODUCT NAME */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="productName"
                        value={editForm.productName}
                        onChange={handleEditChange}
                        placeholder="Enter product name"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.filter((item) => item !== "All").map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Enter price"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>

                  {/* STOCK */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={editForm.stock}
                        onChange={handleEditChange}
                        placeholder="Enter stock quantity"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
                      />
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition-all disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Pencil className="w-4 h-4" />
                        Update Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}