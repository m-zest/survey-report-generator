import React from 'react';
import { motion } from 'framer-motion';
import { FileText, History, Eye, Shield } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'preview' | 'history';
  onViewChange: (view: 'form' | 'preview' | 'history') => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, hasData }) => {
  const navItems = [
    { id: 'form', label: 'Survey Form', icon: FileText },
    { id: 'preview', label: 'Preview Report', icon: Eye, disabled: !hasData },
    { id: 'history', label: 'Report History', icon: History },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900"> PAPA Insurance Survey Generator</h1>
              <p className="text-sm text-gray-600">Professional Vehicle Assessment Reports</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => !item.disabled && onViewChange(item.id as any)}
                disabled={item.disabled}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                whileHover={!item.disabled ? { scale: 1.05 } : {}}
                whileTap={!item.disabled ? { scale: 0.95 } : {}}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};