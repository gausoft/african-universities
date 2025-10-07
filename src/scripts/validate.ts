#!/usr/bin/env tsx

/**
 * AUR (African Universities Registry) Data Validation Script
 * TypeScript implementation with Zod schema validation
 * Usage: tsx validate.ts [file.json] or npm run validate
 */

import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type {
    CountryData,
    InstitutionStatistics,
    ValidationResult
} from '../types';

// Zod schemas for runtime validation
const LocationSchema = z.object({
  city: z.string().min(1, "City is required"),
  region: z.string().optional(),
  address: z.string().optional(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
});

const ContactSchema = z.object({
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

const ProgramsSchema = z.object({
  faculties: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  degrees: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional()
});

const AccreditationSchema = z.object({
  ministryRecognized: z.boolean(),
  recognitionDate: z.string().optional(),
  licenseNumber: z.string().optional(),
  validUntil: z.string().optional()
});

const StudentInfoSchema = z.object({
  enrollmentCapacity: z.number().min(0).optional(),
  currentStudents: z.number().min(0).nullable().optional(),
  internationalStudents: z.boolean().optional()
});

const InstitutionTypeEnum = z.enum(['public', 'private', 'religious', 'international']);
const InstitutionCategoryEnum = z.enum(['university', 'institute', 'college', 'school', 'center']);
const InstitutionStatusEnum = z.enum(['recognized', 'provisional', 'pending', 'suspended']);

const InstitutionSchema = z.object({
  id: z.string().regex(/^[A-Z]{2}[0-9]{3,}$/, "ID must be country code + numbers (e.g., TG001)"),
  name: z.string().min(1, "Institution name is required"),
  nameLocal: z.string().optional(),
  type: InstitutionTypeEnum,
  category: InstitutionCategoryEnum,
  status: InstitutionStatusEnum,
  founded: z.number().min(1800).max(new Date().getFullYear()).optional(),
  location: LocationSchema,
  contact: ContactSchema.optional(),
  programs: ProgramsSchema.optional(),
  accreditation: AccreditationSchema.optional(),
  studentInfo: StudentInfoSchema.optional()
});

const CountrySchema = z.object({
  name: z.string().min(1, "Country name is required"),
  code: z.string().regex(/^[A-Z]{2}$/, "Country code must be 2 uppercase letters"),
  continent: z.literal("Africa"),
  region: z.string().optional(),
  capital: z.string().optional(),
  languages: z.array(z.string()).optional(),
  currency: z.string().optional(),
  lastUpdated: z.string().min(1, "Last updated date is required"),
  academicYear: z.string().optional(),
  source: z.string().url().optional(),
  ministry: z.string().optional(),
  minister: z.string().optional()
});

const StatisticsSchema = z.object({
  totalInstitutions: z.number().min(0),
  publicInstitutions: z.number().min(0).optional(),
  privateInstitutions: z.number().min(0).optional(),
  universities: z.number().min(0).optional(),
  schools: z.number().min(0).optional(),
  institutes: z.number().min(0).optional(),
  centers: z.number().min(0).optional(),
  // Legacy fields for backward compatibility
  publicUniversities: z.number().min(0).optional(),
  privateUniversities: z.number().min(0).optional(),
  technicalInstitutes: z.number().min(0).optional(),
  researchCenters: z.number().min(0).optional()
});

const CountryDataSchema = z.object({
  country: CountrySchema,
  statistics: StatisticsSchema,
  institutions: z.array(InstitutionSchema)
}).refine((data) => {
  // Validate that all institution IDs start with the country code
  const countryCode = data.country.code;
  return data.institutions.every(inst => inst.id.startsWith(countryCode));
}, {
  message: "All institution IDs must start with the country code",
  path: ["institutions"]
});

/**
 * Calculate statistics from institutions array
 */
function calculateStatistics(institutions: any[]): InstitutionStatistics {
  return {
    total: institutions.length,
    public: institutions.filter(i => i.type === 'public').length,
    private: institutions.filter(i => i.type === 'private').length,
    universities: institutions.filter(i => i.category === 'university').length,
    institutes: institutions.filter(i => i.category === 'institute').length,
    schools: institutions.filter(i => i.category === 'school').length,
    centers: institutions.filter(i => i.category === 'center').length,
    colleges: institutions.filter(i => i.category === 'college').length
  };
}

/**
 * Validate country data using Zod schema
 */
function validateCountryData(filePath: string): ValidationResult {
  try {
    // Read and parse JSON file
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    // Validate against schema
    const result = CountryDataSchema.safeParse(data);

    if (result.success) {
      console.log(`✅ ${path.basename(filePath)}: Validation successful`);
      console.log(`   📊 ${result.data.institutions.length} institutions`);
      console.log(`   🏛️ ${result.data.country.name} (${result.data.country.code})`);
      
      // Display institution breakdown
      const stats = calculateStatistics(result.data.institutions);
      console.log(`   📈 ${stats.public} public, ${stats.private} private`);
      console.log(`   🎓 ${stats.universities} universities, ${stats.institutes} institutes, ${stats.schools} schools`);
      
      return {
        success: true,
        data: result.data as CountryData
      };
    } else {
      console.log(`❌ ${path.basename(filePath)}: Validation failed`);
      console.log('Errors found:');
      
      const errors = result.error.issues.map((error: any, index: number) => {
        const errorPath = error.path.length > 0 ? ` at ${error.path.join('.')}` : '';
        const errorMessage = `${index + 1}. ${error.message}${errorPath}`;
        console.log(`   ${errorMessage}`);
        return errorMessage;
      });
      
      return {
        success: false,
        errors
      };
    }

  } catch (error) {
    const errorMessage = `Error processing ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.log(`❌ ${errorMessage}`);
    return {
      success: false,
      errors: [errorMessage]
    };
  }
}

/**
 * Get the data directory path
 */
function getDataDirectory(): string {
  // Navigate from src/scripts to data/countries
  return path.join(__dirname, '../../data/countries');
}

/**
 * Main function
 */
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--all')) {
    // Validate all files in the countries directory
    const countriesDir = getDataDirectory();
    
    if (!fs.existsSync(countriesDir)) {
      console.log('❌ Countries directory not found at:', countriesDir);
      process.exit(1);
    }
    
    const files = fs.readdirSync(countriesDir)
      .filter(f => f.endsWith('.json') && !f.endsWith('.backup.json'))
      .sort();
    
    if (files.length === 0) {
      console.log('⚠️  No JSON files found in countries directory');
      process.exit(0);
    }
    
    console.log(`🔍 Validating ${files.length} file(s) with TypeScript + Zod...\n`);
    
    let allValid = true;
    const results: ValidationResult[] = [];
    
    files.forEach(file => {
      const filePath = path.join(countriesDir, file);
      const result = validateCountryData(filePath);
      results.push(result);
      
      if (!result.success) {
        allValid = false;
      }
      console.log(); // Empty line between files
    });
    
    // Summary
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 Summary: ${successCount}/${files.length} files passed validation`);
    console.log(`${allValid ? '✅' : '❌'} Overall validation ${allValid ? 'successful' : 'failed'}`);
    
    process.exit(allValid ? 0 : 1);
    
  } else {
    // Validate the specified file
    const fileName = args[0];
    const filePath = path.isAbsolute(fileName) 
      ? fileName 
      : path.join(getDataDirectory(), fileName);
    
    const result = validateCountryData(filePath);
    process.exit(result.success ? 0 : 1);
  }
}

// Export for potential use as module
export {
    calculateStatistics, CountryDataSchema,
    InstitutionSchema, validateCountryData
};

// Run if called directly
if (require.main === module) {
  main();
}