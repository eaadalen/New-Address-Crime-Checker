import "./welcome-view.css"
import { useState, useEffect, useRef } from "react";
import arson from '../../../assets/crime_icons/arson.png'
import assault from '../../../assets/crime_icons/assault.png'
import car_parts_theft from '../../../assets/crime_icons/car-parts-theft.png'
import car_theft from '../../../assets/crime_icons/car-theft.png'
import drugs from '../../../assets/crime_icons/drugs.png'
import general from '../../../assets/crime_icons/general.png'
import hacking from '../../../assets/crime_icons/hacking.png'
import identity_theft from '../../../assets/crime_icons/identity-theft.png'
import larceny from '../../../assets/crime_icons/larceny.png'
import murder from '../../../assets/crime_icons/murder.png'
import shooting from '../../../assets/crime_icons/shooting.png'
import shooting_victim from '../../../assets/crime_icons/shooting-victim.png'
import theft from '../../../assets/crime_icons/theft.png'
import vandalism from '../../../assets/crime_icons/vandalism.png'
import moment from 'moment';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Stack, 
  CssBaseline,
  IconButton,
  Tooltip  
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const WelcomeView = () => {
  const [address, setAddress] = useState('')
  let server_url = 'http://localhost:4242/'
  //let server_url = 'https://new-address-crime-checker-8125da47bbcd.herokuapp.com/'
  let latitude = null
  let longitude = null
  let crime_window = 7257600  // as a unix timestamp, default is one month
  let map;
  const [previous, setPrevious] = useState(7257600)
  const [submitted, setSubmitted] = useState(false)
  const infoWindowRef = useRef(null);

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: process.env.GOOGLE_MAPS_API_KEY_GENERATE_MAP,
      v: "weekly"
    })
    moment().format();
  }, [])

  const handleSubmit = () => {
    crime_window = previous
    findAddress()
  }

  const findAddress = () => {
    const data = {
      "address" : {
        "regionCode": "US",
        "locality": "Minneapolis",
        "addressLines": [address]
      }
    }
    fetch('https://addressvalidation.googleapis.com/v1:validateAddress?key=' + process.env.GOOGLE_MAPS_API_KEY_GET_COORDINATES,
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }
    )
    .then((response) => response.json())
    .then((data) => {
      latitude = data.result.geocode.location.latitude
      longitude = data.result.geocode.location.longitude
      binarySearchByLatitude()
      setSubmitted(true)
    })
  }

  function binarySearchByLatitude() {

    const data = {
      "latitude": latitude
    }

    fetch(server_url + 'binarysearch',
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }
    )
    .then((response) => response.json())
    .then((data) => {
      getMarkerCoordinates(data)
    })
  }

  const getMarkerCoordinates = (midIndex) => {

    const data = {
      "midIndex": midIndex,
      "longitude": longitude
    }

    fetch(server_url + 'coordinates',
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      }
    )
    .then((response) => response.json())
    .then((data) => {
      initMap(data)
    })

  }

  async function initMap(markerArray) {

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const infoWindow = new window.google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
    let index = 0
    var now = moment();

    map = new Map(document.getElementById("map"), {
      zoom: 15.75,
      center: { lat: latitude, lng: longitude },
      mapId: "crime_map",
    });

    markerArray.forEach((element) => {

      let date_time = element.Occurred_Date.split(' ')
      let date = date_time[0].replace('/','')
      date = date.replace('/','')


      if (moment().unix() - moment(date).unix() < crime_window) {
        const markerElement = document.createElement('img');
        markerElement.style.width = '30px';  // Set desired size
        markerElement.style.height = '30px';

        switch(element.Offense) {
          case "Arson":
            markerElement.src = arson
            break;
          case "Aggravated Assault":
            markerElement.src = assault
            break;
          case "Simple Assault":
            markerElement.src = assault
            break;
          case "Domestic Aggravated Assault - Subset of Assault":
            markerElement.src = assault
            break;
          case "Theft of Motor Vehicle Parts or Accessories":
            markerElement.src = car_parts_theft
            break;
          case "Motor Vehicle Theft":
            markerElement.src = car_theft
            break;
          case "Drug/Narcotic Violations":
            markerElement.src = drugs
            break;
          case "Drug Equipment Violations":
            markerElement.src = drugs
            break;
          case "Hacking/Computer Invasion":
            markerElement.src = hacking
            break;
          case "Identity Theft":
            markerElement.src = identity_theft
            break;
          case "All Other Larceny":
            markerElement.src = larceny
            break;
          case "Murder and Nonnegligent Manslaughter":
            markerElement.src = murder
            break;
          case "Shooting (PFE)":
            markerElement.src = shooting
            break;
          case "Shooting Report Only (P)":
            markerElement.src = shooting
            break;
          case "Sound of Shots Fired (P)":
            markerElement.src = shooting
            break;
          case "Gunshot Wound Victims":
            markerElement.src = shooting_victim
            break;
          case "Destruction/Damage/Vandalism of Property":
            markerElement.src = vandalism
            break;
          case "Theft From Coin-Operated Machine or Device":
            markerElement.src = theft
            break;
          default:
            markerElement.src = general
        }

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: parseFloat(element.Latitude), lng: parseFloat(element.Longitude) },
          content: markerElement
        })

        index++
      }
    })
  }

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

  const setCrimeWindow = (window) => {
    if (window === previous) {
      return
    }
    crime_window = window
    setPrevious(window)
    findAddress()
  }

  const getVariant = (windowSeconds) => {
    return previous === windowSeconds ? 'contained' : 'outlined';
  }

  const boxRef = useRef(null);
  const iconRefUp = useRef(null);
  const iconRefDown = useRef(null);

  const handleScrollUp = () => {
    if (boxRef.current) {
      boxRef.current.scrollTop -= 2; // Scroll up by one image height
    }
  };

  const handleScrollDown = () => {
    if (boxRef.current) {
      boxRef.current.scrollTop += 2; // Scroll down by one image height
    }
  };

  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography variant="h5" gutterBottom>
          Enter New Address
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            width: '100%', 
            gap: 2, 
            justifyContent: 'center',
            mb: 3 
          }}
        >
          <TextField
            type="email"
            variant="outlined"
            value={address}
            onChange={handleInputChange}
            placeholder="Ex. 1234 Cherrywood Ln"
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ height: '56px' }}
          >
            Submit
          </Button>
        </Box>

        {submitted && (
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography variant="subtitle1" gutterBottom>
              Show all crimes within last:
            </Typography>
            
            <Stack 
              spacing={2} 
              direction="row" 
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <Button 
                variant={getVariant(604800)} 
                onClick={() => setCrimeWindow(604800)}
              >
                Week
              </Button>
              <Button 
                variant={getVariant(2419200)} 
                onClick={() => setCrimeWindow(2419200)}
              >
                Month
              </Button>
              <Button 
                variant={getVariant(7257600)} 
                onClick={() => setCrimeWindow(7257600)}
              >
                3 months
              </Button>
              <Button 
                variant={getVariant(14515200)} 
                onClick={() => setCrimeWindow(14515200)}
              >
                6 months
              </Button>
              <Button 
                variant={getVariant(29030400)} 
                onClick={() => setCrimeWindow(29030400)}
              >
                Year
              </Button>
            </Stack>

            <Box 
              sx={{ 
                display: 'flex', 
                width: '100%',
                alignItems: 'flex-start',
                gap: 4
              }}
            >
              <Box 
                id="map" 
                sx={{ 
                  width: '100%', 
                  maxWidth: 400,
                  height: 400, 
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  Map Placeholder
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  position: 'relative', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  maxHeight: '400px', 
                  overflow: 'hidden' 
                }}
              >
                <IconButton 
                  onMouseEnter={() => {
                    // Start the interval when mouse enters
                    const intervalId = setInterval(handleScrollUp, 10);
                    
                    // Create a cleanup function for when mouse leaves
                    const handleMouseLeave = () => {
                      clearInterval(intervalId);
                      // Remove the event listener to prevent memory leaks
                      iconRefUp.current.removeEventListener('mouseleave', handleMouseLeave);
                    };
                    
                    // Use a ref to manage the event listener
                    iconRefUp.current.addEventListener('mouseleave', handleMouseLeave);
                  }}
                  ref={iconRefUp}
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    zIndex: 1, 
                    width: '100%', 
                    borderRadius: 1,
                    opacity: 1,
                    backgroundColor: 'white',
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: 'white'
                    }
                  }}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                
                <Box 
                  ref={boxRef}
                  sx={{ 
                    overflowY: 'scroll', 
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': {
                      display: 'none' // For Chrome, Safari, and Opera
                    },
                    height: '100%',
                    width: '100%',
                    paddingTop: '40px', // Space for top arrow
                    paddingBottom: '40px', // Space for bottom arrow
                    maxHeight: '400px',
                    display: 'flex',
                    zIndex: 0, 
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Tooltip title="Arson" placement="right">
                    <img src={arson} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Assault" placement="right">
                    <img src={assault} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Car Parts Theft" placement="right">
                    <img src={car_parts_theft} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Car Theft" placement="right">
                    <img src={car_theft} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Drugs" placement="right">
                    <img src={drugs} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Miscellaneous" placement="right">
                    <img src={general} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Hacking" placement="right">
                    <img src={hacking} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Identity Theft" placement="right">
                    <img src={identity_theft} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Larceny" placement="right">
                    <img src={larceny} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Murder" placement="right">
                    <img src={murder} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Shooting" placement="right">
                    <img src={shooting} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Shooting Victim" placement="right">
                    <img src={shooting_victim} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Theft" placement="right">
                    <img src={theft} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                  <Tooltip title="Vandalism" placement="right">
                    <img src={vandalism} height="40" style={{ marginBottom: '10px' }} /> 
                  </Tooltip>
                </Box>
                
                <IconButton 
                  onMouseEnter={() => {
                    // Start the interval when mouse enters
                    const intervalId = setInterval(handleScrollDown, 5);
                    
                    // Create a cleanup function for when mouse leaves
                    const handleMouseLeave = () => {
                      clearInterval(intervalId);
                      // Remove the event listener to prevent memory leaks
                      iconRefDown.current.removeEventListener('mouseleave', handleMouseLeave);
                    };
                    
                    // Use a ref to manage the event listener
                    iconRefDown.current.addEventListener('mouseleave', handleMouseLeave);
                  }}
                  ref={iconRefDown}
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    zIndex: 1, 
                    width: '100%', 
                    borderRadius: 1,
                    opacity: 1,
                    backgroundColor: 'white',
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: 'white'
                    }
                  }}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>

              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  )
}