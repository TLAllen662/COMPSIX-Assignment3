const { workoutCalculator } = require('../workoutReader');
const fs = require('fs');
const path = require('path');

describe('workoutReader.js', () => {
  const testDataDir = path.join(__dirname, '../data');
  const validCsvFile = path.join(testDataDir, 'workouts.csv');
  const missingFile = path.join(testDataDir, 'non-existent.csv');
  const invalidCsvFile = path.join(testDataDir, 'invalid.csv');

  // Setup: Create invalid CSV file for testing
  beforeAll(() => {
    fs.writeFileSync(invalidCsvFile, 'invalid,csv,data\n\x00\xFF');
  });

  // Cleanup: Remove test files
  afterAll(() => {
    if (fs.existsSync(invalidCsvFile)) {
      fs.unlinkSync(invalidCsvFile);
    }
  });

  describe('Reading valid CSV files', () => {
    test('should read a valid CSV file and return an object', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });

    test('should return correct data structure with totalWorkouts and totalMinutes', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(result).toHaveProperty('totalWorkouts');
      expect(result).toHaveProperty('totalMinutes');
    });

    test('should count the correct number of workouts', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(result.totalWorkouts).toBe(10);
    });

    test('should calculate the correct total minutes', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(result.totalMinutes).toBe(330);
    });

    test('should return numeric values for both properties', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(typeof result.totalWorkouts).toBe('number');
      expect(typeof result.totalMinutes).toBe('number');
      expect(Number.isInteger(result.totalWorkouts)).toBe(true);
      expect(Number.isInteger(result.totalMinutes)).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('should handle missing files gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await workoutCalculator(missingFile);
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(result.totalWorkouts).toBe(0);
      expect(result.totalMinutes).toBe(0);
      
      consoleSpy.mockRestore();
    });

    test('should return default values when file is not found', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      
      const result = await workoutCalculator(missingFile);
      
      expect(result).toEqual({ totalWorkouts: 0, totalMinutes: 0 });
      
      console.error.mockRestore();
    });

    test('should not throw an error when file is missing', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      
      expect(async () => {
        await workoutCalculator(missingFile);
      }).not.toThrow();
      
      console.error.mockRestore();
    });
  });

  describe('Data structure validation', () => {
    test('should always return an object with both properties', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      
      const validResult = await workoutCalculator(validCsvFile);
      const errorResult = await workoutCalculator(missingFile);
      
      expect(validResult).toHaveProperty('totalWorkouts');
      expect(validResult).toHaveProperty('totalMinutes');
      expect(errorResult).toHaveProperty('totalWorkouts');
      expect(errorResult).toHaveProperty('totalMinutes');
      
      console.error.mockRestore();
    });

    test('should not return negative numbers', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(result.totalWorkouts).toBeGreaterThanOrEqual(0);
      expect(result.totalMinutes).toBeGreaterThanOrEqual(0);
    });

    test('should return integers, not floats', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(Number.isInteger(result.totalWorkouts)).toBe(true);
      expect(Number.isInteger(result.totalMinutes)).toBe(true);
    });

    test('totalMinutes should be greater than or equal to 0', async () => {
      const result = await workoutCalculator(validCsvFile);
      
      expect(result.totalMinutes).toBeGreaterThan(0);
    });
  });
});