import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        macId: {
            type: String,
            required: true,
            unique: true,
        },
        motherboardSerial: {
            type: String,
            required: true,
            unique: true,
        },
        activationKey: {
            type: String,
            required: true,
            unique: true,
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
        deviceStatus: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);