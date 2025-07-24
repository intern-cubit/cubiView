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
                    size={8} 
                    color="currentColor" 
                    loading={true}
                    cssOverride={{
                        display: "inline-block",
                        marginRight: "8px"
                    }}
                />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
