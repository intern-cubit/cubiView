import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <motion.button
            onClick={toggleTheme}
            className={`
                relative inline-flex items-center justify-center w-12 h-12 rounded-xl
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 focus:ring-yellow-500' 
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-600 focus:ring-blue-500'
                }
                ${className}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ 
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Sun size={20} className="text-yellow-400" />
                ) : (
                    <Moon size={20} className="text-blue-600" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
