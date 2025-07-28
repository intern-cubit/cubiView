import React, { useState, useEffect } from 'react';
import { ChevronRight, Layers, Lock, Zap, BarChart3, Users, Menu, X, Star, ArrowRight, Play, Shield, Globe, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { Button, Card } from '../components/ui';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const { isDark } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 6);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    const features = [
        {
            icon: Layers,
            title: 'Super Admin Control',
            description: 'Complete oversight with advanced admin panel, user management, and detailed audit trails.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Seamless Onboarding',
            description: 'Streamlined registration process with easy device setup and secure payment integration.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Real-time insights with comprehensive reports and data visualization.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Zap,
            title: 'Real-time Monitoring',
            description: 'Instant notifications and live status updates across your entire device fleet.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Military-grade encryption with comprehensive role-based access controls.',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: Globe,
            title: 'Global Integration',
            description: 'Seamless API integration with your existing systems and workflows.',
            color: 'from-indigo-500 to-blue-500'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Devices Managed', icon: Layers },
        { number: '500+', label: 'Enterprise Clients', icon: Users },
        { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
        { number: '24/7', label: 'Expert Support', icon: Headphones }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
                : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
        }`}>
            {/* Navigation */}
            <motion.nav 
                className={`fixed w-full z-50 transition-all duration-300 ${
                    isScrolled 
                        ? isDark 
                            ? 'bg-gray-900/95 backdrop-blur-md py-3 shadow-lg border-b border-gray-800' 
                            : 'bg-white/95 backdrop-blur-md py-3 shadow-lg border-b border-gray-200'
                        : 'bg-transparent py-4'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <motion.div 
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img 
                                src="/Cubiview-Cubicle.png" 
                                alt="CubiView Logo" 
                                className="w-8 h-8"
                            />
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <span className="text-gradient">Cubi</span>View
                            </span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['Features', 'How It Works', 'Pricing', 'Demo'].map((item, index) => (
                                <motion.button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                    className={`font-medium transition-colors duration-300 ${
                                        isDark 
                                            ? 'text-gray-300 hover:text-blue-400' 
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeToggle />
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="sm" icon={<ArrowRight size={16} />}>
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center space-x-2">
                            <ThemeToggle />
                            <motion.button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDark 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                                whileTap={{ scale: 0.95 }}
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="md:hidden mt-4 pb-4 border-t border-opacity-20"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex flex-col space-y-4 pt-4">
                                    {['Features', 'How It Works', 'Pricing', 'Demo'].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                                            className={`text-left font-medium transition-colors ${
                                                isDark 
                                                    ? 'text-gray-300 hover:text-blue-400' 
                                                    : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                    <div className="flex flex-col space-y-2 pt-2">
                                        <Link to="/login">
                                            <Button variant="ghost" size="sm" className="w-full">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button size="sm" className="w-full">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 hero-pattern opacity-50" />
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-float" />
                <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            className="text-center lg:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
                            >
                                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                <span className={isDark ? 'text-blue-300' : 'text-blue-700'}>
                                    Trusted by 500+ organizations
                                </span>
                            </motion.div>
                            
                            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                Enterprise{' '}
                                <span className="text-gradient block sm:inline">
                                    Device Management
                                </span>{' '}
                                Reimagined
                            </h1>
                            
                            <p className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Take complete control of your organization's hardware fleet with our intuitive platform. 
                                From activation to analytics, all in one place.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                                <Link to="/register">
                                    <Button size="xl" icon={<ArrowRight size={20} />}>
                                        Start Free Trial
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    size="xl" 
                                    icon={<Play size={20} />}
                                    onClick={() => scrollToSection('demo')}
                                >
                                    Watch Demo
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                                    SOC 2 Compliant
                                </div>
                                <div className="flex items-center">
                                    <Lock className="w-4 h-4 mr-2 text-blue-500" />
                                    256-bit Encryption
                                </div>
                                <div className="flex items-center">
                                    <Globe className="w-4 h-4 mr-2 text-purple-500" />
                                    Global Infrastructure
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative max-w-lg mx-auto lg:max-w-none">
                                <Card className="relative p-4 sm:p-6 backdrop-blur-xl">
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                        <div className="text-6xl">🖥️</div>
                                    </div>
                                    
                                    {/* Live Stats Overlay */}
                                    <div className="absolute top-8 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                        Live
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {[
                                            { label: 'Devices', value: '1,247' },
                                            { label: 'Online', value: '98%' },
                                            { label: 'Reports', value: '47' }
                                        ].map((stat, index) => (
                                            <motion.div
                                                key={stat.label}
                                                className={`text-center p-3 rounded-lg ${
                                                    isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                                                }`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                <div className={`text-lg font-bold ${
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {stat.value}
                                                </div>
                                                <div className={`text-sm ${
                                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    {stat.label}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${
                isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, staggerChildren: 0.1 }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="space-y-4"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                                } shadow-lg`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className={`text-3xl sm:text-4xl font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {stat.number}
                                    </div>
                                    <div className={`text-sm sm:text-base ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Powerful Features for{' '}
                            <span className="text-gradient">Modern Teams</span>
                        </h2>
                        <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Everything you need to manage your device fleet efficiently, securely, and at scale
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                onHoverStart={() => setActiveFeature(index)}
                            >
                                <Card 
                                    className={`p-8 h-full transition-all duration-300 cursor-pointer ${
                                        activeFeature === index 
                                            ? isDark 
                                                ? 'ring-2 ring-blue-500/50 bg-gray-800/80' 
                                                : 'ring-2 ring-blue-500/50 bg-white/80'
                                            : ''
                                    }`}
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 shadow-lg`}>
                                            <feature.icon className="w-full h-full text-white" />
                                        </div>
                                        <h3 className={`text-xl font-bold ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {feature.title}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${
                isDark ? 'bg-gray-900/30' : 'bg-gray-50/50'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            How It Works
                        </h2>
                        <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Get started in minutes with our simple onboarding process
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                            {[
                                { title: 'Sign Up', description: 'Create your account with basic information', icon: '👤' },
                                { title: 'Add Device', description: 'Register devices using MAC ID or System ID', icon: '📱' },
                                { title: 'Payment', description: 'Choose a plan and complete secure payment', icon: '💳' },
                                { title: 'Activate', description: 'Activate your devices with generated keys', icon: '🔑' },
                                { title: 'Monitor', description: 'Access real-time monitoring and reports', icon: '📊' }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center text-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30" />
                                        <div className={`relative w-20 h-20 flex items-center justify-center text-2xl rounded-full border-2 ${
                                            isDark 
                                                ? 'bg-gray-900 border-gray-700' 
                                                : 'bg-white border-gray-200'
                                        } shadow-lg`}>
                                            {step.icon}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-bold flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className={`text-lg font-bold mb-3 ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm max-w-xs ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {step.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                See It In Action
                            </h2>
                            <p className={`text-lg sm:text-xl mb-8 ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Watch our platform demonstration to see how CubiView can transform your device management workflow.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                {[
                                    'Complete admin dashboard tour',
                                    'Device registration process',
                                    'Report generation and analysis',
                                    'User management features'
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3 flex-shrink-0">
                                            <ChevronRight className="w-3 h-3 text-white" />
                                        </div>
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                            {item}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <Button 
                                size="lg" 
                                icon={<Play size={20} />}
                                className="mb-4"
                            >
                                Request Live Demo
                            </Button>
                            
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                No commitment required • 15-minute session
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative max-w-lg mx-auto lg:max-w-none">
                                <Card className="relative p-6 backdrop-blur-xl">
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative group cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                                        <motion.div
                                            className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </motion.div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                                                <div className="flex items-center justify-between text-white text-sm">
                                                    <span>Dashboard Overview</span>
                                                    <span>5:32</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${
                isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Simple, Transparent Pricing
                        </h2>
                        <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Choose the perfect plan for your organization. Start free, scale as you grow. Pricing is per device per month.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: 'Starter',
                                price: 'Free',
                                description: 'Perfect for small teams getting started',
                                features: ['Up to 5 devices', 'Basic monitoring', 'Email support', 'Monthly reports'],
                                popular: false
                            },
                            {
                                name: 'Professional',
                                price: '₹99',
                                period: '/device/month',
                                description: 'Ideal for growing organizations',
                                features: ['Unlimited devices', 'Real-time monitoring', 'Priority support', 'Advanced analytics', 'API access'],
                                popular: true
                            },
                            {
                                name: 'Enterprise',
                                price: 'Custom',
                                description: 'For large-scale deployments',
                                features: ['Custom solutions', 'Dedicated support', 'On-premise deployment', 'SLA guarantee', 'Training included'],
                                popular: false
                            }
                        ].map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className={`p-8 h-full relative ${
                                    plan.popular 
                                        ? 'ring-2 ring-blue-500/50 scale-105' 
                                        : ''
                                }`}>
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-8">
                                        <h3 className={`text-xl font-bold mb-2 ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {plan.name}
                                        </h3>
                                        <div className="mb-4">
                                            <span className={`text-4xl font-bold ${
                                                isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {plan.price}
                                            </span>
                                            {plan.period && (
                                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                    {plan.period}
                                                </span>
                                            )}
                                        </div>
                                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {plan.description}
                                        </p>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center">
                                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 flex-shrink-0">
                                                    <ChevronRight className="w-3 h-3 text-white" />
                                                </div>
                                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <Button 
                                        variant={plan.popular ? 'primary' : 'outline'} 
                                        className="w-full"
                                    >
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Ready to Transform Your{' '}
                            <span className="text-gradient">Device Management?</span>
                        </h2>
                        <p className={`text-lg sm:text-xl mb-8 max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Join hundreds of organizations that trust CubiView for their enterprise device management needs.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="xl" icon={<ArrowRight size={20} />}>
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Button variant="outline" size="xl">
                                Schedule Demo
                            </Button>
                        </div>
                        <p className={`text-sm mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`border-t pt-16 pb-8 px-4 sm:px-6 lg:px-8 ${
                isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                        {[
                            {
                                title: 'Product',
                                links: ['Features', 'Pricing', 'Security', 'API Documentation']
                            },
                            {
                                title: 'Company',
                                links: ['About Us', 'Careers', 'Blog', 'Press Kit']
                            },
                            {
                                title: 'Resources',
                                links: ['Help Center', 'Tutorials', 'Community', 'Status Page']
                            },
                            {
                                title: 'Legal',
                                links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
                            }
                        ].map((section, index) => (
                            <div key={index}>
                                <h4 className={`font-bold text-lg mb-4 ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a 
                                                href="#" 
                                                className={`transition-colors ${
                                                    isDark 
                                                        ? 'text-gray-400 hover:text-blue-400' 
                                                        : 'text-gray-600 hover:text-blue-600'
                                                }`}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
                        isDark ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <img 
                                src="/Cubiview-Cubicle.png" 
                                alt="CubiView Logo" 
                                className="w-8 h-8"
                            />
                            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <span className="text-gradient">Cubi</span>View
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                                <a
                                    key={platform}
                                    href="#"
                                    className={`transition-colors ${
                                        isDark 
                                            ? 'text-gray-400 hover:text-blue-400' 
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="text-center mt-8">
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            &copy; 2025 CubiView Corp. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}