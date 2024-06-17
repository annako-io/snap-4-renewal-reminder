import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import EventDateTimePicker from './DateTimePicker';

// Props type
type PropsType = {
  start: string,
  changeStart: Dispatch<SetStateAction<string>>,
  end: string,
  changeEnd: Dispatch<SetStateAction<string>>,
  eventName: string,
  eventDescription: string,
  setEventName: Dispatch<SetStateAction<string>>,
  setEventDescription: Dispatch<SetStateAction<string>>
};

const CalendarFields = ({ start, changeStart, end, changeEnd, eventName, eventDescription, setEventName, setEventDescription }: PropsType): ReactElement => {

  return (
    <Stack spacing={2} justifyContent="center">
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
        id="event-name"
        label="Event Name"
        variant="filled"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <TextField
        id="filled-textarea"
        label="Event Description"
        multiline
        variant="filled"
        rows={2}
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
    </Stack>
  );
};

export default CalendarFields;