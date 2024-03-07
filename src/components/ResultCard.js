import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CalModal from './CalModal';

const ResultCard = ({ text, pic, forwardedImgRef, onLoad }) => {

  return (
    <Card sx={{ maxWidth: '95%' }}>
      <CardHeader title="Extracted Text" />
      <CardMedia
        component="img"
        alt="ocr"
        height="240"
        image={pic}
        ref={forwardedImgRef}
        onLoad={onLoad}
      />
      <CardContent>
        {
          text ? (
            text.exp !== undefined ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Expiration Date: {text.exp}
                  <br />
                  <br />
                </Typography>
                {
                  text.renewNow
                    ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Looks like you're past the recommended renewal date. Now is a good time to renew!
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                      >
                        Recommended Renewal Date: {text.renew}
                        <br />
                        (2 months in advance)
                      </Typography>
                    )
                }
                <CalModal value={text} />
              </>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Looks like there was an error extracting the expiration date.
                <br />
                Try again!
              </Typography>
            )
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Looks like there was an error extracting the text data.
              <br />
              Try again!
            </Typography>
          )
        }
      </CardContent>
    </Card>
  );
}

export default ResultCard;