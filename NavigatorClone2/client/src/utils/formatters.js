/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} currency - The currency symbol (default: '$')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = '$') => {
  if (value === null || value === undefined) return '-';
  return `${currency}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @param {object} options - Date formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a time string
 * @param {string} timeString - The time string to format
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return '-';
  
  try {
    const date = new Date(`1970-01-01T${timeString}`);
    
    if (isNaN(date.getTime())) {
      return timeString;
    }
    
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
}; 