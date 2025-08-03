import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SurveyData } from '../types/survey';
import { format } from 'date-fns';

export const generatePDF = async (data: SurveyData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 40;
  let yPosition = 30;

  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number = 12, fontStyle: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
    return y + (fontSize * 0.8);
  };

  // Helper function to add left-aligned text
  const addText = (text: string, x: number, y: number, fontSize: number = 10, fontStyle: 'normal' | 'bold' = 'normal', maxWidth?: number) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.6));
    } else {
      doc.text(text, x, y);
      return y + (fontSize * 0.6);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString || 'N/A';
    }
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    return y + 20;
  };

  // Header Section
  yPosition = addCenteredText('MOTOR VEHICLE SURVEY REPORT', yPosition, 18, 'bold');
  yPosition = addCenteredText('Insurance Claim Assessment', yPosition + 5, 12, 'normal');
  yPosition = addCenteredText(`Report Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, yPosition + 5, 12, 'normal');
  
  // Header line
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition + 10, pageWidth - margin, yPosition + 10);
  yPosition += 25;

  // Surveyor Details Section
  yPosition = addSectionHeader('SURVEYOR DETAILS', yPosition);
  yPosition = addText(`Name: ${data.surveyorDetails.name}`, margin, yPosition, 10);
  yPosition = addText(`License No: ${data.surveyorDetails.licenseNo}`, margin, yPosition, 10);
  yPosition = addText(`Phone: ${data.surveyorDetails.phone}`, margin, yPosition, 10);
  yPosition = addText(`Email: ${data.surveyorDetails.email}`, margin, yPosition, 10);
  yPosition = addText(`Address: ${data.surveyorDetails.address}`, margin, yPosition, 10, 'normal', pageWidth - 2 * margin);
  yPosition += 15;

  // Insured Details Section
  yPosition = addSectionHeader('INSURED DETAILS', yPosition);
  yPosition = addText(`Name: ${data.insuredDetails.name}`, margin, yPosition, 10);
  yPosition = addText(`Phone: ${data.insuredDetails.phone}`, margin, yPosition, 10);
  yPosition = addText(`Email: ${data.insuredDetails.email}`, margin, yPosition, 10);
  yPosition = addText(`Address: ${data.insuredDetails.address}`, margin, yPosition, 10, 'normal', pageWidth - 2 * margin);
  yPosition += 15;

  // Vehicle Details Section
  yPosition = addSectionHeader('VEHICLE DETAILS', yPosition);
  yPosition = addText(`Registration No: ${data.vehicleDetails.registrationNo}`, margin, yPosition, 10);
  yPosition = addText(`Chassis No: ${data.vehicleDetails.chassisNo}`, margin, yPosition, 10);
  yPosition = addText(`Engine No: ${data.vehicleDetails.engineNo}`, margin, yPosition, 10);
  yPosition = addText(`Date of Registration: ${formatDate(data.vehicleDetails.dateOfRegistration)}`, margin, yPosition, 10);
  yPosition = addText(`Make & Model: ${data.vehicleDetails.make} ${data.vehicleDetails.model}`, margin, yPosition, 10);
  yPosition = addText(`Year: ${data.vehicleDetails.year}`, margin, yPosition, 10);
  yPosition = addText(`Color: ${data.vehicleDetails.color}`, margin, yPosition, 10);
  yPosition = addText(`Fuel Type: ${data.vehicleDetails.fuelType}`, margin, yPosition, 10);
  yPosition += 15;

  // Insurance Details Section
  yPosition = addSectionHeader('INSURANCE DETAILS', yPosition);
  yPosition = addText(`Company: ${data.insuranceDetails.companyName}`, margin, yPosition, 10);
  yPosition = addText(`Policy No: ${data.insuranceDetails.policyNo}`, margin, yPosition, 10);
  yPosition = addText(`Policy Period: ${data.insuranceDetails.policyPeriod}`, margin, yPosition, 10);
  yPosition = addText(`Premium: ${data.insuranceDetails.premiumAmount ? formatCurrency(parseFloat(data.insuranceDetails.premiumAmount)) : 'N/A'}`, margin, yPosition, 10);
  yPosition = addText(`IDV: ${data.insuranceDetails.idv ? formatCurrency(parseFloat(data.insuranceDetails.idv)) : 'N/A'}`, margin, yPosition, 10);
  yPosition = addText(`Deductible: ${data.insuranceDetails.deductible ? formatCurrency(parseFloat(data.insuranceDetails.deductible)) : 'N/A'}`, margin, yPosition, 10);

  // Check if we need a new page
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = 30;
  }

  yPosition += 15;

  // Driver Details Section
  yPosition = addSectionHeader('DRIVER DETAILS', yPosition);
  yPosition = addText(`Name: ${data.driverDetails.name}`, margin, yPosition, 10);
  yPosition = addText(`License No: ${data.driverDetails.licenseNo}`, margin, yPosition, 10);
  yPosition = addText(`License Type: ${data.driverDetails.licenseType}`, margin, yPosition, 10);
  yPosition = addText(`License Expiry: ${formatDate(data.driverDetails.licenseExpiry)}`, margin, yPosition, 10);
  yPosition = addText(`Age: ${data.driverDetails.age} years`, margin, yPosition, 10);
  yPosition = addText(`Experience: ${data.driverDetails.experience} years`, margin, yPosition, 10);
  yPosition += 15;

  // Accident Details Section
  yPosition = addSectionHeader('ACCIDENT DETAILS', yPosition);
  yPosition = addText(`Date: ${formatDate(data.accidentDetails.date)}`, margin, yPosition, 10);
  yPosition = addText(`Time: ${data.accidentDetails.time}`, margin, yPosition, 10);
  yPosition = addText(`Place: ${data.accidentDetails.place}`, margin, yPosition, 10, 'normal', pageWidth - 2 * margin);
  yPosition = addText(`Cause: ${data.accidentDetails.cause}`, margin, yPosition, 10, 'normal', pageWidth - 2 * margin);
  yPosition = addText(`Police Station: ${data.accidentDetails.policeStation || 'N/A'}`, margin, yPosition, 10);
  yPosition = addText(`FIR No: ${data.accidentDetails.firNo || 'N/A'}`, margin, yPosition, 10);
  yPosition = addText(`Weather: ${data.accidentDetails.weatherConditions || 'N/A'}`, margin, yPosition, 10);
  yPosition = addText(`Road Conditions: ${data.accidentDetails.roadConditions || 'N/A'}`, margin, yPosition, 10);
  yPosition += 15;

  // Damage Assessment Table
  if (data.damagedParts && data.damagedParts.length > 0) {
    // Check if we need a new page for the table
    if (yPosition > pageHeight - 150) {
      doc.addPage();
      yPosition = 30;
    }

    yPosition = addSectionHeader('DAMAGE ASSESSMENT', yPosition);

    const tableData = data.damagedParts.map((part, index) => [
      (index + 1).toString(),
      part.partName,
      part.damageType,
      formatCurrency(part.partCost),
      formatCurrency(part.laborCost),
      formatCurrency(part.partCost + part.laborCost)
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['S.No.', 'Part Name', 'Damage Type', 'Part Cost', 'Labor Cost', 'Total']],
      body: tableData,
      foot: [['', '', 'TOTAL:', 
        formatCurrency(data.financialAssessment.totalPartsCost),
        formatCurrency(data.financialAssessment.totalLaborCost),
        formatCurrency(data.financialAssessment.totalAssessedCost)
      ]],
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      footStyles: { 
        fillColor: [240, 240, 240],
        fontStyle: 'bold',
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 60 },
        2: { halign: 'center', cellWidth: 30 },
        3: { halign: 'right', cellWidth: 35 },
        4: { halign: 'right', cellWidth: 35 },
        5: { halign: 'right', cellWidth: 35 }
      },
      margin: { left: margin, right: margin }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Financial Summary
  if (yPosition > pageHeight - 120) {
    doc.addPage();
    yPosition = 30;
  }

  yPosition = addSectionHeader('FINANCIAL SUMMARY', yPosition);

  autoTable(doc, {
    startY: yPosition,
    body: [
      ['Total Assessed Cost:', formatCurrency(data.financialAssessment.totalAssessedCost)],
      ['Less: Compulsory Deductible:', `(${formatCurrency(data.financialAssessment.compulsoryDeductible)})`],
      ['Less: Salvage Value:', `(${formatCurrency(data.financialAssessment.salvageValue)})`],
      ['NET LIABILITY:', formatCurrency(data.financialAssessment.netLiability)]
    ],
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 4
    },
    columnStyles: {
      0: { 
        fontStyle: 'bold',
        halign: 'left',
        cellWidth: 120
      },
      1: { 
        halign: 'right',
        fontStyle: 'bold',
        cellWidth: 60
      }
    },
    margin: { left: margin, right: margin }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Additional Remarks
  if (data.additionalRemarks && data.additionalRemarks.trim()) {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 30;
    }
    
    yPosition = addSectionHeader('ADDITIONAL REMARKS', yPosition);
    yPosition = addText(data.additionalRemarks, margin, yPosition, 10, 'normal', pageWidth - 2 * margin);
    yPosition += 20;
  }

  // Signature Section
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = 30;
  }

  yPosition += 30;
  
  // Signature lines
  const signatureLineLength = 80;
  const leftSignatureX = margin;
  const rightSignatureX = pageWidth - margin - signatureLineLength;
  
  doc.setLineWidth(0.5);
  doc.line(leftSignatureX, yPosition, leftSignatureX + signatureLineLength, yPosition);
  doc.line(rightSignatureX, yPosition, rightSignatureX + signatureLineLength, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Surveyor Signature', leftSignatureX, yPosition);
  doc.text('Insured Signature', rightSignatureX, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ___________', leftSignatureX, yPosition);
  doc.text('Date: ___________', rightSignatureX, yPosition);

  // Footer
  yPosition = pageHeight - 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  addCenteredText('This report is generated electronically and is valid without signature.', yPosition, 8);
  addCenteredText(`Report ID: ${data.id || 'DRAFT'} | Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, yPosition + 10, 8);

  // Generate filename with registration number or fallback
  const regNo = data.vehicleDetails.registrationNo?.replace(/[^a-zA-Z0-9]/g, '') || 'Draft';
  const timestamp = format(new Date(), 'yyyyMMdd_HHmm');
  const fileName = `Survey_Report_${regNo}_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(fileName);
};