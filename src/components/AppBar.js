import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import EastIcon from '@mui/icons-material/East';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Basic app bar
function BasicAppBar() {

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", flexWrap: "wrap" }} disableGutters>
          <PhotoCameraBackIcon sx={{ mr: 1 }} />
          <EastIcon sx={{ mr: 1 }} />
          <TextFieldsIcon sx={{ mr: 1 }} />
          <EastIcon sx={{ mr: 1 }} />
          <CalendarMonthIcon sx={{ mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mx: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            App
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BasicAppBar;
