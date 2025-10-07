/**
 * TypeScript definitions for African Universities Registry data structure
 */

export interface Location {
  city: string;
  region?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Contact {
  website?: string;
  email?: string;
  phone?: string;
}

export interface Programs {
  faculties?: string[];
  specializations?: string[];
  degrees?: string[];
  languages?: string[];
}

export interface Accreditation {
  ministryRecognized: boolean;
  recognitionDate?: string;
  licenseNumber?: string;
  validUntil?: string;
}

export interface StudentInfo {
  enrollmentCapacity?: number;
  currentStudents?: number | null;
  internationalStudents?: boolean;
}

export type InstitutionType = 'public' | 'private' | 'religious' | 'international';
export type InstitutionCategory = 'university' | 'institute' | 'college' | 'school' | 'center';
export type InstitutionStatus = 'recognized' | 'provisional' | 'pending' | 'suspended';

export interface Institution {
  id: string; // Format: TG001, GH001, etc.
  name: string;
  nameLocal?: string;
  type: InstitutionType;
  category: InstitutionCategory;
  status: InstitutionStatus;
  founded?: number;
  location: Location;
  contact?: Contact;
  programs?: Programs;
  accreditation?: Accreditation;
  studentInfo?: StudentInfo;
}

export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  continent: 'Africa';
  region?: string;
  capital?: string;
  languages?: string[];
  currency?: string;
  lastUpdated: string;
  academicYear?: string;
  source?: string;
  ministry?: string;
  minister?: string;
}

export interface Statistics {
  totalInstitutions: number;
  publicInstitutions?: number;
  privateInstitutions?: number;
  universities?: number;
  schools?: number;
  institutes?: number;
  centers?: number;
  // Legacy fields for backward compatibility  
  publicUniversities?: number;
  privateUniversities?: number;
  technicalInstitutes?: number;
  researchCenters?: number;
}

export interface CountryData {
  country: Country;
  statistics: Statistics;
  institutions: Institution[];
}

export interface ValidationResult {
  success: boolean;
  errors?: string[];
  data?: CountryData;
}

export interface CountryIndex {
  name: string;
  code: string;
  file: string;
  region: string;
  status: 'active' | 'inactive' | 'draft';
  institutionsCount: number;
  lastUpdated: string;
  dataSource: string;
}

export interface RegistryIndex {
  version: string;
  lastUpdated: string;
  description: string;
  totalCountries: number;
  countries: CountryIndex[];
  regions: Record<string, string[]>;
  statistics: {
    totalInstitutions: number;
    countriesWithData: number;
    dataCoverage: string;
  };
}

export interface InstitutionStatistics {
  total: number;
  public: number;
  private: number;
  universities: number;
  institutes: number;
  schools: number;
  centers: number;
  colleges: number;
}