import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function PreResultCard() {
  return (
    <Card sx={{ maxWidth: '95%' }}>
      <Typography
        gutterBottom
        variant="p"
        component="div"
        color="text.secondary"
        sx={{
          height: '100%',
          width: '100%',
          p: 2.5,
          fontSize: '18px'
        }}
      >
        Use your webcam to take a photo of your driver's license for analysis.
        <br />
        <br />
        For an accurate reading, fill entire screen with your driver's license.
      </Typography>
    </Card>
  );
}
