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
import CalModal from './components/CalModal';


const App = () => {
  // Webcam
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

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
           <CalModal />
         </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default App;