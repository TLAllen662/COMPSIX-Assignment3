const fs = require('fs');

/**
 * Counts the total number of health entries from a JSON health metrics file
 * @param {string} filePath - Path to the health metrics JSON file
 */
async function healthMetricsCounter(filePath) {
  try {
    // Read the JSON file asynchronously
    const data = await fs.promises.readFile(filePath, 'utf8');
    
    // Parse the JSON data
    const healthData = JSON.parse(data);
    
    // Count the total number of health entries
    const totalEntries = healthData.metrics ? healthData.metrics.length : 0;
    
    console.log(`Total health entries: ${totalEntries}`);
    return totalEntries;
  } catch (error) {
    // Handle different types of errors
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found at ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON format in ${filePath}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    return 0;
  }
}

// Export the function for use in other modules
module.exports = { healthMetricsCounter };

// Main execution
if (require.main === module) {
  healthMetricsCounter('./data/health-metrics.json');
}
