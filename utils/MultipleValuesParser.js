const RangeValuesParser = require('./RangeValuesParser');
const StepValuesParser = require('./StepValuesParser');
const AllValuesParser = require('./AllValuesParser');
const CronParser = require('./CronParser');
const { isValidField } = require('./util');

class MultipleValuesParser extends CronParser {
    parse(field, low, high) {

        // Check if the field contains the '*' wildcard
        if (field.includes('*')) {
            // If '*' is present, return all valid values from low to high
            const allValuesParser = new AllValuesParser();
            return allValuesParser.parse(field, low, high);
        }
        const segments = field.split(',');

        const values = segments.flatMap(segment => {
            if (segment.includes('-')) {
                // If the segment contains a range
                const rangeParser = new RangeValuesParser();
                return rangeParser.parse(segment, low, high);
            } else if (segment.includes('/')) {
                // Handle step values
                const stepParser = new StepValuesParser();
                return stepParser.parse(segment, low, high);
            } else {
                const parsedValue = parseInt(segment);
                isValidField(parsedValue, low, high);
                return [parsedValue];
            }
        });

        return values.filter(value => value >= low && value <= high);
    }
}

module.exports = MultipleValuesParser;
