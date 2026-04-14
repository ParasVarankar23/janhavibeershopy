"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
  Loader2,
  User,
  Phone,
  CreditCard,
  Package,
  IndianRupee,
  Receipt,
  CalendarDays,
} from "lucide-react";

const PAYMENT_OPTIONS = ["all", "cash", "upi", "card", "other"];

export default function page() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [savingSale, setSavingSale] = useState(false);
  const [deletingSaleId, setDeletingSaleId] = useState("");

  // Customer form
  const [saleForm, setSaleForm] = useState({
    customerName: "",
    customerPhone: "",
    paymentMethod: "cash",
  });

  // Product picker
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Cart items for sale modal
  const [cartItems, setCartItems] = useState([]);

  // =========================================================
  // FETCH SALES
  // =========================================================
  const fetchSales = async () => {
    try {
      setLoadingSales(true);

      const res = await fetch("/api/sales", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setSales(data.sales || []);
      } else {
        toast.error(data.message || "Failed to fetch sales");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching sales");
    } finally {
      setLoadingSales(false);
    }
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

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
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  // =========================================================
  // FILTERED SALES
  // =========================================================
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const customerName = sale.customerName?.toLowerCase() || "";
      const customerPhone = sale.customerPhone?.toLowerCase() || "";
      const itemNames = sale.items?.map((item) => item.productName?.toLowerCase()).join(" ") || "";

      const matchesSearch =
        customerName.includes(search.toLowerCase()) ||
        customerPhone.includes(search.toLowerCase()) ||
        itemNames.includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === "all" || sale.paymentMethod === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [sales, search, paymentFilter]);

  // =========================================================
  // AVAILABLE PRODUCTS (ONLY STOCK > 0)
  // =========================================================
  const availableProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock) > 0);
  }, [products]);

  // =========================================================
  // SELECTED PRODUCT DETAILS
  // =========================================================
  const selectedProduct = useMemo(() => {
    return availableProducts.find((p) => p._id === selectedProductId) || null;
  }, [availableProducts, selectedProductId]);

  // =========================================================
  // CART TOTAL
  // =========================================================
  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItems]);

  // =========================================================
  // OPEN SALE MODAL
  // =========================================================
  const openSaleModal = () => {
    setSaleForm({
      customerName: "",
      customerPhone: "",
      paymentMethod: "cash",
    });
    setSelectedProductId("");
    setSelectedQuantity(1);
    setCartItems([]);
    setIsSaleModalOpen(true);
  };

  // =========================================================
  // CLOSE SALE MODAL
  // =========================================================
  const closeSaleModal = () => {
    setIsSaleModalOpen(false);
    setSaleForm({
      customerName: "",
      customerPhone: "",
      paymentMethod: "cash",
    });
    setSelectedProductId("");
    setSelectedQuantity(1);
    setCartItems([]);
  };

  // =========================================================
  // HANDLE CUSTOMER FORM
  // =========================================================
  const handleSaleFormChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD PRODUCT TO CART
  // =========================================================
  const handleAddToCart = () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    const product = availableProducts.find((p) => p._id === selectedProductId);

    if (!product) {
      toast.error("Selected product not found");
      return;
    }

    const qty = Number(selectedQuantity);

    if (!qty || qty <= 0) {
      toast.error("Please enter valid quantity");
      return;
    }

    const existingItem = cartItems.find((item) => item.productId === product._id);
    const existingQty = existingItem ? existingItem.quantity : 0;
    const totalRequestedQty = existingQty + qty;

    if (totalRequestedQty > Number(product.stock)) {
      toast.error(
        `Only ${product.stock} stock available for ${product.productName}`
      );
      return;
    }

    if (existingItem) {
      const updatedCart = cartItems.map((item) => {
        if (item.productId === product._id) {
          const newQty = item.quantity + qty;
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.priceAtSale,
          };
        }
        return item;
      });

      setCartItems(updatedCart);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: product._id,
          productName: product.productName,
          quantity: qty,
          priceAtSale: Number(product.price),
          lineTotal: Number(product.price) * qty,
          image: product.image?.url || "",
          stock: Number(product.stock),
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQuantity(1);
    toast.success("Product added to cart");
  };

  // =========================================================
  // REMOVE CART ITEM
  // =========================================================
  const handleRemoveCartItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // =========================================================
  // CHANGE CART ITEM QUANTITY
  // =========================================================
  const handleChangeCartQty = (productId, qty) => {
    const quantity = Number(qty);

    if (quantity <= 0) return;

    const product = products.find((p) => p._id === productId);

    if (!product) return;

    if (quantity > Number(product.stock)) {
      toast.error(`Only ${product.stock} stock available`);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
            ...item,
            quantity,
            lineTotal: quantity * item.priceAtSale,
          }
          : item
      )
    );
  };

  // =========================================================
  // CREATE SALE
  // =========================================================
  const handleCreateSale = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    try {
      setSavingSale(true);

      const payload = {
        customerName: saleForm.customerName.trim(),
        customerPhone: saleForm.customerPhone.trim(),
        paymentMethod: saleForm.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const promise = fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }).then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to create sale");
        }
        return data;
      });

      const data = await toast.promise(promise, {
        loading: "Creating sale...",
        success: "Sale created successfully 🎉",
        error: (err) => err.message || "Failed to create sale",
      });

      setSales((prev) => [data.sale, ...prev]);

      // Refresh products so stock updates immediately in UI
      await fetchProducts();

      closeSaleModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingSale(false);
    }
  };

  // =========================================================
  // DELETE SALE
  // =========================================================
  const handleDeleteSale = async (saleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sale? Stock will be restored."
    );

    if (!confirmDelete) return;

    try {
      setDeletingSaleId(saleId);

      const promise = fetch(`/api/sales?saleId=${saleId}`, {
        method: "DELETE",
        credentials: "include",
      }).then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to delete sale");
        }
        return data;
      });

      await toast.promise(promise, {
        loading: "Deleting sale...",
        success: "Sale deleted and stock restored",
        error: (err) => err.message || "Failed to delete sale",
      });

      setSales((prev) => prev.filter((sale) => sale._id !== saleId));

      // Refresh products because stock restored
      await fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingSaleId("");
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500 mt-1">
            Manage bills and track your Janhavi Beer Shop sales
          </p>
        </div>

        <button
          onClick={openSaleModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold shadow-md hover:bg-[#ea580c] transition-all"
        >
          <Plus className="w-5 h-5" />
          New Sale
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
              placeholder="Search by customer, phone or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
            />
          </div>

          {/* PAYMENT FILTER */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#f8fafc] outline-none focus:border-[#f59e0b]"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "all"
                  ? "All Payments"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-right">
          <span className="text-sm text-gray-500">
            Total Sales:{" "}
            <span className="font-semibold">{filteredSales.length}</span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SALES LIST */}
      {/* ========================================================= */}
      {loadingSales ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-[#f59e0b] text-lg font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading sales...
          </div>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center">
          <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No sales found</h3>
          <p className="text-gray-500 mt-2 mb-5">
            Start by creating your first sale bill.
          </p>
          <button
            onClick={openSaleModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Sale
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredSales.map((sale) => (
            <div
              key={sale._id}
              className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* TOP ROW */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {sale.customerName || "Walk-in Customer"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {sale.customerPhone || "No phone provided"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase">
                    {sale.paymentMethod}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {sale.saleStatus}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingCart className="w-4 h-4 text-[#f59e0b]" />
                  <p className="font-semibold text-gray-800">Sold Items</p>
                </div>

                <div className="space-y-3">
                  {sale.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                          {item.productId?.image?.url ? (
                            <img
                              src={item.productId.image.url}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ₹{item.priceAtSale}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold text-gray-900 whitespace-nowrap">
                        ₹{item.lineTotal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER INFO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="rounded-2xl bg-[#fffaf0] border border-[#f59e0b]/20 p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-[#ea580c] text-lg">₹{sale.totalAmount}</p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-3">
                  <p className="text-xs text-gray-500 mb-1">Sold By</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {sale.soldBy?.fullName || "Admin"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-3">
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteSale(sale._id)}
                  disabled={deletingSaleId === sale._id}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  {deletingSaleId === sale._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Sale
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW SALE MODAL */}
      {/* ========================================================= */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Sale</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Add customer details and build the bill
                </p>
              </div>
              <button
                onClick={closeSaleModal}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSale}
              className="grid grid-cols-1 xl:grid-cols-2"
            >
              {/* ========================================================= */}
              {/* LEFT SIDE - CUSTOMER DETAILS + ADD PRODUCT */}
              {/* ========================================================= */}
              <div className="p-6 border-b xl:border-b-0 xl:border-r border-gray-200 bg-[#fffaf0]">
                {/* CUSTOMER DETAILS */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Customer Details
                  </h3>

                  <div className="space-y-4">
                    {/* CUSTOMER NAME */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Customer Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="customerName"
                          value={saleForm.customerName}
                          onChange={handleSaleFormChange}
                          placeholder="Enter customer name (optional)"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                        />
                      </div>
                    </div>

                    {/* CUSTOMER PHONE */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Customer Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="customerPhone"
                          value={saleForm.customerPhone}
                          onChange={handleSaleFormChange}
                          placeholder="Enter phone number (optional)"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                        />
                      </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="paymentMethod"
                          value={saleForm.paymentMethod}
                          onChange={handleSaleFormChange}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                        >
                          <option value="cash">Cash</option>
                          <option value="upi">UPI</option>
                          <option value="card">Card</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADD PRODUCT SECTION */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Add Products to Bill
                  </h3>

                  {loadingProducts ? (
                    <div className="rounded-2xl bg-white border border-gray-200 p-4 flex items-center gap-2 text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading products...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* PRODUCT SELECT */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Product
                        </label>
                        <div className="relative">
                          <Package className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                          <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                          >
                            <option value="">Choose product</option>
                            {availableProducts.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.productName} | ₹{product.price} | Stock: {product.stock}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* PRODUCT PREVIEW */}
                      {selectedProduct && (
                        <div className="rounded-2xl border border-[#f59e0b]/20 bg-white p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f8fafc] border border-gray-100">
                              {selectedProduct.image?.url ? (
                                <img
                                  src={selectedProduct.image.url}
                                  alt={selectedProduct.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">
                                {selectedProduct.productName}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {selectedProduct.category}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="font-semibold text-[#ea580c]">
                                  ₹{selectedProduct.price}
                                </span>
                                <span className="text-gray-600">
                                  Stock: {selectedProduct.stock}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* QUANTITY */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                        />
                      </div>

                      {/* ADD BUTTON */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Bill
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* RIGHT SIDE - CART / BILL SUMMARY */}
              {/* ========================================================= */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bill Summary</h3>

                {cartItems.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 p-10 text-center bg-[#f8fafc]">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800">
                      No items in bill
                    </h4>
                    <p className="text-gray-500 mt-2">
                      Select products from the left side to create the bill.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate">
                                {item.productName}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                ₹{item.priceAtSale} each
                              </p>

                              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                                <input
                                  type="number"
                                  min="1"
                                  max={item.stock}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleChangeCartQty(item.productId, e.target.value)
                                  }
                                  className="w-24 px-3 py-2 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#f59e0b]"
                                />

                                <p className="font-semibold text-[#ea580c]">
                                  ₹{item.lineTotal}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveCartItem(item.productId)}
                              className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="mt-6 rounded-3xl border border-[#f59e0b]/20 bg-[#fffaf0] p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600">Items</span>
                        <span className="font-semibold text-gray-900">
                          {cartItems.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600">Payment</span>
                        <span className="font-semibold text-gray-900 uppercase">
                          {saleForm.paymentMethod}
                        </span>
                      </div>

                      <div className="border-t border-[#f59e0b]/20 pt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-extrabold text-[#ea580c]">
                          ₹{totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeSaleModal}
                        className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={savingSale}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#f59e0b] text-white font-semibold hover:bg-[#ea580c] transition-all disabled:opacity-60"
                      >
                        {savingSale ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Receipt className="w-4 h-4" />
                            Create Sale
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}