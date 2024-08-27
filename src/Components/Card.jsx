import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


export default function ImgMediaCard({title,time,img}) {
  return (
    <Card sx={{ maxWidth: 345 }} >
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={img}
      />
      <CardContent>
      <h2> {title}</h2>
       
        
        <h3>
         {time}
         </h3>
       
      </CardContent>
    </Card>
  );
}
