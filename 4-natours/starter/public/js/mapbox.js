/* eslint-disable */

const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2FuYWpldHp0IiwiYSI6ImNrMDZjcmxmeDM2eGkzY3BrNHFtZDJtZncifQ.y_6ulnsUXBO36UyjTWmzlA'

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kanajetzt/ck06cxang246d1dpirijqxubs',
    scrollZoom: false,
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div')
    el.className = 'marker'

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map)

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    // Extend map boudns to include current location
    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  })
}

export default displayMap
