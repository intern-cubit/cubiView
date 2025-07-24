import { useState, useEffect } from "react";
import {
    ChevronLeft,
    Circle,
    Activity,
    CreditCard,
    Key,
    Clock,
    Hash,
    Wifi,
    AlertTriangle,
    Download,
    Calendar,
    Edit3,
    Trash2,
    Crown,
    Shield,
    Settings,
    WifiOff,
    CheckCircle,
    AlertCircle,
    User,
    Database,
    FileText,
    MoreVertical,
    Copy,
    RefreshCw,
    X
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function DeviceDetails() {
    const { systemId } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState({
        _id: "",
        systemId: "",
        activationKey: "",
        adminId: "",
        deviceStatus: "",
        paymentStatus: "",
        createdAt: "",
        updatedAt: "",
        __v: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);
    const [copySuccess, setCopySuccess] = useState("");
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/device/${systemId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (!data) {
                    throw new Error("Device not found");
                }
                setDevice(data);

                // Set default date to today
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);

                setLoading(false);
            } catch (error) {
                setError("Failed to fetch device details");
                setLoading(false);
            }
        };

        fetchDeviceDetails();
    }, [systemId]);

    // Format date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get relative time
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays <= 7) return `${diffDays} days ago`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    // Get status configuration
    const getStatusConfig = (status) => {
        return status === 'active'
            ? {
                color: 'text-green-400',
                bg: 'bg-green-500/20',
                border: 'border-green-500/30',
                icon: <Wifi size={18} className="text-green-400" />,
                label: 'Online',
                pulse: 'animate-pulse'
            }
            : {
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/20',
                border: 'border-yellow-500/30',
                icon: <WifiOff size={18} className="text-yellow-400" />,
                label: 'Offline',
                pulse: ''
            };
    };

    // Get payment configuration
    const getPaymentConfig = (status) => {
        return status === 'paid'
            ? {
                color: 'text-green-400',
                bg: 'bg-green-500/20',
                border: 'border-green-500/30',
                icon: <CheckCircle size={18} className="text-green-400" />,
                label: 'Paid'
            }
            : {
                color: 'text-red-400',
                bg: 'bg-red-500/20',
                border: 'border-red-500/30',
                icon: <AlertCircle size={18} className="text-red-400" />,
                label: 'Unpaid'
            };
    };

    // Copy to clipboard function
    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(label);
            setTimeout(() => setCopySuccess(""), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Handle navigation back to dashboard
    const handleBackToDashboard = () => {
        navigate(-1);
    };

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Handle report download
    const handleReportDownload = async () => {
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/device/download-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    systemId: device.systemId,
                    adminId: device.adminId,
                    date: selectedDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate report");
            }

            const { downloadUrl } = await response.json();
            await handleDownload(downloadUrl, device.systemId);

        } catch (error) {
            setDownloadError(error.message);
            console.error("Download error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = async (url, systemId) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Could not fetch the ZIP file');

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `report_${systemId}_${ts}.zip`;

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error(err);
            alert(`Download error: ${err.message}`);
        }
    };

    // Handle premium upgrade
    const handlePremiumUpgrade = async () => {
        if (!selectedPlan) {
            setUpgradeError("Please select a plan to continue.");
            return;
        }

        setIsUpgrading(true);
        setUpgradeError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/upgrade-premium`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    systemId: device.systemId,
                    plan: selectedPlan,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upgrade to premium");
            }

            const updatedDevice = await response.json();
            setDevice(updatedDevice.device);
            setIsPremiumModalOpen(false);
            setSelectedPlan("");

        } catch (error) {
            setUpgradeError(error.message);
        } finally {
            setIsUpgrading(false);
        }
    };

    // Get premium plan configurations
    const premiumPlans = [
        { id: '7days', label: '7 Days', price: '₹99', duration: '7 days' },
        { id: '15days', label: '15 Days', price: '₹179', duration: '15 days' },
        { id: '30days', label: '30 Days', price: '₹299', duration: '30 days' },
        { id: '1year', label: '1 Year', price: '₹999', duration: '1 year', popular: true },
    ];

    // Get premium status configuration
    const getPremiumConfig = () => {
        if (device.isPremium) {
            const expiryDate = new Date(device.premiumExpiryDate);
            const isExpired = new Date() > expiryDate;
            
            if (isExpired) {
                return {
                    color: 'text-red-400',
                    bg: 'bg-red-500/20',
                    border: 'border-red-500/30',
                    icon: <AlertCircle size={18} className="text-red-400" />,
                    label: 'Expired',
                    description: 'Premium subscription has expired'
                };
            }
            
            return {
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/20',
                border: 'border-yellow-500/30',
                icon: <Crown size={18} className="text-yellow-400" />,
                label: 'Premium',
                description: `Expires on ${expiryDate.toLocaleDateString()}`
            };
        }
        
        return {
            color: 'text-gray-400',
            bg: 'bg-gray-500/20',
            border: 'border-gray-500/30',
            icon: <Shield size={18} className="text-gray-400" />,
            label: 'Basic',
            description: 'Upgrade to premium for report downloads'
        };
    };

    const premiumConfig = getPremiumConfig();

    // Handle delete device
    const handleDeleteDevice = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/delete-device/${systemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete device");
            }

            setIsDeleteModalOpen(false);
            setIsDeleted(true);

            setTimeout(() => {
                handleBackToDashboard();
            }, 1500);

        } catch (error) {
            setDeleteError("Error deleting device. Please try again.");
            setIsDeleting(false);
        }
    };

    const statusConfig = getStatusConfig(device.deviceStatus);
    const paymentConfig = getPaymentConfig(device.paymentStatus);

    if (isDeleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] flex items-center justify-center p-4">
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-green-500/50 rounded-2xl p-8 text-center max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-400 mb-3">Device Deleted Successfully</h2>
                    <p className="text-gray-300 mb-6">The device has been removed from the system.</p>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        Return to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] text-white">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
                {/* Back Button */}
                <motion.button
                    onClick={handleBackToDashboard}
                    className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                >
                    <ChevronLeft size={20} className="mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </motion.button>

                {/* Upgrade Banner for Non-Premium Users */}
                <AnimatePresence>
                    {!device.isPremium && showUpgradeBanner && (
                        <motion.div
                            className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6"
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Crown size={20} className="text-yellow-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                                            You're missing out on premium features!
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                                            <div className="flex items-center space-x-2">
                                                <Download size={14} className="text-yellow-400 flex-shrink-0" />
                                                <span>Download reports</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText size={14} className="text-yellow-400 flex-shrink-0" />
                                                <span>Historical data</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Settings size={14} className="text-yellow-400 flex-shrink-0" />
                                                <span>Advanced analytics</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield size={14} className="text-yellow-400 flex-shrink-0" />
                                                <span>Priority support</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 ml-4">
                                    <button
                                        onClick={() => setIsPremiumModalOpen(true)}
                                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center text-sm font-medium hover:shadow-lg hover:shadow-yellow-500/20 flex-shrink-0"
                                    >
                                        <Crown size={14} className="mr-1" />
                                        Upgrade Now
                                    </button>
                                    <button
                                        onClick={() => setShowUpgradeBanner(false)}
                                        className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
                                        title="Dismiss"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 p-6 lg:p-8 border-b border-gray-700/50">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Wifi size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Device Details
                                    </h1>
                                    <p className="text-gray-300 mt-1">MAC ID: {device.systemId}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg px-4 py-2 flex items-center space-x-2`}>
                                    <div className={`w-2 h-2 rounded-full ${statusConfig.color.replace('text-', 'bg-')} ${statusConfig.pulse}`}></div>
                                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                                        {statusConfig.label}
                                    </span>
                                </div>
                                <div className={`${paymentConfig.bg} ${paymentConfig.border} border rounded-lg px-4 py-2 flex items-center space-x-2`}>
                                    {paymentConfig.icon}
                                    <span className={`text-sm font-medium ${paymentConfig.color}`}>
                                        {paymentConfig.label}
                                    </span>
                                </div>
                                <div className={`${premiumConfig.bg} ${premiumConfig.border} border rounded-lg px-4 py-2 flex items-center space-x-2`}>
                                    {premiumConfig.icon}
                                    <span className={`text-sm font-medium ${premiumConfig.color}`}>
                                        {premiumConfig.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        {loading ? (
                            <div className="text-center py-16">
                                <motion.div
                                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                                <p className="text-lg text-gray-300">Loading device details...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl text-red-400 mb-2">Error Loading Device</h3>
                                <p className="text-gray-300 mb-6">{error}</p>
                                <button
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                    onClick={() => window.location.reload()}
                                >
                                    <RefreshCw size={18} className="mr-2 inline" />
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Download Report Section - Only for Premium Devices */}
                                {device.isPremium && (
                                    <motion.div
                                        className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center mb-4">
                                            <FileText size={24} className="text-blue-400 mr-3" />
                                            <h2 className="text-xl font-semibold text-blue-400">Download Report</h2>
                                        </div>

                                        {downloadError && (
                                            <motion.div
                                                className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                            >
                                                <AlertTriangle size={16} className="inline mr-2" />
                                                {downloadError}
                                            </motion.div>
                                        )}

                                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                                            <div className="flex flex-col lg:flex-row items-stretch gap-4">
                                                <div className="flex-1">
                                                    <label htmlFor="reportDate" className="block text-sm font-medium text-gray-300 mb-2">
                                                        Select Date for Report
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            id="reportDate"
                                                            value={selectedDate}
                                                            onChange={handleDateChange}
                                                            className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all"
                                                        />
                                                        <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div className="flex items-end">
                                                    <button
                                                        onClick={handleReportDownload}
                                                        disabled={isDownloading || !selectedDate}
                                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center hover:shadow-lg hover:shadow-blue-500/20"
                                                    >
                                                        {isDownloading ? (
                                                            <>
                                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                                <span>Downloading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Download size={18} className="mr-2" />
                                                                <span>Download</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Device Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Basic Information */}
                                        <motion.div
                                            className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex items-center mb-6">
                                                <Database size={24} className="text-purple-400 mr-3" />
                                                <h3 className="text-xl font-semibold text-purple-400">Basic Information</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {/* MAC ID */}
                                                <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <Wifi size={18} className="text-purple-400 mr-2" />
                                                            <span className="text-sm font-medium text-gray-400">System ID</span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(device.systemId, "System ID")}
                                                            className="text-gray-400 hover:text-purple-400 transition-colors"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-white font-mono text-sm break-all">{device.systemId}</p>
                                                </div>

                                                {/* Activation Key */}
                                                <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <Key size={18} className="text-purple-400 mr-2" />
                                                            <span className="text-sm font-medium text-gray-400">Activation Key</span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(device.activationKey, "Activation Key")}
                                                            className="text-gray-400 hover:text-purple-400 transition-colors"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    </div>
                                                    <p className="text-white font-mono text-sm break-all">{device.activationKey}</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Status Information */}
                                        <motion.div
                                            className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex items-center mb-6">
                                                <Activity size={24} className="text-green-400 mr-3" />
                                                <h3 className="text-xl font-semibold text-green-400">Status Overview</h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg p-4`}>
                                                    <div className="flex items-center mb-2">
                                                        {statusConfig.icon}
                                                        <span className="ml-2 text-sm font-medium text-gray-400">Device Status</span>
                                                    </div>
                                                    <p className={`text-lg font-semibold ${statusConfig.color} capitalize`}>
                                                        {device.deviceStatus}
                                                    </p>
                                                </div>

                                                <div className={`${paymentConfig.bg} ${paymentConfig.border} border rounded-lg p-4`}>
                                                    <div className="flex items-center mb-2">
                                                        {paymentConfig.icon}
                                                        <span className="ml-2 text-sm font-medium text-gray-400">Payment Status</span>
                                                    </div>
                                                    <p className={`text-lg font-semibold ${paymentConfig.color} capitalize`}>
                                                        {device.paymentStatus}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Administrative */}
                                        <motion.div
                                            className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <div className="flex items-center mb-6">
                                                <User size={24} className="text-yellow-400 mr-3" />
                                                <h3 className="text-xl font-semibold text-yellow-400">Administrative</h3>
                                            </div>

                                            <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <Shield size={18} className="text-yellow-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-400">Admin ID</span>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(device.adminId, "Admin ID")}
                                                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-white font-mono text-sm break-all">{device.adminId}</p>
                                            </div>
                                        </motion.div>

                                        {/* Timestamps */}
                                        <motion.div
                                            className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="flex items-center mb-6">
                                                <Clock size={24} className="text-blue-400 mr-3" />
                                                <h3 className="text-xl font-semibold text-blue-400">Timeline</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                    <div className="flex items-center mb-2">
                                                        <Calendar size={18} className="text-blue-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-400">Created</span>
                                                    </div>
                                                    <p className="text-white text-sm">{formatDate(device.createdAt)}</p>
                                                    <p className="text-gray-400 text-xs mt-1">{getRelativeTime(device.createdAt)}</p>
                                                </div>

                                                <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                    <div className="flex items-center mb-2">
                                                        <RefreshCw size={18} className="text-blue-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-400">Last Updated</span>
                                                    </div>
                                                    <p className="text-white text-sm">{formatDate(device.updatedAt)}</p>
                                                    <p className="text-gray-400 text-xs mt-1">{getRelativeTime(device.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Premium Information */}
                                        <motion.div
                                            className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <div className="flex items-center mb-6">
                                                <Crown size={24} className="text-yellow-400 mr-3" />
                                                <h3 className="text-xl font-semibold text-yellow-400">Premium Status</h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div className={`${premiumConfig.bg} ${premiumConfig.border} border rounded-lg p-4`}>
                                                    <div className="flex items-center mb-2">
                                                        {premiumConfig.icon}
                                                        <span className="ml-2 text-sm font-medium text-gray-400">Subscription</span>
                                                    </div>
                                                    <p className={`text-lg font-semibold ${premiumConfig.color} mb-1`}>
                                                        {premiumConfig.label}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {premiumConfig.description}
                                                    </p>
                                                </div>

                                                {device.isPremium && device.premiumPlan && (
                                                    <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/40">
                                                        <div className="flex items-center mb-2">
                                                            <Settings size={18} className="text-yellow-400 mr-2" />
                                                            <span className="text-sm font-medium text-gray-400">Current Plan</span>
                                                        </div>
                                                        <p className="text-white text-sm capitalize">{device.premiumPlan.replace('days', ' Days').replace('year', ' Year')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Premium Features Info */}
                                {!device.isPremium && (
                                    <motion.div
                                        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="flex items-center mb-4">
                                            <Crown size={24} className="text-yellow-400 mr-3" />
                                            <h2 className="text-xl font-semibold text-yellow-400">Unlock Premium Features</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                    <Download size={16} className="text-yellow-400" />
                                                </div>
                                                <span className="text-white">Download detailed reports</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                    <FileText size={16} className="text-yellow-400" />
                                                </div>
                                                <span className="text-white">Access historical data</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                    <Settings size={16} className="text-yellow-400" />
                                                </div>
                                                <span className="text-white">Advanced analytics</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                    <Shield size={16} className="text-yellow-400" />
                                                </div>
                                                <span className="text-white">Priority support</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-700/50 p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg">
                                <Edit3 size={18} className="mr-2" />
                                Edit Device
                            </button>
                            <button 
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-green-500/20"
                                onClick={() => setIsPremiumModalOpen(true)}
                            >
                                <Crown size={18} className="mr-2" />
                                {device.isPremium ? 'Extend Premium' : 'Upgrade to Premium'}
                            </button>
                            <button
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-red-500/20"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                <Trash2 size={18} className="mr-2" />
                                Delete Device
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Copy Success Notification */}
                <AnimatePresence>
                    {copySuccess && (
                        <motion.div
                            className="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                        >
                            <div className="flex items-center">
                                <CheckCircle size={18} className="mr-2" />
                                <span>{copySuccess} copied to clipboard!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Premium Upgrade Modal */}
                <AnimatePresence>
                    {isPremiumModalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-yellow-500/50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4">
                                        <Crown size={24} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-yellow-400">
                                            {device.isPremium ? 'Extend Premium Subscription' : 'Upgrade to Premium'}
                                        </h3>
                                        <p className="text-gray-400 text-sm">Choose your premium plan</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-300 mb-4">
                                        Unlock powerful features with our premium plans:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Download size={16} className="text-yellow-400" />
                                            <span className="text-sm text-gray-300">Download detailed reports</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileText size={16} className="text-yellow-400" />
                                            <span className="text-sm text-gray-300">Access historical data</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Settings size={16} className="text-yellow-400" />
                                            <span className="text-sm text-gray-300">Advanced analytics</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield size={16} className="text-yellow-400" />
                                            <span className="text-sm text-gray-300">Priority support</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {premiumPlans.map((plan) => (
                                            <motion.div
                                                key={plan.id}
                                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                                                    selectedPlan === plan.id
                                                        ? 'border-yellow-500 bg-yellow-500/10'
                                                        : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                                                } ${plan.popular ? 'ring-2 ring-yellow-500/30' : ''}`}
                                                onClick={() => setSelectedPlan(plan.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {plan.popular && (
                                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            POPULAR
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-semibold text-white">{plan.label}</h4>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        selectedPlan === plan.id 
                                                            ? 'border-yellow-500 bg-yellow-500' 
                                                            : 'border-gray-400'
                                                    }`}>
                                                        {selectedPlan === plan.id && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-yellow-400 mb-1">
                                                    {plan.price}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    For {plan.duration}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {upgradeError && (
                                    <motion.div
                                        className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <AlertTriangle size={16} className="inline mr-2" />
                                        {upgradeError}
                                    </motion.div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                        onClick={() => {
                                            setIsPremiumModalOpen(false);
                                            setSelectedPlan("");
                                            setUpgradeError(null);
                                        }}
                                        disabled={isUpgrading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center hover:shadow-lg hover:shadow-yellow-500/20"
                                        onClick={handlePremiumUpgrade}
                                        disabled={isUpgrading || !selectedPlan}
                                    >
                                        {isUpgrading ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Crown size={18} className="mr-2" />
                                                {selectedPlan && `Upgrade for ${premiumPlans.find(p => p.id === selectedPlan)?.price}`}
                                                {!selectedPlan && 'Select a Plan'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {isDeleteModalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                                        <AlertTriangle size={24} className="text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-400">Delete Device</h3>
                                        <p className="text-gray-400 text-sm">This action cannot be undone</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-300 mb-4">
                                        Are you sure you want to delete this device?
                                    </p>
                                    <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                                        <p className="text-sm text-gray-400">MAC ID:</p>
                                        <p className="font-mono text-yellow-400 break-all">{device.systemId}</p>
                                    </div>
                                </div>

                                {deleteError && (
                                    <motion.div
                                        className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <AlertTriangle size={16} className="inline mr-2" />
                                        {deleteError}
                                    </motion.div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center hover:shadow-lg hover:shadow-red-500/20"
                                        onClick={handleDeleteDevice}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={18} className="mr-2" />
                                                Delete Device
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}