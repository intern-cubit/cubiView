import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

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

export default Card;
