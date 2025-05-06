import Device from "../models/Device.js";
import Admin from "../models/User.js";
import Coupon from "../models/Coupon.js";
import crypto from "crypto";

export const getDetails = async (req, res) => {
    try {
        const devices = await Device.find();
        const admins = await Admin.find();

        res.status(200).json({
            success: true,
            data: {
                devices,
                admins,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching details",
            error: error.message,
        });
    }
};

export const generateCoupons = async (req, res) => {
    try {
        const { count, plan } = req.body;

        if (!count || !plan) {
            return res.status(400).json({
                success: false,
                message: "Count and discount are required",
            });
        }

        const coupons = [];

        for (let i = 0; i < count; i++) {
            const couponCode = crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();
            const coupon = new Coupon({
                couponCode,
                plan,
            });
            await coupon.save();
            coupons.push(coupon.couponCode);
        }

        res.status(201).json({
            success: true,
            data: coupons,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating coupons",
            error: error.message,
        });
    }
};
