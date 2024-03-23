const CronParserFactory = require('../utils/CronParserFactory');
const { Parsers, Timing } = require('../utils/Constants');
const CronExpression = require('../models/CronExpression');
const { isValidCharacters } = require('../utils/util');
const { getActualDatesInMonth } = require('../utils/dateUtils');

class CronService {
    constructor() {
        this.parserFactory = new CronParserFactory();
    }

    parseCronExpression(cronString) {
        const [minute, hour, dayOfMonth, month, dayOfWeek, command] = cronString.split(/\s+/);

        // Validate input fields to ensure they contain only numeric characters, '*', '/', '-', ','
        if (!isValidCharacters(minute) || !isValidCharacters(hour) || !isValidCharacters(dayOfMonth) || !isValidCharacters(month) || !isValidCharacters(dayOfWeek)) {
            throw new Error('Invalid input.');
        }

        const parsedValues = {
            'minute': this.parseField(minute, Parsers, Timing.STARTING_MINUTES_IN_HOUR, Timing.ENDING_MINUTES_IN_HOUR),
            'hour': this.parseField(hour, Parsers, Timing.STARTING_HOURS_IN_DAY, Timing.ENDING_HOURS_IN_DAY),
            'dayOfMonth': this.parseField(dayOfMonth, Parsers, Timing.STARTING_DAYS_IN_MONTH, Timing.ENDING_DAYS_IN_MONTH),
            'month': this.parseField(month, Parsers, Timing.STARTING_MONTHS_IN_YEAR, Timing.ENDING_MONTHS_IN_YEAR),
            'dayOfWeek': this.parseField(dayOfWeek, Parsers, Timing.STARTING_DAYS_IN_WEEK, Timing.ENDING_DAYS_IN_WEEK),
            'command': command
        };

        // Get actual dates in the month for the dayOfMonth field
        getActualDatesInMonth(parsedValues.dayOfMonth);

        return new CronExpression(parsedValues.minute, parsedValues.hour, parsedValues.dayOfMonth, parsedValues.month, parsedValues.dayOfWeek, parsedValues.command);
    }

    parseField(field, parsers, min, max) {
        if (field === '*') {
            const parser = this.parserFactory.createParser('AllValuesParser');
            return parser.parse(field, min, max);
        }
        for (const type in parsers) {
            if (field.includes(parsers[type])) {
                const parser = this.parserFactory.createParser(type);
                return parser.parse(field, min, max);
            }
        }
        return [];
    }

    formatOutput(cronExpression) {
        let output = '';
        output += `Minute:        ${cronExpression.minute.join(' ')}\n`;
        output += `Hour:          ${cronExpression.hour.join(' ')}\n`;
        output += `Day of Month:  ${cronExpression.dayOfMonth.join(' ')}\n`;
        output += `Month:         ${cronExpression.month.join(' ')}\n`;
        output += `Day of Week:   ${cronExpression.dayOfWeek.join(' ')}\n`;
        output += `Command:       ${cronExpression.command}\n`;
        return output;
    }
}

module.exports = CronService;
