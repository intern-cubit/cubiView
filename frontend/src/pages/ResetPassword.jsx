import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, AlertCircle, Shield } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const ResetPassword = () => {
    const { token } = useParams();
    const { isDark } = useTheme();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setMessage(data.message || "Password reset successfully!");
            setError("");

            // Redirect to login after a brief delay
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message || "Error occurred");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

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

            {/* Navigation */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
                <motion.button
                    onClick={() => navigate('/login')}
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
                    <span className="text-sm font-medium">Back to Login</span>
                </motion.button>
                <ThemeToggle />
            </div>

            <div className="flex justify-center items-center py-12 px-4 min-h-screen relative z-10">
                <motion.div
                    className="w-full max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className={`px-8 py-6 border-b ${
                            isDark 
                                ? 'bg-gray-800/30 border-gray-700/50' 
                                : 'bg-gray-50/50 border-gray-200/50'
                        }`}>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <Shield size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                        Reset Password
                                    </h2>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Enter your new password below
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            {!isSuccess ? (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {error && (
                                        <motion.div
                                            className={`p-4 rounded-lg border flex items-center space-x-3 ${
                                                isDark 
                                                    ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                                                    : 'bg-red-50 border-red-200 text-red-600'
                                            }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <AlertCircle size={20} className="flex-shrink-0" />
                                            <span className="text-sm">{error}</span>
                                        </motion.div>
                                    )}

                                    {/* New Password Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="newPassword" className={`block text-sm font-medium ${
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={newPasswordVisible ? "text" : "password"}
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                placeholder="Enter new password"
                                                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                    isDark 
                                                        ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-green-500/50 focus:ring-green-500/25' 
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500/25'
                                                }`}
                                            />
                                            <Lock size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                            <button
                                                type="button"
                                                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                                    isDark 
                                                        ? 'text-gray-400 hover:text-green-400' 
                                                        : 'text-gray-500 hover:text-green-600'
                                                }`}
                                            >
                                                {newPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="confirmPassword" className={`block text-sm font-medium ${
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={confirmPasswordVisible ? "text" : "password"}
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder="Confirm new password"
                                                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                    isDark 
                                                        ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-green-500/50 focus:ring-green-500/25' 
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500/25'
                                                }`}
                                            />
                                            <Lock size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                                                    isDark 
                                                        ? 'text-gray-400 hover:text-green-400' 
                                                        : 'text-gray-500 hover:text-green-600'
                                                }`}
                                            >
                                                {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <p>Password requirements:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li className={newPassword.length >= 6 ? (isDark ? 'text-green-400' : 'text-green-600') : ''}>
                                                At least 6 characters long
                                            </li>
                                            <li className={newPassword === confirmPassword && newPassword ? (isDark ? 'text-green-400' : 'text-green-600') : ''}>
                                                Passwords match
                                            </li>
                                        </ul>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                        isLoading={loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                        icon={!loading ? <Shield size={18} /> : null}
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </Button>

                                    <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Remember your password?{' '}
                                        <Link 
                                            to="/login" 
                                            className={`font-medium transition-colors ${
                                                isDark 
                                                    ? 'text-green-400 hover:text-green-300' 
                                                    : 'text-green-600 hover:text-green-700'
                                            }`}
                                        >
                                            Sign in here
                                        </Link>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    className="text-center space-y-6"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
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
                                            Password Reset Successful!
                                        </h3>
                                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Your password has been successfully reset.
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            You will be redirected to the login page in a few seconds.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                                        icon={<ArrowLeft size={18} />}
                                    >
                                        Go to Login
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;