import Device from "../models/Device.js";
import Report from "../models/Report.js";
import cloudinary from "../config/cloudinary.js";

export const verifyDevice = async (req, res) => {
    const { macId, activationKey } = req.body;

    if (!macId || !activationKey) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const device = await Device.findOne({ macId, activationKey });
    if (!device) {
        return res
            .status(400)
            .json({ message: "Invalid device or activation key" });
    }
    device.deviceStatus = "active";
    await device.save();
    return res.status(200).json({ message: "Device verified successfully" });
};

export const getDeviceDetails = async (req, res) => {
    const { macId } = req.params;
    try {
        const device = await Device.findOne({ macId });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        return res.status(200).json(device);
    } catch (error) {
        console.error("Get device details error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const uploadReport = async (req, res) => {
    try {
        const { macId } = req.body;
        if (!macId) {
            return res.status(400).json({ error: "macId is required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "ZIP file is required" });
        }

        const device = await Device.findOne({ macId });
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }

        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "raw" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.end(buffer);
            });
        };

        const result = await streamUpload(req.file.buffer);

        // save report record
        const report = await Report.create({
            deviceId: device._id,
            adminId: device.adminId,
            reportUrl: result.secure_url,
            reportDate: Date.now(),
        });

        return res.json({ url: report.reportUrl });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

export const downloadReport = async (req, res) => {
    try {
        const { macId, date } = req.body;
        const user = req.user;

        if (!user) return res.status(401).json({ error: "Unauthorized" });
        if (!macId || !date)
            return res
                .status(400)
                .json({ error: "macId and date are required" });

        const device = await Device.findOne({ macId });
        if (!device) return res.status(404).json({ error: "Device not found" });

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const report = await Report.findOne({
            deviceId: device._id,
            adminId: device.adminId,
            reportDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (!report) return res.status(404).json({ error: "Report not found" });

        const downloadUrl = report.reportUrl;
        return res.status(200).json({ downloadUrl });
    } catch (err) {
        console.error("Download error:", err);
        return res.status(500).json({
            error: "Server error while processing the download request.",
        });
    }
};
