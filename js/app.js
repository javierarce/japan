var config = {
  mapOptions: {
    zoom: false,
    loaderControl: false,
    search:false,
    shareable: false
  },
  vizjson: 'https://arce.cartodb.com/api/v2/viz/84c40c80-e5ef-11e4-a74b-0e853d047bba/viz.json'
};

var openPopup = function(map, name, address, coordinates, readonly) {

  var content = '<div class="header"><h3>' + name + '</h3></div><div class="body"><textarea placeholder="Thanks! Why do you think I should go here?" name="name" rows="8" cols="40"></textarea><div class="controls"><a href="#" class="Button">Add this place</a></div></div><div class="footer">' + address + '</div>';

  var popup = L.popup({ className: readonly ? "readonly" : "", offset: new L.Point(0, 0)})
  .setLatLng(coordinates)
  .setContent(content)
  .openOn(map);
};

var goToCoordinates = function(map, coordinates) {
  map.panTo(coordinates);

  setTimeout(function() {
    map.setZoom(17);
  }, 200);
};

onVisLoaded = function(vis, layers) {
  var layer = layers[1]
  layer.setInteraction(true);
  var sublayer = layer.getSubLayer(0);

  sublayer.setInteractivity('name, description, latitude, longitude');
 var subLayerOptions = {
      sql: "SELECT the_geom_webmercator, cartodb_id, name, description, ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude FROM jp",
        }
  sublayer.set(subLayerOptions);
  //debugger;
  //layer.sublay.setInteractivity('name, description');

  layer.on('mouseover', function() {
    $('.leaflet-container').css('cursor','pointer');
  });

  layer.on('mouseout', function() {
    $('.leaflet-container').css('cursor','auto');
  });

  layer.on('featureClick', function(e, latlng, pos, data, layer) {
    console.log(data)
    openPopup(map, data.name, data.description, [data.latitude, data.longitude], true);
  });

  map = vis.getNativeMap();

  var content = '<div class="header"><h3>Title</h3></div><div class="body"><textarea placeholder="Thanks! Why do you think I should go here?" name="name" rows="8" cols="40"></textarea><div class="controls"><a href="#" class="Button">Add this place</a></div></div><div class="footer">Dirección</div>';
  var popup = L.popup({ offset: new L.Point(0, 0)})
  .setLatLng([40.4, -3.7])
  .setContent(content)
  .openOn(map);

  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);

  var onPlaceChange = function() {

    var place = autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    if (place.geometry.location) {

      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();
      var coordinates = [lat, lng];

      goToCoordinates(map, coordinates);

      setTimeout(function() {
        openPopup(map, place.name, place.formatted_address, coordinates);
      }, 700);

    }

  }

  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChange);

}

$(function() {

  cartodb.createVis('map', config.vizjson, config.mapOptions).done(onVisLoaded);
});

