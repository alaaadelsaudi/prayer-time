import React from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import { Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Card from './Card';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import fajr from '../img/fajr-prayer.png';
import dhuhr from '../img/dhhr-prayer-mosque.png';
import asr from '../img/asr-prayer-mosque.png';
import maghrib from '../img/sunset-prayer-mosque.png';
import isha from '../img/night-prayer-mosque.png';

import { useState , useEffect} from 'react';

export default  function Prayer() {
    const [timings,setTiming] = useState( 
        {"Fajr": "04:22",
            "Sunrise": "05:51",
            "Dhuhr": "12:24",
            "Asr": "15:53",
            "Sunset": "18:57",
            "Maghrib": "18:57",
            "Isha": "20:27",}
     );
     const [city, setACity] = useState({
        disPlayName:'مكة المكرمة',
        apiName:'Makka'
     });
     const avilableCities=[
        {
            disPlayName:'مكة المكرمة',
            apiName:'Makka'
         },
         {
            disPlayName:'الرياض',
            apiName:'Riyadh'
         },
         {
            disPlayName:"الدمام",
            apiName:'Dmmam'
         }
     ]

    
const getTimings= async()=>{
 const data =await axios.get(
    `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${city.apiName}`
)
 setTiming(data.data.data.timings)}; 
    useEffect(()=>{ 
    getTimings()
    },[city]); 


    const handleChange = (event) => {
        const cityObiect= avilableCities.find((city)=>{
return city.apiName == event.target.value
        } )  
    setACity(cityObiect)}
     

     
   


    

   
  return (
   <>

   <Grid container  >
    <Grid xs={6} >
<div >
    <h3>
        سبتمبر 2023 9| 4:28
    </h3>
    <h2>{city.disPlayName}</h2>
</div>
    </Grid>
    <Grid xs={6}>
<div>
    <h3>
        متبقى حتى الصلاة 
    </h3>
    <h2>2:10:00</h2>
</div>
    </Grid>
   </Grid>
   
   <Divider/ >
   
<Stack marginTop={'20px'}   direction="row"
  justifyContent="space-around"
  alignItems="flex-start"
  spacing={2}>
    <Card title={"الفجر"} time={timings.Fajr} img={fajr}/>
    <Card title={'الظهر'} time={timings.Dhuhr} img={dhuhr}/>
    <Card title={'العصر'} time={timings.Asr}  img={asr}/>
    <Card title={'المغرب'} time={timings.Maghrib}  img={maghrib}/>
    <Card title={'العشاء'} time={timings.Isha}  img={isha}/>

   
</Stack>
<Stack direction={'row'} justifyContent={'center'} marginTop={'40px'}>
<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">
      <span >المدينة</span>
      </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Age"
        value={city.apiName}
        onChange={handleChange}
      >
        {avilableCities.map((city)=>(
         
                <MenuItem value={city.apiName} key={city.apiName} >
                {city.disPlayName}
                </MenuItem>

            
        ))}
      
      </Select>
    </FormControl>
</Stack>

   </>
  )
}
