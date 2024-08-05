import "./welcome-view.css"
import { useState, useEffect } from "react";
import crime_data from '../../../assets/crime_data/sorted_crime_data.json'
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

export const WelcomeView = () => {
  const [address, setAddress] = useState('2201 Blaisdell Ave')
  let latitude = null
  let longitude = null
  let crime_window = 7257600  // as a unix timestamp, default is one month
  let map;
  const [week, setWeek] = useState("outlined")
  const [month, setMonth] = useState("outlined")
  const [three_months, setThreeMonths] = useState("contained")
  const [six_months, setSixMonths] = useState("outlined")
  const [year, setYear] = useState("outlined")
  const [previous, setPrevious] = useState(7257600)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: process.env.GOOGLE_MAPS_API_KEY_GENERATE_MAP,
      v: "weekly"
    })
    moment().format();
  }, [])

  function binarySearchByLatitude(array, targetLatitude) {
    let low = 0;
    let high = array.length - 1;
  
    while (true) {
      const midIndex = Math.floor((low + high) / 2);
      const midItem = array[midIndex];
  
      if (midItem.Latitude < targetLatitude) {
        low = midIndex + 1; // Search in the right half
      } else {
        high = midIndex - 1; // Search in the left half
      }

      if (low > high) {
        return midIndex
      }
    }
  }

  async function initMap(markerArray) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    let index = 0
    let markers = []
    let glyphs = []
    let pinElements = []
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
        glyphs.push(document.createElement("img"))
        glyphs[index].style.height = '30px';

        switch(element.Offense) {
          case "Arson":
            glyphs[index].src = arson
            break;
          case "Aggravated Assault":
            glyphs[index].src = assault
            break;
          case "Simple Assault":
            glyphs[index].src = assault
            break;
          case "Domestic Aggravated Assault - Subset of Assault":
            glyphs[index].src = assault
            break;
          case "Theft of Motor Vehicle Parts or Accessories":
            glyphs[index].src = car_parts_theft
            break;
          case "Motor Vehicle Theft":
            glyphs[index].src = car_theft
            break;
          case "Drug/Narcotic Violations":
            glyphs[index].src = drugs
            break;
          case "Drug Equipment Violations":
            glyphs[index].src = drugs
            break;
          case "Hacking/Computer Invasion":
            glyphs[index].src = hacking
            break;
          case "Identity Theft":
            glyphs[index].src = identity_theft
            break;
          case "All Other Larceny":
            glyphs[index].src = larceny
            break;
          case "Murder and Nonnegligent Manslaughter":
            glyphs[index].src = murder
            break;
          case "Shooting (PFE)":
            glyphs[index].src = shooting
            break;
          case "Shooting Report Only (P)":
            glyphs[index].src = shooting
            break;
          case "Sound of Shots Fired (P)":
            glyphs[index].src = shooting
            break;
          case "Gunshot Wound Victims":
            glyphs[index].src = shooting_victim
            break;
          case "Destruction/Damage/Vandalism of Property":
            glyphs[index].src = vandalism
            break;
          case "Theft From Coin-Operated Machine or Device":
            glyphs[index].src = theft
            break;
          default:
            glyphs[index].src = general
        }

        pinElements.push(new PinElement({
          glyph: glyphs[index],
          scale: 0
        }))

        markers.push(new AdvancedMarkerElement({
          map,
          position: { lat: parseFloat(element.Latitude), lng: parseFloat(element.Longitude) },
          content: pinElements[index].element,
        }))

        index++
      }
      
    })

    const pin = new PinElement({
        scale: 1.5,
        background: "#0000FF",
        borderColor: "#000000",
        glyphColor: "#FFFFFF"
    });
    const address = new AdvancedMarkerElement({
      map: map,
      position: { lat: latitude, lng: longitude },
      content: pin.element
    })
    
  }

  const getLatitudeCrimeMarkers = (midIndex) => {
    let countUp = midIndex
    let countDown = midIndex
    let markers = []
    while (true) {
      try {
        if (crime_data[countUp].Latitude - crime_data[midIndex].Latitude < 0.003623) { // 0.003623 change in latitude is equal to 0.25 miles
          markers.push(crime_data[countUp])
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
        if (crime_data[midIndex].Latitude - crime_data[countDown].Latitude < 0.003623) { // 0.003623 change in latitude is equal to 0.25 miles
          markers.push(crime_data[countDown])
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

    getLongitudeCrimeMarkers(markers)
  }

  const getLongitudeCrimeMarkers = (latitudeMarkers) => {
    let index = 0
    let markers = []
    while (index < latitudeMarkers.length) {
      index++
      try {
        if (Math.abs(latitudeMarkers[index].Longitude - longitude) < 0.00457) { // 0.00457 change in longitude is equal to 0.25 miles
          markers.push(latitudeMarkers[index])
          index++
        }
      }
      catch {
        // skip
      }
    }

    initMap(markers)
  }

  const handleInputChange = (event) => {
    setAddress(event.target.value);
  };

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
      getLatitudeCrimeMarkers(binarySearchByLatitude(crime_data, latitude))
      setSubmitted(true)
    })
  }

  const setCrimeWindow = (window) => {
    crime_window = window
    switch(window) {
      case 604800:
        setWeek("contained")
        break;
      case 2419200:
        setMonth("contained")
        break;
      case 7257600:
        setThreeMonths("contained")
        break;
      case 14515200:
        setSixMonths("contained")
        break;
      case 29030400:
        setYear("contained")
        break;
    }
    switch(previous) {
      case 604800:
        setWeek("outlined")
        break;
      case 2419200:
        setMonth("outlined")
        break;
      case 7257600:
        setThreeMonths("outlined")
        break;
      case 14515200:
        setSixMonths("outlined")
        break;
      case 29030400:
        setYear("outlined")
        break;
    }
    setPrevious(window)
    findAddress()
  }

  return (
    <div className="form-group">
      <CssBaseline />
      <br></br>
      <label>Enter New Address</label>
      <input type="email" className="form-control" value={address} onChange={handleInputChange} placeholder="Ex. 1234 Cherrywood Ln"></input>
      <Button variant="contained" onClick={findAddress}>Submit</Button>
      {(submitted == true) && 
        <>
          <div>Show all crimes within last:</div>
          <Stack sx={{ width: '500px' }} spacing={2} direction="row">
            <Button variant={week} onClick={() => setCrimeWindow(604800)}>Week</Button>
            <Button variant={month} onClick={() => setCrimeWindow(2419200)}>Month</Button>
            <Button variant={three_months} onClick={() => setCrimeWindow(7257600)}>3 months</Button>
            <Button variant={six_months} onClick={() => setCrimeWindow(14515200)}>6 months</Button>
            <Button variant={year} onClick={() => setCrimeWindow(29030400)}>Year</Button>
          </Stack>
          <div id="map"></div>
        </>
      }
    </div>
  )
}