import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Mail, Printer } from 'lucide-react';
import { SurveyData } from '../types/survey';
import { generatePDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

interface PDFPreviewProps {
  data: SurveyData;
  onBack: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data, onBack }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-6 flex items-center justify-between"
      >
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Form</span>
        </motion.button>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </motion.button>
          <motion.button
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </motion.button>
        </div>
      </motion.div>

      {/* PDF Preview */}
      <motion.div
        ref={previewRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl border border-gray-300 print:shadow-none print:border-none"
        style={{ minHeight: '297mm', width: '210mm', margin: '0 auto', padding: '20mm' }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MOTOR VEHICLE SURVEY REPORT</h1>
          <p className="text-gray-600">Insurance Claim Assessment</p>
          <div className="mt-4 text-sm text-gray-500">
            Report Generated: {format(new Date(), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>

        {/* Surveyor Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">SURVEYOR DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {data.surveyorDetails.name}</div>
            <div><strong>License No:</strong> {data.surveyorDetails.licenseNo}</div>
            <div><strong>Phone:</strong> {data.surveyorDetails.phone}</div>
            <div><strong>Email:</strong> {data.surveyorDetails.email}</div>
            <div className="col-span-2"><strong>Address:</strong> {data.surveyorDetails.address}</div>
          </div>
        </div>

        {/* Insured Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">INSURED DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {data.insuredDetails.name}</div>
            <div><strong>Phone:</strong> {data.insuredDetails.phone}</div>
            <div><strong>Email:</strong> {data.insuredDetails.email}</div>
            <div className="col-span-2"><strong>Address:</strong> {data.insuredDetails.address}</div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">VEHICLE DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Registration No:</strong> {data.vehicleDetails.registrationNo}</div>
            <div><strong>Chassis No:</strong> {data.vehicleDetails.chassisNo}</div>
            <div><strong>Engine No:</strong> {data.vehicleDetails.engineNo}</div>
            <div><strong>Date of Registration:</strong> {formatDate(data.vehicleDetails.dateOfRegistration)}</div>
            <div><strong>Make & Model:</strong> {data.vehicleDetails.make} {data.vehicleDetails.model}</div>
            <div><strong>Year:</strong> {data.vehicleDetails.year}</div>
            <div><strong>Color:</strong> {data.vehicleDetails.color}</div>
            <div><strong>Fuel Type:</strong> {data.vehicleDetails.fuelType}</div>
          </div>
        </div>

        {/* Insurance Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">INSURANCE DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Company:</strong> {data.insuranceDetails.companyName}</div>
            <div><strong>Policy No:</strong> {data.insuranceDetails.policyNo}</div>
            <div><strong>Policy Period:</strong> {data.insuranceDetails.policyPeriod}</div>
            <div><strong>Premium:</strong> {data.insuranceDetails.premiumAmount ? formatCurrency(parseFloat(data.insuranceDetails.premiumAmount)) : 'N/A'}</div>
            <div><strong>IDV:</strong> {data.insuranceDetails.idv ? formatCurrency(parseFloat(data.insuranceDetails.idv)) : 'N/A'}</div>
            <div><strong>Deductible:</strong> {data.insuranceDetails.deductible ? formatCurrency(parseFloat(data.insuranceDetails.deductible)) : 'N/A'}</div>
          </div>
        </div>

        {/* Driver Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">DRIVER DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {data.driverDetails.name}</div>
            <div><strong>License No:</strong> {data.driverDetails.licenseNo}</div>
            <div><strong>License Type:</strong> {data.driverDetails.licenseType}</div>
            <div><strong>License Expiry:</strong> {formatDate(data.driverDetails.licenseExpiry)}</div>
            <div><strong>Age:</strong> {data.driverDetails.age} years</div>
            <div><strong>Experience:</strong> {data.driverDetails.experience} years</div>
          </div>
        </div>

        {/* Accident Details */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">ACCIDENT DETAILS</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Date:</strong> {formatDate(data.accidentDetails.date)}</div>
            <div><strong>Time:</strong> {data.accidentDetails.time}</div>
            <div className="col-span-2"><strong>Place:</strong> {data.accidentDetails.place}</div>
            <div className="col-span-2"><strong>Cause:</strong> {data.accidentDetails.cause}</div>
            <div><strong>Police Station:</strong> {data.accidentDetails.policeStation || 'N/A'}</div>
            <div><strong>FIR No:</strong> {data.accidentDetails.firNo || 'N/A'}</div>
            <div><strong>Weather:</strong> {data.accidentDetails.weatherConditions || 'N/A'}</div>
            <div><strong>Road Conditions:</strong> {data.accidentDetails.roadConditions || 'N/A'}</div>
          </div>
        </div>

        {/* Damage Assessment */}
        {data.damagedParts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">DAMAGE ASSESSMENT</h2>
            <table className="w-full border-collapse border border-gray-400 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-2 py-1 text-left">S.No.</th>
                  <th className="border border-gray-400 px-2 py-1 text-left">Part Name</th>
                  <th className="border border-gray-400 px-2 py-1 text-left">Damage Type</th>
                  <th className="border border-gray-400 px-2 py-1 text-right">Part Cost</th>
                  <th className="border border-gray-400 px-2 py-1 text-right">Labor Cost</th>
                  <th className="border border-gray-400 px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.damagedParts.map((part, index) => (
                  <tr key={part.id}>
                    <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                    <td className="border border-gray-400 px-2 py-1">{part.partName}</td>
                    <td className="border border-gray-400 px-2 py-1">{part.damageType}</td>
                    <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(part.partCost)}</td>
                    <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(part.laborCost)}</td>
                    <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(part.partCost + part.laborCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={3} className="border border-gray-400 px-2 py-1 text-right">TOTAL:</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(data.financialAssessment.totalPartsCost)}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(data.financialAssessment.totalLaborCost)}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{formatCurrency(data.financialAssessment.totalAssessedCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Financial Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">FINANCIAL SUMMARY</h2>
          <div className="border border-gray-400">
            <div className="grid grid-cols-2 gap-0 text-sm">
              <div className="border-b border-r border-gray-400 px-3 py-2"><strong>Total Assessed Cost:</strong></div>
              <div className="border-b border-gray-400 px-3 py-2 text-right">{formatCurrency(data.financialAssessment.totalAssessedCost)}</div>
              
              <div className="border-b border-r border-gray-400 px-3 py-2"><strong>Less: Compulsory Deductible:</strong></div>
              <div className="border-b border-gray-400 px-3 py-2 text-right">({formatCurrency(data.financialAssessment.compulsoryDeductible)})</div>
              
              <div className="border-b border-r border-gray-400 px-3 py-2"><strong>Less: Salvage Value:</strong></div>
              <div className="border-b border-gray-400 px-3 py-2 text-right">({formatCurrency(data.financialAssessment.salvageValue)})</div>
              
              <div className="border-r border-gray-400 px-3 py-2 bg-yellow-100"><strong>NET LIABILITY:</strong></div>
              <div className="px-3 py-2 text-right bg-yellow-100 font-bold text-lg">{formatCurrency(data.financialAssessment.netLiability)}</div>
            </div>
          </div>
        </div>

        {/* Additional Remarks */}
        {data.additionalRemarks && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2">ADDITIONAL REMARKS</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.additionalRemarks}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="mt-12 pt-6 border-t-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="border-b border-gray-400 mb-2 h-12"></div>
              <p className="text-sm text-center"><strong>Surveyor Signature</strong></p>
              <p className="text-xs text-center text-gray-600">Date: ___________</p>
            </div>
            <div>
              <div className="border-b border-gray-400 mb-2 h-12"></div>
              <p className="text-sm text-center"><strong>Insured Signature</strong></p>
              <p className="text-xs text-center text-gray-600">Date: ___________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>This report is generated electronically and is valid without signature.</p>
          <p>Report ID: {data.id || 'DRAFT'} | Generated on: {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
        </div>
      </motion.div>
    </div>
  );
};