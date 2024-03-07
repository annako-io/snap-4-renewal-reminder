import React, { useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CalendarFields from './CalendarFields';


const style = {
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

const CalModal = ({ value }) => {
  console.log('in CalModal - text data is: ', value);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [start, setStart] = useState(value.startRenewISO);
  const [end, setEnd] = useState(value.endRenewISO);
  const [eventName, setEventName] = useState(`Renew Driver's License`);
  const [eventDescription, setEventDescription] = useState(`Time to renew my driver's license! Thanks to "Snap for Renewal Reminder App"!`);

  // When session exists we have a user
  const session = useSession();
  const supabase = useSupabaseClient();

  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  // Google sign in
  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      },
    });
    if (error) {
      alert('Error logging into Google provider with Supabase');
      console.log(error);
    }
  }

  // Google sign out
  async function signOut() {
    await supabase.auth.signOut();
  }

  // Create calendar event
  async function createCalendarEvent() {
    console.log('Creating calendar event');
    const event = {
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
    await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session.provider_token // Access token for Google
      },
      body: JSON.stringify(event)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      alert('Event created, check your Google Calendar');
    }).catch((error) => {
      console.log('Calendar creation error: ', error);
    })
    resetFields();
  }

  const resetFields = () => {
    setStart(null);
    setEnd(null);
    setEventName('');
    setEventDescription('');
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
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Stack sx={style}>
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
                setEventName={setEventName}
                setEventDescription={setEventDescription}
                resetFields={resetFields}
                eventName={eventName}
                eventDescription={eventDescription}
              />
              <Button
                onClick={() => createCalendarEvent()}
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#2196f3' }}
              >
                Create Reminder
              </Button>
              <Button
                onClick={() => signOut()}
                variant="contained"
                sx={{ my: 2 }}
              >
                Sign Out
              </Button>
            </>
            :
            <>
              <Button
                onClick={() => googleSignIn()}
                variant="contained"
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