const CronParser = require('./CronParser');

class SingleValueParser extends CronParser {
    parse(field, low, high) {
        const value = parseInt(field);

        // Check if the parsed value is a number and falls within the acceptable range
        if (isNaN(value) || value < low || value > high) {
            throw new Error(`Invalid value: ${field}. Value must be between ${low} and ${high}.`);
        }

        return [value];
    }
}

module.exports = SingleValueParser;
