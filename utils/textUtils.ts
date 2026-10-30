import React from 'react';

/**
 * Removes custom highlight markup from a string.
 * e.g., "[[This is highlighted|explanation|info]]" becomes "This is highlighted".
 * @param text The string containing potential highlight markup.
 * @returns The cleaned string.
 */
export const stripHighlights = (text: string): string => {
  if (!text) return '';
  // This regex matches [[highlighted text|explanation|type]] and replaces it with just the highlighted text.
  return text.replace(/\[\[(.*?)\|.+?\|(error|warning|info)\]\]/g, '$1');
};


/**
 * Renders a string with the canonical NOVARIC® registered symbol styling.
 * Applies .novaric-brand wrapper and .novaric-registered superscript (70% size, cap-height level).
 * Standard HTML pattern: <span class="novaric-brand">NOVARIC<sup aria-hidden="true" class="novaric-registered">®</sup></span>
 * Authority: NOVARIC-BRAND-CONTROL-MASTER.md §6.1 / §6.2 (amended 2026-08-20)
 *
 * @param text The string to render.
 * @param symbol The symbol to put in a superscript tag, defaults to '®'.
 * @returns A React Fragment with the formatted text.
 */
export const renderWithSuperscript = (text: string, symbol: string = '®'): React.ReactNode => {
    if (!text || !text.includes(symbol)) {
        return text;
    }
    // Using React.createElement to avoid JSX syntax in a .ts file.
    return text.split(symbol).map((part, index, arr) => {
        const match = part.match(/^(.*?)(NOVARIC)$/);
        if (match && index < arr.length - 1) {
            const prefix = match[1];
            return React.createElement(
                React.Fragment,
                { key: index },
                prefix,
                React.createElement(
                    'span',
                    { className: 'novaric-brand' },
                    'NOVARIC',
                    React.createElement('sup', { className: 'novaric-registered', 'aria-hidden': 'true' }, symbol)
                )
            );
        }
        return React.createElement(
            React.Fragment,
            { key: index },
            part,
            index < arr.length - 1 
                ? React.createElement('sup', { className: 'novaric-registered', 'aria-hidden': 'true' }, symbol) 
                : null
        );
    });
};

/**
 * Parses an Albanian date string (e.g., "16 Qershor, 2024") into an ISO 8601 string.
 * @param dateString The Albanian date string.
 * @returns An ISO 8601 formatted date string.
 */
export const parseAlbanianDateForISO = (dateString: string): string => {
    if (!dateString) return new Date().toISOString();
    
    const months: { [key: string]: string } = {
        "janar": "January", "shkurt": "February", "mars": "March", "prill": "April", "maj": "May", "qershor": "June", 
        "korrik": "July", "gusht": "August", "shtator": "September", "tetor": "October", "nëntor": "November", "dhjetor": "December"
    };
    
    const parts = dateString.toLowerCase().replace(',', '').split(' ');
    if (parts.length === 3) {
        const day = parts[0];
        const month = months[parts[1]];
        const year = parts[2];
        if (day && month && year) {
            const parsedDate = new Date(`${month} ${day}, ${year}`);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString();
            }
        }
    }
    
    // Fallback for other formats Date can parse
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
    }

    return new Date().toISOString(); // Final fallback
};

/**
 * Parses an Albanian date string (e.g., "Qershor 2024") into an ISO 8601 format (YYYY-MM).
 * @param dateString The Albanian date string.
 * @returns An ISO 8601 formatted date string (YYYY-MM).
 */
export const parseAlbanianMonthYearForISO = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().substring(0, 7);
    
    const months: { [key: string]: string } = {
        "janar": "01", "shkurt": "02", "mars": "03", "prill": "04", "maj": "05", "qershor": "06", 
        "korrik": "07", "gusht": "08", "shtator": "09", "tetor": "10", "nëntor": "11", "dhjetor": "12"
    };
    
    const parts = dateString.toLowerCase().replace(',', '').split(' ');
    if (parts.length === 2) {
        const month = months[parts[0]];
        const year = parts[1];
        if (month && year) {
            return `${year}-${month}`;
        }
    }
    
    const d = new Date();
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
};

/**
 * Parses an Albanian date string (e.g., "16 Qershor, 2024") into a Date object.
 * @param dateString The Albanian date string.
 * @returns A Date object, or null if parsing fails.
 */
export const parseAlbanianDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const months: { [key: string]: number } = {
    "janar": 0, "shkurt": 1, "mars": 2, "prill": 3, "maj": 4, "qershor": 5,
    "korrik": 6, "gusht": 7, "shtator": 8, "tetor": 9, "nëntor": 10, "dhjetor": 11
  };
  const parts = dateString.toLowerCase().replace(',', '').split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0); // Normalize to start of day for consistent comparison
      return date;
    }
  }
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  }
  return null;
};

/**
 * Formats a Date object to a 'YYYY-MM-DD' string.
 * @param date The Date object to format.
 * @returns A string in 'YYYY-MM-DD' format.
 */
export const formatDateToYyyyMmDd = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};