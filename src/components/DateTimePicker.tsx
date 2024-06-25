import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface EventDateTimePickerPropsType {
  date: string;
  onChange: Dispatch<SetStateAction<string>>;
  label: string;
}

const isValidDate = (date: string): boolean => {
  return dayjs(date).isValid();
};

const EventDateTimePicker = ({ date, onChange, label }: EventDateTimePickerPropsType) => {
  const [value, setValue] = useState<Dayjs | null>(isValidDate(date) ? dayjs(date) : null);

  useEffect(() => {
    if (!isValidDate(date)) {
      console.error('Invalid date string provided: ', date);
    }
  }, [date]);

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (newValue) {
      onChange(newValue.toISOString());
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          value={value}
          onChange={handleDateChange}
          label={label}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default EventDateTimePicker;