import React, { useState, useEffect } from 'react';
import { ChevronRight, Layers, Lock, Zap, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Navigation */}
            <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-black bg-opacity-80 py-2 shadow-lg' : 'bg-transparent py-4'
                }`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-white">
                            <span className="text-yellow-400">Cubi</span>View
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="hover:text-yellow-400 transition">Features</a>
                        <a href="#workflow" className="hover:text-yellow-400 transition">How It Works</a>
                        <a href="#demo" className="hover:text-yellow-400 transition">Demo</a>
                    </div>
                    <Link to={"/login"} className="bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-2 px-4 rounded-lg transition">
                        Sign In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1200/800')] bg-center bg-no-repeat bg-cover opacity-10"></div>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-900/20 to-transparent"></div>

                <div className="container mx-auto max-w-6xl relative z-1">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Enterprise <span className="text-yellow-400">Device Management</span> Reimagined
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                                Take complete control of your organization's hardware fleet with our intuitive platform. From activation to analytics, all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to={"/register"} className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center">
                                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                                <button className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-semibold py-3 px-6 rounded-lg transition">
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                    <img
                                        src="/api/placeholder/600/400"
                                        alt="Dashboard preview"
                                        className="rounded-lg shadow-lg w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <p className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">5000+</p>
                            <p className="text-gray-400">Devices Managed</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">200+</p>
                            <p className="text-gray-400">Enterprise Clients</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">99.9%</p>
                            <p className="text-gray-400">Uptime</p>
                        </div>
                        <div className="p-4">
                            <p className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">24/7</p>
                            <p className="text-gray-400">Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Everything you need to manage your device fleet efficiently and securely
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 p-3 rounded-lg mb-4">
                                <Layers className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Super Admin Panel</h3>
                            <p className="text-gray-400">
                                Comprehensive control over MAC IDs, activation keys, and admin accounts with full authority and audit trails.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 p-3 rounded-lg mb-4">
                                <Users className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Admin Onboarding</h3>
                            <p className="text-gray-400">
                                Streamlined sign-up process, easy device registration by MAC/Processor ID, and secure payment integration.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 p-3 rounded-lg mb-4">
                                <BarChart3 className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Report Access</h3>
                            <p className="text-gray-400">
                                Download comprehensive daily reports in multiple formats directly from your device's software.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 p-3 rounded-lg mb-4">
                                <Zap className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-time Monitoring</h3>
                            <p className="text-gray-400">
                                Get instant notifications and status updates on all your devices with our real-time dashboard.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 p-3 rounded-lg mb-4">
                                <Lock className="h-8 w-8 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                            <p className="text-gray-400">
                                Military-grade encryption and comprehensive role-based access controls to protect your data.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 transition hover:transform hover:scale-105 hover:shadow-xl">
                            <div className="flex justify-center items-center h-16 w-16 bg-yellow-400/20 rounded-lg mb-4">
                                <div className="text-2xl text-yellow-400 font-bold">API</div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Robust API</h3>
                            <p className="text-gray-400">
                                Integrate with your existing systems using our well-documented and feature-rich API endpoints.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-20 px-4 bg-gradient-to-t from-gray-900 to-black">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Get started in minutes with our simple onboarding process
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-400/30 to-yellow-400 transform -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-1">
                            {['Sign Up', 'Add Device', 'Payment', 'Activate', 'Get Reports'].map((step, idx) => (
                                <div key={step} className="flex flex-col items-center">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-sm opacity-70"></div>
                                        <div className="relative w-16 h-16 flex items-center justify-center bg-gray-800 text-yellow-400 text-xl font-bold rounded-full border-2 border-yellow-400">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step}</h3>
                                    <p className="text-gray-400 text-center">
                                        {idx === 0 && "Create your account with basic information"}
                                        {idx === 1 && "Register devices using MAC ID or processor ID"}
                                        {idx === 2 && "Choose a plan and complete secure payment"}
                                        {idx === 3 && "Activate your devices with generated keys"}
                                        {idx === 4 && "Access and download detailed reports"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">See It In Action</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Watch our platform demonstration to see how CubiView can transform your device management workflow.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Complete admin dashboard tour', 'Device registration process', 'Report generation and analysis', 'User management'].map((item) => (
                                    <li key={item} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                                                <ChevronRight className="h-4 w-4 text-black" />
                                            </div>
                                        </div>
                                        <span className="ml-3">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition flex items-center">
                                Request Live Demo
                            </button>
                        </div>
                        <div className="relative p-1 rounded-2xl">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-purple-600 rounded-2xl blur opacity-30"></div>
                            <div className="relative bg-gray-800 p-4 rounded-2xl">
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                    <img
                                        src="/api/placeholder/800/450"
                                        alt="Demo video placeholder"
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-yellow-400 rounded-full p-4 shadow-lg">
                                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Device Management?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Join hundreds of organizations that trust CubiView for their enterprise device management needs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-8 rounded-lg transition">
                            Start Free Trial
                        </button>
                        <button className="bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-semibold py-3 px-8 rounded-lg transition">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-12 pb-6 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">API Reference</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Tutorials</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Guides</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">FAQs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Cookie Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">GDPR</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 mt-12 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <span className="text-2xl font-bold">
                                <span className="text-yellow-400">Cubi</span>View
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="text-gray-400 hover:text-yellow-400 transition"
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-8">&copy; 2025 CubiView Corp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}