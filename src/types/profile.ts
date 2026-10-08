export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type EducationLevel = 
  | '10th'
  | '12th'
  | 'Diploma'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Doctorate';

export type IndianState = 
  | 'All India'
  | 'Andhra Pradesh'
  | 'Arunachal Pradesh'
  | 'Assam'
  | 'Bihar'
  | 'Chhattisgarh'
  | 'Goa'
  | 'Gujarat'
  | 'Haryana'
  | 'Himachal Pradesh'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Kerala'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Odisha'
  | 'Punjab'
  | 'Rajasthan'
  | 'Sikkim'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Tripura'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'West Bengal'
  | 'Delhi (NCT)';

export interface PhysicalMeasurements {
  heightCm?: number;
  chestCm?: number;
  chestExpandedCm?: number;
  visionStandard?: '6/6' | '6/9' | '6/12' | 'other';
  colorBlindness?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  state: IndianState;
  category: SocialCategory;
  isPwd: boolean;
  pwdPercentage?: number;
  
  // Education
  educationLevel: EducationLevel;
  degreeName?: string;
  stream?: string; // e.g. Engineering, Arts, Science, Commerce
  currentYear?: number;
  passingYear?: number;
  percentageScore?: number;
  
  // Optional progressive welfare criteria (collected only when scheme requires)
  annualFamilyIncome?: number; // In INR e.g. 250000
  gender?: 'Male' | 'Female' | 'Other';
  occupation?: 'Student' | 'Unemployed' | 'Employed' | 'Farmer' | 'Self-employed';
  maritalStatus?: 'Single' | 'Married' | 'Widowed';
  areaType?: 'Rural' | 'Urban';
  
  // Physical measurements for physical requirement checks
  physicalMeasurements?: PhysicalMeasurements;
  
  // Metadata
  isOnboarded: boolean;
  primaryIntent?: 'exams' | 'schemes' | 'both';
  savedOpportunityIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'guest-profile-local',
  name: '',
  age: 21,
  state: 'Madhya Pradesh',
  category: 'General',
  isPwd: false,
  educationLevel: 'Undergraduate',
  degreeName: 'B.Tech (Bachelor of Technology)',
  stream: 'Engineering',
  currentYear: 3,
  passingYear: 2026,
  savedOpportunityIds: [],
  isOnboarded: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
