import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { PulseLoader } from 'react-spinners';

// Button Component
export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    isLoading = false,
    disabled = false,
    icon,
    ...props 
}) => {
    const { isDark } = useTheme();
    
    const variants = {
        primary: isDark 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/25',
        secondary: isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
        outline: isDark 
            ? 'border border-blue-500 text-blue-400 hover:bg-blue-500/10' 
            : 'border border-blue-500 text-blue-600 hover:bg-blue-50',
        ghost: isDark 
            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        danger: isDark 
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
        success: isDark 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
    };
    
    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };
    
    return (
        <motion.button
            className={`
                inline-flex items-center justify-center font-medium rounded-lg
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${variants[variant]} ${sizes[size]} ${className}
                ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={disabled || isLoading}
            whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            {...props}
        >
            {isLoading ? (
                <PulseLoader 
                    color="currentColor" 
                    size={6}
                    loading={true}
                    cssOverride={{ marginRight: '8px' }}
                />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
};

// Card Component
export const Card = ({ children, className = '', hover = true, ...props }) => {
    const { isDark } = useTheme();
    
    return (
        <motion.div
            className={`
                rounded-xl border backdrop-blur-sm transition-all duration-300
                ${isDark 
                    ? 'bg-gray-900/50 border-gray-700/50 shadow-xl' 
                    : 'bg-white/50 border-gray-200/50 shadow-lg'
                }
                ${hover ? (isDark 
                    ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30' 
                    : 'hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30'
                ) : ''}
                ${className}
            `}
            whileHover={hover ? { y: -2 } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Input Component
export const Input = ({ 
    label, 
    error, 
    icon, 
    className = '', 
    required = false,
    ...props 
}) => {
    const { isDark } = useTheme();
    
    return (
        <div className="space-y-2">
            {label && (
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{icon}</span>
                    </div>
                )}
                <input
                    className={`
                        w-full rounded-lg border transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
                        ${isDark 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                        }
                        ${error 
                            ? 'border-red-500 focus:ring-red-500' 
                            : isDark 
                                ? 'focus:border-blue-500' 
                                : 'focus:border-blue-500'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

// Badge Component
export const Badge = ({ children, variant = 'default', className = '' }) => {
    const { isDark } = useTheme();
    
    const variants = {
        default: isDark 
            ? 'bg-gray-700 text-gray-200' 
            : 'bg-gray-100 text-gray-800',
        success: isDark 
            ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
            : 'bg-green-100 text-green-800 border border-green-200',
        warning: isDark 
            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        danger: isDark 
            ? 'bg-red-900/30 text-red-400 border border-red-500/30' 
            : 'bg-red-100 text-red-800 border border-red-200',
        info: isDark 
            ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    
    return (
        <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${variants[variant]} ${className}
        `}>
            {children}
        </span>
    );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const { isDark } = useTheme();
    
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <motion.div
                    className="fixed inset-0 transition-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                </motion.div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                
                <motion.div
                    className={`
                        inline-block align-bottom rounded-xl text-left overflow-hidden shadow-xl transform transition-all
                        sm:my-8 sm:align-middle sm:w-full ${sizes[size]}
                        ${isDark 
                            ? 'bg-gray-900 border border-gray-700' 
                            : 'bg-white border border-gray-200'
                        }
                    `}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                    {title && (
                        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                        </div>
                    )}
                    <div className="px-6 py-4">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '', color = 'currentColor' }) => {
    const sizeMap = {
        sm: 16,
        md: 32,
        lg: 48,
        xl: 64
    };
    
    return (
        <div className={className}>
            <PulseLoader 
                color={color} 
                size={sizeMap[size] / 4}
                loading={true}
            />
        </div>
    );
};

// Alert Component
export const Alert = ({ children, type = 'info', className = '' }) => {
    const { isDark } = useTheme();
    
    const types = {
        info: isDark 
            ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' 
            : 'bg-blue-50 border-blue-200 text-blue-800',
        success: isDark 
            ? 'bg-green-900/20 border-green-500/30 text-green-400' 
            : 'bg-green-50 border-green-200 text-green-800',
        warning: isDark 
            ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: isDark 
            ? 'bg-red-900/20 border-red-500/30 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-800'
    };
    
    return (
        <div className={`p-4 rounded-lg border ${types[type]} ${className}`}>
            {children}
        </div>
    );
};
