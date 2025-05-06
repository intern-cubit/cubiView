import { useState, useEffect } from "react";
import { ChevronLeft, Circle, Activity, CreditCard, Key, Clock, Hash, Wifi, AlertTriangle, Download, Calendar } from "lucide-react";
import { useParams } from "react-router-dom";

export default function DeviceDetails() {
    const { macId } = useParams();

    const [device, setDevice] = useState({
        _id: "",
        macId: "",
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

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/device/${macId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        // Add any authentication headers if needed
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
    }, [macId]);

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

    // Get status color
    const getStatusColor = (status) => {
        if (status === "active") return "text-green-500";
        if (status === "inactive") return "text-red-500";
        return "text-yellow-500";
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        if (status === "paid") return "text-green-500";
        if (status === "unpaid") return "text-red-500";
        return "text-yellow-500";
    };

    // Handle navigation back to dashboard
    const handleBackToDashboard = () => {
        // In a real implementation with routing, this would use navigation
        // For now, we'll just log it
        console.log("Navigating back to dashboard");
        window.location.href = "/dashboard";
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
                    macId: device.macId,
                    adminId: device.adminId,
                    date: selectedDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate report");
            }

            const { downloadUrl } = await response.json();
            await handleDownload(downloadUrl, device.macId);

        } catch (error) {
            setDownloadError(error.message);
            console.error("Download error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = async (url, macId) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Could not fetch the ZIP file');

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `report_${macId}_${ts}.zip`;

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

    // Handle delete device
    const handleDeleteDevice = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/delete-device/${macId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                    // Add any authentication headers if needed
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete device");
            }

            // Close modal and set deleted state
            setIsDeleteModalOpen(false);
            setIsDeleted(true);

            // Redirect to dashboard (would use navigation in real implementation)
            setTimeout(() => {
                handleBackToDashboard();
            }, 1500);

        } catch (error) {
            setDeleteError("Error deleting device. Please try again.");
            setIsDeleting(false);
        }
    };

    if (isDeleted) {
        return (
            <div className="p-4 sm:p-6 mx-auto bg-black h-screen flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-lg border border-green-500 text-center">
                    <div className="text-green-500 text-4xl mb-4">✓</div>
                    <h2 className="text-xl font-bold text-green-400 mb-2">Device Deleted Successfully</h2>
                    <p className="text-gray-300 mb-4">The device has been removed from the system.</p>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 mx-auto bg-black">
            <button onClick={handleBackToDashboard} className="flex items-center text-yellow-400 mb-6 hover:text-yellow-300 transition-colors">
                <ChevronLeft size={20} className="mr-1" />
                <span>Back to Dashboard</span>
            </button>

            {/* Main content container */}
            <div className="bg-gray-900 backdrop-blur-xs bg-opacity-50 rounded-lg border border-yellow-600 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 p-4 sm:p-6 border-b border-yellow-600/30">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">Device Details</h1>
                        <div className="flex items-center">
                            <Circle size={12} className={`${getStatusColor(device.deviceStatus)} mr-2`} />
                            <span className="capitalize text-gray-300">{device.deviceStatus}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
                            <p className="mt-2 text-gray-300">Loading device details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400">{error}</div>
                    ) : (
                        <>
                            {/* Download Report Section */}
                            <div className="mb-6 bg-gray-800 rounded-lg p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h2 className="text-lg font-medium text-yellow-400 mb-2 sm:mb-0">Download Report</h2>

                                    {downloadError && (
                                        <div className="px-3 py-1 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm w-full sm:w-auto">
                                            {downloadError}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600">
                                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                                        <div className="w-full md:w-1/3">
                                            <label htmlFor="reportDate" className="block text-xs text-gray-400 mb-2">Select Date for Report</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    id="reportDate"
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-gray-200 pr-8 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                                />
                                                <Calendar size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400" />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">Select the date for which you want to download data</p>
                                        </div>

                                        <div className="flex flex-col justify-end w-full md:w-2/3">
                                            <div className="flex flex-col sm:flex-row justify-end gap-3 h-full">
                                                <button
                                                    onClick={handleReportDownload}
                                                    disabled={isDownloading || !selectedDate}
                                                    className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors flex items-center justify-center"
                                                >
                                                    {isDownloading ? (
                                                        <>
                                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                            <span>Downloading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download size={18} className="mr-2" />
                                                            <span>Download Report</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Device info sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column - Basic details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                                        <h2 className="text-lg font-medium text-yellow-400 mb-4">Basic Information</h2>

                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="flex flex-col sm:flex-row items-start">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3 mb-2 sm:mb-0">
                                                    <Wifi size={18} className="text-yellow-400" />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-400 mb-1">MAC ID</p>
                                                    <p className="text-gray-200 font-medium bg-gray-700 bg-opacity-50 p-2 rounded border border-gray-600 break-all">{device.macId}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3 mb-2 sm:mb-0">
                                                    <Key size={18} className="text-yellow-400" />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-400 mb-1">Activation Key</p>
                                                    <p className="text-gray-200 font-medium bg-gray-700 bg-opacity-50 p-2 rounded border border-gray-600 break-all">{device.activationKey}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3 mb-2 sm:mb-0">
                                                    <Hash size={18} className="text-yellow-400" />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-400 mb-1">Device ID</p>
                                                    <p className="text-gray-200 font-medium bg-gray-700 bg-opacity-50 p-2 rounded border border-gray-600 break-all">{device._id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                                        <h2 className="text-lg font-medium text-yellow-400 mb-4">Status Information</h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start bg-gray-700 bg-opacity-30 p-3 rounded-lg border border-gray-600">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3">
                                                    <Activity size={18} className="text-yellow-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Device Status</p>
                                                    <p className={`font-medium capitalize ${getStatusColor(device.deviceStatus)}`}>{device.deviceStatus}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start bg-gray-700 bg-opacity-30 p-3 rounded-lg border border-gray-600">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3">
                                                    <CreditCard size={18} className="text-yellow-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Payment Status</p>
                                                    <p className={`font-medium capitalize ${getPaymentStatusColor(device.paymentStatus)}`}>{device.paymentStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column - Admin and timestamps */}
                                <div className="space-y-6">
                                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                                        <h2 className="text-lg font-medium text-yellow-400 mb-4">Administrative</h2>

                                        <div className="bg-gray-700 bg-opacity-30 p-3 rounded-lg border border-gray-600">
                                            <p className="text-xs text-gray-400 mb-1">Admin ID</p>
                                            <p className="text-gray-200 font-medium break-all bg-gray-700 bg-opacity-50 p-2 rounded border border-gray-600">{device.adminId}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
                                        <h2 className="text-lg font-medium text-yellow-400 mb-4">Timestamps</h2>

                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row items-start bg-gray-700 bg-opacity-30 p-3 rounded-lg border border-gray-600">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3 mb-2 sm:mb-0">
                                                    <Clock size={18} className="text-yellow-400" />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-400 mb-1">Created At</p>
                                                    <p className="text-gray-200">{formatDate(device.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start bg-gray-700 bg-opacity-30 p-3 rounded-lg border border-gray-600">
                                                <div className="bg-gray-700 p-2 rounded-md mr-3 mb-2 sm:mb-0">
                                                    <Clock size={18} className="text-yellow-400" />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-400 mb-1">Last Updated</p>
                                                    <p className="text-gray-200">{formatDate(device.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Action buttons */}
                <div className="border-t border-yellow-600/30 p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                        Edit Device
                    </button>
                    <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                        Upgrade Plan
                    </button>
                    <button
                        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete Device
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-yellow-600 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4 text-red-500">
                            <AlertTriangle size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Delete Device</h3>
                        </div>

                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete device with MAC ID: <span className="font-semibold text-yellow-400">{device.macId}</span>? This action cannot be undone.
                        </p>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors flex items-center"
                                onClick={handleDeleteDevice}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}