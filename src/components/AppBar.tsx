import React, { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import EastIcon from '@mui/icons-material/East';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SxProps, Theme } from '@mui/material';

// Define styles using sx props
const iconStyle: SxProps<Theme> = { mr: 1 };
const typographyStyle: SxProps<Theme> = {
  mx: 2,
  display: 'flex',
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
};

// Basic app bar
const BasicAppBar = (): ReactElement => {

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar sx={{ display: 'flex', flexWrap: 'wrap' }} disableGutters>
          <PhotoCameraBackIcon sx={iconStyle} aria-label='Camera Icon' />
          <EastIcon sx={iconStyle} aria-label='Arrow Icon'/>
          <TextFieldsIcon sx={iconStyle} aria-label='Text Fields Icon' />
          <EastIcon sx={iconStyle} aria-label='Arrow Icon' />
          <CalendarMonthIcon sx={iconStyle} aria-label='Calendar Icon'/>
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={typographyStyle}
          >
            App
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BasicAppBar;
