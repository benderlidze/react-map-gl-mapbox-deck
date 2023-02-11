import './App.css';
import MapContainer from './components/Map';

import { useMap } from 'react-map-gl';
import { useEffect, useState } from 'react';

function App() {

  const { current: map, mymap } = useMap();
  const [geojsonData, setGeojsonData] = useState();

  const handleButtonClick = () => {
    console.log('mymap', mymap);
    const center = mymap.getCenter()
    console.log('center', center);
    mymap.flyTo({ center: { lng: -122.44628162054244, lat: 37.71138135953602 }, zoom: 11 })
    setGeojsonData({ "type": "FeatureCollection", "features": [{ "type": "Feature", "properties": {}, "geometry": { "coordinates": [[-122.46798252829589, 37.799873370906], [-122.4720262135383, 37.770472200897444], [-122.47890047844975, 37.77015255870667], [-122.4700043709171, 37.68667871600961], [-122.47081310796558, 37.67643790106051], [-122.45504273552115, 37.65435133345618], [-122.44088983717333, 37.63674139160278], [-122.4311849925922, 37.62745446858604]], "type": "LineString" } }, { "type": "Feature", "properties": {}, "geometry": { "coordinates": [[-122.44493352241577, 37.78613297555755], [-122.4425073112703, 37.762161054879996], [-122.4239063591565, 37.76983291513366], [-122.4089447237602, 37.77015255870667], [-122.40611414409086, 37.765997084487765], [-122.40611414409086, 37.74937285266621], [-122.4061141451231, 37.734983480139775], [-122.40004861725981, 37.71867214662022], [-122.3960049320177, 37.70427681035257], [-122.38913066710595, 37.6847586679047], [-122.39155687825105, 37.67195709698183], [-122.40449667102612, 37.65819294474748]], "type": "LineString" } }] })
  }

  useEffect(() => {
    console.log('mymap--------->', mymap);
  }, [mymap])

  return (
    <div style={{ width: "100%", height: "100vh", }} >
      <button onClick={handleButtonClick} style={{ left: 10, position: "absolute", zIndex: 10 }}>Click me!!!</button>
      <MapContainer geojsonData={geojsonData} />
    </div>
  );
}

export default App;
