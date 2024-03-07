import React, { useState, useRef, useCallback } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import WebcamBox from './components/WebcamBox';
import TextField from '@mui/material/TextField';
import EventDateTimePicker from './components/DateTimePicker';


const App = () => {
  // Webcam
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Calendar
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Webcam Capture
  const webcamCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('imageSrc from frontend App: ', imageSrc);
    setImgSrc(imageSrc);


    // Create a canvas element to draw the image
    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamRef.current.video, 0, 0);


    // Convert the canvas image to a data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImgSrc(dataUrl);


  }, [webcamRef, canvasRef]);


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
    <>
      {/* Outer Box */}
      <Box>
        <Typography>Webcam to Text</Typography>
        {/* Inner Container */}
        <Grid container sx={{ p: 5, paddingTop: 0 }} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} >
          {/* Left Column */}
          <Grid>
            <Button
              variant="contained"
              onClick={webcamCapture}
              sx={{
                textTransform: "none",
                fontSize: "2rem",
                width: "90%",
                height: "100px",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            >
              <PhotoCameraIcon sx={{ mr: 2, fontSize: '3rem' }} />
              Capture
            </Button>
            <Grid container justifyContent="center" alignContent="start" >
              {imgSrc && <img src={imgSrc} alt="Captured Image" />}
            </Grid>
          </Grid>
          {/* Right Column */}
          <Grid item container xs={6} md={8} alignItems="start" justifyContent="center" sx={{ bgcolor: '#212121', borderRadius: '8px' }} >
           <WebcamBox webcamRef={webcamRef} />
         </Grid>
        </Grid>
      </Box>
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
    </>
  );
};

export default App;