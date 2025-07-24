import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CreditCard, CheckCircle } from "lucide-react";
import { addDeviceSuccess } from "../features/deviceSlice";

export default function AddDeviceForm() {
    const [systemId, setSystemId] = useState("");
    const [message, setMessage] = useState("");
    const [currentStep, setCurrentStep] = useState("form"); // "form", "payment", "success"
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [activationKey, setActivationKey] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (!systemId.trim()) {
                throw new Error("System ID is required");
            }
            
            setCurrentStep("payment");

        } catch (err) {
            setMessage(`❌ ${err.message}`);
        }
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const response = await fetch(`${BACKEND_URL}/api/admin/add-device`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ systemId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add device.");
            }
            
            dispatch(addDeviceSuccess(data.device));
            setActivationKey(data.activationKey);
            setCurrentStep("success");

        } catch (err) {
            setMessage(`❌ ${err.message}`);
            setCurrentStep("form");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleComplete = () => {
        // Refresh devices in Redux store by dispatching the new device
        // The navigation will show the updated list
        setTimeout(() => {
            navigate("/dashboard");
        }, 500); // Small delay to show success message
    };

    const renderFormStep = () => (
        <>
            <h2 className="text-2xl font-bold text-center text-amber-400">Add a New Device</h2>

            {message && (
                <div className={`text-center text-sm ${message.startsWith('🎉') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </div>
            )}

            <div>
                <label className="block mb-1 font-medium text-sm text-white">
                    System ID
                </label>
                <input
                    name="systemId"
                    value={systemId}
                    onChange={(e) => setSystemId(e.target.value)}
                    placeholder="e.g., PROC123456789"
                    required
                    className="w-full px-4 py-2 border border-amber-400 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
                Continue to Payment
            </button>
        </>
    );

    const renderPaymentStep = () => (
        <>
            <h2 className="text-2xl font-bold text-center text-amber-400">Payment Required</h2>

            <div className="text-center space-y-4">
                <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <CreditCard className="mx-auto mb-3 text-amber-400" size={40} />
                    <h3 className="text-lg font-semibold text-white mb-2">Device Registration Fee</h3>
                    <p className="text-gray-300 text-sm mb-3">One-time payment to register your device</p>
                    <div className="text-2xl font-bold text-amber-400">₹499</div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Device Details:</p>
                    <p className="text-white font-medium text-sm">System ID: {systemId}</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentStep("form")}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                        Back
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
                    >
                        {paymentLoading ? "Processing..." : "Pay Now"}
                    </button>
                </div>
            </div>
        </>
    );

    const renderSuccessStep = () => (
        <>
            <div className="text-center space-y-4">
                <CheckCircle className="mx-auto text-green-400" size={48} />
                <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                    <p className="text-green-300 text-sm">✅ Device has been successfully added to your dashboard</p>
                    <p className="text-xs text-gray-400 mt-1">System ID: {systemId}</p>
                    {activationKey && (
                        <div className="mt-2 p-2 bg-amber-900/20 border border-amber-700 rounded-lg">
                            <p className="text-xs text-amber-300 mb-1">Activation Key (Use this in your app):</p>
                            <p className="text-amber-200 font-mono text-xs font-bold">{activationKey}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleComplete}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    Continue to Dashboard
                </button>
            </div>
        </>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-black p-8 rounded-2xl shadow-lg space-y-6 border border-amber-400"
        >
            {currentStep === "form" && renderFormStep()}
            {currentStep === "payment" && renderPaymentStep()}
            {currentStep === "success" && renderSuccessStep()}
        </form>
    );
}
