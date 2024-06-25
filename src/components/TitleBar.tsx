import React, { ReactElement } from "react";
import { Typography, SxProps, Theme } from "@mui/material";

const responsiveTitle: SxProps<Theme> = {
  fontWeight: '400',
  mt: 1,
  pb: 0,
  width: '100%',
  fontSize: { xs: 40, sm: 50, md: 80, lg: 100 }
};

const responsiveSubtitle: SxProps<Theme> = {
  fontSize: { xs: 20, md: 24, lg: 28 }
};

const TitleBar = (): ReactElement => {
  return (
    <>
      <Typography
        align="center"
        variant="h3"
        sx={responsiveTitle}
      >
        Snap for Renewal Reminder
      </Typography>
      <Typography
        align="center"
        // variant="p"
        color="text.secondary"
        sx={responsiveSubtitle}
      >
        Get a Google Calendar reminder to renew your driver's license from a screenshot
      </Typography>
    </>
  );
};

export default TitleBar;