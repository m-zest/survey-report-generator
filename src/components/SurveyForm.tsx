import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, Calculator, Plus, Trash2, FileText } from 'lucide-react';
import { SurveyData, DamagedPart } from '../types/survey';
import { FormSection } from './FormSection';
import { DamagedPartsTable } from './DamagedPartsTable';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void;
  onSave: (data: SurveyData) => void;
  initialData?: SurveyData | null;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, onSave, initialData }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SurveyData>({
    defaultValues: initialData || {
      surveyorDetails: {
        name: '',
        licenseNo: '',
        phone: '',
        email: '',
        address: '',
      },
      insuredDetails: {
        name: '',
        address: '',
        phone: '',
        email: '',
      },
      vehicleDetails: {
        registrationNo: '',
        chassisNo: '',
        engineNo: '',
        dateOfRegistration: '',
        make: '',
        model: '',
        year: '',
        color: '',
        fuelType: '',
      },
      insuranceDetails: {
        companyName: '',
        policyNo: '',
        policyPeriod: '',
        premiumAmount: '',
        idv: '',
        deductible: '',
      },
      driverDetails: {
        name: '',
        licenseNo: '',
        licenseType: '',
        licenseExpiry: '',
        age: '',
        experience: '',
      },
      accidentDetails: {
        date: '',
        time: '',
        place: '',
        cause: '',
        policeStation: '',
        firNo: '',
        weatherConditions: '',
        roadConditions: '',
      },
      damagedParts: [],
      financialAssessment: {
        totalPartsCost: 0,
        totalLaborCost: 0,
        totalAssessedCost: 0,
        compulsoryDeductible: 0,
        salvageValue: 0,
        netLiability: 0,
      },
      additionalRemarks: '',
    }
  });

  const [damagedParts, setDamagedParts] = useState<DamagedPart[]>(initialData?.damagedParts || []);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    'Surveyor Details',
    'Insured Details', 
    'Vehicle Details',
    'Insurance Details',
    'Driver Details',
    'Accident Details',
    'Damage Assessment',
    'Financial Summary'
  ];

  // Calculate financial assessment whenever damaged parts change
  useEffect(() => {
    const totalPartsCost = damagedParts.reduce((sum, part) => sum + part.partCost, 0);
    const totalLaborCost = damagedParts.reduce((sum, part) => sum + part.laborCost, 0);
    const totalAssessedCost = totalPartsCost + totalLaborCost;
    
    const compulsoryDeductible = parseFloat(watch('insuranceDetails.deductible')) || 0;
    const salvageValue = 0; // Can be calculated based on business logic
    const netLiability = totalAssessedCost - compulsoryDeductible - salvageValue;

    setValue('financialAssessment', {
      totalPartsCost,
      totalLaborCost,
      totalAssessedCost,
      compulsoryDeductible,
      salvageValue,
      netLiability: Math.max(0, netLiability),
    });
    setValue('damagedParts', damagedParts);
  }, [damagedParts, watch('insuranceDetails.deductible'), setValue]);

  const handleFormSubmit = (data: SurveyData) => {
    onSubmit({ ...data, damagedParts });
  };

  const handleSaveForm = () => {
    const data = watch();
    onSave({ ...data, damagedParts });
  };

  const addDamagedPart = () => {
    const newPart: DamagedPart = {
      id: Date.now().toString(),
      partName: '',
      damageType: 'Replace',
      partCost: 0,
      laborCost: 0,
      total: 0,
    };
    setDamagedParts([...damagedParts, newPart]);
  };

  const updateDamagedPart = (id: string, updates: Partial<DamagedPart>) => {
    setDamagedParts(parts => 
      parts.map(part => 
        part.id === id 
          ? { ...part, ...updates, total: (updates.partCost || part.partCost) + (updates.laborCost || part.laborCost) }
          : part
      )
    );
  };

  const removeDamagedPart = (id: string) => {
    setDamagedParts(parts => parts.filter(part => part.id !== id));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <FormSection title="Surveyor Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surveyor Name *</label>
                <input
                  {...register('surveyorDetails.name', { required: 'Surveyor name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter surveyor name"
                />
                {errors.surveyorDetails?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.surveyorDetails.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                <input
                  {...register('surveyorDetails.licenseNo', { required: 'License number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter license number"
                />
                {errors.surveyorDetails?.licenseNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.surveyorDetails.licenseNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  {...register('surveyorDetails.phone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
                {errors.surveyorDetails?.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.surveyorDetails.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  {...register('surveyorDetails.email', { required: 'Email is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
                {errors.surveyorDetails?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.surveyorDetails.email.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  {...register('surveyorDetails.address', { required: 'Address is required' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address"
                />
                {errors.surveyorDetails?.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.surveyorDetails.address.message}</p>
                )}
              </div>
            </div>
          </FormSection>
        );

      case 1:
        return (
          <FormSection title="Insured Person Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insured Name *</label>
                <input
                  {...register('insuredDetails.name', { required: 'Insured name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter insured person name"
                />
                {errors.insuredDetails?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuredDetails.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  {...register('insuredDetails.phone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
                {errors.insuredDetails?.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuredDetails.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  {...register('insuredDetails.email')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  {...register('insuredDetails.address', { required: 'Address is required' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address"
                />
                {errors.insuredDetails?.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuredDetails.address.message}</p>
                )}
              </div>
            </div>
          </FormSection>
        );

      case 2:
        return (
          <FormSection title="Vehicle Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number *</label>
                <input
                  {...register('vehicleDetails.registrationNo', { required: 'Registration number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., MH12AB1234"
                />
                {errors.vehicleDetails?.registrationNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.registrationNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number *</label>
                <input
                  {...register('vehicleDetails.chassisNo', { required: 'Chassis number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter chassis number"
                />
                {errors.vehicleDetails?.chassisNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.chassisNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number *</label>
                <input
                  {...register('vehicleDetails.engineNo', { required: 'Engine number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter engine number"
                />
                {errors.vehicleDetails?.engineNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.engineNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Registration *</label>
                <input
                  type="date"
                  {...register('vehicleDetails.dateOfRegistration', { required: 'Registration date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.vehicleDetails?.dateOfRegistration && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.dateOfRegistration.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                <input
                  {...register('vehicleDetails.make', { required: 'Vehicle make is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Maruti Suzuki"
                />
                {errors.vehicleDetails?.make && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.make.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  {...register('vehicleDetails.model', { required: 'Vehicle model is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Swift VDI"
                />
                {errors.vehicleDetails?.model && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.model.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input
                  {...register('vehicleDetails.year', { required: 'Manufacturing year is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
                {errors.vehicleDetails?.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.year.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  {...register('vehicleDetails.color')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., White"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                <select
                  {...register('vehicleDetails.fuelType', { required: 'Fuel type is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.vehicleDetails?.fuelType && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicleDetails.fuelType.message}</p>
                )}
              </div>
            </div>
          </FormSection>
        );

      case 3:
        return (
          <FormSection title="Insurance Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Company Name *</label>
                <input
                  {...register('insuranceDetails.companyName', { required: 'Insurance company name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ICICI Lombard"
                />
                {errors.insuranceDetails?.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceDetails.companyName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number *</label>
                <input
                  {...register('insuranceDetails.policyNo', { required: 'Policy number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter policy number"
                />
                {errors.insuranceDetails?.policyNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceDetails.policyNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Period *</label>
                <input
                  {...register('insuranceDetails.policyPeriod', { required: 'Policy period is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 01/04/2023 to 31/03/2024"
                />
                {errors.insuranceDetails?.policyPeriod && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceDetails.policyPeriod.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Premium Amount</label>
                <input
                  type="number"
                  {...register('insuranceDetails.premiumAmount')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter premium amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IDV (Insured Declared Value) *</label>
                <input
                  type="number"
                  {...register('insuranceDetails.idv', { required: 'IDV is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter IDV amount"
                />
                {errors.insuranceDetails?.idv && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceDetails.idv.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compulsory Deductible *</label>
                <input
                  type="number"
                  {...register('insuranceDetails.deductible', { required: 'Deductible amount is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter deductible amount"
                />
                {errors.insuranceDetails?.deductible && (
                  <p className="text-red-500 text-sm mt-1">{errors.insuranceDetails.deductible.message}</p>
                )}
              </div>
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection title="Driver Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name *</label>
                <input
                  {...register('driverDetails.name', { required: 'Driver name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter driver name"
                />
                {errors.driverDetails?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverDetails.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                <input
                  {...register('driverDetails.licenseNo', { required: 'License number is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter license number"
                />
                {errors.driverDetails?.licenseNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverDetails.licenseNo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Type *</label>
                <select
                  {...register('driverDetails.licenseType', { required: 'License type is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select license type</option>
                  <option value="LMV">LMV (Light Motor Vehicle)</option>
                  <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                  <option value="MCWG">MCWG (Motorcycle with Gear)</option>
                  <option value="MCWOG">MCWOG (Motorcycle without Gear)</option>
                </select>
                {errors.driverDetails?.licenseType && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverDetails.licenseType.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date *</label>
                <input
                  type="date"
                  {...register('driverDetails.licenseExpiry', { required: 'License expiry date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.driverDetails?.licenseExpiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverDetails.licenseExpiry.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  {...register('driverDetails.age', { required: 'Driver age is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter age"
                />
                {errors.driverDetails?.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverDetails.age.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driving Experience (Years)</label>
                <input
                  type="number"
                  {...register('driverDetails.experience')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          </FormSection>
        );

      case 5:
        return (
          <FormSection title="Accident Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Accident *</label>
                <input
                  type="date"
                  {...register('accidentDetails.date', { required: 'Accident date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.accidentDetails?.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.accidentDetails.date.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time of Accident *</label>
                <input
                  type="time"
                  {...register('accidentDetails.time', { required: 'Accident time is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.accidentDetails?.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.accidentDetails.time.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Place of Accident *</label>
                <input
                  {...register('accidentDetails.place', { required: 'Accident place is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter detailed location of accident"
                />
                {errors.accidentDetails?.place && (
                  <p className="text-red-500 text-sm mt-1">{errors.accidentDetails.place.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cause of Accident *</label>
                <textarea
                  {...register('accidentDetails.cause', { required: 'Cause of accident is required' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the cause and circumstances of the accident"
                />
                {errors.accidentDetails?.cause && (
                  <p className="text-red-500 text-sm mt-1">{errors.accidentDetails.cause.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Police Station</label>
                <input
                  {...register('accidentDetails.policeStation')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter police station name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FIR Number</label>
                <input
                  {...register('accidentDetails.firNo')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter FIR number if applicable"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
                <select
                  {...register('accidentDetails.weatherConditions')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select weather conditions</option>
                  <option value="Clear">Clear</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Foggy">Foggy</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Stormy">Stormy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Road Conditions</label>
                <select
                  {...register('accidentDetails.roadConditions')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select road conditions</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Wet">Wet</option>
                </select>
              </div>
            </div>
          </FormSection>
        );

      case 6:
        return (
          <FormSection title="Damage Assessment">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Damaged Parts</h3>
                <motion.button
                  type="button"
                  onClick={addDamagedPart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Part</span>
                </motion.button>
              </div>
              
              <DamagedPartsTable
                parts={damagedParts}
                onUpdate={updateDamagedPart}
                onRemove={removeDamagedPart}
              />
            </div>
          </FormSection>
        );

      case 7:
        const financialData = watch('financialAssessment');
        return (
          <FormSection title="Financial Summary">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Parts Cost:</span>
                      <span className="font-semibold">₹{financialData?.totalPartsCost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Labor Cost:</span>
                      <span className="font-semibold">₹{financialData?.totalLaborCost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Total Assessed Cost:</span>
                      <span className="font-bold text-lg">₹{financialData?.totalAssessedCost?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compulsory Deductible:</span>
                      <span className="font-semibold text-red-600">-₹{financialData?.compulsoryDeductible?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salvage Value:</span>
                      <span className="font-semibold text-red-600">-₹{financialData?.salvageValue?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Net Liability:</span>
                      <span className="font-bold text-lg text-green-600">₹{financialData?.netLiability?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Remarks</label>
                <textarea
                  {...register('additionalRemarks')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any additional remarks or observations"
                />
              </div>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Survey Report Form</h2>
          <div className="text-sm text-gray-600">
            Step {currentSection + 1} of {sections.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => setCurrentSection(index)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                index === currentSection
                  ? 'bg-blue-600 text-white'
                  : index < currentSection
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {renderCurrentSection()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            {currentSection > 0 && (
              <motion.button
                type="button"
                onClick={prevSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={handleSaveForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </motion.button>
          </div>

          <div className="flex space-x-4">
            {currentSection < sections.length - 1 ? (
              <motion.button
                type="button"
                onClick={nextSection}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </motion.button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};