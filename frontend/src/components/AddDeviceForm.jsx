import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDeviceSuccess } from "../features/deviceSlice";

export default function AddDeviceForm() {
    const [macId, setmacId] = useState("");
    const [motherboardSerial, setMotherboardSerial] = useState("");
    const [message, setMessage] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/add-device`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ macId, motherboardSerial }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add device.");
            }
            setMessage("🎉 Device added successfully!");
            dispatch(addDeviceSuccess(data.device));
            setTimeout(() => navigate("/dashboard"), 2000);

        } catch (err) {
            setMessage(`❌ ${err.message}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-black p-8 rounded-2xl shadow-lg space-y-6 border border-amber-400"
        >
            <h2 className="text-2xl font-bold text-center text-amber-400">Add a New Device</h2>

            {message && (
                <div className={`text-center text-sm ${message.startsWith('🎉') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </div>
            )}

            <div>
                <label className="block mb-1 font-medium text-sm text-white">
                    Processor ID
                </label>
                <input
                    name="macId"
                    value={macId}
                    onChange={(e) => setmacId(e.target.value)}
                    placeholder="e.g., PROC123456789"
                    required
                    className="w-full px-4 py-2 border border-amber-400 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-sm text-white">
                    Motherboard Serial
                </label>
                <input
                    name="motherboardSerial"
                    value={motherboardSerial}
                    onChange={(e) => setMotherboardSerial(e.target.value)}
                    placeholder="e.g., MB987654321"
                    required
                    className="w-full px-4 py-2 border border-amber-400 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
                Add Device
            </button>
        </form>
    );
}
