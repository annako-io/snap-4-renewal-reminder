import React, { useRef, useState, useCallback, MutableRefObject, ReactElement, CSSProperties } from 'react';
import Webcam from 'react-webcam';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Grid, CssBaseline, CircularProgress, SxProps, Theme } from '@mui/material';
import Tesseract from 'tesseract.js';
import BasicAppBar from './components/AppBar';
import TitleBar from './components/TitleBar';
import CustomButton from './components/CustomButton';
import WebcamBox from './components/WebcamBox';
import ResultCard from './components/ResultCard';
import PreResultCard from './components/PreResultCard';
import preprocessImage from './helpers/preprocess';
import { parseText, RecordResultType, ParseTextReturnType } from './helpers/parseText';
import darkTheme from './helpers/theme';

const innerContainerGridStyles: SxProps<Theme> = {
  p: 1,
  pl: { lg: 2 },
  m: 1,
  ml: { md: 2, lg: 2 },
  mr: { xs: 5, sm: 6, md: 3 },
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'column-reverse', md: 'row', lg: 'row' }
};

const leftColumnGridStyles: SxProps<Theme> = {
  p: 2,
  m: 2,
  bgcolor: '#212121',
  borderRadius: '8px'

};

const canvasStyles: CSSProperties = {
  width: '250px',
  height: '150px',
  position: 'absolute',
  display: 'none'
};

const App = (): ReactElement => {
  const webcamRef: MutableRefObject<Webcam | null> = useRef(null);
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const imageRef: MutableRefObject<HTMLImageElement | null> = useRef(null);

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [text, setText] = useState<RecordResultType | {} | ''>({});
  const [load, setLoad] = useState<boolean>(false);

  // Preprocess
  const handleImageLoad = (): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;

    if (canvas && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);
      ctx?.putImageData(preprocessImage(canvas), 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
    } else {
      console.error('2D content not available'); 
    }
  };

  // Webcam Capture
  const webcamCapture = useCallback(() => {
    setLoad(true);
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      setImgSrc(imageSrc);

      // Set image for display
      const newImage: HTMLImageElement = new Image();
      newImage.onload = handleImageLoad;
      newImage.src = imageSrc;

      // Run tesseract.js
      Tesseract.recognize(imageSrc, 'eng', {
        logger: (m) => console.log('logger: ', m)
      })
        .catch((err) => {
          console.error(err);
          setLoad(false);
        })
        .then((result) => {
          const confidence = result?.data?.confidence;
          console.log(confidence);
          const newText = result?.data?.text || '';
          const parseNewText: ParseTextReturnType = parseText(newText);
          if (parseNewText !== undefined) {
            setText(parseNewText);
            setLoad(false);
          } else {
            console.error('Text parse failed');
            setLoad(false);
          }
        })
    } else {
      console.error('Webcam capture failed');
      setLoad(false);
    }
  }, [webcamRef]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BasicAppBar />
      {/* Outer Container */}
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
      >
        <TitleBar />
        {/* Inner Container */}
        <Grid
          container
          spacing={1}
          wrap='nowrap'
          sx={innerContainerGridStyles}
          columnSpacing={{ md: 1, lg: 1 }}
        >
          {/* Left Column */}
          <Grid
            item
            container
            justifyContent='center'
            xs={12}
            md={4}
            lg={4}
            sx={leftColumnGridStyles}
          >
            <Grid
              container
              justifyContent='center'
              alignContent='start'
            >
              <CustomButton webCaptureClick={webcamCapture} />
              {load ? (
                <CircularProgress sx={{ margin: '30px' }} />
              ) : imgSrc ? (
                <>
                  <ResultCard
                    text={text}
                    pic={imgSrc}
                    forwardedImgRef={imageRef}
                    onLoad={handleImageLoad}
                  />
                  <canvas
                    ref={canvasRef}
                    style={canvasStyles}
                  ></canvas>
                </>
              ) : (
                <PreResultCard />
              )}
            </Grid>
          </Grid>
          {/* Right Column */}
          <WebcamBox webcamRef={webcamRef} />
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;