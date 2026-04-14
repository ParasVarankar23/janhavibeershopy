import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            url: {
                type: String,
                default: "",
            },
            public_id: {
                type: String,
                default: "",
            },
        },

        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;