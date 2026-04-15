import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const gradients = {
  blue: 'from-blue-500 to-cyan-400',
  purple: 'from-purple-500 to-pink-400',
  orange: 'from-orange-500 to-amber-400',
  green: 'from-emerald-500 to-teal-400',
  red: 'from-red-500 to-rose-400',
  cyan: 'from-cyan-500 to-blue-400',
  amber: 'from-amber-500 to-yellow-400',
  rose: 'from-rose-500 to-pink-400',
  indigo: 'from-indigo-500 to-purple-400',
  sky: 'from-sky-500 to-cyan-400',
};

export default function ModuleIcon({ 
  icon: Icon, 
  color = 'blue', 
  size = 'md',
  pulse = false,
  className 
}) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div className={cn(
      "relative rounded-2xl flex items-center justify-center",
      `bg-gradient-to-br ${gradients[color]}`,
      "shadow-lg",
      sizes[size],
      className
    )}>
      {pulse && (
        <motion.div
          className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br", gradients[color])}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <Icon className={cn("text-white relative z-10", iconSizes[size])} />
    </div>
  );
}