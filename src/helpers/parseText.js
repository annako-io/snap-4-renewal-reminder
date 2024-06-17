type DateString = string;

type PropType = RecordResult;
export interface RecordResult {
  exp?:  DateString, // expDate
  renew?: DateString, // renewDate
  renewNow?: boolean, // true
  startRenewISO?: DateString, // convertToISOStringWithHour(renewDate, 9),
  endRenewISO?: DateString, // convertToISOStringWithHour(renewDate, 10),
}

const CalModal = ({ value }: PropType) => {}

export const parseText = (text) => {
  let expDate = '';
  let renewDate = '';
  let renewNow = false;
  let noExpDateExtracted = null;
  const dates = {};

  // console.log('text data: ', text);
  const rows = text.split('\n').map(row => row.split('\t').join(''));
  // console.log('rows: ', rows);
  for (let i = 0; i < rows.length; i++) {
    // expiration date
    const expCheck = /(ex|exp|xp)/g;
    if (expCheck.test(rows[i])) {
      // console.log('String includes "ex" or "exp".');
      expDate = findDate(rows[i]);
      continue;
    }

    // Find any dates
    if (hasDate(rows[i])) {
      dates[i] = findDate(rows[i]);
    }
  }

  if (!expDate) {
    if (Object.keys(dates).length === 0) {
      noExpDateExtracted = true;
      const noRecord = {
        noExpDate: noExpDateExtracted
      };
      return noRecord;
    }
    expDate = findLatestDate(Object.values(dates));

    // recommended renewal date
    renewDate = subtractTwoMonths(expDate);
    if (isBeforeToday(renewDate)) {
      renewDate = formatDate(new Date());
      renewNow = true;
    }

    // full record
    const record = {
      exp: expDate,
      renew: renewDate,
      renewNow: true,
      startRenewISO: convertToISOStringWithHour(renewDate, 9),
      endRenewISO: convertToISOStringWithHour(renewDate, 10),
    };
    console.log(record);
    return record;
  }
};

// Helper function to find a date
const findDate = (str) => {
  // matches dates in the format MM/DD/YYYY & MMDDYYYY
  const aDate = /(?:(0[1-9]|1[0-2])(\/)?(0[1-9]|[12][0-9]|3[01])\/?\d{4})|(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{4}/;
  const match = str.match(aDate);
  if (match) {
    const date = match[0];
    if (date.length === 8) {
      return date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    } else if (date.length === 10) {
      return date;
    }
  }
  return 'No date';
};

// Helper to check if there is a date substring
const hasDate = (str) => {
  // Regular expression to match MM/DD/YYYY format
  const regex = /\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}\b/;
  return regex.test(str);
}

// Helper function to check for latest date
const findLatestDate = (dates) => {
  // Find the maximum date string among the array of dates
  const latestDate = dates.reduce((latest, current) => {
    // Convert dates to a format that can be compared
    const latestParts = latest.split('/').reverse().join('');
    const currentParts = current.split('/').reverse().join('');

    // Compare dates as strings
    return latestParts > currentParts ? latest : current;
  });

  return latestDate;
}

// Helper function to get date of 2 months before expiration date
const subtractTwoMonths = (dateString) => {
  // Parse the given date string into a Date object
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  const originalDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object

  // Subtract 2 months from the date
  const modifiedDate = new Date(originalDate);
  modifiedDate.setMonth(modifiedDate.getMonth() - 2);

  // Format the resulting date back into MM/DD/YYYY format
  const formattedMonth = modifiedDate.getMonth() + 1; // Adding 1 because months are 0-indexed
  const formattedDay = modifiedDate.getDate();
  const formattedYear = modifiedDate.getFullYear();
  const formattedDate = `${formattedMonth}/${formattedDay}/${formattedYear}`;

  return formattedDate;
}

// Helper function to check if today's date is after than renewal date
const isBeforeToday = (dateString) => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

  // Parse the given date string into a Date object
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  const targetDate = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object

  // Compare today's date with the parsed date
  return targetDate < today;
}

// Helper function to format date for user
const formatDate = (date) => {
  // Get the components of the date
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());

  // Construct the formatted date string in MM/DD/YYYY format
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
}

// Helper function to set default time
const convertToISOStringWithHour = (dateString, hour) => {
  // Split the date string into components
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Create a new Date object with the parsed components
  const date = new Date(year, month - 1, day); // Month is 0-based in Date object

  // Set the desired hour
  date.setHours(hour, 0, 0, 0);

  // Return the ISO string representation
  return date.toISOString();
};

// export default parseText;