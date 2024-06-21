import React, { ReactElement, useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext, Session, SupabaseClient } from '@supabase/auth-helpers-react';
import { Button, Modal, Stack, Typography, SxProps, Theme } from '@mui/material';
import CalendarFields from './CalendarFields';
import { RecordResult } from '../helpers/parseText';

type DateString = string;

const stackStyles: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 300, sm: 500 },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  margin: '30px auto',
  textAlign: 'center'
};

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: DateString | undefined;
    timeZone: DateString;
  };
  end: {
    dateTime: DateString | undefined;
    timeZone: DateString;
  };
}

interface ModalPropsType {
  value: RecordResult;
}

const CalModal = ({ value }: ModalPropsType): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [start, setStart] = useState<DateString>(value.startRenewISO || '');
  const [end, setEnd] = useState<DateString>(value.endRenewISO || '');
  const [eventName, setEventName] = useState<string>(`Renew Driver's License`);
  const [eventDescription, setEventDescription] = useState<string>(`Time to renew my driver's license! Thanks to "Snap for Renewal Reminder App"!`);

  // When session exists we have a user
  const session: Session | null = useSession();
  const supabase: SupabaseClient = useSupabaseClient();
  const { isLoading } = useSessionContext();

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  if (isLoading) {
    return <></>;
  }

  // Google sign in
  async function googleSignIn(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      },
    });
    if (error) {
      alert('Error logging into Google provider with Supabase');
      console.error('Error logging into Google provider with Supabase: ', error.message);
    }
  }

  // Google sign out
  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  // Create calendar event
  async function createCalendarEvent(): Promise<void> {
    console.log('Creating calendar event');
    const event: CalendarEvent = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // local time
      },
      'end': {
        'dateTime': end,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // local time
      },
    };

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session?.provider_token
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
      }

      const data = await response.json();
      console.log('Event created: ', data);
      alert('Event created successfully!');
      resetFields();
    } catch (error) {
      console.error('Calendar creation error: ', error);
      alert('Failed to create calendar event. Please try again.');
    }
  }

  const resetFields = (): void => {
    setStart('');
    setEnd('');
    setEventName(`Renew Driver's License`);
    setEventDescription(`Time to renew my driver's license! Thanks to "Snap for Renewal Reminder App"!`);
  };

  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant='contained'
        sx={{ mt: 3, justifySelf: 'center' }}
      >
        Schedule Reminder
      </Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Stack sx={stackStyles}>
          <Typography variant='h4' gutterBottom>
            Schedule Your Reminder
          </Typography>
          {session
            ?
            <>
              <Typography variant='h6' gutterBottom>
                Hey there {session.user.email}!
              </Typography>
              <CalendarFields
                start={start}
                changeStart={setStart}
                end={end}
                changeEnd={setEnd}
                eventName={eventName}
                setEventName={setEventName}
                eventDescription={eventDescription}
                setEventDescription={setEventDescription}
                resetFields={resetFields}
              />
              <Button
                onClick={() => createCalendarEvent()}
                variant='contained'
                sx={{ mt: 2, backgroundColor: '#2196f3' }}
              >
                Create Reminder
              </Button>
              <Button
                onClick={() => signOut()}
                variant='contained'
                sx={{ my: 2 }}
              >
                Sign Out
              </Button>
            </>
            :
            <>
              <Button
                onClick={() => googleSignIn()}
                variant='contained'
                sx={{ my: 2 }}
              >
                Sign In With Google
              </Button>
            </>
          }
        </Stack>
      </Modal >
    </>
  );
};

export default CalModal;