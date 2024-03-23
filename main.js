const CronService = require('./services/cronService');

const cronString = process.argv[2];

if (!cronString || cronString.split(/\s+/).length !== 6) {
  throw new Error('Invalid cron string. Please provide a valid cron string with 6 fields separated by spaces.');
}
const cronService = new CronService();
try {
  const cronExpression = cronService.parseCronExpression(cronString);
  const formattedOutput = cronService.formatOutput(cronExpression);
  console.log(formattedOutput);
} catch (error) {
  console.error('Error parsing cron expression:', error.message);
  process.exit(1);
}

