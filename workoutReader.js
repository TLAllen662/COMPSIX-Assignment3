const fs = require('fs');
const csv = require('csv-parser');

/**
 * Reads CSV workout data asynchronously and calculates statistics
 * @param {string} filePath - Path to the CSV workout file
 */
async function workoutCalculator(filePath) {
  try {
    const workouts = [];

    // Create a promise to handle the CSV parsing
    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      
      stream.on('error', (error) => {
        reject(error);
      });
      
      stream
        .pipe(csv())
        .on('data', (row) => {
          // Collect each row (workout) from the CSV
          workouts.push(row);
        })
        .on('end', () => {
          // CSV parsing completed successfully
          resolve();
        })
        .on('error', (error) => {
          // Handle stream or parsing errors
          reject(error);
        });
    });

    // Count the total number of workouts
    const totalWorkouts = workouts.length;

    // Calculate total workout minutes using a for loop
    let totalMinutes = 0;
    for (let i = 0; i < workouts.length; i++) {
      const duration = parseInt(workouts[i].duration, 10);
      if (!isNaN(duration)) {
        totalMinutes += duration;
      }
    }

    console.log(`Total workouts: ${totalWorkouts}`);
    console.log(`Total minutes: ${totalMinutes}`);

    return { totalWorkouts, totalMinutes };
  } catch (error) {
    // Handle different types of errors
    if (error.code === 'ENOENT') {
      console.error(`Error: Workout file not found at ${filePath}`);
    } else if (error.message.includes('EACCES')) {
      console.error(`Error: Permission denied reading file at ${filePath}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    return { totalWorkouts: 0, totalMinutes: 0 };
  }
}

// Export the function for use in other modules
module.exports = { workoutCalculator };

// Main execution
if (require.main === module) {
  workoutCalculator('./data/workouts.csv');
}
