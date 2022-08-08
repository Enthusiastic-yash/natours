/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoieWFzaDEwMiIsImEiOiJjbDY5YXE3MTEwMWwyM2NuMXNudm4yaDB3In0.Z0ZhjkjgNu7qnZcEx3gOtA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/yash102/cl69lwcmt003y14loj5ceoaqd',
    scrollZoom: false,
    //   center: [-118.262081081181634, 34.056577153666765],
    //   zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //Add Pop up
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
      .addTo(map);

    //Extend the map bound to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
