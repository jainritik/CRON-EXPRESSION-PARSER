// Function to get the number of days in a month
const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

// Function to get the actual dates in the month for the dayOfMonth field
const getActualDatesInMonth = (dayOfMonthArr) => {
    // Get the current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // January is month 1

    const daysToRemove = [];

    // Check for dates exceeding the number of days in the current month
    dayOfMonthArr.forEach(day => {
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        if (day > daysInCurrentMonth) {
            daysToRemove.push(day);
        }
    });

    // Remove the invalid dates from the array
    daysToRemove.forEach(dayToRemove => {
        const indexToRemove = dayOfMonthArr.indexOf(dayToRemove);
        if (indexToRemove !== -1) {
            dayOfMonthArr.splice(indexToRemove, 1);
        }
    });
};

module.exports = {
    getActualDatesInMonth
};
