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
    MoreVertical,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { fetchDevicesSuccess } from '../features/deviceSlice';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { Button, Card, Badge, Input, LoadingSpinner } from '../components/ui';
import AddDeviceModal from '../components/AddDeviceModal';
// Custom AnimatedNumber using Framer Motion's animate API
const AnimatedNumber = ({ value, isDark = false, isWhite = false }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 0.8,
            onUpdate: (latest) => setCount(latest),
        });
        return () => controls.stop();
    }, [value, count]);

    const textColor = isWhite ? 'text-white' : isDark ? 'text-white' : 'text-gray-900';

    return (
        <span className={`text-2xl lg:text-3xl font-bold ${textColor}`}>
            {Math.round(count)}
        </span>
    );
};

// Enhanced Stats Card Component
const StatsCard = ({ title, value, icon, color = "indigo", subtitle, isDark }) => {
    const colorClasses = {
        indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/25",
        emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/25",
        amber: "from-amber-500 to-amber-600 shadow-amber-500/25",
        violet: "from-violet-500 to-violet-600 shadow-violet-500/25",
        rose: "from-rose-500 to-rose-600 shadow-rose-500/25",
        cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/25"
    };

    return (
        <motion.div
            className={`
                relative bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white
                shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                        <p className="text-sm font-medium text-white/80">
                            {title}
                        </p>
                        {subtitle && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/90">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    {typeof value === 'number' ? (
                        <AnimatedNumber value={value} isWhite={true} />
                    ) : (
                        <span className="text-2xl lg:text-3xl font-bold text-white">
                            {value}
                        </span>
                    )}
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                    {icon}
                </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/5 rounded-full blur-sm" />
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/5 rounded-full blur-sm" />
        </motion.div>
    );
};

// Enhanced Device Card Component
const DeviceCard = memo(({ device, index, isDark }) => {
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
            ? { 
                color: 'text-emerald-600', 
                bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600', 
                icon: <Wifi size={16} className="text-white" />, 
                label: 'Online',
                textColor: 'text-white'
            }
            : { 
                color: 'text-amber-600', 
                bg: 'bg-gradient-to-r from-amber-500 to-amber-600', 
                icon: <WifiOff size={16} className="text-white" />, 
                label: 'Offline',
                textColor: 'text-white'
            };
    };

    const getPaymentConfig = (status) => {
        return status === 'paid'
            ? { 
                color: 'text-blue-600', 
                bg: 'bg-gradient-to-r from-blue-500 to-blue-600', 
                icon: <CheckCircle size={16} className="text-white" />, 
                label: 'Paid',
                textColor: 'text-white'
            }
            : { 
                color: 'text-rose-600', 
                bg: 'bg-gradient-to-r from-rose-500 to-rose-600', 
                icon: <AlertTriangle size={16} className="text-white" />, 
                label: 'Unpaid',
                textColor: 'text-white'
            };
    };

    const statusConfig = getStatusConfig(device.deviceStatus);
    const paymentConfig = getPaymentConfig(device.paymentStatus);

    return (
        <Card
            className={`p-4 lg:p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 ${
                isDark 
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/30 hover:shadow-indigo-500/10' 
                    : 'bg-white/80 border-slate-200/50 hover:border-indigo-500/30 hover:shadow-indigo-500/15'
            }`}
            onClick={() => navigate(`/device/${device.systemId}`)}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2, scale: 1.02 }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            device.deviceStatus === 'active' 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}>
                            <Smartphone size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-base group-hover:text-indigo-600 transition-colors ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                {device.name || device.systemId}
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {device.name ? device.systemId : "Device ID"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                                isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'
                            }`}
                        >
                            <MoreVertical size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                        </Button>
                        <ChevronRight size={18} className={`group-hover:text-indigo-600 transition-colors ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`${statusConfig.bg} rounded-lg p-3 shadow-sm`}>
                        <div className="flex items-center space-x-2">
                            {statusConfig.icon}
                            <div>
                                <p className="text-xs text-white/80">Status</p>
                                <p className={`text-sm font-semibold ${statusConfig.textColor}`}>
                                    {statusConfig.label}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`${paymentConfig.bg} rounded-lg p-3 shadow-sm`}>
                        <div className="flex items-center space-x-2">
                            {paymentConfig.icon}
                            <div>
                                <p className="text-xs text-white/80">Payment</p>
                                <p className={`text-sm font-semibold ${paymentConfig.textColor}`}>
                                    {paymentConfig.label}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-3 border-t ${
                    isDark ? 'border-slate-700/50' : 'border-slate-200/50'
                }`}>
                    <div className={`flex items-center space-x-2 text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                        <Clock size={12} />
                        <span>Created {formatDate(device.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${device.deviceStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${device.paymentStatus === 'paid' ? 'bg-blue-400' : 'bg-rose-400'}`}></div>
                    </div>
                </div>
            </motion.div>
        </Card>
    );
});

// Loading Skeleton Component
const DeviceCardSkeleton = ({ isDark }) => (
    <div className={`backdrop-blur-md border rounded-xl p-4 lg:p-6 animate-pulse ${
        isDark 
            ? 'bg-slate-800/40 border-slate-700/50' 
            : 'bg-white/40 border-slate-200/50'
    }`}>
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                <div>
                    <div className={`w-24 h-4 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                    <div className={`w-16 h-3 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
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
    const { isDark } = useTheme();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const storedUser = localStorage.getItem('user');
    const reduxUser = useSelector((s) => s.auth.user);
    const reduxDevices = useSelector((s) => s.device.devices);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user] = useState(storedUser ? JSON.parse(storedUser) : reduxUser);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found');
                navigate('/login');
                return;
            }

            const res = await fetch(`${BACKEND_URL}/api/admin/get-devices`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }
                throw new Error(`Failed to fetch devices: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Fetched devices:', data); // Debug log
            setDevices(data || []);
            setFilteredDevices(data || []);
            // Update Redux store as well
            dispatch(fetchDevicesSuccess(data || []));
            setError(null);
        } catch (err) {
            console.error('Error fetching devices:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [BACKEND_URL]);

    // Update local devices when Redux devices change (e.g., when device is added)
    useEffect(() => {
        if (reduxDevices.length > 0) {
            setDevices(reduxDevices);
            setFilteredDevices(reduxDevices);
        }
    }, [reduxDevices]);

    // Filter devices based on search and status
    useEffect(() => {
        let filtered = devices;

        if (searchTerm) {
            filtered = filtered.filter(device =>
                device.systemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (device.name && device.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <div className={`min-h-screen flex items-center justify-center ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
                    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
            }`}>
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LoadingSpinner size="large" />
                    <p className={`text-lg mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading dashboard data...
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
                    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
            }`}>
                <motion.div
                    className={`text-center p-8 backdrop-blur-md border rounded-xl max-w-md ${
                        isDark 
                            ? 'bg-gray-900/50 border-red-500/50' 
                            : 'bg-white/50 border-red-300/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
                    <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        Retry
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${
            isDark 
                ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white' 
                : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900'
        }`}>
            {/* Theme Toggle Fixed Position */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    className={`backdrop-blur-md border rounded-2xl p-6 lg:p-8 mb-8 shadow-xl ${
                        isDark 
                            ? 'bg-slate-800/50 border-slate-700/50' 
                            : 'bg-white/80 border-slate-200/50'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <img 
                                    src="/Cubiview-Cubicle.png" 
                                    alt="CubiView" 
                                    className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Welcome back, {user?.fullName || 'User'}!
                                </h1>
                                <p className={`text-base lg:text-lg mt-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {user?.email || 'Email not available'}
                                </p>
                                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    @{user?.username || 'username'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex-1 lg:flex-none"
                            >
                                <PlusCircle size={18} className="mr-2" />
                                Add Device
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/profile')}
                                className={`px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 flex-1 lg:flex-none ${
                                    isDark 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Settings size={18} className="mr-2" />
                                Settings
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    localStorage.clear();
                                    navigate('/login');
                                }}
                                className={`px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 text-red-500 hover:text-red-600 flex-1 lg:flex-none ${
                                    isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                                }`}
                            >
                                <LogOut size={18} className="mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <StatsCard
                        title="Total Devices"
                        value={totalDevices}
                        icon={<Smartphone size={24} className="text-white" />}
                        color="indigo"
                        subtitle="Registered"
                        isDark={isDark}
                    />
                    <StatsCard
                        title="Active Devices"
                        value={activeCount}
                        icon={<Activity size={24} className="text-white" />}
                        color="emerald"
                        subtitle="Online now"
                        isDark={isDark}
                    />
                    <StatsCard
                        title="Offline Devices"
                        value={totalDevices - activeCount}
                        icon={<Smartphone size={24} className="text-white" />}
                        color="amber"
                        subtitle="Need attention"
                        isDark={isDark}
                    />
                    <StatsCard
                        title="Last Sync"
                        value={lastUpdate
                            ? new Date(lastUpdate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })
                            : 'Never'}
                        icon={<Calendar size={24} className="text-white" />}
                        color="violet"
                        subtitle="Most recent"
                        isDark={isDark}
                    />
                </div>

                {/* Devices Section */}
                <motion.div
                    className={`backdrop-blur-md border rounded-2xl overflow-hidden shadow-xl ${
                        isDark 
                            ? 'bg-slate-800/50 border-slate-700/50' 
                            : 'bg-white/80 border-slate-200/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Section Header */}
                    <div className={`p-6 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex items-center">
                                <h2 className={`text-xl lg:text-2xl font-semibold flex items-center ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                    <MapPin size={24} className="mr-3 text-indigo-500" />
                                    Device Management
                                </h2>
                                <div className={`ml-6 flex items-center space-x-4 text-sm ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                        Online: {activeCount}
                                    </span>
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                        Offline: {totalDevices - activeCount}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                {/* Search */}
                                <div className="relative flex-1 lg:w-64">
                                    <Input
                                        type="text"
                                        placeholder="Search devices..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        icon={<Search size={18} />}
                                        className={`${
                                            isDark 
                                                ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' 
                                                : 'bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-500'
                                        }`}
                                    />
                                </div>

                                {/* Filter */}
                                <select
                                    className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 transition-all ${
                                        isDark 
                                            ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-indigo-500/50 focus:ring-indigo-500/25' 
                                            : 'bg-white/50 border-slate-300/50 text-slate-900 focus:border-indigo-500/50 focus:ring-indigo-500/25'
                                    }`}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                {/* View Toggle */}
                                <div className={`flex border rounded-lg p-1 ${
                                    isDark 
                                        ? 'bg-slate-700/50 border-slate-600/50' 
                                        : 'bg-white/50 border-slate-300/50'
                                }`}>
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="p-2"
                                    >
                                        <Grid size={16} />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="p-2"
                                    >
                                        <List size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Device Grid/List */}
                    <div className="p-6">
                        {loading ? (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {[...Array(6)].map((_, i) => (
                                    <DeviceCardSkeleton key={i} isDark={isDark} />
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
                                        <DeviceCard key={device.systemId} device={device} index={index} isDark={isDark} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-16">
                                <Smartphone size={64} className={`mx-auto mb-6 ${
                                    isDark ? 'text-slate-600' : 'text-slate-400'
                                }`} />
                                <h3 className={`text-xl mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {searchTerm || filterStatus !== 'all' ? 'No devices match your criteria' : 'No devices found'}
                                </h3>
                                <p className={`mb-6 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                                    {searchTerm || filterStatus !== 'all'
                                        ? 'Try adjusting your search or filter settings'
                                        : 'Start by adding your first tracking device'
                                    }
                                </p>
                                {!searchTerm && filterStatus === 'all' && (
                                    <Button
                                        onClick={() => navigate('/add-device')}
                                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        <PlusCircle size={18} className="mr-2" />
                                        Add Your First Device
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <AddDeviceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDeviceAdded={fetchDevices}
            />
        </div>
    );
};

export default Dashboard;