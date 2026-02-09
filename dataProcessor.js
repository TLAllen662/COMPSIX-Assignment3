require('dotenv').config();
const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

/**
 * Main program that integrates health and workout data processing
 * Reads environment variables from .env file
 */
async function main() {
  try {
    // Load environment variables
    const userName = process.env.USER_NAME;
    const weeklyGoal = process.env.WEEKLY_GOAL;

    console.log('=== Data Processor ===');
    console.log(`User: ${userName}`);
    console.log(`Weekly Workout Goal: ${weeklyGoal} minutes\n`);

    // Process health metrics
    console.log('--- Health Metrics ---');
    const healthCount = await healthMetricsCounter('./data/health-metrics.json');

    // Process workout data
    console.log('\n--- Workout Data ---');
    const workoutData = await workoutCalculator('./data/workouts.csv');

    // Calculate progress towards weekly goal
    console.log('\n--- Weekly Summary ---');
    const weeklyProgress = Math.round((workoutData.totalMinutes / weeklyGoal) * 100);
    console.log(`Progress towards goal: ${weeklyProgress}%`);
    console.log(`Minutes remaining: ${Math.max(0, weeklyGoal - workoutData.totalMinutes)} minutes`);

  } catch (error) {
    console.error('Error in data processor:', error.message);
  }
}

// Run the main program
main();
