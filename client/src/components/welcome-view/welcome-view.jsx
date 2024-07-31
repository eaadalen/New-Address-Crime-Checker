import "./welcome-view.css"
import { useState, useEffect } from "react";
import crime_data from '../../../assets/crime_data/sorted_crime_data.json'
import unique_crimes from '../../../assets/crime_data/unique_crimes.json'
import murder from '../../../assets/crime_icons/murder.png'

export const WelcomeView = () => {
  const [address, setAddress] = useState('2201 Blaisdell Ave')
  let latitude = null
  let longitude = null
  let map;

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: process.env.GOOGLE_MAPS_API_KEY_GENERATE_MAP,
      v: "weekly"
    })
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
    let markers = []

    map = new Map(document.getElementById("map"), {
      zoom: 15.75,
      center: { lat: latitude, lng: longitude },
      mapId: "crime_map",
    });

    markerArray.forEach((element) => {
      markers.push(new AdvancedMarkerElement({
        map: map,
        position: { lat: parseFloat(element.Latitude), lng: parseFloat(element.Longitude) }
      }))
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

    // A marker with a custom SVG glyph.
    const glyphImg = document.createElement("img");

    glyphImg.src = murder
    glyphImg.style.height = '30px';

    const glyphSvgPinElement = new PinElement({
      glyph: glyphImg
    });
    const glyphSvgMarkerView = new AdvancedMarkerElement({
      map,
      position: { lat: latitude, lng: longitude },
      content: glyphSvgPinElement.element,
      title: "A marker using a custom SVG for the glyph.",
    });

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
    })
  }

  return (
    <div className="form-group">
      <label>Enter New Address</label>
      <input type="email" className="form-control" value={address} onChange={handleInputChange} placeholder="Ex. 1234 Cherrywood Ln"></input>
      <button onClick={findAddress}>Submit</button>
      <div id="map"></div>
    </div>
  )
}