import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Copy, Download, Users, Smartphone, Tag, Search, RefreshCw } from 'lucide-react';
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
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
            const response = await fetch(`${BACKEND_URL}/api/sadmin/generate-coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
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
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                    <p className="mt-4 text-lg text-amber-300">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="rounded-lg bg-gray-900 p-6 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-lg font-semibold text-red-400">Error Loading Dashboard</h2>
                    <p className="mt-2 text-red-300">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 inline-flex items-center rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <header className="bg-gray-900 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold tracking-tight text-amber-500">Super Admin Dashboard</h1>
                </div>
            </header>

            {notification.show && (
                <div className={`fixed right-4 top-4 z-50 rounded-md p-4 shadow-lg ${notification.type === 'success' ? 'bg-gray-800 text-green-300' : 'bg-gray-800 text-red-300'
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

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-amber-500">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <div className="ml-5">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-400">Total Devices</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">{dashboardData.devices.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-amber-500">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="ml-5">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-400">Total Admins</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">{dashboardData.admins.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-800 text-amber-500">
                                    <Tag className="h-6 w-6" />
                                </div>
                                <div className="ml-5">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-400">Generated Coupons</dt>
                                        <dd className="mt-1 text-3xl font-semibold text-white">{generatedCoupons.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 border-b border-gray-800">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'devices'
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('devices')}
                        >
                            <div className="flex items-center">
                                <Smartphone className="mr-2 h-5 w-5" />
                                Devices
                            </div>
                        </button>
                        <button
                            className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'admins'
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('admins')}
                        >
                            <div className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Admins
                            </div>
                        </button>
                        <button
                            className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'coupons'
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('coupons')}
                        >
                            <div className="flex items-center">
                                <Tag className="mr-2 h-5 w-5" />
                                Generate Coupons
                            </div>
                        </button>
                    </nav>
                </div>

                {activeTab !== 'coupons' && (
                    <div className="mb-6">
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-gray-700 bg-gray-900 pl-10 text-white placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Content based on active tab */}
                {activeTab === 'devices' && (
                    <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-amber-500">Device List</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-800">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">MAC ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Activation Key</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Admin</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Payment Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Device Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                                        {filteredDevices.length > 0 ? (
                                            filteredDevices.map((device) => {
                                                // Find admin by ID
                                                const admin = dashboardData.admins.find(a => a._id === device.adminId) || { fullName: 'Unknown' };

                                                return (
                                                    <tr key={device._id} onClick={() => navigate(`/device/${device.macId}`)} className="cursor-pointer hover:bg-gray-800">
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{device.macId}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{device.activationKey}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{admin.fullName}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${device.paymentStatus === 'paid'
                                                                ? 'bg-green-900 text-green-300'
                                                                : 'bg-red-900 text-red-300'
                                                                }`}>
                                                                {device.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${device.deviceStatus === 'active'
                                                                ? 'bg-green-900 text-green-300'
                                                                : 'bg-gray-700 text-gray-300'
                                                                }`}>
                                                                {device.deviceStatus}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{formatDate(device.createdAt)}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">
                                                    No devices found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'admins' && (
                    <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-amber-500">Admin List</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-800">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Full Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Username</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Email</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Created</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Devices</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                                        {filteredAdmins.length > 0 ? (
                                            filteredAdmins.map((admin) => {
                                                // Count devices associated with this admin
                                                const adminDevices = dashboardData.devices.filter(device => device.adminId === admin._id);

                                                return (
                                                    <tr key={admin._id}>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">{admin.fullName}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{admin.username}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{admin.email}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{formatDate(admin.createdAt)}</td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{adminDevices.length}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                                                    No admins found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'coupons' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-lg font-medium text-amber-500">Generate Coupons</h2>
                                <div className="mt-4">
                                    <label htmlFor="couponCount" className="block text-sm font-medium text-gray-300">
                                        Number of Coupons
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            id="couponCount"
                                            className="block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 no-spinner"
                                            min="1"
                                            max="100"
                                            value={couponCount}
                                            onChange={(e) =>
                                                setCouponCount(e.target.value)
                                            }
                                        />
                                    </div>
                                    <button
                                        onClick={generateCoupons}
                                        disabled={generatingCoupons}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-800 disabled:text-gray-300"
                                    >
                                        {generatingCoupons ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>Generate Coupons</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-gray-900 shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-amber-500">Generated Coupons</h2>
                                    {generatedCoupons.length > 0 && (
                                        <button
                                            onClick={downloadCouponsAsCsv}
                                            className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download CSV
                                        </button>
                                    )}
                                </div>
                                <div className="mt-4">
                                    {generatedCoupons.length > 0 ? (
                                        <ul className="max-h-64 divide-y divide-gray-800 overflow-y-auto rounded border border-gray-700">
                                            {generatedCoupons.map((coupon, idx) => (
                                                <li key={idx} className="flex items-center justify-between p-3 hover:bg-gray-800">
                                                    <span className="font-mono text-sm text-white">{coupon ? coupon.toString() : "Loading..."}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(coupon)}
                                                        className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-amber-500"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="rounded-md bg-gray-800 py-6 text-center">
                                            <p className="text-sm text-gray-400">No coupons generated yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}