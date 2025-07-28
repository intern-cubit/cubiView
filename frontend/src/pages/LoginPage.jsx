import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${
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

            {/* Left Panel - Hidden on mobile */}
            <motion.div 
                className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                            <img 
                                src="/Cubiview-Cubicle.png" 
                                alt="CubiView Logo" 
                                className="w-12 h-12"
                            />
                        </div>
                        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Welcome to{' '}
                            <span className="text-gradient">CubiView</span>
                        </h1>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Enterprise device management made simple and secure
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        {[
                            {
                                title: 'Secure & Reliable',
                                description: 'Enterprise-grade security with 99.9% uptime guarantee',
                                icon: '🔒'
                            },
                            {
                                title: 'Real-time Monitoring',
                                description: 'Monitor your devices with live status updates and alerts',
                                icon: '📊'
                            },
                            {
                                title: 'Easy Integration',
                                description: 'Seamlessly integrate with your existing infrastructure',
                                icon: '🔗'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start space-x-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <div className="text-2xl">{feature.icon}</div>
                                <div>
                                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-12 text-center"
                    >
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            Trusted by 500+ organizations worldwide
                        </p>
                        <div className="flex justify-center space-x-8 mt-4 opacity-60">
                            {['🏢', '🏭', '🏥', '🎓', '🏪'].map((emoji, i) => (
                                <span key={i} className="text-2xl">{emoji}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
                {/* Login Form Container */}
                <div className="w-full max-w-md mt-16 lg:mt-0">
                    <LoginForm />
                    
                    {/* Mobile Brand */}
                    <motion.div
                        className="lg:hidden text-center mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <img 
                                src="/Cubiview-Cubicle.png" 
                                alt="CubiView Logo" 
                                className="w-8 h-8"
                            />
                            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <span className="text-gradient">Cubi</span>View
                            </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Enterprise device management platform
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
