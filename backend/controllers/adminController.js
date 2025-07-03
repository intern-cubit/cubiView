import Device from "../models/Device.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateActivationKey } from "../utils/generateActivationKey.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async () => {
    console.log("Razorpay key loaded:", !!process.env.RAZORPAY_KEY_ID);
    console.log("Razorpay secret loaded:", !!process.env.RAZORPAY_KEY_SECRET);
    console.log("Razorpay instance created:", !!razorpay);
    const amount = 49900;
    const order = await razorpay.orders.create({
        amount,
        currency: "INR",
    });

    return { order, key: process.env.RAZORPAY_KEY_ID, amount };
};

export const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        systemId,
    } = req.body;

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature === razorpay_signature) {
        const activationKey = crypto.randomBytes(8).toString("hex");

        await Device.findOneAndUpdate(
            { systemId },
            { activationKey, paymentStatus: "paid" },
            { upsert: true, new: true }
        );

        return res.json({ success: true, activationKey });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid signature" });
    }
};

export const addDevice = async (req, res) => {
    const { systemId } = req.body;
    const { id: adminId } = req.user;

    try {
        const existingDevice = await Device.findOne({
            systemId
        });
        if (!systemId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (existingDevice) {
            return res.status(400).json({ message: "Device already exists" });
        }
        const activationKey = generateActivationKey(systemId);
        if (!activationKey) {
            return res.status(400).json({ message: "Invalid IMEI" });
        }
        const device = new Device({
            systemId,
            activationKey,
            adminId,
        });
        await device.save();
        const { order, key, amount } = await createOrder();
        return res.status(201).json({
            message: "Device added successfully",
            order,
            key: process.env.RAZORPAY_KEY_ID,
            amount,
        });
    } catch (error) {
        console.error("Add device error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const add_device = async (req, res) => {
    const { systemId, name } = req.body;
    const { id: adminId } = req.user;

    try {
        if (!systemId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingDevice = await Device.findOne({
            systemId
        });

        if (existingDevice) {
            return res.status(400).json({ message: "Device already exists" });
        }

        const activationKey = generateActivationKey(systemId);
        if (!activationKey) {
            return res.status(400).json({ message: "Invalid IMEI" });
        }

        const deviceData = {
            systemId,
            activationKey,
            adminId,
        };

        if (name && name.trim() !== "") {
            deviceData.name = name.trim();
        }

        const device = new Device(deviceData);
        await device.save();

        return res.status(201).json({ device });
    } catch (error) {
        console.error("Add device error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteDevice = async (req, res) => {
    const { id: adminId } = req.user;
    const { systemId } = req.params;

    try {
        const device = await Device.findOneAndDelete({
            systemId,
            adminId,
        });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error("Delete device error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getDevices = async (req, res) => {
    const { id: adminId } = req.user;
    try {
        const devices = await Device.find({ adminId });
        return res.status(200).json(devices);
    } catch (error) {
        console.error("Get devices error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
