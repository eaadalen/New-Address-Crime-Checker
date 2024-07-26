import "./welcome-view.css"
import { useState, useEffect } from "react";
import sortPackageJson from 'sort-package-json'

export const WelcomeView = () => {
  const [address, setAddress] = useState('2201 Blaisdell Ave')
  let latitude = null
  let longitude = null
  let map;

  useEffect(() => {
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: process.env.GOOGLE_MAPS_API_KEY_GENERATE_MAP,
      v: "weekly",
    })
  }, [])

  useEffect(() => {
    const packageJsonString = `[
      {"Occurred_Date":"2019/01/01 00:01:58+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.01776","Longitude":"-93.30953"}
      ,
      {"Occurred_Date":"2019/01/01 00:02:07+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.00201","Longitude":"-93.31461"}
      ,
      {"Occurred_Date":"2019/01/01 00:02:59+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.00689","Longitude":"-93.30062"}
      ,
      {"Occurred_Date":"2019/01/01 00:03:44+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.03663","Longitude":"-93.28883"}
      ,
      {"Occurred_Date":"2019/01/01 00:04:01+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.02591","Longitude":"-93.31539"}
      ,
      {"Occurred_Date":"2019/01/01 00:04:49+00","Offense":"Sound of Shots Fired (P)","Latitude":"45.01855","Longitude":"-93.29496"}
    ]`

    const packageJsonObject = JSON.parse(packageJsonString)

    const sorted = sortPackageJson(packageJsonObject, {
      sortOrder: ['Latitude'],
    })

    console.log(sorted)
  }, [])

  async function initMap() {
    const position = { lat: latitude, lng: longitude };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: 15,
      center: position,
      mapId: "crime_map",
    });

    const marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: "Minneapolis",
    });
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
      initMap()
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