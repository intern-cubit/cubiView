import Device from "../models/Device.js";

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
    }
    catch (error) {
        console.error("Get device details error:", error);
        res.status(500).json({ message: "Server Error" });
    }
}