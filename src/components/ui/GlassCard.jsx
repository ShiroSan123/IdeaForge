import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GlassCard({ 
  children, 
  className, 
  gradient,
  hover = true,
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "bg-white/80 backdrop-blur-xl",
        "border border-white/20 shadow-xl shadow-slate-200/50",
        hover && "hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-300",
        gradient,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}