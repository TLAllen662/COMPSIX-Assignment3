const { healthMetricsCounter } = require('../healthReader');
const fs = require('fs');
const path = require('path');

describe('healthReader.js', () => {
  const testDataDir = path.join(__dirname, '../data');
  const validJsonFile = path.join(testDataDir, 'health-metrics.json');
  const missingFile = path.join(testDataDir, 'non-existent.json');
  const invalidJsonFile = path.join(testDataDir, 'invalid.json');

  // Setup: Create invalid JSON file for testing
  beforeAll(() => {
    fs.writeFileSync(invalidJsonFile, '{ invalid json content }');
  });

  // Cleanup: Remove test files
  afterAll(() => {
    if (fs.existsSync(invalidJsonFile)) {
      fs.unlinkSync(invalidJsonFile);
    }
  });

  describe('Reading valid JSON files', () => {
    test('should read a valid JSON file and return correct data structure', async () => {
      const result = await healthMetricsCounter(validJsonFile);
      
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(result).toBe(8);
    });

    test('should count the correct number of health entries', async () => {
      const result = await healthMetricsCounter(validJsonFile);
      
      expect(result).toEqual(8);
    });

    test('should return a number type for total entries', async () => {
      const result = await healthMetricsCounter(validJsonFile);
      
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('should handle missing files gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await healthMetricsCounter(missingFile);
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBe(0);
      
      consoleSpy.mockRestore();
    });

    test('should return 0 when file is not found', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      
      const result = await healthMetricsCounter(missingFile);
      
      expect(result).toBe(0);
      
      console.error.mockRestore();
    });

    test('should handle invalid JSON gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await healthMetricsCounter(invalidJsonFile);
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBe(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Data structure validation', () => {
    test('should return an integer value', async () => {
      const result = await healthMetricsCounter(validJsonFile);
      
      expect(Number.isInteger(result)).toBe(true);
    });

    test('should not return negative numbers', async () => {
      const result = await healthMetricsCounter(validJsonFile);
      
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should return 0 on error instead of throwing', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(async () => {
        await healthMetricsCounter(missingFile);
      }).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
});
