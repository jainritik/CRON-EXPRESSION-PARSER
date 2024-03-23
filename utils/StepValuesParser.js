const CronParser = require('./CronParser');
const { isValidField } = require('./util');

class StepValuesParser extends CronParser {
    parse(field, low, high) {
        const [start, step] = field.split('/').map(value => parseInt(value));
        let startValue = 0;
        
        // Determine the starting value based on whether it's a wildcard or a specific value
        if (field.charAt(field.indexOf("/") - 1) === '*') {
            startValue = low;
        } else {
            startValue = parseInt(field.substring(0, field.indexOf("/")));
        }

        // Validate the step value
        isValidField(step, low, high);

        const values = [];
        for (let i = startValue; i <= high; i += step) {
            values.push(i % (high + 1));
        }
        return values;
    }
}

module.exports = StepValuesParser;
