var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
require('jquery.easing');

var popupTemplate = require('./popup.tpl');
var placeholderTemplate = require('./placeholder.tpl');

var CoreView = require('./core-view');
var LocalStorage = require('./local-storage');
var InformationPane = require('./help');
var UserView = require('./user-view');
var DataDownload = require('./data-download');
var InputField = require('./input-field');
var Comment = require('./comment');
var CommentsView = require('./comments-view');

var STORAGE_KEY = 'japanmap';
var STORAGE_KEY_POPUP = 'popup';
var STORAGE_KEY_POSITION = 'position';
var STORAGE_KEY_COMMENT = 'comment';
var READONLY = true;

var PLACES = ['Unknown place', 'Misterious place', 'Misterious location', 'Unkown spot', 'Uncharted spot', 'Unexplored location', 'Unnamed location', 'Exotic place'];

var App = CoreView.extend({
  el: 'body',

  initialize: function (opts) {
    _.bindAll(this, '_onMapClick', '_onMapDblClick', '_onVisLoaded', '_onPlaceChange', '_onClickPlace', '_onFinishedGeocoding', '_onMouseOver', '_onMouseOut', '_canClosePopup', '_onFeatureClick', '_onFeatureOver', '_onFeatureOut');

    this.options = opts;

    this._setupOptions();
    this._setupModel();

    cartodb.createVis('map', this.options.vizjson, this.options.mapOptions).done(this._onVisLoaded);
    this.render();
  },

  _setupOptions: function () {
    this.options = _.extend(this.options, {
      places: PLACES,
      mapOptions: {
        center: this.options.map.coordinates,
        zoom: this.options.map.zoom,
        https: true,
        scrollwheel: true,
        loaderControl: false,
        search: false,
        shareable: false
      },
      style: {
        marker: {
          radius: 7,
          fillColor: '#F05658',
          color: '#FFFFFF',
          weight: 1.5,
          opacity: 0.9,
          fillOpacity: 1
        }
      },
      vizjson: this.options.vizjson
    });
  },

  render: function () {
    if (this.options.username !== 'anonymous') {
      $('body').addClass('is--logged');
    }

    this._renderInputField();
    this._renderInformationPane();
    this._renderComments();
    this._renderDataDownload();
    this._renderUser();
  },

  _onGoToCoordinates: function (response) {
    var coordinates = response.coordinates;
    var comment = response.comment;

    this._openPopup(comment.get('name'), comment.get('description'), [coordinates[0], coordinates[1]], {
      type: 2,
      comment: comment.get('comment'),
      profile_image_url: comment.get('profile_image_url'),
      screen_name: comment.get('screen_name')
    }, READONLY);

    this._goToCoordinates(coordinates);
  },

  _renderInformationPane: function () {
    this.informationPane = new InformationPane({ username: this.options.username });
    this.$el.append(this.informationPane.render().$el);
  },

  _renderDataDownload: function () {
    this._dataDownload = new DataDownload();
    this.$el.append(this._dataDownload.render().$el);
  },

  _renderUser: function () {
    this.user = new UserView({ username: this.options.username, src: this.options.avatar });
    this.$el.append(this.user.render().$el);
  },

  _renderComments: function () {
    this.comments = new CommentsView();
    this.comments.bind('goToCoordinates', this._onGoToCoordinates, this);
    this.comments.bind('fetched', this._updateCommentsCount, this);
    this.$el.append(this.comments.render().$el);
  },

  _renderInputField: function () {
    this.searchField = new InputField();
    this.searchField.bind('onSearchClick', this._closeInformationPane, this);
    this.searchField.bind('onCenterButtonClick', this._centerMap, this);
    this.$el.append(this.searchField.render().$el);
  },

  _updateCommentsCount: function (comments) {
    this._dataDownload.setCount(comments.size());
  },

  _closeInformationPane: function () {
    this.informationPane.close();
  },

  _centerMap: function () {
    this.map.setZoom(this.options.map.zoom);

    setTimeout(function () {
      this.map.panTo(this.options.map.coordinates);
    }.bind(this), 250);
  },

  _setupModel: function () {
    this.model = new Backbone.Model({
      selected: null
    });
  },

  _onVisLoaded: function (vis, layers) {
    this._setupOnPressKey();

    var layer = layers[1];
    layer.setInteraction(true);
    var sublayer = layer.getSubLayer(0);

    this.map = vis.getNativeMap();

    this.map.clicked = 0;

    this.map.on('click', this._onMapClick);
    this.map.on('dblclick', this._onMapDblClick);

    this._setupLocalStorage();

    sublayer.setInteractivity('cartodb_id, name, description, comment, latitude, longitude, profile_image_url, screen_name');

    var subLayerOptions = {
      sql: 'SELECT *, ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude FROM ' + this.options.map.table
    };

    sublayer.set(subLayerOptions);

    layer.on('mouseover', this._onMouseOver);
    layer.on('mouseout', this._onMouseOut);
    layer.on('featureOut', this._onFeatureOut);
    layer.on('featureOver', this._onFeatureOver);
    layer.on('featureClick', this._onFeatureClick);

    this.autocomplete = new google.maps.places.Autocomplete(this.searchField.$('input')[0], {
      componentRestrictions: { country: 'usa' }
    });

    google.maps.event.addListener(this.autocomplete, 'place_changed', this._onPlaceChange);

    this.geocoder = new google.maps.Geocoder();
  },

  _setupLocalStorage: function () {
    LocalStorage.init(STORAGE_KEY);

    if (LocalStorage.get(STORAGE_KEY_POPUP)) {
      var o = LocalStorage.get(STORAGE_KEY_POPUP);
      var options = _.toArray(JSON.parse(o));
      if (options.length) {
        this._openPopup.apply(this, options);
      }
    }

    var storedPosition = LocalStorage.get(STORAGE_KEY_POSITION);

    if (storedPosition) {
      var position = JSON.parse(storedPosition);
      this._goTo(position.zoom, [position.lat, position.lng]);
    }

    this.map.on('moveend', function (e) {
      LocalStorage.set(STORAGE_KEY_POSITION, JSON.stringify({
        zoom: e.target.getZoom(),
        lat: e.target.getCenter().lat,
        lng: e.target.getCenter().lng
      }));
    });
  },

  _onFeatureOut: function (e, latlng, pos, data, layer) {
    if (this.model.get('selected') !== -1 && this._canClosePopup()) {
      this.model.set('selected', null);
      this.map.closePopup();
    }
  },

  _onMouseOut: function () {
    $('.leaflet-container').css('cursor', 'auto');
  },

  _onMouseOver: function () {
    if (this._canClosePopup()) {
      $('.leaflet-container').css('cursor', 'help');
    }
  },

  _canClosePopup: function () {
    return (!this.popup || (this.popup && this.popup.options && this.popup.options.type !== 1));
  },

  _onFeatureClick: function (e, latlng, pos, data, layer) {
    this._killEvent(e);

    if (this.t) {
      clearTimeout(this.t);
    }

    this.map.closePopup();
    this.model.set('selected', data.cartodb_id);
    this._openPopup(data.name, data.description, [data.latitude, data.longitude], { type: 2, comment: data.comment, profile_image_url: data.profile_image_url, screen_name: data.screen_name }, true);
  },

  _onFeatureOver: function (e, latlng, pos, data, layer) {
    this._killEvent(e);

    if (this.model.get('selected') !== -1 && this.model.get('selected') !== data.cartodb_id) {
      this.model.set('selected', data.cartodb_id);
      this._openPopup(data.name, data.description, [data.latitude, data.longitude], { type: 2, comment: data.comment, profile_image_url: data.profile_image_url, screen_name: data.screen_name }, true);
    }
  },

  _onFinishedGeocoding: function (coordinates, results, status) {
    var c = [coordinates[0], coordinates[1]];

    if (status === google.maps.GeocoderStatus.OK) {
      if (results && results.length > 0) {
        this._openPopup(null, results[0].formatted_address, c, { type: 1 });
      } else {
        this._openUnknownStreetPopup(c);
      }
    } else {
      this._openUnknownStreetPopup(c);
    }
  },

  _openUnknownStreetPopup: function (c) {
    this._openPopup(null, 'Unknown street', c, { type: 1 });
  },

  _onMapClick: function (e) {
    var self = this;

    this.map.clicked = this.map.clicked + 1;

    if (this.informationPane.isOpen()) {
      this.map.clicked = 0;
      this.informationPane.close();
      return;
    }

    this.t = setTimeout(function () {
      if (self.map.clicked === 1) {
        self.model.set('selected', -1);
        self.map.clicked = 0;

        var coordinates = [e.latlng.lat, e.latlng.lng];

        self.geocoder.geocode({ 'latLng': self._getLatLngFromCoordinates(coordinates) }, function (results, status) {
          self._onFinishedGeocoding(coordinates, results, status);
        });
      }
    }, 250);
  },

  _getLatLngFromCoordinates: function (coordinates) {
    return new google.maps.LatLng(coordinates[0], coordinates[1]);
  },

  _onMapDblClick: function (e) {
    this.map.clicked = 0;
  },

  _getPlaceName: function (name) {
    if (name) {
      return name;
    }
    return _.shuffle(this.options.places)[0];
  },

  _getPopupContent: function (name, address, coordinates, opts, readonly) {
    var comment = LocalStorage.get(STORAGE_KEY_COMMENT);
    var profile_image_url = this.options.avatar;

    if (opts && opts.comment) {
      comment = opts.comment;
    }

    if (opts) {
      profile_image_url = opts.profile_image_url || this.options.avatar;
    }

    var anon = _.sample(['anonymous person', 'anonymous individual', 'mysterious person', 'mysterious individual', 'secretive individual']);
    var username = this.options.username !== 'anonymous' ? ', @' + this.options.username : ', ' + anon;
    var place = name !== null ? ('to ' + name) : 'here';
    var placeholder = placeholderTemplate({ place: place, username: username });

    var thanks = _.sample(['どうもありがとう!', 'Thanks!', 'Cool, thank you!', 'Thank you!', 'Nice, thanks!', 'Thaaaanks!']);

    var content = popupTemplate({
      logged_in: this.options.username !== 'anonymous',
      name: this._getPlaceName(name),
      profile_image_url: profile_image_url,
      placeholder: placeholder,
      address: address,
      comment: comment,
      thanks: thanks
    });

    var options = {
      type: opts.type,
      className: 'Popup ' + (readonly ? 'is--readonly' : ''),
      offset: new L.Point(0, 0)
    };

    return { content: content, options: options };
  },

  _onPlaceChange: function () {
    var place = this.autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    this.model.set('selected', -1);

    if (place.geometry.location) {
      var coordinates = [place.geometry.location.lat(), place.geometry.location.lng()];
      this._goToCoordinates(coordinates);

      setTimeout(function () {
        this._openPopup(place.name, place.formatted_address, coordinates, { type: 1 });
      }.bind(this), 900);
    }
  },

  _openPopup: function (name, address, coordinates, opts, readonly) {
    LocalStorage.set(STORAGE_KEY_POPUP, JSON.stringify(arguments));

    var content = this._getPopupContent(name, address, coordinates, opts, readonly);

    this.popup = L.popup(content.options)
    .setLatLng(coordinates)
    .setContent(content.content)
    .openOn(this.map);

    var self = this;

    this.map.on('popupclose', function () {
      LocalStorage.delete(STORAGE_KEY_POPUP);
      self.model.set('selected', null);
    });

    $('.js-comment').focus();

    $('.js-comment').off('keyup', this._onWriteComment);
    $('.js-comment').on('keyup', this._onWriteComment);

    $('.js-add-place').off('click', this._onClickPlace);
    $('.js-add-place').on('click', function (e) {
      self._onClickPlace(e, name, address, coordinates);
    });
  },

  _onWriteComment: function (e) {
    LocalStorage.set(STORAGE_KEY_COMMENT, $('.js-comment').val());
  },

  _onClickPlace: function (e, name, address, coordinates) {
    var $el = $(this.popup._container);
    var comment = new Comment({ coordinates: coordinates, name: name, address: address, comment: $el.find('textarea').val() });

    if (!comment.get('comment')) {
      this._shakePopup();
      return;
    }

    $el.find('.js-message').fadeIn(150);

    var self = this;

    comment.save({}, { success: function (comment) {
      $el.find('.js-message .Success').animate({ top: 0 }, { duration: 100, easing: 'easeOutQuad' });
      self._addMarker(comment);
    }});
  },

  _shakePopup: function () {
    var $el = $(this.popup._container).find('.leaflet-popup-content-wrapper');
    this._shake($el);
  },

  _addMarker: function (comment) {
    LocalStorage.delete(STORAGE_KEY_POPUP);
    LocalStorage.delete(STORAGE_KEY_COMMENT);

    this.comments.refresh();

    var coordinates = comment.get('coordinates');
    var marker = L.circleMarker(coordinates, this.options.style.marker);

    marker.addTo(this.map);

    var content = this._getPopupContent(comment.get('name'), comment.get('address'), coordinates, {
      type: 2,
      comment: comment.get('comment'),
      profile_image_url: this.options.avatar,
      screen_name: this.options.username
    }, true);

    marker.bindPopup(content.content, content.options);
  },

  _goTo: function (zoom, coordinates) {
    this.map.setZoom(zoom);

    setTimeout(function () {
      this.map.panTo(coordinates);
    }.bind(this), 250);
  },

  _goToCoordinates: function (coordinates) {
    this.map.panTo(coordinates);

    setTimeout(function () {
      this.map.setZoom(15);
    }.bind(this), 500);
  },

  _setupOnPressKey: function () {
    var self = this;

    $(document).on('keyup', function (e) {
      if (e.keyCode === 27) {
        self.map.closePopup();
        self.informationPane.close();
      }
    });
  }
});

$(function () {
  window.app = new App(window.config);
});
