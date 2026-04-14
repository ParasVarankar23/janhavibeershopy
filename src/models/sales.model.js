import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        priceAtSale: {
            type: Number,
            required: true,
            min: 0,
        },

        lineTotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const salesSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            default: "",
            trim: true,
        },

        customerPhone: {
            type: String,
            default: "",
            trim: true,
        },

        items: {
            type: [saleItemSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                },
                message: "At least one product is required in a sale",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card", "other"],
            default: "cash",
        },

        saleStatus: {
            type: String,
            enum: ["completed", "cancelled"],
            default: "completed",
        },

        soldBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Sale = mongoose.models.Sale || mongoose.model("Sale", salesSchema);

export default Sale;