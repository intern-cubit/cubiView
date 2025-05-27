import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Copy, Download, Users, Smartphone, Tag, Search, RefreshCw, PlusCircle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({ devices: [], admins: [] });
    const [activeTab, setActiveTab] = useState('devices');
    const [searchTerm, setSearchTerm] = useState('');
    const [couponCount, setCouponCount] = useState(10);
    const [generatedCoupons, setGeneratedCoupons] = useState([]);
    const [generatingCoupons, setGeneratingCoupons] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate()

    const BACKEND_URL = 'http://localhost:5000'; // You can make this configurable

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/sadmin/get-details`);
            const data = await response.json();

            if (data.success) {
                setDashboardData(data.data);
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const generateCoupons = async () => {
        setGeneratingCoupons(true);
        try {
            const token = 'your-auth-token'; // You might want to get this from context or localStorage
            const response = await fetch(`${BACKEND_URL}/api/sadmin/generate-coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ count: couponCount, plan: "0" }),
            });

            const data = await response.json();

            if (data && data.data.length > 0) {
                setGeneratedCoupons(data.data);
                showNotification('Coupons generated successfully!', 'success');
            } else {
                showNotification('No coupons were generated', 'error');
            }
        } catch (err) {
            showNotification(err.message || 'Failed to generate coupons', 'error');
        } finally {
            setGeneratingCoupons(false);
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 5000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        });
    };

    const downloadCouponsAsCsv = () => {
        if (generatedCoupons.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," + generatedCoupons.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "generated-coupons.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Coupons downloaded as CSV', 'success');
    };

    const filteredDevices = dashboardData.devices.filter(device =>
        device.macId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.activationKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.deviceStatus.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAdmins = dashboardData.admins.filter(admin =>
        admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#111827] via-black to-[#10151b]">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#111827] via-black to-[#10151b]">
                <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 p-8 text-center shadow-2xl">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
                    <h2 className="mt-4 text-xl font-semibold text-red-400">Error Loading Dashboard</h2>
                    <p className="mt-2 text-red-300">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] text-white">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 lg:p-8 mb-8 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Users size={32} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Super Admin Dashboard
                                </h1>
                                <p className="text-base lg:text-lg text-gray-300 mt-1">Manage your entire system from here</p>
                                <p className="text-sm text-gray-400 mt-1">Complete oversight and control</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                            <button
                                onClick={fetchDashboardData}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex-1 lg:flex-none"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`fixed right-4 top-4 z-50 rounded-xl p-4 shadow-2xl backdrop-blur-md border ${notification.type === 'success'
                        ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-500/50 text-green-300'
                        : 'bg-gradient-to-r from-red-600/20 to-red-700/20 border-red-500/50 text-red-300'
                        }`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {notification.type === 'success' ? (
                                    <Check className="h-5 w-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{notification.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Total Devices</p>
                                <p className="text-3xl font-bold text-white mt-1">{dashboardData.devices.length}</p>
                                <p className="text-xs text-purple-400 mt-1">All registered</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                                <Smartphone size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Active Devices</p>
                                <p className="text-3xl font-bold text-white mt-1">{dashboardData.devices.filter(d => d.deviceStatus === 'active').length}</p>
                                <p className="text-xs text-green-400 mt-1">Currently online</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                                <Activity size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-yellow-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Total Admins</p>
                                <p className="text-3xl font-bold text-white mt-1">{dashboardData.admins.length}</p>
                                <p className="text-xs text-yellow-400 mt-1">System administrators</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-3">
                                <Users size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-500/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Generated Coupons</p>
                                <p className="text-3xl font-bold text-white mt-1">{generatedCoupons.length}</p>
                                <p className="text-xs text-blue-400 mt-1">Ready to use</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                                <Tag size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Tab Navigation */}
                    <div className="p-6 border-b border-gray-700/50">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'devices', icon: Smartphone, label: 'Devices' },
                                { id: 'admins', icon: Users, label: 'Admins' },
                                { id: 'coupons', icon: Tag, label: 'Generate Coupons' }
                            ].map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeTab === id
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                    onClick={() => setActiveTab(id)}
                                >
                                    <Icon size={18} className="mr-2" />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Search Bar */}
                    {activeTab !== 'coupons' && (
                        <div className="p-6 border-b border-gray-700/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/25 transition-all"
                                    placeholder={`Search ${activeTab}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'devices' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            {['MAC ID', 'Activation Key', 'Admin', 'Payment Status', 'Device Status', 'Created'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredDevices.length > 0 ? (
                                            filteredDevices.map((device) => {
                                                const admin = dashboardData.admins.find(a => a._id === device.adminId) || { fullName: 'Unknown' };
                                                return (
                                                    <tr key={device._id} className="hover:bg-gray-700/30 transition-colors cursor-pointer" onClick={() => navigate(`/device/${device.macId}`)}>
                                                        <td className="px-6 py-4 text-sm font-medium text-white">{device.macId}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{device.activationKey}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{admin.fullName}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${device.paymentStatus === 'paid'
                                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                                                : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                                                                }`}>
                                                                {device.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${device.deviceStatus === 'active'
                                                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                                                : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                                                                }`}>
                                                                {device.deviceStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{formatDate(device.createdAt)}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                    <Smartphone size={48} className="mx-auto mb-4 text-gray-600" />
                                                    <p>No devices found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'admins' && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700/50">
                                            {['Full Name', 'Username', 'Email', 'Created', 'Devices'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {filteredAdmins.length > 0 ? (
                                            filteredAdmins.map((admin) => {
                                                const adminDevices = dashboardData.devices.filter(device => device.adminId === admin._id);
                                                return (
                                                    <tr key={admin._id} className="hover:bg-gray-700/30 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-white">{admin.fullName}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{admin.username}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{admin.email}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{formatDate(admin.createdAt)}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-300">{adminDevices.length}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                    <Users size={48} className="mx-auto mb-4 text-gray-600" />
                                                    <p>No admins found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'coupons' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Generate Section */}
                                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Generate Coupons</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="couponCount" className="block text-sm font-medium text-gray-300 mb-2">
                                                Number of Coupons
                                            </label>
                                            <input
                                                type="number"
                                                id="couponCount"
                                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/25 transition-all"
                                                min="1"
                                                max="100"
                                                value={couponCount}
                                                onChange={(e) => setCouponCount(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <button
                                            onClick={generateCoupons}
                                            disabled={generatingCoupons}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {generatingCoupons ? (
                                                <>
                                                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>Generate Coupons</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Generated Coupons */}
                                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white">Generated Coupons</h3>
                                        {generatedCoupons.length > 0 && (
                                            <button
                                                onClick={downloadCouponsAsCsv}
                                                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 flex items-center"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download CSV
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {generatedCoupons.length > 0 ? (
                                            <div className="max-h-64 overflow-y-auto space-y-2">
                                                {generatedCoupons.map((coupon, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                                                        <span className="font-mono text-sm text-white">{coupon}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(coupon)}
                                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Tag size={48} className="text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400">No coupons generated yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}