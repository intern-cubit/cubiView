import { useState } from "react";
import { useDispatch } from "react-redux";
import { X, CreditCard, CheckCircle, Copy } from "lucide-react";
import { addDeviceSuccess } from "../features/deviceSlice";

const AddDeviceModal = ({ isOpen, onClose, onDeviceAdded }) => {
    const [systemId, setSystemId] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState("form"); // "form", "payment", "success"
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [activationKey, setActivationKey] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            // Validate systemId first
            if (!systemId.trim()) {
                throw new Error("System ID is required");
            }

            // Move to payment step
            setCurrentStep("payment");
            setIsLoading(false);

        } catch (err) {
            setMessage(`❌ ${err.message}`);
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        setPaymentLoading(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // After "successful" payment, add device
            const payload = {
                systemId,
            };

            if (name.trim() !== "") {
                payload.name = name.trim();
            }

            const response = await fetch(`${BACKEND_URL}/api/admin/add-device`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
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

    const handleClose = () => {
        setCurrentStep("form");
        setSystemId("");
        setName("");
        setMessage("");
        setActivationKey("");
        
        // Call onDeviceAdded if device was successfully added
        if (currentStep === "success" && onDeviceAdded) {
            onDeviceAdded();
        }
        
        onClose();
    };

    if (!isOpen) return null;

    const renderFormStep = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Device</h2>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${message.includes('❌')
                    ? 'bg-red-900/20 border border-red-800 text-red-300'
                    : 'bg-green-900/20 border border-green-800 text-green-300'
                    }`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        System ID
                    </label>
                    <input
                        type="text"
                        value={systemId}
                        onChange={(e) => setSystemId(e.target.value)}
                        placeholder="e.g., PROC123456789"
                        required
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name (Optional)
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Avinash's PC"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : "Continue to Payment"}
                    </button>
                </div>
            </div>
        </>
    );

    const renderPaymentStep = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Payment Required</h2>
                <button
                    onClick={() => setCurrentStep("form")}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
                    <CreditCard className="mx-auto mb-4 text-purple-400" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">Device Registration Fee</h3>
                    <p className="text-gray-300 mb-4">One-time payment to register your device</p>
                    <div className="text-3xl font-bold text-purple-400">₹499</div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Device Details:</p>
                    <p className="text-white font-medium">System ID: {systemId}</p>
                    {name && <p className="text-white">Name: {name}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setCurrentStep("form")}
                        className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {paymentLoading ? "Processing Payment..." : "Pay Now"}
                    </button>
                </div>
            </div>
        </>
    );

    const renderSuccessStep = () => (
        <>
            <div className="text-center space-y-6">
                <CheckCircle className="mx-auto text-green-400" size={64} />
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                    <p className="text-green-300">✅ Device has been successfully added to your dashboard</p>
                    <p className="text-sm text-gray-400 mt-2">System ID: {systemId}</p>
                    {activationKey && (
                        <div className="mt-3 p-3 bg-purple-900/20 border border-purple-700 rounded-lg flex flex-col items-start">
                            <p className="text-xs text-purple-300 mb-1">Activation Key (Use this in your app):</p>
                            <div className="flex items-center justify-between w-full">
                                <span className="text-purple-200 font-mono text-sm font-bold select-all">{activationKey}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(activationKey);
                                        setMessage("Copied activation key!");
                                        setTimeout(() => setMessage(""), 1500);
                                    }}
                                    className="px-2 py-1 text-white rounded transition-all text-xs"
                                    title="Copy to clipboard"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                            {message === "Copied activation key!" && (
                                <span className="text-green-400 text-xs mt-2">Copied!</span>
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all"
                >
                    Continue to Dashboard
                </button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#111827] via-black to-[#10151b] bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-gray-800 rounded-xl p-6 w-full max-w-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)]">
                {currentStep === "form" && renderFormStep()}
                {currentStep === "payment" && renderPaymentStep()}
                {currentStep === "success" && renderSuccessStep()}
            </div>
        </div>
    );
};

export default AddDeviceModal;