import React, { useRef, useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import BasicAppBar from './components/AppBar';
import TitleBar from './components/TitleBar';
import CustomButton from './components/CustomButton';
import WebcamBox from './components/WebcamBox';
import ResultCard from './components/ResultCard';
import PreResultCard from './components/PreResultCard';
import preprocessImage from './helpers/preprocess';
import parseText from './helpers/parseText';
import darkTheme from './helpers/theme';

const App = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [text, setText] = useState({});
  const [load, setLoad] = useState(false);

  // Proprocess
  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ensure canvas and image are available
    if (canvas && imageRef.current) {
      canvas.width = imageRef.current.width;
      canvas.height = imageRef.current.height;
      ctx.drawImage(imageRef.current, 0, 0);
      ctx.putImageData(preprocessImage(canvas), 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
    }
  };

  // Webcam Capture
  const webcamCapture = useCallback(() => {
    setLoad(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // Set image for display
    const newImage = new Image();
    newImage.onLoad = handleImageLoad;
    newImage.src = imageSrc;

    // Run tesseract.js
    Tesseract.recognize(
      imageSrc,
      'eng',
      { logger: m => console.log('logger: ', m) }
    )
      .catch(err => {
        console.error(err);
      })
      .then(result => {
        const confidence = result.data.confidence;
        console.log(confidence);
        let text = result.data.text;
        text = parseText(text);
        setText(text);
        setLoad(false);
      })

  }, [webcamRef, imageRef, canvasRef]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BasicAppBar />
      {/* Outer box */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <TitleBar />
        {/* Inner Container */}
        <Grid
          container
          spacing={1}
          wrap="nowrap"
          sx={{
            p: 1,
            pl: { lg: 2 },
            m: 1,
            ml: { md: 2, lg: 2 },
            mr: { xs: 5, sm: 6, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'column-reverse', md: 'row', lg: 'row' },
          }}
          columnSpacing={{ md: 1, lg: 1 }}
        >
          {/* Left Column */}
          <Grid
            item
            container
            justifyContent="center"
            xs={12}
            md={4}
            lg={4}
            sx={{ p: 2, m: 2, bgcolor: '#212121', borderRadius: '8px' }}
          >
            <Grid
              container
              justifyContent="center"
              alignContent="start"
            >
              <CustomButton webCaptureClick={webcamCapture} />
              {
                load
                  ?
                  <CircularProgress sx={{ margin: '30px' }}>Loading...</CircularProgress>
                  :
                  (
                    imgSrc
                      ?
                      <>
                        <ResultCard
                          text={text}
                          pic={imgSrc}
                          forwardedImgRef={imageRef}
                          onLoad={handleImageLoad}
                        />
                        <canvas
                          ref={canvasRef}
                          style={{
                            width: '250',
                            height: '150',
                            position: 'absolute',
                            display: 'none'
                          }}
                        ></canvas>
                      </>
                      :
                      <PreResultCard />
                  )
              }
            </Grid>
          </Grid>
          {/* Right Column */}
          <WebcamBox webcamRef={webcamRef} />
          <CalModal />
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;