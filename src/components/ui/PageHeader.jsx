import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageHeader({ 
  title, 
  subtitle,
  backTo = 'Home',
  action,
  transparent = false 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-50 ${transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-xl border-b border-slate-100/50'}`}
    >
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to={createPageUrl(backTo)}
              className="w-10 h-10 rounded-2xl bg-slate-100/80 backdrop-blur flex items-center justify-center hover:bg-slate-200/80 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      </div>
    </motion.div>
  );
}