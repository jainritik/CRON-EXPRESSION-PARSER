const CronService = require('../services/cronService');

describe('CronService', () => {
    describe('parseCronExpression', () => {
        it('should throw an error if there are less than 6 fields in the given string', () => {
            const invalidCronString = '1 2 3 4';
            const cronService = new CronService();
            
            expect(() => cronService.parseCronExpression(invalidCronString))
                .toThrowError(Error, 'Invalid cron expression: The expression must contain 6 fields.');
        });

        it('should throw an error if any character is not a number in the first 5 fields', () => {
            const invalidCronString = '1 a 3 4 5 6';
            const cronService = new CronService();
            
            expect(() => cronService.parseCronExpression(invalidCronString))
                .toThrowError(Error, 'Invalid cron expression: All values in the first 5 fields must be numbers or *,-/.');
        });

        it('should throw an error if there is a range exceeding the maximum value', () => {
            const invalidCronString = '1 2 3 13-14 5 6';
            const cronService = new CronService();
            
            expect(() => cronService.parseCronExpression(invalidCronString))
                .toThrowError(Error, 'Invalid cron expression: Range values must be within the valid range.');
        });

        it('should handle steps and other symbols in the same field', () => {
            const validCronString = '1/2,3 2 3 4 5 6';
            const cronService = new CronService();
            
            expect(() => cronService.parseCronExpression(validCronString)).not.toThrow();
        });
        it('should handle a valid cron expression with steps and other symbols', () => {
            // Arrange
            const validCronString = '*/15 0 1,15 * 1-5 /usr/bin/find';
            const cronService = new CronService();
            
            // Act & Assert
            expect(() => cronService.parseCronExpression(validCronString)).not.toThrow();
        });
        it('should handle when we have all * expression with steps and other symbols', () => {
            // Arrange
            const validCronString = '* * * * * /usr/bin/find';
            const cronService = new CronService();
            
            // Act & Assert
            expect(() => cronService.parseCronExpression(validCronString)).not.toThrow();
        });
    });
});
