import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeView() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // Fetch GeoJSON for world map polygons
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    // Auto-rotate and position camera over India
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 20, lng: 77, altitude: 1.5 }, 2000);
    }
  }, []);

  // Bangalore Coordinates
  const markerData = [{ lat: 12.9716, lng: 77.5946, size: 20, color: '#00eaff', name: 'BENGALURU' }];

  return (
    <Globe
      ref={globeEl}
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere={true}
      atmosphereColor="#00eaff"
      atmosphereAltitude={0.15}
      
      // Map Polygons
      polygonsData={countries.features}
      polygonAltitude={d => d.properties.ISO_A2 === 'IN' ? 0.02 : 0.01}
      polygonCapColor={d => d.properties.ISO_A2 === 'IN' ? 'rgba(0, 234, 255, 0.4)' : 'rgba(10, 15, 26, 0.8)'}
      polygonSideColor={() => 'rgba(0, 234, 255, 0.1)'}
      polygonStrokeColor={() => '#00eaff'}
      
      // Bangalore Pin
      htmlElementsData={markerData}
      htmlElement={d => {
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 8px; height: 8px; background: ${d.color}; border-radius: 50%; box-shadow: 0 0 10px ${d.color};"></div>
            <span style="color: #fff; font-size: 50px; font-family: monospace; letter-spacing: 1px; text-shadow: 0 0 4px #000;">${d.name}</span>
          </div>
        `;
        return el;
      }}
    />
  );
}