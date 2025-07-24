import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Home } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const ForgotPassword = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const { isDark } = useTheme();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSent) return;

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong.");

            setMessage(data.message || "Reset email sent!");
            setError("");
            setIsSent(true);
        } catch (err) {
            setError(err.message);
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
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                    <Mail size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Forgot Password
                                    </h2>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Enter your email to receive reset instructions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            {!isSent ? (
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

                                    <div className="space-y-2">
                                        <label htmlFor="email" className={`block text-sm font-medium ${
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="Enter your email address"
                                                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                    isDark 
                                                        ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/25' 
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/25'
                                                }`}
                                            />
                                            <Mail size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !email}
                                        isLoading={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                        icon={!loading ? <Send size={18} /> : null}
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </Button>

                                    <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Remember your password?{' '}
                                        <Link 
                                            to="/login" 
                                            className={`font-medium transition-colors ${
                                                isDark 
                                                    ? 'text-blue-400 hover:text-blue-300' 
                                                    : 'text-blue-600 hover:text-blue-700'
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
                                            Email Sent!
                                        </h3>
                                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            We've sent password reset instructions to{' '}
                                            <span className="font-medium">{email}</span>
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Please check your email and follow the instructions to reset your password.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                            icon={<ArrowLeft size={18} />}
                                        >
                                            Back to Login
                                        </Button>
                                        
                                        <button
                                            onClick={() => {
                                                setIsSent(false);
                                                setEmail("");
                                                setMessage("");
                                                setError("");
                                            }}
                                            className={`w-full text-sm transition-colors ${
                                                isDark 
                                                    ? 'text-gray-400 hover:text-white' 
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            Try a different email
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;