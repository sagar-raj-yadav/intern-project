// utils.js

// Function to validate date
const isValidDate = (date) => {
    return !isNaN(new Date(date).getTime());
};

module.exports = { isValidDate };
