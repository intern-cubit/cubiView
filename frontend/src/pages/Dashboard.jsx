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
    PlusCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation
import { useSelector } from 'react-redux';
import { FixedSizeList as VirtualList } from 'react-window';  // Virtualization
import Skeleton from 'react-loading-skeleton';               // Skeleton loader
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, animate } from 'framer-motion';            // Framer Motion core

// Lazy-load sparklines for device activity trends
const Sparklines = lazy(() =>
    import('react-sparklines').then((m) => ({ default: m.Sparklines }))
);
const SparklinesLine = lazy(() =>
    import('react-sparklines').then((m) => ({ default: m.SparklinesLine }))
);

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
    return <span className="text-2xl font-bold text-white">{Math.round(count)}</span>;
};

// Memoized row component for virtualization
const DeviceRow = memo(({ index, style, data }) => {
    const device = data.devices[index];
    const isMobile = data.isMobile;
    const formatDate = (s) =>
        new Date(s).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const navigate = useNavigate();
    if (isMobile) {
        return (
            <div style={style}>
                <motion.div
                    className="border-t border-gray-800 hover:bg-gray-800 overflow-hidden   "
                    whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
                    onClick={() => navigate(`/device/${device.macId}`)}
                >
                    <div
                        className="p-3 flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <div className="font-mono text-sm truncate max-w-xs">{device.macId}</div>
                        </div>
                        <div className="flex items-center">
                            {device.deviceStatus === 'active' ? (
                                <CheckCircle className="text-green-400 mr-2" size={16} />
                            ) : (
                                <AlertCircle className="text-yellow-400 mr-2" size={16} />
                            )}
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="flex border-t border-gray-800 hover:bg-gray-800 overflow-hidden"
            style={style}
            whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}
            onClick={() => navigate(`/device/${device.macId}`)}
        >
            <div className="w-1/6 p-4 font-mono truncate">{device.macId}</div>
            <div className="w-1/12 p-4 flex items-center">
                {device.deviceStatus === 'active' ? (
                    <CheckCircle className="text-green-400" size={18} />
                ) : (
                    <AlertCircle className="text-yellow-400" size={18} />
                )}
                <span className="ml-2 capitalize hidden sm:inline">{device.deviceStatus}</span>
            </div>
            <div className="w-1/12 p-4 flex items-center">
                {device.paymentStatus === 'paid' ? (
                    <DollarSign className="text-green-400" size={18} />
                ) : (
                    <AlertTriangle className="text-red-400" size={18} />
                )}
                <span className="ml-2 capitalize hidden sm:inline">{device.paymentStatus}</span>
            </div>
            <div className="w-1/6 p-4 font-mono text-yellow-400 truncate">{device.activationKey}</div>
            <div className="w-1/6 p-4 text-gray-400">{formatDate(device.createdAt)}</div>
            <div className="w-1/6 p-4">
                <Suspense fallback={<Skeleton width={100} height={20} />}>
                    <Sparklines data={device.activity || [0, 1, 2, 1, 0]}>
                        <SparklinesLine style={{ strokeWidth: 1.5, stroke: '#FACC15' }} />
                    </Sparklines>
                </Suspense>
            </div>
        </motion.div>
    );
});

const Dashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const storedUser = localStorage.getItem('user');
    const reduxUser = useSelector((s) => s.auth.user);
    const [user] = useState(storedUser ? JSON.parse(storedUser) : reduxUser);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            } catch {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        })();
    }, [BACKEND_URL]);

    const activeCount = devices.filter((d) => d.deviceStatus === 'active').length;
    const paidCount = devices.filter((d) => d.paymentStatus === 'paid').length;
    const lastUpdate = devices[0]?.updatedAt;

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-black text-white">
                <Skeleton circle height={60} width={60} baseColor="#1f2937" highlightColor="#374151" />
                <p className="ml-4 text-yellow-400">Loading dashboard data...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-black text-white">
                <div className="text-center p-6 bg-gray-900 rounded-lg border border-red-500">
                    <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-400">Error</h2>
                    <p className="mt-2">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-2 sm:p-6">
            <div className="bg-gray-900 backdrop-blur-xs bg-opacity-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-yellow-600">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-yellow-500 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                            <User size={isMobile ? 18 : 24} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                                {user?.fullName || 'User'}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-300">{user?.email || 'Email not available'}</p>
                            <p className="text-xs text-gray-400">Username: {user?.username || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Link
                            to="/add-device" x
                            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded flex items-center justify-center text-sm sm:text-base"
                        >
                            <PlusCircle size={isMobile ? 14 : 16} className="mr-1 sm:mr-2" />
                            Add Device
                        </Link>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded flex items-center text-sm sm:text-base">
                            <Settings size={isMobile ? 14 : 16} className="mr-1 sm:mr-2" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {[
                    {
                        label: 'Active Devices',
                        value: activeCount,
                        icon: <Smartphone size={isMobile ? 20 : 24} className="text-yellow-400" />,
                    },
                    {
                        label: 'Paid Devices',
                        value: paidCount,
                        icon: <DollarSign size={isMobile ? 20 : 24} className="text-yellow-400" />,
                    },
                    {
                        label: 'Last Updated',
                        value: lastUpdate
                            ? new Date(lastUpdate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })
                            : 'N/A',
                        icon: <Settings size={isMobile ? 20 : 24} className="text-yellow-400" />,
                    },
                ].map((card, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-800 flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div>
                            <p className="text-xs sm:text-sm text-gray-400">{card.label}</p>
                            {typeof card.value === 'number' ? (
                                <AnimatedNumber value={card.value} />
                            ) : (
                                <span className="text-sm font-bold text-white">{card.value}</span>
                            )}
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center">
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                {!isMobile && (
                    <div className="flex bg-gray-800 text-yellow-400 text-sm overflow-hidden">
                        <div className="w-1/6 p-4">MAC ID</div>
                        <div className="w-1/12 p-4">Status</div>
                        <div className="w-1/12 p-4">Payment</div>
                        <div className="w-1/6 p-4">Activation Key</div>
                        <div className="w-1/6 p-4">Created</div>
                        <div className="w-1/6 p-4">Activity</div>
                    </div>
                )}

                {isMobile && devices.length > 0 && (
                    <div className="p-3 bg-gray-800 text-yellow-400 text-xs">
                        <div className="flex justify-between items-center">
                            <span>Devices ({devices.length})</span>
                            <div className="flex items-center space-x-1 text-xs">
                                <span className="flex items-center">
                                    <CheckCircle size={12} className="text-green-400 mr-1" />
                                    Active: {activeCount}
                                </span>
                                <span className="mx-1">|</span>
                                <span className="flex items-center">
                                    <DollarSign size={12} className="text-green-400 mr-1" />
                                    Paid: {paidCount}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <VirtualList
                    height={Math.min(devices.length * (isMobile ? 50 : 60), 400)}
                    itemCount={devices.length}
                    itemSize={isMobile ? 50 : 60}
                    width="100%"
                    itemData={{ devices, isMobile }}
                >
                    {DeviceRow}
                </VirtualList>
            </div>
        </div>
    );
};

export default Dashboard;