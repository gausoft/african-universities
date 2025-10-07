/**
 * Data transformation utilities for converting between JSON (snake_case) and TypeScript (camelCase)
 */

import type { CountryData } from '../types';

/**
 * Convert snake_case string to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert object keys from snake_case to camelCase recursively
 */
export function keysToCamelCase<T = any>(obj: any): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(keysToCamelCase) as T;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = typeof value === 'object' ? keysToCamelCase(value) : value;
  }

  return result;
}

/**
 * Convert object keys from camelCase to snake_case recursively
 */
export function keysToSnakeCase<T = any>(obj: any): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase) as T;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = typeof value === 'object' ? keysToSnakeCase(value) : value;
  }

  return result;
}

/**
 * Transform JSON data (snake_case) to TypeScript format (camelCase)
 */
export function transformFromJson(jsonData: any): CountryData {
  return keysToCamelCase<CountryData>(jsonData);
}

/**
 * Transform TypeScript data (camelCase) to JSON format (snake_case)
 */
export function transformToJson(data: CountryData): any {
  return keysToSnakeCase(data);
}

/**
 * Validate and transform a raw JSON object to CountryData
 */
export function parseCountryData(rawData: any): CountryData {
  // Transform keys to camelCase
  const transformedData = transformFromJson(rawData);
  
  // You could add additional validation here if needed
  return transformedData;
}