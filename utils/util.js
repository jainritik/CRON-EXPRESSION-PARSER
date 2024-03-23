function isValidField(field, min, max) {
    if (field === '*') {
        return true;
    }
    const value = parseInt(field);
    if (!isNaN(value) && value >= min && value <= max) {
        return true;
    } else {
        throw new Error(`Invalid value: ${field}. Value must be between ${min} and ${max}.`);
    }
}

function isValidCharacters(field) {
    if (!/^[\d*,-/]+$/.test(field)) {
        throw new Error(`Invalid characters in field: ${field}`);
    }
    return true;
} 

module.exports = {
    isValidField,
    isValidCharacters
};
