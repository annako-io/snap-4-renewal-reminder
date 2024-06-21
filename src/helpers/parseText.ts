type DateString = string;

interface DateObject {
  [index: number]: string;
}

export interface RecordResultType {
  exp?: DateString;
  renew?: DateString;
  renewNow?: boolean;
  startRenewISO?: DateString;
  endRenewISO?: DateString;
}

export type ParseTextReturnType = RecordResultType | { noExpDate: boolean } | undefined;

export const parseText = (text: string): ParseTextReturnType => {
  let expDate = '';
  let renewDate = '';
  let renewNow = false;
  let noExpDateExtracted = null;
  const dates: DateObject = {};

  // console.log('text data: ', text);
  const rows: string[] = text.split('\n').map(row => row.replace('\t/g', ''));
  // console.log('rows: ', rows);
  for (const row of rows) {
    // Check expiration date
    const expCheck: RegExp = /(ex|exp|xp)/g;
    if (expCheck.test(row)) {
      // console.log('String includes "ex" or "exp".');
      expDate = findDate(row);
      continue;
    }

    // Find any dates
    if (hasDate(row)) {
      dates[rows.indexOf(row)] = findDate(row);
    }
  }

  if (!expDate) {
    if (Object.keys(dates).length === 0) {
      noExpDateExtracted = true;
      return { noExpDate: noExpDateExtracted };;
    }
    expDate = findLatestDate(Object.values(dates));

    // Recommended renewal date
    renewDate = subtractTwoMonths(expDate);
    if (isBeforeToday(renewDate)) {
      renewDate = formatDate(new Date());
      renewNow = true;
    }

    // Full record
    const record: RecordResultType = {
      exp: expDate,
      renew: renewDate,
      renewNow,
      startRenewISO: convertToISOStringWithHour(renewDate, 9),
      endRenewISO: convertToISOStringWithHour(renewDate, 10),
    };
    console.log(record);
    return record;
  }
};

// Helper function to find a date
const findDate = (str: string): DateString => {
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
const hasDate = (str: string): boolean => {
  // Regular expression to match MM/DD/YYYY format
  const regex: RegExp = /\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}\b/;
  return regex.test(str);
};

// Helper function to check for latest date
const findLatestDate = (dates: DateString[]): DateString => {
  // Find the maximum date string among the array of dates
  return dates.reduce((latest, current) => {
    // Convert dates to a format that can be compared
    const latestParts = latest.split('/').reverse().join('');
    const currentParts = current.split('/').reverse().join('');
    return latestParts > currentParts ? latest : current;
  });
};

// Helper function to get date of 2 months before expiration date
const subtractTwoMonths = (dateString: DateString): DateString => {
  // Parse date string 
  const [month, day, year] = dateString.split('/').map(part => parseInt(part, 10));
  const originalDate = new Date(year, month - 1, day);
  originalDate.setMonth(originalDate.getMonth() - 2); // subtract 2 months

  // Format the resulting date back into MM/DD/YYYY format
  const formattedMonth = String(originalDate.getMonth() + 1).padStart(2, '0');
  const formattedDay = String(originalDate.getDate()).padStart(2, '0');
  const formattedYear = String(originalDate.getFullYear());

  return `${formattedMonth}/${formattedDay}/${formattedYear}`;
}

// Helper function to check if today's date is after than renewal date
const isBeforeToday = (dateString: DateString): boolean => {
  // Get today's date & set hours, minutes, seconds, milliseconds to 0 for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse the given date string into a Date object
  const [month, day, year] = dateString.split('/').map(part => parseInt(part, 10));
  const targetDate = new Date(year, month - 1, day);

  // Compare today's date with the parsed date
  return targetDate < today;
}

// Helper function to format date for user
const formatDate = (date: Date): DateString => {
  // Get the components of the date
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${month}/${day}/${year}`;
}

// Helper function to set default time
const convertToISOStringWithHour = (dateString: DateString, hour: number): DateString => {
  const [month, day, year] = dateString.split('/').map(part => parseInt(part, 10));
  const date = new Date(year, month - 1, day);
  date.setHours(hour, 0, 0, 0);

  // Return the ISO string representation
  return date.toISOString();
};
