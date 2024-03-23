const Timing = {
    STARTING_MINUTES_IN_HOUR: 0,
    ENDING_MINUTES_IN_HOUR: 59,
    STARTING_HOURS_IN_DAY: 0,
    ENDING_HOURS_IN_DAY: 23,
    STARTING_DAYS_IN_MONTH: 1,
    ENDING_DAYS_IN_MONTH: 31,
    STARTING_MONTHS_IN_YEAR: 1,
    ENDING_MONTHS_IN_YEAR: 12,
    STARTING_DAYS_IN_WEEK: 0,
    ENDING_DAYS_IN_WEEK: 6
};

const Parsers = {
    MultipleValuesParser: ',',
    StepValuesParser: '/',
    RangeValuesParser: '-',
    SingleValueParser: ''
};

module.exports = {
    Timing,
    Parsers
};