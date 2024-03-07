import React, { useState, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CircularProgress from '@mui/material/CircularProgress';
import darkTheme from './helpers/theme';
import WebcamBox from './components/WebcamBox';
import CalModal from './components/CalModal';
import preprocessImage from './helpers/preprocess';


const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [load, setLoad] = useState(false);

  // Proprocess
  const handleImageLoad = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ensure canvas and image are available
    if (canvas && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      ctx.putImageData(preprocessImage(canvas), 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      console.log('dataUrl: ', dataUrl);
    }
  }, [canvasRef, image]);

  // Webcam Capture
  const webcamCapture = useCallback(() => {
    setLoad(true);
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('imageSrc from frontend App: ', imageSrc);
    setImgSrc(imageSrc);

    // Set image for display
    const newImage = new Image();
    newImage.onLoad = handleImageLoad;
    newImage.src = imageSrc;

    // Run tesseract.js
    Tesseract.recognize(
      imageSrc,
      'eng',
      { logger: m => console.log('logger from server: ', m) }
    )
      .catch(err => {
        console.error(err);
      })
      .then(result => {
        console.log('result.data is: ', result.data);
        const confidence = result.data.confidence;
        console.log(confidence);
        let text = result.data.text;
        setText(text);
        setLoad(false);
      })


  }, [webcamRef, handleImageLoad]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* Outer box */}
      <Box
        spacing={2}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography align="center" variant="h1" sx={{ fontWeight: '400', p: '16px', pb: 0 }} >
          Webcam to Text
        </Typography>
        {/* Inner container below header */}
        <Grid container sx={{ p: 5, paddingTop: 0 }} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }} >
          {/* Left Column */}
          <Grid item container justifyContent="center" alignContent="start" xs={6} md={4} sx={{ p: 5, bgcolor: '#212121', borderRadius: '8px' }} >
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
              {
                load
                  ?
                  <CircularProgress sx={{ margin: '30px' }}>Loading...</CircularProgress>
                  :
                  (
                    imgSrc
                      ?
                      <>
                        <img src={imgSrc} alt="Captured Image" />
                        <canvas ref={canvasRef} style={{ width: '200', height: '150' }}></canvas>
                        {/* For canvas later: style={{ position: 'absolute', display: 'none' }} */}
                        <Typography >
                          {text}
                        </Typography>
                      </>
                      :
                      <Typography color="text.secondary">
                        No image yet.
                      </Typography>
                  )
              }
            </Grid>
          </Grid>
          {/* Right Column */}
          <Grid item container xs={6} md={8} alignItems="start" justifyContent="center" sx={{ bgcolor: '#212121', borderRadius: '8px' }} >
            <WebcamBox webcamRef={webcamRef} />
            <CalModal />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;