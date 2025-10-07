/**
 * African Universities Registry
 * Main entry point for the application
 */

import { validateCountryData } from './scripts/validate';

export * from './types';
export { validateCountryData };

console.log('🎓 African Universities Registry - TypeScript Ready!');
console.log('📚 Use "npm run validate" to validate data files');
console.log('🔍 Use "npm run validate:all" to validate all countries');