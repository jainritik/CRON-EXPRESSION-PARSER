const AllValuesParser = require('./AllValuesParser');
const MultipleValuesParser = require('./MultipleValuesParser');
const StepValuesParser = require('./StepValuesParser');
const RangeValuesParser = require('./RangeValuesParser');
const SingleValueParser = require('./SingleValueParser');

class CronParserFactory {
    createParser(parserType) {
        switch (parserType) {
            case 'AllValuesParser':
                return new AllValuesParser();
            case 'MultipleValuesParser':
                return new MultipleValuesParser();
            case 'StepValuesParser':
                return new StepValuesParser();
            case 'RangeValuesParser':
                return new RangeValuesParser();
            case 'SingleValueParser':
                return new SingleValueParser();
            default:
                throw new Error(`Invalid parser type: ${parserType}`);
        }
    }
}

module.exports = CronParserFactory;
