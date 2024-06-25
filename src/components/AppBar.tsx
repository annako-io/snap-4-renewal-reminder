import React, { ReactElement } from 'react';
import { AppBar, Container, Toolbar, Typography, SxProps, Theme } from '@mui/material';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import EastIcon from '@mui/icons-material/East';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const toolbarStyles: SxProps<Theme> = { display: 'flex', flexWrap: 'wrap' };
const iconStyles: SxProps<Theme> = { mr: 1 };
const typographyStyles: SxProps<Theme> = {
  mx: 2,
  display: 'flex',
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
};

const BasicAppBar = (): ReactElement => {

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar sx={toolbarStyles} disableGutters>
          <PhotoCameraBackIcon sx={iconStyles} aria-label='Camera Icon' />
          <EastIcon sx={iconStyles} aria-label='Arrow Icon'/>
          <TextFieldsIcon sx={iconStyles} aria-label='Text Fields Icon' />
          <EastIcon sx={iconStyles} aria-label='Arrow Icon' />
          <CalendarMonthIcon sx={iconStyles} aria-label='Calendar Icon'/>
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={typographyStyles}
          >
            App
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BasicAppBar;
