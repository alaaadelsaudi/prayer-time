import React, { useState, useEffect } from 'react';
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
import moment from 'moment';

export default function Prayer() {
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
    const [timings, setTiming] = useState({
        "Fajr": "04:22",
        "Sunrise": "05:51",
        "Dhuhr": "12:24",
        "Asr": "15:53",
        "Sunset": "18:57",
        "Maghrib": "18:57",
        "Isha": "20:27",
    });
    const [city, setCity] = useState({
        displayName: 'مكة المكرمة',
        apiName: 'Makka'
    });
    const [today, setToday] = useState('');
    const [remainingTime, setRemainingTime] = useState("");

    const availableCities = [
        { displayName: 'مكة المكرمة', apiName: 'Makka' },
        { displayName: 'الرياض', apiName: 'Riyadh' },
        { displayName: 'الدمام', apiName: 'Dammam' }
    ];

    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Maghrib", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" }
    ];

    const getTimings = async () => {
        const data = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${city.apiName}`);
        setTiming(data.data.data.timings);
    };

    useEffect(() => {
        getTimings();
    }, [city]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("calling timer");
            setupCountdownTimer();
        }, 1000);

        const t = moment();
        setToday(t.format("MMM Do YYYY | h:mm"));

        return () => {
            clearInterval(interval);
        };
    }, [timings]);

    const setupCountdownTimer = () => {
        const momentNow = moment();
        let prayerIndex = 0;

        if (
            momentNow.isAfter(moment(timings["Fajr"], "HH:mm")) &&
            momentNow.isBefore(moment(timings["Dhuhr"], "HH:mm"))
        ) {
            prayerIndex = 1;
        } else if (
            momentNow.isAfter(moment(timings["Dhuhr"], "HH:mm")) &&
            momentNow.isBefore(moment(timings["Asr"], "HH:mm"))
        ) {
            prayerIndex = 2;
        } else if (
            momentNow.isAfter(moment(timings["Asr"], "HH:mm")) &&
            momentNow.isBefore(moment(timings["Sunset"], "HH:mm"))
        ) {
            prayerIndex = 3;
        } else if (
            momentNow.isAfter(moment(timings["Sunset"], "HH:mm")) &&
            momentNow.isBefore(moment(timings["Isha"], "HH:mm"))
        ) {
            prayerIndex = 4;
        }

        setNextPrayerIndex(prayerIndex);

        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "HH:mm");

        let remainingTime = nextPrayerTimeMoment.diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "HH:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "HH:mm:ss"));

            remainingTime = midnightDiff + fajrToMidnightDiff;
        }

        const durationRemainingTime = moment.duration(remainingTime);

        setRemainingTime(
            `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
        );
    };

    const handleChange = (event) => {
        const selectedCity = availableCities.find(city => city.apiName === event.target.value);
        setCity(selectedCity);
    };

    return (
        <>
            <Grid container>
                <Grid xs={6}>
                    <div>
                        <h3>
                            {today}
                            <h1>{city.displayName}</h1>
                        </h3>
                        <h2>{city.displayName}</h2>
                    </div>
                </Grid>
                <Grid xs={6}>
                    <div>
                        <h3>
                            متبقى حتى الصلاة {""}
                            {prayersArray[nextPrayerIndex].displayName}
                        </h3>
                        <h2>{remainingTime}</h2>
                    </div>
                </Grid>
            </Grid>
            <Divider />
            <Stack marginTop={'20px'} direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2}>
                <Card title={"الفجر"} time={timings.Fajr} img={fajr} />
                <Card title={'الظهر'} time={timings.Dhuhr} img={dhuhr} />
                <Card title={'العصر'} time={timings.Asr} img={asr} />
                <Card title={'المغرب'} time={timings.Maghrib} img={maghrib} />
                <Card title={'العشاء'} time={timings.Isha} img={isha} />
            </Stack>
            <Stack direction={'row'} justifyContent={'center'} marginTop={'40px'}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">
                        <span>المدينة</span>
                    </InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={city.apiName}
                        onChange={handleChange}
                    >
                        {availableCities.map((city) => (
                            <MenuItem value={city.apiName} key={city.apiName}>
                                {city.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </>
    );
}
