/* eslint-disable*/

const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJ0aHVycnVzaWtlIiwiYSI6ImNsbmZ2c2MwbDAycWsycm83MTh3bTJram8ifQ.d_m1MfEZ0k3Hol3WZPjDvQ';
  // 'pk.eyJ1IjoiYXJ0aHVycnVzaWtlIiwiYSI6ImNsbmZ3M2RpdTByMzAyam1rdDU1bGd4dG4ifQ.39xPIuzVmHEqOansWqQdQw';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/arthurrusike/clnfwoufr01l201pyb1f7eje1',
    scrollZoom: false,
    // center: [-118.11349, 34.111745],
    // zoom: 8,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};


const mapBox = document.getElementById('map');


//Dom Elements
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
 
} else {
  
}
