import { useRef, useState, useCallback, MutableRefObject, ReactElement, LegacyRef } from 'react';
import Webcam from 'react-webcam';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Grid, CssBaseline, CircularProgress } from '@mui/material';
import Tesseract from 'tesseract.js';
import BasicAppBar from './components/AppBar';
import TitleBar from './components/TitleBar';
import CustomButton from './components/CustomButton';
import WebcamBox from './components/WebcamBox';
import ResultCard from './components/ResultCard';
import PreResultCard from './components/PreResultCard';
import preprocessImage from './helpers/preprocess';
import { parseText, RecordResult } from './helpers/parseText';
import darkTheme from './helpers/theme';

const App = (): ReactElement => {
  // const webcamRef: LegacyRef<Webcam> = useRef(null);
  const webcamRef: MutableRefObject<Webcam | null> = useRef(null);
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const imageRef: MutableRefObject<HTMLImageElement | null> = useRef(null);
  
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [text, setText] = useState<RecordResult | {} | ''>({});
  const [load, setLoad] = useState<boolean>(false);

  // Proprocess
  const handleImageLoad = ():void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    // bug fix
    const image = imageRef.current;

    // Ensure canvas and image are available
    if (canvas && image) {
      // canvas.width = imageRef.current.width;
      // canvas.height = imageRef.current.height;
      // bug fix
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
  const webcamCapture: () => void = useCallback(() => {
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
        })
        .then((result) => {
          const confidence = result?.data?.confidence;
          console.log(confidence);
          let text = result?.data?.text || '';
          text = parseText(text);
          setText(text);
          setLoad(false);
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
      {/* Outer Container */ }
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <TitleBar />
        {/* Inner Container */ }
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
          {/* Left Column */ }
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
            {load ? (
              <CircularProgress sx={{ margin: '30px' }}> Loading...</CircularProgress>
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
                    style={{
                      width: '250px',
                      height: '150px',
                      position: 'absolute',
                      display: 'none'
                    }}
                  ></canvas>
                </>
              ) : (
                <PreResultCard />
              )}
            </Grid>
          </Grid>
          {/* Right Column */ }
          <WebcamBox webcamRef={webcamRef}/>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;