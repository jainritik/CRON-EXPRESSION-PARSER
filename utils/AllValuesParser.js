const CronParser = require('./CronParser');

class AllValuesParser extends CronParser {
    parse(field, low, high) {
        return Array.from({ length: high - low + 1 }, (_, index) => low + index);
    }
}

module.exports = AllValuesParser;
