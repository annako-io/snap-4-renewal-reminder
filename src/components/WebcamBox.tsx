import React, { ReactElement, MutableRefObject } from 'react';
import Webcam from 'react-webcam';
import Grid from '@mui/material/Grid';

interface WebcamBoxPropsType {
  // webcamRef: LegacyRef<Webcam>;
  webcamRef: MutableRefObject<Webcam | null>;
}

interface Constraints {
  width: number;
  height: number;
}

const WebcamBox = ({ webcamRef }: WebcamBoxPropsType): ReactElement => {
  const videoConstraints: Constraints = {
    width: 426,
    height: 240
  };

  return (
    <Grid
      item
      container
      xs={12}
      md={8}
      lg={8}
      alignItems='start'
      justifyContent='center'
      sx={{
        p: 2,
        m: 2,
        bgcolor: '#212121',
        borderRadius: '8px'
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        height={420}
        width={680}
        videoConstraints={videoConstraints}
      />
    </Grid>
  );
};

export default WebcamBox;