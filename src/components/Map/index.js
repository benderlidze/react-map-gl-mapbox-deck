import * as React from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
/// app.js
import 'mapbox-gl/dist/mapbox-gl.css';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers/typed';
import { TripsLayer } from '@deck.gl/geo-layers/typed';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { useControl } from 'react-map-gl';
import { useState, useEffect } from 'react';

function DeckGLOverlay(props) {
    const overlay = useControl(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

const MapContainer = ({ geojsonData }) => {

    const TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg';


    const [time, setTime] = useState(0);
    const [animation] = useState({});


    const animationSpeed = 1;
    const loopLength = 1800;

    const animate = () => {
        setTime(t => (t + animationSpeed) % loopLength);
        animation.id = window.requestAnimationFrame(animate);
    };

    useEffect(() => {
        animation.id = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(animation.id);
    }, [animation]);


    const geojson = geojsonData || {
        type: 'FeatureCollection',
        features: []
    };

    const [layerStyle, setLayerStyle] = React.useState({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#888',
            'line-width': 8
        }
    });

    const onClick = (event) => {
        const county = event.features && event.features[0];
        setLayerStyle({
            ...layerStyle,
            'paint': {
                ...layerStyle.paint,
                'line-color': '#ff0000'
            }
        })
        console.log('county', county);
        console.log('event', event);
    }

    const scatterplotLayer = new ScatterplotLayer({
        id: 'my-scatterplot',
        data: [
            { position: [37, -122], size: 10000 },
            { position: [-122.4, 37.8], size: 10000 }
        ],
        getPosition: d => d.position,
        getRadius: d => d.size,
        getFillColor: [255, 0, 0]
    });

    const layer = new GeoJsonLayer({
        id: 'geojson-layer',
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 200],
        getPointRadius: 100,
        getLineWidth: 1,
        getElevation: 30
    });

    const trips = new TripsLayer({
        id: 'trips',
        data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json',
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => [253, 128, 93],
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength: 180,
        currentTime: time,
        shadowEnabled: false
    })

    return (
        <>
            <Map
                id="mymap"
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 14
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/light-v9"
                mapboxAccessToken={TOKEN}
                interactiveLayerIds={['route']}
                onClick={onClick}
            >
                <DeckGLOverlay layers={[scatterplotLayer, layer, trips]} />
                <NavigationControl />
                <Source id="my-data" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source>
            </Map>
        </>
    );
}
export default MapContainer;
