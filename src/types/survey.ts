export interface InsuredDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface VehicleDetails {
  registrationNo: string;
  chassisNo: string;
  engineNo: string;
  dateOfRegistration: string;
  make: string;
  model: string;
  year: string;
  color: string;
  fuelType: string;
}

export interface InsuranceDetails {
  companyName: string;
  policyNo: string;
  policyPeriod: string;
  premiumAmount: string;
  idv: string;
  deductible: string;
}

export interface DriverDetails {
  name: string;
  licenseNo: string;
  licenseType: string;
  licenseExpiry: string;
  age: string;
  experience: string;
}

export interface AccidentDetails {
  date: string;
  time: string;
  place: string;
  cause: string;
  policeStation: string;
  firNo: string;
  weatherConditions: string;
  roadConditions: string;
}

export interface DamagedPart {
  id: string;
  partName: string;
  damageType: 'Replace' | 'Repair';
  partCost: number;
  laborCost: number;
  total: number;
}

export interface FinancialAssessment {
  totalPartsCost: number;
  totalLaborCost: number;
  totalAssessedCost: number;
  compulsoryDeductible: number;
  salvageValue: number;
  netLiability: number;
}

export interface SurveyorDetails {
  name: string;
  licenseNo: string;
  phone: string;
  email: string;
  address: string;
}

export interface SurveyData {
  id?: string;
  createdAt?: string;
  surveyorDetails: SurveyorDetails;
  insuredDetails: InsuredDetails;
  vehicleDetails: VehicleDetails;
  insuranceDetails: InsuranceDetails;
  driverDetails: DriverDetails;
  accidentDetails: AccidentDetails;
  damagedParts: DamagedPart[];
  financialAssessment: FinancialAssessment;
  additionalRemarks: string;
}