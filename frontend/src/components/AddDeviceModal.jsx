import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { X, CreditCard, CheckCircle, Copy, Smartphone, Wifi, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { addDeviceSuccess } from "../features/deviceSlice";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { PulseLoader, CircleLoader } from "react-spinners";

const AddDeviceModal = ({ isOpen, onClose, onDeviceAdded }) => {
    const { isDark } = useTheme();
    const [systemId, setSystemId] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState("form"); // "form", "payment", "success"
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [activationKey, setActivationKey] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const dispatch = useDispatch();

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const resetModal = () => {
        setSystemId("");
        setName("");
        setMessage("");
        setCurrentStep("form");
        setActivationKey("");
        setCopySuccess(false);
    };

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
            setMessage(err.message);
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
            setMessage(err.message);
            setCurrentStep("form");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                    <Card className="overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className={`px-8 py-6 border-b ${
                            isDark 
                                ? 'bg-gray-800/30 border-gray-700/50' 
                                : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                        <Smartphone size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            {currentStep === "form" && "Add New Device"}
                                            {currentStep === "payment" && "Complete Payment"}
                                            {currentStep === "success" && "Device Added Successfully"}
                                        </h2>
                                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {currentStep === "form" && "Enter device details to get started"}
                                            {currentStep === "payment" && "Secure payment processing"}
                                            {currentStep === "success" && "Your device is now registered"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className={`transition-colors p-2 rounded-lg ${
                                        isDark 
                                            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-center mt-6 space-x-4">
                                <div className={`flex items-center space-x-2 ${
                                    currentStep === "form" 
                                        ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                                        : (isDark ? 'text-green-400' : 'text-green-600')
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        currentStep === "form" 
                                            ? (isDark ? 'border-blue-400 bg-blue-500/20' : 'border-blue-600 bg-blue-100')
                                            : (isDark ? 'border-green-400 bg-green-500/20' : 'border-green-600 bg-green-100')
                                    }`}>
                                        {currentStep === "form" ? "1" : <CheckCircle size={16} />}
                                    </div>
                                    <span className="text-sm font-medium">Device Details</span>
                                </div>

                                <ArrowRight size={16} className={isDark ? 'text-gray-600' : 'text-gray-400'} />

                                <div className={`flex items-center space-x-2 ${
                                    currentStep === "payment" 
                                        ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                                        : currentStep === "success" 
                                            ? (isDark ? 'text-green-400' : 'text-green-600')
                                            : (isDark ? 'text-gray-600' : 'text-gray-400')
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        currentStep === "payment" 
                                            ? (isDark ? 'border-blue-400 bg-blue-500/20' : 'border-blue-600 bg-blue-100')
                                            : currentStep === "success" 
                                                ? (isDark ? 'border-green-400 bg-green-500/20' : 'border-green-600 bg-green-100')
                                                : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-100')
                                    }`}>
                                        {currentStep === "success" ? <CheckCircle size={16} /> : "2"}
                                    </div>
                                    <span className="text-sm font-medium">Payment</span>
                                </div>

                                <ArrowRight size={16} className={isDark ? 'text-gray-600' : 'text-gray-400'} />

                                <div className={`flex items-center space-x-2 ${
                                    currentStep === "success" 
                                        ? (isDark ? 'text-green-400' : 'text-green-600')
                                        : (isDark ? 'text-gray-600' : 'text-gray-400')
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        currentStep === "success" 
                                            ? (isDark ? 'border-green-400 bg-green-500/20' : 'border-green-600 bg-green-100')
                                            : (isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-100')
                                    }`}>
                                        {currentStep === "success" ? <CheckCircle size={16} /> : "3"}
                                    </div>
                                    <span className="text-sm font-medium">Complete</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`px-8 py-6 ${
                            isDark ? 'bg-gray-800/20' : 'bg-white'
                        }`}>
                            <AnimatePresence mode="wait">
                                {/* Step 1: Device Form */}
                                {currentStep === "form" && (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        {message && (
                                            <motion.div
                                                className={`p-4 rounded-lg border flex items-center space-x-3 ${
                                                    isDark 
                                                        ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                                                        : 'bg-red-50 border-red-200 text-red-600'
                                                }`}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <span className="text-sm">{message}</span>
                                            </motion.div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label htmlFor="systemId" className={`block text-sm font-medium ${
                                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    System ID / MAC Address *
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="systemId"
                                                        value={systemId}
                                                        onChange={(e) => setSystemId(e.target.value)}
                                                        required
                                                        placeholder="Enter device system ID"
                                                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                            isDark 
                                                                ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25' 
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/25 shadow-sm'
                                                        }`}
                                                    />
                                                    <Wifi size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="name" className={`block text-sm font-medium ${
                                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    Device Name (Optional)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Enter a friendly name for the device"
                                                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                            isDark 
                                                                ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25' 
                                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/25 shadow-sm'
                                                        }`}
                                                    />
                                                    <Smartphone size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`} />
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleClose}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading || !systemId.trim()}
                                                    isLoading={isLoading}
                                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                    icon={!isLoading ? <ArrowRight size={18} /> : null}
                                                >
                                                    {isLoading ? 'Validating...' : 'Continue to Payment'}
                                                </Button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                {/* Step 2: Payment */}
                                {currentStep === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="text-center space-y-4">
                                            {paymentLoading ? (
                                                <motion.div
                                                    className="flex flex-col items-center space-y-4"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <CircleLoader 
                                                        size={60} 
                                                        color={isDark ? '#60a5fa' : '#3b82f6'}
                                                        loading={true}
                                                    />
                                                    <div>
                                                        <h3 className={`text-xl font-semibold mb-2 ${
                                                            isDark ? 'text-blue-400' : 'text-blue-700'
                                                        }`}>
                                                            Processing Payment...
                                                        </h3>
                                                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            Please wait while we process your payment securely
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                                                        isDark 
                                                            ? 'bg-blue-500/20 text-blue-400' 
                                                            : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                        <CreditCard size={32} />
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className={`text-xl font-semibold mb-2 ${
                                                            isDark ? 'text-blue-400' : 'text-blue-700'
                                                        }`}>
                                                            Device Registration
                                                        </h3>
                                                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            Complete your payment to register the device
                                                        </p>
                                                    </div>

                                                    <div className={`rounded-lg p-6 border ${
                                                        isDark 
                                                            ? 'bg-gray-800/30 border-gray-600/30' 
                                                            : 'bg-blue-50 border-blue-200 shadow-sm'
                                                    }`}>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                                                    Device Registration Fee
                                                                </span>
                                                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    ₹500
                                                                </span>
                                                            </div>
                                                            <hr className={isDark ? 'border-gray-600' : 'border-gray-300'} />
                                                            <div className="flex justify-between items-center text-lg font-bold">
                                                                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                                                                    Total
                                                                </span>
                                                                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                    ₹500
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {!paymentLoading && (
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setCurrentStep("form")}
                                                    className="flex-1"
                                                    icon={<ArrowLeft size={18} />}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handlePayment}
                                                    disabled={paymentLoading}
                                                    isLoading={paymentLoading}
                                                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                                    icon={!paymentLoading ? <CreditCard size={18} /> : null}
                                                >
                                                    {paymentLoading ? 'Processing Payment...' : 'Complete Payment'}
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 3: Success */}
                                {currentStep === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="space-y-6 text-center"
                                    >
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                                            isDark 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-green-100 text-green-600'
                                        }`}>
                                            <CheckCircle size={32} />
                                        </div>
                                        
                                        <div>
                                            <h3 className={`text-xl font-semibold mb-2 ${
                                                isDark ? 'text-green-400' : 'text-green-700'
                                            }`}>
                                                Device Added Successfully!
                                            </h3>
                                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Your device has been registered and is ready to use.
                                            </p>
                                        </div>

                                        {activationKey && (
                                            <div className={`rounded-lg p-4 border ${
                                                isDark 
                                                    ? 'bg-gray-800/30 border-gray-600/30' 
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}>
                                                <div className="space-y-3">
                                                    <h4 className={`font-medium ${
                                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                        Activation Key
                                                    </h4>
                                                    <div className="flex items-center justify-between">
                                                        <code className={`font-mono text-sm px-3 py-2 rounded ${
                                                            isDark 
                                                                ? 'bg-gray-700/50 text-green-400' 
                                                                : 'bg-gray-200 text-green-600'
                                                        }`}>
                                                            {activationKey}
                                                        </code>
                                                        <Button
                                                            onClick={() => copyToClipboard(activationKey)}
                                                            variant="outline"
                                                            size="sm"
                                                            icon={<Copy size={14} />}
                                                        >
                                                            {copySuccess ? 'Copied!' : 'Copy'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => {
                                                onDeviceAdded?.();
                                                handleClose();
                                            }}
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                            icon={<CheckCircle size={18} />}
                                        >
                                            Continue to Dashboard
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddDeviceModal;