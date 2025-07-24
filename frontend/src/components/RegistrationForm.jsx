import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, User, Lock, UserCircle } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';
import { Button, Input, Card, Alert } from './ui';

const RegistrationForm = () => {
    const { isDark } = useTheme();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error when user starts typing again
        if (error) setError("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            // Success notification
            navigate("/login", { state: { message: "Registration successful! Please log in." } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={`w-full backdrop-blur-md border shadow-2xl `}>
                {/* Header */}
                <div className="p-6 pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-6"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <UserCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Create Account
                        </h2>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Join our community and start tracking
                        </p>
                    </motion.div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Alert variant="destructive" className="mb-4">
                                {error}
                            </Alert>
                        </motion.div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Full Name
                            </label>
                            <Input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                icon={<User className="w-4 h-4" />}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Username
                            </label>
                            <Input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                required
                                icon={<User className="w-4 h-4" />}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Email Address
                        </label>
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            icon={<Mail className="w-4 h-4" />}
                        />
                    </motion.div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className={`block text-sm font-medium mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                    >
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </motion.div>

                    {/* Social Registration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={`w-full border-t ${
                                    isDark ? 'border-gray-700' : 'border-gray-300'
                                }`} />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-2 ${
                                    isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
                                }`}>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                                Twitter
                            </Button>
                        </div>
                    </motion.div>
                </form>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6"
                >
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className={`font-medium transition-colors hover:underline ${
                                isDark 
                                    ? 'text-blue-400 hover:text-blue-300' 
                                    : 'text-blue-600 hover:text-blue-700'
                            }`}
                        >
                            Sign in here
                        </Link>
                    </p>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default RegistrationForm;