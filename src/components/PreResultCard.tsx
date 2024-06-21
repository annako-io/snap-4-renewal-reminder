import React, { ReactElement } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material';

const cardStyles = {
  maxWidth: '95%'
};

const typographyStyles: SxProps<Theme> = {
  height: '100%',
  width: '100%',
  p: 2.5,
  fontSize: '18px'
}

const PreResultCard = (): ReactElement => {
  return (
    <Card sx={cardStyles}>
      <Typography
        gutterBottom
        variant='body1'
        component='div'
        color='text.secondary'
        sx={typographyStyles}
      >
        Use your webcam to take a photo of your driver's license for analysis.
        <br />
        <br />
        For an accurate reading, fill entire screen with your driver's license.
      </Typography>
    </Card>
  );
};

export default PreResultCard;