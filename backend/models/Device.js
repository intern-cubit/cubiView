import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        systemId: {
            type: String,
            required: true,
            unique: true,
        },
        activationKey: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid"],
            default: "unpaid",
        },
        basePayment: {
            type: Boolean,
            default: false,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        premiumPlan: {
            type: String,
            enum: ["7days", "15days", "30days", "1year"],
            default: null,
        },
        premiumExpiryDate: {
            type: Date,
            default: null,
        },
        deviceStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);