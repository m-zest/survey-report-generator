import React from 'react';
import { motion } from 'framer-motion';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
        {title}
      </h3>
      {children}
    </motion.div>
  );
};