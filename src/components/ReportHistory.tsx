import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Download, Trash2, Eye, Calendar, FileText } from 'lucide-react';
import { SurveyData } from '../types/survey';
import { format } from 'date-fns';
import { generatePDF } from '../utils/pdfGenerator';

interface ReportHistoryProps {
  reports: SurveyData[];
  onEdit: (report: SurveyData) => void;
  onDelete: (id: string) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  onEdit,
  onDelete,
}) => {
  const handleDownload = async (report: SurveyData) => {
    try {
      await generatePDF(report);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (reports.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reports Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any survey reports yet. Start by filling out the survey form.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Report History</h2>
        <p className="text-gray-600">Manage your saved survey reports</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {report.vehicleDetails.registrationNo || 'Draft Report'}
                </h3>
                <p className="text-sm text-gray-600">
                  {report.vehicleDetails.make} {report.vehicleDetails.model}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={() => onEdit(report)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Report"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => handleDownload(report)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => report.id && onDelete(report.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {report.createdAt 
                    ? format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')
                    : 'Draft'
                  }
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Insured:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {report.insuredDetails.name || 'N/A'}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Insurance:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {report.insuranceDetails.companyName || 'N/A'}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Net Liability:</span>
                <span className="ml-2 font-bold text-green-600">
                  ₹{report.financialAssessment.netLiability.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                report.id 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {report.id ? 'Saved' : 'Draft'}
              </span>
              
              <div className="text-xs text-gray-500">
                {report.damagedParts.length} damaged parts
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};