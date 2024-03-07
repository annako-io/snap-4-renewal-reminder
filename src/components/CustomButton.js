import React from "react";
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const CustomButton = ({ webCaptureClick }) => {
  return (
    <Button
      variant="contained"
      onClick={webCaptureClick}
      sx={{
        textTransform: "none",
        fontSize: "2rem",
        width: {xs: "100%", sm: "70%", md: "90%"},
        height: "100px",
        borderRadius: "8px",
        mb: "10px",
        mt: "20px"
      }}
    >
      <PhotoCameraIcon sx={{ mr: 2, fontSize: '3rem' }} />
      Capture
    </Button>
  );
};

export default CustomButton;