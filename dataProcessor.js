require('dotenv').config();
const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

// Load environment variables
const userName = process.env.USER_NAME;
const weeklyGoal = parseInt(process.env.WEEKLY_GOAL, 10);

/**
 * Main function that processes health and workout data files
 * Displays summary and checks if weekly goal has been met
 */
async function processFiles() {
  try {
    console.log(`Processing data for: ${userName}`);
    console.log('📁 Reading workout data...');
    
    // Call workoutCalculator function with async/await
    const workoutData = await workoutCalculator('./data/workouts.csv');
    
    console.log('📁 Reading health data...');
    
    // Call healthMetricsCounter function with async/await
    const healthEntries = await healthMetricsCounter('./data/health-metrics.json');

    // Display summary
    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
    console.log(`Health entries found: ${healthEntries}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    // Check if weekly goal has been met
    if (workoutData.totalMinutes >= weeklyGoal) {
      console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
    } else {
      const minutesRemaining = weeklyGoal - workoutData.totalMinutes;
      console.log(`⏱️ ${userName}, you need ${minutesRemaining} more minutes to reach your weekly goal.`);
    }

  } catch (error) {
    console.error(`Error processing files: ${error.message}`);
    console.error('Please ensure all required files are in place and properly formatted.');
  }
}

// Run the main program
processFiles();
