import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDeviceSuccess } from "../features/deviceSlice";

export default function AddDeviceForm() {
    const [macId, setMacId] = useState("");
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
                body: JSON.stringify({ macId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add device.");
            }
            setMessage("Device added successfully!");
            dispatch(addDeviceSuccess(data.device));
            setTimeout(() => navigate("/dashboard"), 2000);
            // if (!response.ok) {
            //     throw new Error(data.message || "Failed to add device.");
            // }

            // // Razorpay payment begins here!
            // const options = {
            //     key: data.key,
            //     amount: data.amount,
            //     currency: "INR",
            //     name: "GPS Tracker System",
            //     description: "Activation Payment",
            //     order_id: data.order.id,
            //     handler: async function (response) {
            //         // Verify the payment
            //         const verifyRes = await fetch(`${BACKEND_URL}/api/admin/verify-payment`, {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({
            //                 ...response,
            //                 macId,
            //             }),
            //         });

            //         const verifyData = await verifyRes.json();

            //         if (!verifyRes.ok) {
            //             throw new Error(verifyData.message || "Payment verification failed.");
            //         }

            //         setMessage(`🎉 Device added and payment successful! Activation Key: ${verifyData.activationKey}`);
            //         setTimeout(() => navigate("/dashboard"), 2000);
            //     },
            //     prefill: {
            //         name: "Avinash 🚀",
            //         email: "leelaavinash24@gmail.com",
            //         contact: "+91 8074947204",
            //     },
            //     theme: {
            //         color: "#f59e0b", // Amber magic!
            //     },
            // };

            // const rzp = new window.Razorpay(options);
            // rzp.open();
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
                    MAC ID
                </label>
                <input
                    name="macId"
                    value={macId}
                    onChange={(e) => setMacId(e.target.value)}
                    placeholder="eg: A1B2C3D4E5F6"
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
