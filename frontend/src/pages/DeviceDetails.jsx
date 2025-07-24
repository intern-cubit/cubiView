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
    X,
    ArrowLeft,
    Home
} from "lucide-react";
import { CircleLoader, PulseLoader } from 'react-spinners';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { Button, Card, Badge } from "../components/ui";

// Helper functions for date formatting and time calculations
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
};

export default function DeviceDetails() {
    const { systemId } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();

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
                color: isDark ? 'text-green-400' : 'text-green-600',
                bg: isDark ? 'bg-green-500/20' : 'bg-green-100/50',
                border: isDark ? 'border-green-500/30' : 'border-green-300/50',
                icon: <Wifi size={18} className={isDark ? 'text-green-400' : 'text-green-600'} />,
                label: 'Online',
                pulse: 'animate-pulse'
            }
            : {
                color: isDark ? 'text-yellow-400' : 'text-yellow-600',
                bg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100/50',
                border: isDark ? 'border-yellow-500/30' : 'border-yellow-300/50',
                icon: <WifiOff size={18} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />,
                label: 'Offline',
                pulse: ''
            };
    };

    // Get payment configuration
    const getPaymentConfig = (status) => {
        return status === 'paid'
            ? {
                color: isDark ? 'text-green-400' : 'text-green-600',
                bg: isDark ? 'bg-green-500/20' : 'bg-green-100/50',
                border: isDark ? 'border-green-500/30' : 'border-green-300/50',
                icon: <CheckCircle size={18} className={isDark ? 'text-green-400' : 'text-green-600'} />,
                label: 'Paid'
            }
            : {
                color: isDark ? 'text-red-400' : 'text-red-600',
                bg: isDark ? 'bg-red-500/20' : 'bg-red-100/50',
                border: isDark ? 'border-red-500/30' : 'border-red-300/50',
                icon: <AlertCircle size={18} className={isDark ? 'text-red-400' : 'text-red-600'} />,
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
                    color: isDark ? 'text-red-400' : 'text-red-600',
                    bg: isDark ? 'bg-red-500/20' : 'bg-red-100/50',
                    border: isDark ? 'border-red-500/30' : 'border-red-300/50',
                    icon: <AlertCircle size={18} className={isDark ? 'text-red-400' : 'text-red-600'} />,
                    label: 'Expired',
                    description: 'Premium subscription has expired'
                };
            }
            
            return {
                color: isDark ? 'text-yellow-400' : 'text-yellow-600',
                bg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100/50',
                border: isDark ? 'border-yellow-500/30' : 'border-yellow-300/50',
                icon: <Crown size={18} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />,
                label: 'Premium',
                description: `Expires on ${expiryDate.toLocaleDateString()}`
            };
        }
        
        return {
            color: isDark ? 'text-gray-400' : 'text-gray-600',
            bg: isDark ? 'bg-gray-500/20' : 'bg-gray-200/50',
            border: isDark ? 'border-gray-500/30' : 'border-gray-300/50',
            icon: <Shield size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />,
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
            <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
                    : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
            }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 hero-pattern opacity-30" />
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 animate-float" />
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }} />

                <motion.div
                    className={`backdrop-blur-md border rounded-2xl p-8 text-center max-w-md relative z-10 ${
                        isDark 
                            ? 'bg-gray-900/50 border-gray-700/50' 
                            : 'bg-white/50 border-gray-200/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-500 mb-3">Device Deleted Successfully</h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        The device has been removed from the system.
                    </p>
                    <Button
                        onClick={handleBackToDashboard}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                        Return to Dashboard
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
                : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
        }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 hero-pattern opacity-30" />
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 animate-float" />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }} />

            {/* Fixed Header with Navigation and Theme Toggle */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
                <motion.button
                    onClick={handleBackToDashboard}
                    className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </motion.button>
                <ThemeToggle />
            </div>

            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl relative z-10 mt-16 lg:mt-0">

                {/* Upgrade Banner for Non-Premium Users */}
                <AnimatePresence>
                    {!device.isPremium && showUpgradeBanner && (
                        <motion.div
                            className={`border rounded-xl p-4 mb-6 ${
                                isDark 
                                    ? 'bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/30' 
                                    : 'bg-gradient-to-r from-yellow-100/50 via-orange-100/50 to-red-100/50 border-yellow-300/50'
                            }`}
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        isDark ? 'bg-yellow-500/20' : 'bg-yellow-200/50'
                                    }`}>
                                        <Crown size={20} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-lg font-semibold mb-1 ${
                                            isDark ? 'text-yellow-400' : 'text-yellow-700'
                                        }`}>
                                            You're missing out on premium features!
                                        </h3>
                                        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            <div className="flex items-center space-x-2">
                                                <Download size={14} className={`flex-shrink-0 ${
                                                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                                                }`} />
                                                <span>Download reports</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText size={14} className={`flex-shrink-0 ${
                                                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                                                }`} />
                                                <span>Historical data</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Settings size={14} className={`flex-shrink-0 ${
                                                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                                                }`} />
                                                <span>Advanced analytics</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Shield size={14} className={`flex-shrink-0 ${
                                                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                                                }`} />
                                                <span>Priority support</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 ml-4">
                                    <Button
                                        onClick={() => setIsPremiumModalOpen(true)}
                                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white flex items-center text-sm font-medium flex-shrink-0"
                                        icon={<Crown size={14} />}
                                    >
                                        Upgrade Now
                                    </Button>
                                    <button
                                        onClick={() => setShowUpgradeBanner(false)}
                                        className={`transition-colors p-1 flex-shrink-0 ${
                                            isDark 
                                                ? 'text-gray-400 hover:text-white' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
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
                <Card
                    className="overflow-hidden shadow-2xl"
                    hover={false}
                >
                    {/* Header */}
                    <div className={`p-6 lg:p-8 border-b ${
                        isDark 
                            ? 'bg-gray-800/30 border-gray-700/50' 
                            : 'bg-gray-50/50 border-gray-200/50'
                    }`}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Wifi size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Device Details
                                    </h1>
                                    <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        MAC ID: {device.systemId}
                                    </p>
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
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-6"
                                >
                                    <CircleLoader 
                                        color={isDark ? '#8b5cf6' : '#7c3aed'} 
                                        size={64}
                                        loading={true}
                                    />
                                </motion.div>
                                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Loading device details...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <AlertTriangle size={48} className={`mx-auto mb-4 ${
                                    isDark ? 'text-red-400' : 'text-red-500'
                                }`} />
                                <h3 className={`text-xl mb-2 ${
                                    isDark ? 'text-red-400' : 'text-red-600'
                                }`}>Error Loading Device</h3>
                                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                    icon={<RefreshCw size={18} />}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Download Report Section - Only for Premium Devices */}
                                {device.isPremium && (
                                    <motion.div
                                        className={`rounded-xl p-6 ${
                                            isDark 
                                                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20' 
                                                : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-200/50'
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                                isDark 
                                                    ? 'bg-blue-500/20 text-blue-400' 
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                <FileText size={20} />
                                            </div>
                                            <h2 className={`text-xl font-semibold ${
                                                isDark ? 'text-blue-400' : 'text-blue-700'
                                            }`}>Download Report</h2>
                                        </div>

                                        {downloadError && (
                                            <motion.div
                                                className={`mb-4 p-4 rounded-lg flex items-center ${
                                                    isDark 
                                                        ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                                                        : 'bg-red-50 border border-red-200 text-red-600'
                                                }`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                            >
                                                <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                                                {downloadError}
                                            </motion.div>
                                        )}

                                        <div className={`rounded-lg p-4 border ${
                                            isDark 
                                                ? 'bg-gray-800/30 border-gray-600/30' 
                                                : 'bg-gray-50/50 border-gray-200/50'
                                        }`}>
                                            <div className="flex flex-col lg:flex-row items-stretch gap-4">
                                                <div className="flex-1">
                                                    <label htmlFor="reportDate" className={`block text-sm font-medium mb-2 ${
                                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                        Select Date for Report
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            id="reportDate"
                                                            value={selectedDate}
                                                            onChange={handleDateChange}
                                                            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                                                                isDark 
                                                                    ? 'bg-gray-700/50 border-gray-600/50 text-white focus:border-blue-500/50 focus:ring-blue-500/25' 
                                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/25'
                                                            }`}
                                                        />
                                                        <Calendar size={18} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                                                            isDark ? 'text-blue-400' : 'text-blue-600'
                                                        }`} />
                                                    </div>
                                                </div>

                                                <div className="flex items-end">
                                                    <Button
                                                        onClick={handleReportDownload}
                                                        disabled={isDownloading || !selectedDate}
                                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                                        isLoading={isDownloading}
                                                        icon={!isDownloading ? <Download size={18} /> : null}
                                                    >
                                                        {isDownloading ? 'Downloading...' : 'Download'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Device Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Basic Information */}
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Card className="p-6">
                                            <div className="flex items-center mb-6">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                                    isDark 
                                                        ? 'bg-purple-500/20 text-purple-400' 
                                                        : 'bg-purple-100 text-purple-600'
                                                }`}>
                                                    <Database size={20} />
                                                </div>
                                                <h3 className={`text-xl font-semibold ${
                                                    isDark ? 'text-purple-400' : 'text-purple-700'
                                                }`}>Basic Information</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {/* System ID */}
                                                <div className={`rounded-lg p-4 border transition-all hover:shadow-md ${
                                                    isDark 
                                                        ? 'bg-gray-800/30 border-gray-600/30 hover:border-purple-500/30' 
                                                        : 'bg-gray-50/50 border-gray-200/50 hover:border-purple-300/50'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <Wifi size={18} className={`mr-2 ${
                                                                isDark ? 'text-purple-400' : 'text-purple-600'
                                                            }`} />
                                                            <span className={`text-sm font-medium ${
                                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>System ID</span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(device.systemId, "System ID")}
                                                            className={`transition-colors hover:scale-110 ${
                                                                isDark 
                                                                    ? 'text-gray-400 hover:text-purple-400' 
                                                                    : 'text-gray-500 hover:text-purple-600'
                                                            }`}
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    </div>
                                                    <p className={`font-mono text-sm break-all font-semibold ${
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>{device.systemId}</p>
                                                </div>

                                                {/* Activation Key */}
                                                <div className={`rounded-lg p-4 border transition-all hover:shadow-md ${
                                                    isDark 
                                                        ? 'bg-gray-800/30 border-gray-600/30 hover:border-purple-500/30' 
                                                        : 'bg-gray-50/50 border-gray-200/50 hover:border-purple-300/50'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center">
                                                            <Key size={18} className={`mr-2 ${
                                                                isDark ? 'text-purple-400' : 'text-purple-600'
                                                            }`} />
                                                            <span className={`text-sm font-medium ${
                                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>Activation Key</span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(device.activationKey, "Activation Key")}
                                                            className={`transition-colors hover:scale-110 ${
                                                                isDark 
                                                                    ? 'text-gray-400 hover:text-purple-400' 
                                                                    : 'text-gray-500 hover:text-purple-600'
                                                            }`}
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                    </div>
                                                    <p className={`font-mono text-sm break-all font-semibold ${
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>{device.activationKey}</p>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Status Overview */}
                                        <Card className="p-6">
                                            <div className="flex items-center mb-6">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                                    isDark 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'bg-green-100 text-green-600'
                                                }`}>
                                                    <Activity size={20} />
                                                </div>
                                                <h3 className={`text-xl font-semibold ${
                                                    isDark ? 'text-green-400' : 'text-green-700'
                                                }`}>Status Overview</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Device Status */}
                                                <div className={`rounded-lg p-4 border ${
                                                    statusConfig.bg
                                                } ${statusConfig.border}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {statusConfig.icon}
                                                            <span className={`ml-2 font-medium ${statusConfig.color}`}>
                                                                Device Status
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                statusConfig.color.replace('text-', 'bg-')
                                                            } ${statusConfig.pulse}`}></div>
                                                            <span className={`text-sm font-semibold ${statusConfig.color}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Status */}
                                                <div className={`rounded-lg p-4 border ${
                                                    paymentConfig.bg
                                                } ${paymentConfig.border}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {paymentConfig.icon}
                                                            <span className={`ml-2 font-medium ${paymentConfig.color}`}>
                                                                Payment Status
                                                            </span>
                                                        </div>
                                                        <span className={`text-sm font-semibold ${paymentConfig.color}`}>
                                                            {paymentConfig.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Premium Status */}
                                                <div className={`rounded-lg p-4 border ${
                                                    premiumConfig.bg
                                                } ${premiumConfig.border}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {premiumConfig.icon}
                                                            <span className={`ml-2 font-medium ${premiumConfig.color}`}>
                                                                Premium Status
                                                            </span>
                                                        </div>
                                                        <span className={`text-sm font-semibold ${premiumConfig.color}`}>
                                                            {premiumConfig.label}
                                                        </span>
                                                    </div>
                                                    {premiumConfig.description && (
                                                        <p className={`text-xs mt-2 ${
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                            {premiumConfig.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>

                                    {/* Right Column - Admin & Timeline */}
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {/* Admin Information */}
                                        <Card className="p-6">
                                            <div className="flex items-center mb-6">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                                    isDark 
                                                        ? 'bg-yellow-500/20 text-yellow-400' 
                                                        : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                    <User size={20} />
                                                </div>
                                                <h3 className={`text-xl font-semibold ${
                                                    isDark ? 'text-yellow-400' : 'text-yellow-700'
                                                }`}>Admin Profile</h3>
                                            </div>

                                            <div className={`rounded-lg p-4 border transition-all hover:shadow-md ${
                                                isDark 
                                                    ? 'bg-gray-800/30 border-gray-600/30 hover:border-yellow-500/30' 
                                                    : 'bg-gray-50/50 border-gray-200/50 hover:border-yellow-300/50'
                                            }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <Hash size={18} className={`mr-2 ${
                                                            isDark ? 'text-yellow-400' : 'text-yellow-600'
                                                        }`} />
                                                        <span className={`text-sm font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>Admin ID</span>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(device.adminId, "Admin ID")}
                                                        className={`transition-colors hover:scale-110 ${
                                                            isDark 
                                                                ? 'text-gray-400 hover:text-yellow-400' 
                                                                : 'text-gray-500 hover:text-yellow-600'
                                                        }`}
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                </div>
                                                <p className={`font-mono text-sm break-all font-semibold ${
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                }`}>{device.adminId}</p>
                                            </div>
                                        </Card>

                                        {/* Timeline */}
                                        <Card className="p-6">
                                            <div className="flex items-center mb-6">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                                    isDark 
                                                        ? 'bg-blue-500/20 text-blue-400' 
                                                        : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    <Clock size={20} />
                                                </div>
                                                <h3 className={`text-xl font-semibold ${
                                                    isDark ? 'text-blue-400' : 'text-blue-700'
                                                }`}>Timeline</h3>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Created */}
                                                <div className={`rounded-lg p-4 border ${
                                                    isDark 
                                                        ? 'bg-gray-800/30 border-gray-600/30' 
                                                        : 'bg-gray-50/50 border-gray-200/50'
                                                }`}>
                                                    <div className="flex items-center mb-2">
                                                        <Calendar size={16} className={`mr-2 ${
                                                            isDark ? 'text-blue-400' : 'text-blue-600'
                                                        }`} />
                                                        <span className={`text-sm font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>Created</span>
                                                    </div>
                                                    <p className={`text-sm font-semibold ${
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>{formatDate(device.createdAt)}</p>
                                                    <p className={`text-xs ${
                                                        isDark ? 'text-gray-500' : 'text-gray-500'
                                                    }`}>{getRelativeTime(device.createdAt)}</p>
                                                </div>

                                                {/* Last Updated */}
                                                <div className={`rounded-lg p-4 border ${
                                                    isDark 
                                                        ? 'bg-gray-800/30 border-gray-600/30' 
                                                        : 'bg-gray-50/50 border-gray-200/50'
                                                }`}>
                                                    <div className="flex items-center mb-2">
                                                        <RefreshCw size={16} className={`mr-2 ${
                                                            isDark ? 'text-blue-400' : 'text-blue-600'
                                                        }`} />
                                                        <span className={`text-sm font-medium ${
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>Last Updated</span>
                                                    </div>
                                                    <p className={`text-sm font-semibold ${
                                                        isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>{formatDate(device.updatedAt)}</p>
                                                    <p className={`text-xs ${
                                                        isDark ? 'text-gray-500' : 'text-gray-500'
                                                    }`}>{getRelativeTime(device.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </div>

                                {/* Action Buttons */}
                                <motion.div
                                    className={`flex flex-col sm:flex-row gap-4 pt-8 border-t ${
                                        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsPremiumModalOpen(true)}
                                        icon={<Crown size={18} />}
                                    >
                                        {device.isPremium ? 'Extend Premium' : 'Upgrade to Premium'}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        icon={<Trash2 size={18} />}
                                    >
                                        Delete Device
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </div>
                    </Card>

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
                                                <PulseLoader 
                                                    color="#ffffff" 
                                                    size={4}
                                                    loading={true}
                                                    cssOverride={{ marginRight: '8px' }}
                                                />
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
                                                <PulseLoader 
                                                    color="#ffffff" 
                                                    size={4}
                                                    loading={true}
                                                    cssOverride={{ marginRight: '8px' }}
                                                />
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