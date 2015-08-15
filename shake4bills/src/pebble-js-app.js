 var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  var req = new XMLHttpRequest();
req.open('POST', 'http://d401d4fa.ngrok.io/location?lat='+pos.coords.latitude+'&lon='pos.coords.longitude, true);
req.onload = function(e) {
  if (req.readyState == 4 && req.status == 200) {
    if(req.status == 200) {
      /*var response = JSON.parse(req.responseText);
      var temperature = response.list[0].main.temp;
      var icon = response.list[0].main.icon;
      Pebble.sendAppMessage({ 'icon':icon, 'temperature':temperature + '\u00B0C'});*/
    } else { console.log('Error'); }
  }
}
req.send(null);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('ready',
  function(e) {
    // Request current position
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
);


function fetch_location_error(err) {
  console.log(err);
  Pebble.sendAppMessage({location: 'Unable to retrieve location'});
}

Pebble.addEventListener('ready', function(e) {
  locationWatcher = window.navigator.geolocation.watchPosition(fetch_location_data, fetch_location_error, locationOptions);
});