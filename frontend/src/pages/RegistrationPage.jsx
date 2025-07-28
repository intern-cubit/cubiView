import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage = () => {
    const { isDark } = useTheme();

    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Enterprise Security",
            description: "Bank-grade encryption and security protocols"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Team Collaboration",
            description: "Seamless team management and role-based access"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Optimized performance for real-time tracking"
        }
    ];

    return (
        <div className={`min-h-screen flex ${
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
                <Link
                    to="/"
                    className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <ThemeToggle />
            </div>

            {/* Left Panel - Branding */}
            <motion.div 
                className={`hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden ${
                    isDark ? 'bg-gray-900/50' : 'bg-white/50'
                }`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-md text-center relative z-10">
                    {/* Logo */}
                    <motion.div 
                        className="mb-8"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <img 
                                src="/Cubiview-Cubicle.png" 
                                alt="CubiView" 
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            CubiView
                        </h1>
                    </motion.div>

                    {/* Welcome Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className={`text-2xl font-bold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Join CubiView Today
                        </h2>
                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Start your journey with the most advanced device tracking platform
                        </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 text-left"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        isDark 
                                            ? 'bg-purple-500/20 text-purple-400' 
                                            : 'bg-purple-100 text-purple-600'
                                    }`}>
                                        {feature.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Already have account */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                        className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear" 
                        }}
                    />
                    <motion.div 
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                        animate={{ 
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0]
                        }}
                        transition={{ 
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear" 
                        }}
                    />
                </div>
            </motion.div>

            {/* Right Panel - Registration Form */}
            <motion.div 
                className="flex-1 flex items-center justify-center p-6 lg:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="w-full max-w-md mt-16 lg:mt-0">
                    <RegistrationForm />
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;
