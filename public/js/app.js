popup = {};
selected = null;
autocomplete = {}, geocoder = {};
map = {};

var config = {
  mapOptions: {
    zoom: true,
    scrollwheel: true,
    loaderControl: false,
    search:false,
    shareable: false
  },
  vizjson: 'https://arce.cartodb.com/api/v2/viz/84c40c80-e5ef-11e4-a74b-0e853d047bba/viz.json'
};

var onPlaceChange = function() {
  var place = autocomplete.getPlace();

  if (!place.geometry) {
    return;
  }
  selected = -1;

  if (place.geometry.location) {

    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var coordinates = [lat, lng];


    goToCoordinates(map, coordinates);

    setTimeout(function() {
      openPopup(map, place.name, place.formatted_address, coordinates, { type: 1 });
    }, 900);

  }

}
var onMapClick = function(e) {
  selected = -1;
  var coordinates = [e.latlng.lat, e.latlng.lng];

  var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results && results.length > 0) {
        openPopup(map, null, results[0].formatted_address, coordinates, { type: 1});
      } else {
        openPopup(map, null, "Unknown street", coordinates, { type: 1});
      }
    } else {
      openPopup(map, null, "Unknown street", coordinates, { type: 1});
    }
  });
};

var getPopupContent = function(map, name, address, coordinates, opts, readonly) {
  var comment = "";
  var profile_image_url = "";

  if (opts) {
    comment           = opts.comment;
    profile_image_url = opts.profile_image_url || avatar;
  }

  var placeholder = "Why do you think I should go " + (name !== null ? ("to " + name) : "here" ) + (username !== "anonymous" ? ", " + username : "" ) + "?";

  var getPlaceName = function(name) {

    if (name) {
      return name;
    }

    var places = ["Unknown place", "Misterious place", "Misterious location", "Unkown spot"];
    return _.shuffle(places)[0];

  };

  name = getPlaceName(name);

  var content = '<div class="header"><h3>' + name + '</h3></div><div class="Body"><div class="message"><div class="Spinner"></div><div class="success"></div></div><div class="comment"><img class="Avatar" src="' + profile_image_url + '" /> ' + comment + '</div><textarea placeholder="' + placeholder +'" name="name" rows="8" cols="40"></textarea><div class="Controls"><a href="#" class="Button js-add-place">Add this place</a></div></div><div class="footer">' + address + '</div>';

  var className = readonly ? "is--readonly" : "";

  var options = {
    type: opts.type,
    className: "Popup " + className,
    offset: new L.Point(0, 0)
  };

  return { content: content, options: options };

};

var openPopup = function(map, name, address, coordinates, opts, readonly) {

  var content = getPopupContent(map, name, address, coordinates, opts, readonly);

  popup = L.popup(content.options)
  .setLatLng(coordinates)
  .setContent(content.content)
  .openOn(map)

  map.on("popupclose", function() { selected = null });

  var onClickPlace = function(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    var $el = $(this).closest(".leaflet-popup");
    var $textarea = $el.find("textarea");
    var comment = $textarea.val();
    var data = JSON.stringify({ coordinates: coordinates, name: name, address: address, comment: comment });

    if (!comment) {
      $wrapper = $el.find(".leaflet-popup-content-wrapper");
      $wrapper.addClass('animated shake');
      $wrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $wrapper.removeClass("animated shake");
      });
      return;
    }

    $el.find(".message").fadeIn(150);

    $.ajax({ url: "/place", data: data, type: "POST", contentType: "application/json", dataType: "json" }).done(function(data) {
      $el.find(".message .success").animate({ top: 0 }, { duration: 100, easing: "easeOutQuad" });

      var geojsonMarkerOptions = {
        radius: 7,
        fillColor: "#f05658",
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 1
      };

      var marker = L.circleMarker(coordinates, geojsonMarkerOptions);
      marker.addTo(map);
      var content = getPopupContent(map, name, address, coordinates, { type: 2, comment: comment, profile_image_url: avatar, screen_name: username }, true)
      marker.bindPopup(content.content, content.options)
    });
  };

  $(".js-add-place").off("click", onClickPlace);
  $(".js-add-place").on("click", onClickPlace);

};

var goToCoordinates = function(map, coordinates) {
  map.panTo(coordinates);

  setTimeout(function() {
    map.setZoom(15);
  }, 500);
};

var setupOnPressKey = function() {
  $(document).on("keyup", function(e) {
    if (e.keyCode === 27) {
      map.closePopup();
    }
  });
};

onVisLoaded = function(vis, layers) {

  setupOnPressKey();
  var layer = layers[1]
  layer.setInteraction(true);
  var sublayer = layer.getSubLayer(0);

  map = vis.getNativeMap();

  map.on('click', onMapClick);

  sublayer.setInteractivity('cartodb_id, name, description, comment, latitude, longitude, profile_image_url, screen_name');

  var subLayerOptions = {
    sql: "SELECT *, ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude FROM jp",
  }

  sublayer.set(subLayerOptions);

  layer.on('mouseover', function() {
    if (!popup || (popup && popup.options && popup.options.type !== 1)) {
      $('.leaflet-container').css('cursor','help');
    }
  });

  layer.on('mouseout', function() {
    $('.leaflet-container').css('cursor','auto');
  });

  layer.on('featureOut', function(e, latlng, pos, data, layer) {
    if (selected !== -1 && !popup || (popup && popup.options && popup.options.type !== 1)) {
      selected = null;
      map.closePopup();
    }
  });
  layer.on('featureOver', function(e, latlng, pos, data, layer) {
    e & e.preventDefault();
    e & e.stopPropagation();

    if (selected !== -1 && selected !== data.cartodb_id) {
      selected = data.cartodb_id;
      openPopup(map, data.name, data.description, [data.latitude, data.longitude], { type: 2, comment: data.comment, profile_image_url: data.profile_image_url, screen_name: data.screen_name }, true);
    }
  });

  var $input = $(".js-search-place");
  autocomplete = new google.maps.places.Autocomplete($input[0]);
  geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChange);

}

$(function() {

  if (username !== "anonymous") {
    $("body").addClass("is--logged");
  }

  $(".js-information-pane > div").html('<h3>Hello, ' + (username !== "anonymous" ? username : "stranger" ) + '!</h3><p>Thanks for helping me with my Japan trip! Please, feel free to add some places you like and some tips for me.<span class="TwitterHelp"><br /><br />Also, if you connect this website with your Twitter account I\'ll know who to say thanks to.</span><br /><br />Best,<br /><a href="http://www.twitter.com/javier">Javier Arce</a></p> <a href="/login" class="Button">Login with Twitter</a>');
  $('.js-information-pane').show().addClass('animated bounceInUp');


  cartodb.createVis('map', config.vizjson, config.mapOptions).done(onVisLoaded);
});
