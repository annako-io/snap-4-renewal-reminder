import React from 'react';
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { SxProps, Theme } from '@mui/material';

const iconStyles: SxProps<Theme> = { mr: 2, fontSize: '3rem' };

interface CustomButtonPropsType {
  webCaptureClick: () => void;
}

const CustomButton = ({ webCaptureClick }: CustomButtonPropsType) => {
  return (
    <Button
      variant='contained'
      onClick={webCaptureClick}
      sx={{
        textTransform: 'none',
        fontSize: '2rem',
        width: {xs: '100%', sm: '70%', md: '90%'},
        height: '100px',
        borderRadius: '8px',
        mb: '10px',
        mt: '20px'
      }}
    >
      <PhotoCameraIcon sx={iconStyles} />
      Capture
    </Button>
  );
};

export default CustomButton;