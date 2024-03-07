import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const EventDateTimePicker = ({ value, onChange, label }) => {
  // const [value, setValue] = useState(dayjs(date));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          label={label}
          value={value}
          onChange={onChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default EventDateTimePicker;