// src/pages/Dashboard.jsx

import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import {
    User,
    Settings,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    DollarSign,
    ChevronRight,
    PlusCircle,
    Activity,
    Calendar,
    MapPin,
    Bell,
    Search,
    Filter,
    Grid,
    List,
    Wifi,
    WifiOff,
    Clock,
    MoreVertical
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, animate } from 'framer-motion';
import AddDeviceModal from '../components/AddDeviceModal';
// Custom AnimatedNumber using Framer Motion's animate API
const AnimatedNumber = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 0.8,
            onUpdate: (latest) => setCount(latest),
        });
        return () => controls.stop();
    }, [value, count]);

    return <span className="text-2xl lg:text-3xl font-bold text-white">{Math.round(count)}</span>;
};

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon, trend, color = "purple", subtitle }) => {
    const colorClasses = {
        purple: "from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:shadow-purple-500/20",
        green: "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:shadow-green-500/20",
        yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:shadow-yellow-500/20",
        blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:shadow-blue-500/20"
    };

    return (
        <motion.div
            className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md border rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <p className="text-xs lg:text-sm text-gray-300 font-medium">{title}</p>
                        {subtitle && (
                            <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    {typeof value === 'number' ? (
                        <AnimatedNumber value={value} />
                    ) : (
                        <span className="text-xl lg:text-2xl font-bold text-white">{value}</span>
                    )}
                    {trend && (
                        <div className="flex items-center mt-2 text-xs">
                            <span className="text-green-400 flex items-center">
                                ↗ {trend}
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

// Enhanced Device Card Component
const DeviceCard = memo(({ device, index }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusConfig = (status) => {
        return status === 'active'
            ? { color: 'text-green-400', bg: 'bg-green-500/20', icon: <Wifi size={16} />, label: 'Online' }
            : { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: <WifiOff size={16} />, label: 'Offline' };
    };

    const getPaymentConfig = (status) => {
        return status === 'paid'
            ? { color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle size={16} />, label: 'Paid' }
            : { color: 'text-red-400', bg: 'bg-red-500/20', icon: <AlertTriangle size={16} />, label: 'Unpaid' };
    };

    const statusConfig = getStatusConfig(device.deviceStatus);
    const paymentConfig = getPaymentConfig(device.paymentStatus);

    return (
        <motion.div
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 lg:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2, scale: 1.02 }}
            onClick={() => navigate(`/device/${device.macId}`)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Smartphone size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-mono text-sm lg:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {device.name || device.macId}
                        </h3>
                        <p className="text-xs text-gray-400">{device.name ? device.macId : "Device ID"}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={14} className="text-gray-400" />
                    </button>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`${statusConfig.bg} rounded-lg p-3 flex items-center space-x-2`}>
                    <div className={statusConfig.color}>
                        {statusConfig.icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className={`text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                        </p>
                    </div>
                </div>

                <div className={`${paymentConfig.bg} rounded-lg p-3 flex items-center space-x-2`}>
                    <div className={paymentConfig.color}>
                        {paymentConfig.icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Payment</p>
                        <p className={`text-sm font-medium ${paymentConfig.color}`}>
                            {paymentConfig.label}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>Created {formatDate(device.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${device.deviceStatus === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${device.paymentStatus === 'paid' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
            </div>
        </motion.div>
    );
});

// Loading Skeleton Component
const DeviceCardSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 lg:p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div>
                    <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="w-16 h-3 bg-gray-800 rounded"></div>
                </div>
            </div>
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-700/30 rounded-lg p-3 h-16"></div>
            <div className="bg-gray-700/30 rounded-lg p-3 h-16"></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div className="w-20 h-3 bg-gray-700 rounded"></div>
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const storedUser = localStorage.getItem('user');
    const reduxUser = useSelector((s) => s.auth.user);
    const [user] = useState(storedUser ? JSON.parse(storedUser) : reduxUser);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/admin/get-devices`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) throw new Error('Fetch failed');
                const data = await res.json();
                setDevices(data || []);
                setFilteredDevices(data || []);
            } catch {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        })();
    }, [BACKEND_URL]);

    // Filter devices based on search and status
    useEffect(() => {
        let filtered = devices;

        if (searchTerm) {
            filtered = filtered.filter(device =>
                device.macId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(device =>
                device.deviceStatus === filterStatus
            );
        }

        setFilteredDevices(filtered);
    }, [devices, searchTerm, filterStatus]);

    const activeCount = devices.filter((d) => d.deviceStatus === 'active').length;
    const paidCount = devices.filter((d) => d.paymentStatus === 'paid').length;
    const totalDevices = devices.length;
    const lastUpdate = devices[0]?.updatedAt;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-300">Loading dashboard data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] flex items-center justify-center p-4">
                <motion.div
                    className="text-center p-8 bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-red-500/50 rounded-xl max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] text-white">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 lg:p-8 mb-8 shadow-2xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <User size={window.innerWidth < 768 ? 24 : 32} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Welcome back, {user?.fullName || 'User'}!
                                </h1>
                                <p className="text-base lg:text-lg text-gray-300 mt-1 truncate">{user?.email || 'Email not available'}</p>
                                <p className="text-sm text-gray-400 mt-1">@{user?.username || 'username'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex-1 lg:flex-none"
                            >
                                <PlusCircle size={18} className="mr-2" />
                                Add Device
                            </button>
                            <button className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-purple-500/50 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                                <Settings size={18} className="mr-2" />
                                Settings
                            </button>
                            <button className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-yellow-500/50 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-all duration-300">
                                <Bell size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <StatsCard
                        title="Total Devices"
                        value={totalDevices}
                        icon={<Smartphone size={24} className="text-purple-400" />}
                        color="purple"
                        trend="+12% this month"
                        subtitle="All registered"
                    />
                    <StatsCard
                        title="Active Devices"
                        value={activeCount}
                        icon={<Activity size={24} className="text-green-400" />}
                        color="green"
                        trend="+8% this week"
                        subtitle="Currently online"
                    />
                    <StatsCard
                        title="Paid Devices"
                        value={paidCount}
                        icon={<DollarSign size={24} className="text-yellow-400" />}
                        color="yellow"
                        trend="+15% this month"
                        subtitle="Payment complete"
                    />
                    <StatsCard
                        title="Last Updated"
                        value={lastUpdate
                            ? new Date(lastUpdate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })
                            : 'N/A'}
                        icon={<Calendar size={24} className="text-blue-400" />}
                        color="blue"
                        subtitle="Recent activity"
                    />
                </div>

                {/* Devices Section */}
                <motion.div
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Section Header */}
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex items-center">
                                <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center">
                                    <MapPin size={24} className="mr-3 text-purple-400" />
                                    Device Management
                                </h2>
                                <div className="ml-6 flex items-center space-x-4 text-sm text-gray-400">
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Online: {activeCount}
                                    </span>
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                        Offline: {totalDevices - activeCount}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                {/* Search */}
                                <div className="relative flex-1 lg:w-64">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search devices..."
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Filter */}
                                <select
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex bg-gray-700/50 border border-gray-600/50 rounded-lg p-1">
                                    <button
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Grid/List */}
                    <div className="p-6">
                        {loading ? (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {[...Array(6)].map((_, i) => (
                                    <DeviceCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredDevices.length > 0 ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {filteredDevices.map((device, index) => (
                                        <DeviceCard key={device.macId} device={device} index={index} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-16">
                                <Smartphone size={64} className="text-gray-600 mx-auto mb-6" />
                                <h3 className="text-xl text-gray-300 mb-2">
                                    {searchTerm || filterStatus !== 'all' ? 'No devices match your criteria' : 'No devices found'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filter settings'
                                        : 'Start by adding your first tracking device'
                                    }
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <Link
                                        to="/add-device"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                    >
                                        <PlusCircle size={18} className="mr-2" />
                                        Add Your First Device
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <AddDeviceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;