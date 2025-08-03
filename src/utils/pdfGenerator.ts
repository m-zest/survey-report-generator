import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SurveyData } from '../types/survey';
import { format } from 'date-fns';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = async (data: SurveyData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth?: number) => {
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * 5);
    } else {
      doc.text(text, x, y);
      return y + 5;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('MOTOR VEHICLE SURVEY REPORT', pageWidth / 2, yPosition);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  yPosition = addText('Insurance Claim Assessment', pageWidth / 2, yPosition + 5);
  yPosition = addText(`Report Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth / 2, yPosition + 5);
  
  // Line separator
  doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5);
  yPosition += 15;

  // Surveyor Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('SURVEYOR DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Name: ${data.surveyorDetails.name}`, margin, yPosition);
  yPosition = addText(`License No: ${data.surveyorDetails.licenseNo}`, margin, yPosition);
  yPosition = addText(`Phone: ${data.surveyorDetails.phone}`, margin, yPosition);
  yPosition = addText(`Email: ${data.surveyorDetails.email}`, margin, yPosition);
  yPosition = addText(`Address: ${data.surveyorDetails.address}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition += 10;

  // Insured Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('INSURED DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Name: ${data.insuredDetails.name}`, margin, yPosition);
  yPosition = addText(`Phone: ${data.insuredDetails.phone}`, margin, yPosition);
  yPosition = addText(`Email: ${data.insuredDetails.email}`, margin, yPosition);
  yPosition = addText(`Address: ${data.insuredDetails.address}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition += 10;

  // Vehicle Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('VEHICLE DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Registration No: ${data.vehicleDetails.registrationNo}`, margin, yPosition);
  yPosition = addText(`Chassis No: ${data.vehicleDetails.chassisNo}`, margin, yPosition);
  yPosition = addText(`Engine No: ${data.vehicleDetails.engineNo}`, margin, yPosition);
  yPosition = addText(`Date of Registration: ${formatDate(data.vehicleDetails.dateOfRegistration)}`, margin, yPosition);
  yPosition = addText(`Make & Model: ${data.vehicleDetails.make} ${data.vehicleDetails.model}`, margin, yPosition);
  yPosition = addText(`Year: ${data.vehicleDetails.year}`, margin, yPosition);
  yPosition = addText(`Color: ${data.vehicleDetails.color}`, margin, yPosition);
  yPosition = addText(`Fuel Type: ${data.vehicleDetails.fuelType}`, margin, yPosition);
  yPosition += 10;

  // Insurance Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('INSURANCE DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Company: ${data.insuranceDetails.companyName}`, margin, yPosition);
  yPosition = addText(`Policy No: ${data.insuranceDetails.policyNo}`, margin, yPosition);
  yPosition = addText(`Policy Period: ${data.insuranceDetails.policyPeriod}`, margin, yPosition);
  yPosition = addText(`Premium: ${data.insuranceDetails.premiumAmount ? formatCurrency(parseFloat(data.insuranceDetails.premiumAmount)) : 'N/A'}`, margin, yPosition);
  yPosition = addText(`IDV: ${data.insuranceDetails.idv ? formatCurrency(parseFloat(data.insuranceDetails.idv)) : 'N/A'}`, margin, yPosition);
  yPosition = addText(`Deductible: ${data.insuranceDetails.deductible ? formatCurrency(parseFloat(data.insuranceDetails.deductible)) : 'N/A'}`, margin, yPosition);
  yPosition += 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Driver Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('DRIVER DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Name: ${data.driverDetails.name}`, margin, yPosition);
  yPosition = addText(`License No: ${data.driverDetails.licenseNo}`, margin, yPosition);
  yPosition = addText(`License Type: ${data.driverDetails.licenseType}`, margin, yPosition);
  yPosition = addText(`License Expiry: ${formatDate(data.driverDetails.licenseExpiry)}`, margin, yPosition);
  yPosition = addText(`Age: ${data.driverDetails.age} years`, margin, yPosition);
  yPosition = addText(`Experience: ${data.driverDetails.experience} years`, margin, yPosition);
  yPosition += 10;

  // Accident Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('ACCIDENT DETAILS', margin, yPosition);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 5;
  
  yPosition = addText(`Date: ${formatDate(data.accidentDetails.date)}`, margin, yPosition);
  yPosition = addText(`Time: ${data.accidentDetails.time}`, margin, yPosition);
  yPosition = addText(`Place: ${data.accidentDetails.place}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addText(`Cause: ${data.accidentDetails.cause}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addText(`Police Station: ${data.accidentDetails.policeStation || 'N/A'}`, margin, yPosition);
  yPosition = addText(`FIR No: ${data.accidentDetails.firNo || 'N/A'}`, margin, yPosition);
  yPosition = addText(`Weather: ${data.accidentDetails.weatherConditions || 'N/A'}`, margin, yPosition);
  yPosition = addText(`Road Conditions: ${data.accidentDetails.roadConditions || 'N/A'}`, margin, yPosition);
  yPosition += 10;

  // Damage Assessment Table
  if (data.damagedParts.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('DAMAGE ASSESSMENT', margin, yPosition);
    yPosition += 5;

    const tableData = data.damagedParts.map((part, index) => [
      (index + 1).toString(),
      part.partName,
      part.damageType,
      formatCurrency(part.partCost),
      formatCurrency(part.laborCost),
      formatCurrency(part.partCost + part.laborCost)
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['S.No.', 'Part Name', 'Damage Type', 'Part Cost', 'Labor Cost', 'Total']],
      body: tableData,
      foot: [['', '', 'TOTAL:', 
        formatCurrency(data.financialAssessment.totalPartsCost),
        formatCurrency(data.financialAssessment.totalLaborCost),
        formatCurrency(data.financialAssessment.totalAssessedCost)
      ]],
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200] },
      footStyles: { fillColor: [200, 200, 200], fontStyle: 'bold' }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Financial Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('FINANCIAL SUMMARY', margin, yPosition);
  yPosition += 5;

  doc.autoTable({
    startY: yPosition,
    body: [
      ['Total Assessed Cost:', formatCurrency(data.financialAssessment.totalAssessedCost)],
      ['Less: Compulsory Deductible:', `(${formatCurrency(data.financialAssessment.compulsoryDeductible)})`],
      ['Less: Salvage Value:', `(${formatCurrency(data.financialAssessment.salvageValue)})`],
      ['NET LIABILITY:', formatCurrency(data.financialAssessment.netLiability)]
    ],
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right', fontStyle: 'bold' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Additional Remarks
  if (data.additionalRemarks) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('ADDITIONAL REMARKS', margin, yPosition);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition += 5;
    yPosition = addText(data.additionalRemarks, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;
  }

  // Signature Section
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition += 20;
  doc.line(margin, yPosition, margin + 60, yPosition);
  doc.line(pageWidth - margin - 60, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  addText('Surveyor Signature', margin, yPosition);
  addText('Insured Signature', pageWidth - margin - 60, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  addText('Date: ___________', margin, yPosition);
  addText('Date: ___________', pageWidth - margin - 60, yPosition);

  // Footer
  yPosition += 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  addText('This report is generated electronically and is valid without signature.', pageWidth / 2, yPosition);
  addText(`Report ID: ${data.id || 'DRAFT'} | Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, pageWidth / 2, yPosition + 5);

  // Save the PDF
  const fileName = `Survey_Report_${data.vehicleDetails.registrationNo || 'Draft'}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
  doc.save(fileName);
};