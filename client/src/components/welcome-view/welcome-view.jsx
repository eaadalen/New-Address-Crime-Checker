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
import left from '../../../assets/crime_icons/left-direction-arrow.svg'
import right from '../../../assets/crime_icons/right-direction-arrow.svg'
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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const WelcomeView = () => {
  const [address, setAddress] = useState('2201 Blaisdell Ave')
  let crime_window = 7257600  // as a unix timestamp, default is one month
  let map;
  let sorted_data = null
  const [previous, setPrevious] = useState(7257600)
  const [submitted, setSubmitted] = useState(false)
  const infoWindowRef = useRef(null);
  const [mobile, setMobile] = useState(null)
  const [crimeData, setCrimeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: process.env.GOOGLE_MAPS_API_KEY_GENERATE_MAP,
      v: "weekly"
    })
    moment().format();
    const device = detectDevice();
    setMobile(device.isMobile)
    fetchCrimeData()
  }, [])

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - box.offsetLeft);
      setScrollLeft(box.scrollLeft);
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - box.offsetLeft;
      const walk = (x - startX) * 2;
      box.scrollLeft = scrollLeft - walk;
    };

    box.addEventListener('mousedown', handleMouseDown);
    box.addEventListener('mouseleave', handleMouseLeave);
    box.addEventListener('mouseup', handleMouseUp);
    box.addEventListener('mousemove', handleMouseMove);

    return () => {
      box.removeEventListener('mousedown', handleMouseDown);
      box.removeEventListener('mouseleave', handleMouseLeave);
      box.removeEventListener('mouseup', handleMouseUp);
      box.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft])

  const boxRef = useRef(null);
  const iconRefUp = useRef(null);
  const iconRefDown = useRef(null);

  const handleScrollLeft = () => {
    if (boxRef.current) {
      boxRef.current.scrollLeft -= 5;
    }
  }
  
  const handleScrollRight = () => {
    if (boxRef.current) {
      boxRef.current.scrollLeft += 5;
    }
  }

  const detectDevice = () => {
    // Check screen width
    const isMobileWidth = window.innerWidth <= 768;
    
    // Check touch capability
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
    
    // Check user agent
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      isMobile: isMobileWidth || (isTouchDevice && isMobileUserAgent),
      isTouchDevice: isTouchDevice
    };
  }

  async function fetchCrimeData() {

    fetch('https://services.arcgis.com/afSMGVsC7QlRK1kZ/arcgis/rest/services/Crime_Data/FeatureServer/0/query?where=1%3D1&outFields=occurred_date,offense,latitude,longitude&f=json',
      {
          method: "GET"
      }
    )
    .then((response) => response.json())
    .then((data) => {
      sort_data(data.features)
      setLoading(false)
    })

  }

  async function sort_data(unsorted_data) {
    sorted_data = await quicksort(unsorted_data, 'Latitude')
    console.log(sorted_data)
  }

  function quicksort(arr, key) {

    if (arr.length <= 1) {
      return arr
    }
  
    const pivot = arr[arr.length - 1];
    const left = []
    const right = []
  
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].attributes[key] < pivot.attributes[key]) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }

    return [...quicksort(left, key), pivot, ...quicksort(right, key)]
  }

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
      binarySearchByLatitude(data.result.geocode.location.latitude, data.result.geocode.location.longitude)
      setSubmitted(true)
    })
  }

  function binarySearchByLatitude(latitude, longitude) {
    console.log(sorted_data)
    let low = 0;
    let high = sorted_data.length - 1;

    while (true) {
      const midIndex = Math.floor((low + high) / 2);
      const midItem = sorted_data[midIndex];
      console.log(latitude, sorted_data[midIndex].attributes.Latitude)

      if (midItem.attributes.Latitude < latitude) {
        low = midIndex + 1; // Search in the right half
      } else {
        high = midIndex - 1; // Search in the left half
      }

      if (low > high) {
        getMarkerCoordinates(midIndex, latitude, longitude)
        return
      }
    }
  }

  const getMarkerCoordinates = (midIndex, latitude, longitude) => {
    console.log(midIndex, latitude, longitude)
    let countUp = midIndex
    let countDown = midIndex
    let latitude_markers = []
    while (true) {
      try {
        if (sorted_data[countUp].Latitude - sorted_data[midIndex].Latitude < 0.0057968) { // 0.0057968 change in latitude is equal to 0.4 miles
          latitude_markers.push(sorted_data[countUp])
          countUp++
        }
        else {
          break
        }
      }
      catch {
        // skip to next
      }
    }
    while (true) {
      try {
        if (sorted_data[midIndex].Latitude - sorted_data[countDown].Latitude < 0.0057968) { // 0.0057968 change in latitude is equal to 0.4 miles
          latitude_markers.push(sorted_data[countDown])
          countDown--
        }
        else {
          break
        }
      }
      catch {
        // skip to next
      }
    }
  
    let index = 0
    let longitude_markers = []
    while (index < latitude_markers.length) {
      index++
      try {
        if (Math.abs(latitude_markers[index].Longitude - longitude) < 0.007312) { // 0.007312 change in longitude is equal to 0.4 miles
          longitude_markers.push(latitude_markers[index])
          index++
        }
      }
      catch {
        // skip
      }
    }
    
    console.log(latitude_markers, longitude_markers)
    initMap(longitude_markers, latitude, longitude)
  }

  async function initMap(markerArray, latitude, longitude) {

    console.log(markerArray)
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

  const [openTooltip, setOpenTooltip] = useState(null);

  const handleTooltipToggle = (event, index) => {
    setOpenTooltip(openTooltip === index ? null : index);
  };

  const icons = [
    { src: arson, title: "Arson" },
    { src: assault, title: "Assault" },
    { src: car_parts_theft, title: "Car Parts Theft" },
    { src: car_theft, title: "Car Theft" },
    { src: drugs, title: "Drugs" },
    { src: general, title: "Miscellaneous" },
    { src: hacking, title: "Hacking" },
    { src: identity_theft, title: "Identity Theft" },
    { src: larceny, title: "Larceny" },
    { src: murder, title: "Murder" },
    { src: shooting, title: "Shooting" },
    { src: shooting_victim, title: "Shooting Victim" },
    { src: theft, title: "Theft" },
    { src: vandalism, title: "Vandalism" },
  ];

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

        {!loading && (
          <Typography variant="h5" gutterBottom>
            
          </Typography>
        )}

        {submitted && loading && (
          <div className="flex justify-center items-center h-full w-full p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {submitted && !loading && (
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography variant="subtitle1" gutterBottom>
              Show all crimes within last:
            </Typography>
            
            <Stack 
              spacing={1} 
              direction="row" 
              justifyContent="center"
              flexWrap="wrap"  // Enable wrapping
              gap={0.5}         // Consistent gap between wrapped items
              sx={{ 
                mb: 3,
                '& .MuiButton-root': {  // Target all buttons
                  whiteSpace: 'nowrap', // Prevent text wrapping
                  minWidth: 'auto',     // Allow buttons to shrink to content
                  margin: '4px',        // Add margin for wrapped items
                }
              }}
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
                flexDirection: 'column', // Changed to column to stack map and scroll area
                gap: 4
              }}
            >
              <Box 
                id="map" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '100%', // Adjusted to take full width
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
              
              {!mobile && 
                <Box 
                  sx={{ 
                    position: 'relative', 
                    display: 'flex',
                    alignItems: 'center', // Center the scroll area
                    width: '100%',
                    height: '60px', // Adjusted for horizontal layout
                  }}
                >
                  <IconButton 
                    onMouseEnter={() => {
                      const intervalId = setInterval(handleScrollLeft, 10); // Changed to handleScrollLeft
                      
                      const handleMouseLeave = () => {
                        clearInterval(intervalId);
                        iconRefUp.current.removeEventListener('mouseleave', handleMouseLeave);
                      };
                      
                      iconRefUp.current.addEventListener('mouseleave', handleMouseLeave);
                    }}
                    ref={iconRefUp}
                    sx={{ 
                      position: 'absolute', 
                      left: 0, // Changed from top to left
                      zIndex: 1, 
                      height: '100%', // Changed width to height
                      borderRadius: 1,
                      opacity: 1,
                      backgroundColor: 'white',
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <KeyboardArrowLeftIcon /> {/* Changed from Up to Left */}
                  </IconButton>
                  
                  <Box 
                    ref={boxRef}
                    sx={{ 
                      overflowX: 'scroll', // Changed from overflowY to overflowX
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none'
                      },
                      width: '100%',
                      height: '100%',
                      paddingLeft: '40px', // Changed from paddingTop
                      paddingRight: '40px', // Changed from paddingBottom
                      display: 'flex',
                      zIndex: 0, 
                      flexDirection: 'row', // Changed from column to row
                      alignItems: 'center'
                    }}
                  >
                    <Tooltip title="Arson">
                      <img src={arson} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Assault" placement="top">
                      <img src={assault} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Car Parts Theft" placement="top">
                      <img src={car_parts_theft} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Car Theft" placement="top">
                      <img src={car_theft} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Drugs" placement="top">
                      <img src={drugs} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Miscellaneous" placement="top">
                      <img src={general} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Hacking" placement="top">
                      <img src={hacking} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Identity Theft" placement="top">
                      <img src={identity_theft} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Larceny" placement="top">
                      <img src={larceny} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Murder" placement="top">
                      <img src={murder} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Shooting" placement="top">
                      <img src={shooting} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Shooting Victim" placement="top">
                      <img src={shooting_victim} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Theft" placement="top">
                      <img src={theft} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Vandalism" placement="top">
                      <img src={vandalism} height="40" style={{ marginRight: '10px' }} />
                    </Tooltip>
                  </Box>
                  
                  <IconButton 
                    onMouseEnter={() => {
                      const intervalId = setInterval(handleScrollRight, 5); // Changed to handleScrollRight
                      
                      const handleMouseLeave = () => {
                        clearInterval(intervalId);
                        iconRefDown.current.removeEventListener('mouseleave', handleMouseLeave);
                      };
                      
                      iconRefDown.current.addEventListener('mouseleave', handleMouseLeave);
                    }}
                    ref={iconRefDown}
                    sx={{ 
                      position: 'absolute', 
                      right: 0, // Changed from bottom to right
                      zIndex: 1, 
                      height: '100%', // Changed width to height
                      borderRadius: 1,
                      opacity: 1,
                      backgroundColor: 'white',
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <KeyboardArrowRightIcon /> {/* Changed from Down to Right */}
                  </IconButton>

                </Box>
              }
              {mobile && 
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '60px',
                  }}
                >
                  <Box><img src={left} height="30" style={{ marginRight: '20px', marginTop: '7px' }} ></img></Box>
                  <Box
                    sx={{
                      overflowX: 'scroll',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' },
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      zIndex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    {icons.map((icon, index) => (
                      <Tooltip
                        key={index}
                        title={icon.title}
                        placement="top"
                        open={openTooltip === index}
                        onClose={() => setOpenTooltip(null)}
                      >
                        <img
                          src={icon.src}
                          height="40"
                          style={{ marginRight: '10px' }}
                          onClick={(event) => handleTooltipToggle(event, index)}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                  <Box><img src={right} height="30" style={{ marginLeft: '20px', marginTop: '7px' }} ></img></Box>
                </Box>
              }

            </Box>
          </Box>
        )}
      </Box>
    </Container>
  )
}