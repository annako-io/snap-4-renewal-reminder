import React, { useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EventDateTimePicker from './components/DateTimePicker';


const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

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
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // local time
      },
      'end': {
        'dateTime': end.toISOString(),
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
    // reset fields
  }

  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);

  return (
    <Stack>
      {
        session
          ?
          <>
            <h2>Hey there {session.user.email}</h2>
            <EventDateTimePicker onChange={setStart} value={start} label='Start Date' />
            <EventDateTimePicker onChange={setEnd} value={end} label='End Date' />
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
            <Button
                onClick={() => createCalendarEvent()}
                variant="contained"
              >
                Create Reminder
              </Button>
            <Button onClick={() => signOut()} variant='contained'>Sign Out</Button>
          </>
          :
          <>
            <Button onClick={() => googleSignIn()} variant='contained'>Sign In With Google</Button>
          </>
      }
    </Stack>
  );
};

export default App;