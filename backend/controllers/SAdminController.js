import { Request, Response } from "express";
import Device from "../models/Device";
import Admin from "../models/Admin";
import Coupon from "../models/Coupon";
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

// Generate coupons
export const generateCoupons = async (req, res) => {
    try {
        const { count = 1, limit = 1 } = req.body;
        const coupons = [];

        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(6).toString("hex").toUpperCase();
            const coupon = new Coupon({
                code,
                limit,
            });
            await coupon.save();
            coupons.push(coupon);
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
