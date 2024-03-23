const CronParser = require('./CronParser');
const { isValidField } = require('./util');

class RangeValuesParser extends CronParser {
    parse(field, low, high) {
        const [start, end] = field.split('-').map(value => parseInt(value));
        
        if(start > end) {
            throw new Error('Invalid Range');
        }
        // Value isValidField
        isValidField(start,low, high);
        isValidField(end, low, high);

        const values = [];
        for (let i = start; i <= end; i++) {
            values.push(i % (high + 1));
        }
        return values;
    }
}

module.exports = RangeValuesParser;
