import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import EventDateTimePicker from './DateTimePicker';

interface CalFieldsPropsType {
  start: string;
  changeStart: Dispatch<SetStateAction<string>>;
  end: string;
  changeEnd: Dispatch<SetStateAction<string>>;
  eventName: string;
  setEventName: Dispatch<SetStateAction<string>>;
  eventDescription: string;
  setEventDescription: Dispatch<SetStateAction<string>>;
  resetFields: () => void;
}

const CalendarFields = ({ start, changeStart, end, changeEnd, eventName, eventDescription, setEventName, setEventDescription }: CalFieldsPropsType): ReactElement => {

  return (
    <Stack spacing={2} justifyContent='center'>
      <EventDateTimePicker
        date={start}
        onChange={changeStart}
        label='Start Date'
      />
      <EventDateTimePicker
        date={end}
        onChange={changeEnd}
        label='End Date'
      />
      <TextField
        id='event-name'
        label='Event Name'
        variant='filled'
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <TextField
        id='filled-textarea'
        label='Event Description'
        multiline
        variant='filled'
        rows={2}
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
    </Stack>
  );
};

export default CalendarFields;