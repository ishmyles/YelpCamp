mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: geoData, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const popup = new mapboxgl.Popup()
    .setHTML(`<h5>${camp}</h5><p>${campLocation}</p>`);

const marker = new mapboxgl.Marker()
    .setLngLat(geoData)
    .setPopup(popup)
    .addTo(map);