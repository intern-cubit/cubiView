import React, { useState, useEffect } from 'react';
import { ChevronRight, Layers, Lock, Zap, BarChart3, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#111827] via-black to-[#10151b] text-white">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[rgba(30,30,30,0.9)] backdrop-blur-md py-3 shadow-lg border-b border-gray-800' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white">
                                <span className="text-[#6a5acd]">Cubi</span>View
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('features')} className="hover:text-[#6a5acd] transition-colors duration-300">Features</button>
                            <button onClick={() => scrollToSection('workflow')} className="hover:text-[#6a5acd] transition-colors duration-300">How It Works</button>
                            <button onClick={() => scrollToSection('demo')} className="hover:text-[#6a5acd] transition-colors duration-300">Demo</button>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to={"/register"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)]">
                                Sign Up
                            </Link>
                            <Link to={"/login"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)]">
                                Sign In
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-[#6a5acd] transition-colors duration-300"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
                            <div className="flex flex-col space-y-4 pt-4">
                                <button onClick={() => scrollToSection('features')} className="text-left hover:text-[#6a5acd] transition-colors duration-300">Features</button>
                                <button onClick={() => scrollToSection('workflow')} className="text-left hover:text-[#6a5acd] transition-colors duration-300">How It Works</button>
                                <button onClick={() => scrollToSection('demo')} className="text-left hover:text-[#6a5acd] transition-colors duration-300">Demo</button>
                                <button className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] w-full">
                                    Sign In
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-dvh flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1200/800')] bg-center bg-no-repeat bg-cover opacity-10"></div>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#6a5acd]/10 to-transparent"></div>

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-0">
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Enterprise <span className="text-[#6a5acd] block sm:inline">Device Management</span> Reimagined
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Take complete control of your organization's hardware fleet with our intuitive platform. From activation to analytics, all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to={"/register"} className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] flex items-center justify-center">
                                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                                <button className="border border-[#6a5acd] text-[#6a5acd] hover:bg-[#6a5acd]/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.2)]">
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative max-w-lg mx-auto lg:max-w-none">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#6a5acd] to-[#4a3a8d] rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-[rgba(30,30,30,0.8)] backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-gray-800">
                                    <img
                                        src="/api/placeholder/600/400"
                                        alt="Dashboard preview"
                                        className="rounded-lg shadow-lg w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[rgba(30,30,30,0.3)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
                        {[
                            { number: '5000+', label: 'Devices Managed' },
                            { number: '200+', label: 'Enterprise Clients' },
                            { number: '99.9%', label: 'Uptime' },
                            { number: '24/7', label: 'Support' }
                        ].map((stat, index) => (
                            <div key={index} className="p-4 sm:p-6">
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6a5acd] mb-2">{stat.number}</p>
                                <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                            Everything you need to manage your device fleet efficiently and securely
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: Layers,
                                title: 'Super Admin Panel',
                                description: 'Comprehensive control over MAC IDs, activation keys, and admin accounts with full authority and audit trails.'
                            },
                            {
                                icon: Users,
                                title: 'Admin Onboarding',
                                description: 'Streamlined sign-up process, easy device registration by MAC/Processor ID, and secure payment integration.'
                            },
                            {
                                icon: BarChart3,
                                title: 'Report Access',
                                description: 'Download comprehensive daily reports in multiple formats directly from your device\'s software.'
                            },
                            {
                                icon: Zap,
                                title: 'Real-time Monitoring',
                                description: 'Get instant notifications and status updates on all your devices with our real-time dashboard.'
                            },
                            {
                                icon: Lock,
                                title: 'Enterprise Security',
                                description: 'Military-grade encryption and comprehensive role-based access controls to protect your data.'
                            },
                            {
                                icon: null,
                                title: 'CubiView App',
                                description: 'Integrate with your existing systems using our well-documented and feature-rich Application.',
                                isAPI: true
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-[rgba(30,30,30,0.5)] backdrop-blur-md border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] hover:transform hover:scale-105">
                                <div className="mb-4">
                                    {feature.isAPI ? (
                                        <div className="flex justify-center items-center h-16 w-16 bg-[#6a5acd]/20 rounded-lg">
                                            <div className="text-2xl text-[#6a5acd] font-bold">APP</div>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center bg-[#6a5acd]/20 p-3 rounded-lg">
                                            <feature.icon className="h-8 w-8 text-[#6a5acd]" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#111827] to-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
                            Get started in minutes with our simple onboarding process
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting line - hidden on mobile */}
                        <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-[#6a5acd] via-[#6a5acd]/30 to-[#6a5acd] transform -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
                            {[
                                { title: 'Sign Up', description: 'Create your account with basic information' },
                                { title: 'Add Device', description: 'Register devices using MAC ID or processor ID' },
                                { title: 'Payment', description: 'Choose a plan and complete secure payment' },
                                { title: 'Activate', description: 'Activate your devices with generated keys' },
                                { title: 'Get Reports', description: 'Access and download detailed reports' }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <div className="absolute -inset-1 bg-[#6a5acd] rounded-full blur-sm opacity-70"></div>
                                        <div className="relative w-16 h-16 flex items-center justify-center bg-[rgba(30,30,30,0.8)] backdrop-blur-md text-[#6a5acd] text-xl font-bold rounded-full border-2 border-[#6a5acd]">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-400 max-w-xs">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">See It In Action</h2>
                            <p className="text-base sm:text-lg text-gray-400 mb-8">
                                Watch our platform demonstration to see how CubiView can transform your device management workflow.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Complete admin dashboard tour',
                                    'Device registration process',
                                    'Report generation and analysis',
                                    'User management'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-[#6a5acd] flex items-center justify-center">
                                                <ChevronRight className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm sm:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] flex items-center">
                                Request Live Demo
                            </button>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative max-w-lg mx-auto lg:max-w-none">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#6a5acd] to-[#4a3a8d] rounded-2xl blur opacity-30"></div>
                                <div className="relative bg-[rgba(30,30,30,0.8)] backdrop-blur-md p-4 rounded-2xl border border-gray-800">
                                    <div className="aspect-video rounded-lg overflow-hidden">
                                        <img
                                            src="/api/placeholder/800/450"
                                            alt="Demo video placeholder"
                                            className="object-cover w-full h-full rounded-lg"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-[#6a5acd] hover:bg-[#5a4abd] rounded-full p-4 shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] cursor-pointer">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#111827] via-black to-[#10151b]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Device Management?</h2>
                    <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
                        Join hundreds of organizations that trust CubiView for their enterprise device management needs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="bg-[#6a5acd] hover:bg-[#5a4abd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.3)] w-full sm:w-auto">
                            Start Free Trial
                        </button>
                        <button className="bg-transparent border border-[#6a5acd] text-[#6a5acd] hover:bg-[#6a5acd]/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(106,90,205,0.2)] w-full sm:w-auto">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[rgba(30,30,30,0.5)] backdrop-blur-md border-t border-gray-800 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
                        {[
                            {
                                title: 'Company',
                                links: ['About', 'Careers', 'Blog', 'Press']
                            },
                            {
                                title: 'Resources',
                                links: ['Documentation', 'API Reference', 'Tutorials', 'Guides']
                            },
                            {
                                title: 'Support',
                                links: ['Help Center', 'Contact Us', 'FAQs', 'Community']
                            },
                            {
                                title: 'Legal',
                                links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR']
                            }
                        ].map((section, index) => (
                            <div key={index}>
                                <h4 className="font-bold text-base sm:text-lg mb-4">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a href="#" className="text-sm sm:text-base text-gray-400 hover:text-[#6a5acd] transition-colors duration-300">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-gray-800 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center">
                            <span className="text-xl sm:text-2xl font-bold">
                                <span className="text-[#6a5acd]">Cubi</span>View
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map(platform => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="text-sm sm:text-base text-gray-400 hover:text-[#6a5acd] transition-colors duration-300"
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-xs sm:text-sm mt-8">&copy; 2025 CubiView Corp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}