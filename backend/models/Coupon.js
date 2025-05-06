import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        couponCode: {
            type: String,
            required: true,
            unique: true,
        },
        plan: {
            type: Number,
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true,
            default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, 
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        maxUsage: {
            type: Number,
            default: 1,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
