var InfoPod = Backbone.View.extend({
  initialize: function() {
  },

  render: function() {
  }
});

var InformationPane = Backbone.View.extend({

  className: "InformationPane",

  template: '<div class="PaneContent"><h3>Hello, <%= username %>!</h3><p>Thanks for helping me out with my Japan trip!<br /><br />Please, feel free to add some places you like using the search field up there. <span class="TwitterHelp">Also, if you connect this website with your Twitter account I\'ll know who to say thanks to.</span><br /><br />Best,<br /><a href="http://www.twitter.com/javier">Javier Arce</a></p> <a href="/login" class="Button">Login with Twitter</a></div>', 

  initialize: function(options) {
    this.options = options;
  },

  render: function() {
    var username = this.options.username !== "anonymous" ? this.options.username : "stranger";

    this.$el.append(_.template(this.template, { username: username }));

    this.$el.show().addClass('animated bounceInUp');

    return this;
  }
});

var App = Backbone.View.extend({

  el: "body",

  defaults: {
    mapOptions: {
      https: true,
      zoom: true,
      scrollwheel: true,
      loaderControl: false,
      search:false,
      shareable: false
    },
    style: {
      marker: {
        radius: 7,
        fillColor: "#f05658",
        color: "#ffffff",
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 1
      }
    },
    vizjson: 'https://arce.cartodb.com/api/v2/viz/84c40c80-e5ef-11e4-a74b-0e853d047bba/viz.json'
  },

  initialize: function() {

    _.bindAll(this, "_onVisLoaded", "_onPlaceChange", "_onClickPlace", "_onMapClick", "_onFinishedGeocoding", "_onMouseOver", "_onMouseOut", "_canClosePopup", "_onFeatureOver", "_onFeatureOut");

    this._setupModel();

    cartodb.createVis('map', this.defaults.vizjson, this.defaults.mapOptions).done(this._onVisLoaded);
    this.render();
  },

  render: function() {

    if (username !== "anonymous") {
      $("body").addClass("is--logged");
    }

    var information = new InformationPane({ username: username });
    this.$el.append(information.render().$el);

  },

  _killEvent: function(e) {
    e & e.preventDefault();
    e & e.stopPropagation();
  },

  _setupModel: function() {
    this.model = new Backbone.Model({ 
      selected: null
    });
  },

  _onVisLoaded: function(vis, layers) {

    this._setupOnPressKey();

    var layer = layers[1]
    layer.setInteraction(true);
    var sublayer = layer.getSubLayer(0);

    this.map = vis.getNativeMap();

    this.map.on('click', this._onMapClick);

    sublayer.setInteractivity('cartodb_id, name, description, comment, latitude, longitude, profile_image_url, screen_name');

    var subLayerOptions = {
      sql: "SELECT *, ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude FROM jp",
    }

    sublayer.set(subLayerOptions);

    layer.on('mouseover',   this._onMouseOver);
    layer.on('mouseout',    this._onMouseOut);
    layer.on('featureOut',  this._onFeatureOut, this);
    layer.on('featureOver', this._onFeatureOver);

    var $input = $(".js-search-place");
    this.autocomplete = new google.maps.places.Autocomplete($input[0]);
    this.geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._onPlaceChange);
  },

  _onFeatureOut: function(e, latlng, pos, data, layer) {
    if (this.model.get("selected") !== -1 && this._canClosePopup()) {
      this.model.set("selected", null);
      this.map.closePopup();
    }
  },

  _onMouseOut: function() {
    $('.leaflet-container').css('cursor','auto');
  },

  _onMouseOver: function() {
    if (this._canClosePopup()) {
      $('.leaflet-container').css('cursor','help');
    }
  },

  _canClosePopup: function() {
    return (!this.popup || (this.popup && this.popup.options && this.popup.options.type !== 1));
  },

  _onFeatureOver: function(e, latlng, pos, data, layer) {
    this._killEvent(e);

    if (this.model.get("selected") !== -1 && this.model.get("selected") !== data.cartodb_id) {
      this.model.set("selected", data.cartodb_id);
      this._openPopup(data.name, data.description, [data.latitude, data.longitude], { type: 2, comment: data.comment, profile_image_url: data.profile_image_url, screen_name: data.screen_name }, true);
    }
  },

  _onFinishedGeocoding: function(coordinates, results, status) {
    var coordinates = [coordinates[0], coordinates[1]];

    if (status == google.maps.GeocoderStatus.OK) {
      if (results && results.length > 0) {
        this._openPopup(null, results[0].formatted_address, coordinates, { type: 1});
      } else {
        this._openPopup(null, "Unknown street", coordinates, { type: 1});
      }
    } else {
      this._openPopup(null, "Unknown street", coordinates, { type: 1});
    }
  },

  _onMapClick: function(e) {

    this.model.set("selected", -1);
    var coordinates = [e.latlng.lat, e.latlng.lng];
    var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);

    var self = this;
    this.geocoder.geocode({ 'latLng': latlng }, function(results, status) {
      self._onFinishedGeocoding(coordinates, results, status);
    });
  },

  _getPopupContent: function(name, address, coordinates, opts, readonly) {

    var comment = "";
    var profile_image_url = avatar;

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

    var template = '<div class="header"><h3><%= name %></h3></div><div class="Body"><div class="message"><div class="Spinner"></div><div class="success"></div></div><div class="comment"><img class="Avatar" src="<%= profile_image_url %>" /><%= comment %></div><textarea placeholder="<%= placeholder %>" name="name" rows="8" cols="40"></textarea><div class="Controls"><a href="#" class="Button js-add-place">Add this place</a></div></div><div class="footer"><%= address %></div>';

    var content = _.template(template, { name: name, profile_image_url: profile_image_url, placeholder: placeholder, address: address, comment: comment });

    var className = readonly ? "is--readonly" : "";

    var options = {
      type: opts.type,
      className: "Popup " + className,
      offset: new L.Point(0, 0)
    };

    return { content: content, options: options };

  },

  _onPlaceChange: function() {
    var place = this.autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    this.model.set("selected", -1);

    if (place.geometry.location) {
      var coordinates = [place.geometry.location.lat(), place.geometry.location.lng()];
      this._goToCoordinates(coordinates);

      var self = this;
      setTimeout(function() {
        self._openPopup(place.name, place.formatted_address, coordinates, { type: 1 });
      }, 900);
    }
  },

  _openPopup: function(name, address, coordinates, opts, readonly) {

    var content = this._getPopupContent(name, address, coordinates, opts, readonly);

    this.popup = L.popup(content.options)
    .setLatLng(coordinates)
    .setContent(content.content)
    .openOn(this.map);

    var self = this;

    this.map.on("popupclose", function() { 
      self.model.set("selected", null);
    });

    $(".js-add-place").off("click", this._onClickPlace);
    $(".js-add-place").on("click", function(e) {
      self._onClickPlace(e, name, address, coordinates);
    });

  },

  _onClickPlace: function(e, name, address, coordinates) {
    this._killEvent(e);

    var $el = $(this.popup._container);
    var data = { coordinates: coordinates, name: name, address: address, comment: $el.find("textarea").val() };

    if (!data.comment) {
      this._shakePopup();
      return;
    }

    var self = this;
    $el.find(".message").fadeIn(150);
    $.ajax({ url: "/place", data: JSON.stringify(data), type: "POST", contentType: "application/json", dataType: "json" }).done(function() {
      $el.find(".message .success").animate({ top: 0 }, { duration: 100, easing: "easeOutQuad" });
      self._addMarker(data);
    });
  },

  _shakePopup: function() {
    var $el = $(this.popup._container);
    $wrapper = $el.find(".leaflet-popup-content-wrapper");
    $wrapper.addClass('animated shake');
    $wrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $wrapper.removeClass("animated shake");
    });
  },

  _addMarker: function(data) {
    var geojsonMarkerOptions = this.defaults.style.marker;
    var marker = L.circleMarker(data.coordinates, geojsonMarkerOptions);
    marker.addTo(this.map);

    var content = this._getPopupContent(data.name, data.address, data.coordinates, { type: 2, comment: data.comment, profile_image_url: avatar, screen_name: username }, true)
    marker.bindPopup(content.content, content.options)
  },

  _goToCoordinates: function(coordinates) {
    this.map.panTo(coordinates);

    var self = this;
    setTimeout(function() {
      self.map.setZoom(15);
    }, 500);
  },

  _setupOnPressKey: function() {
    var self = this;
    $(document).on("keyup", function(e) {
      if (e.keyCode === 27) {
        self.map.closePopup();
      }
    });
  }

});

$(function() {
  app = new App();
});
