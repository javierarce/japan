var Comment = Backbone.Model.extend();

var Comments = Backbone.Collection.extend({
  model: Comment,
  url: "https://arce.cartodb.com/api/v2/sql?q=SELECT *, ST_X(ST_Centroid(the_geom)) as longitude,ST_Y(ST_Centroid(the_geom)) as latitude FROM jp ORDER BY created_at DESC",
  parse: function(response) {
    return response.rows;
  }
});

var CommentsView = Backbone.View.extend({

  className: "CommentsPane is--first-time",

  events: {
    "click .js-toggle": "_onToggleClick"
  },

  template: '<a href="#" class="ToggleButton js-toggle"></a><div class="CommentsInnerContent"><ul class="CommentList"></ul></div>',

  initialize: function() {
    this.comments = new Comments();
    this.comments.bind("reset", this._onLoadComments, this);
    this.comments.fetch();
    this.model = new Backbone.Model({ open: false });
    this.model.on("change:open", this._onChangeOpen, this);
  },

  _onLoadComments: function() {
    this.$el.addClass("has--loaded");
    this.render();
  },

  _renderComments: function() {
    var self = this;
    i = 0;
    this.comments.each(function(comment) {
      var view = new CommentView({ model: comment })
      i = i+1;
      self.$el.find("ul").append(view.render().$el);
    });
  },

  render: function() {
    this.$el.html(_.template(this.template));
    this._renderComments();
    return this;
  },

  _onChangeOpen: function() {
    var self = this;

    if (this.model.get("open")) {

      if (this.$el.hasClass("is--first-time")) {
        this.$el.find(".CommentItem").each(function(i, el) {
          if (i > 10) i = 10;
          $(el).delay(150*i).queue(function(now){
            $(this).show().addClass('animated-fast fadeInUp');
            now();
          });
        });
      }

      this.$el.animate({ right: 0 }, { duration: 150, easing: "easeInQuad", complete: function(){
        self.$el.addClass("is--open");
        self.$el.removeClass("is--first-time");
      }});
    } else {
      this.$el.animate({ right: -250}, { duration: 150, easing: "easeOutQuad", complete: function() {
        self.$el.removeClass("is--open");
      }});
    }
  },

  _onToggleClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.model.set("open", !this.model.get("open"));
  }
});

var CommentView = Backbone.View.extend({

  events: {
    "click": "_onMouseClick",
    "click .js-avatar": "_onAvatarClick"
  },

  tagName: "li",

  className: "CommentItem",

  template: '<div class="Body"><div class="comment"><a class="js-avatar" href="http://twitter.com/<%= screen_name %>"><img class="Avatar" src="<%= profile_image_url %>" /></a><p><% if (name) { %><strong><%= name %></strong>: <% } %><%= comment %></p></div></div><div class="Footer"><%= description %></div>',

  initialize: function() {
  },

  render: function() {
    var comment = this.model.get("comment").length > 140 ? this.model.get("comment").substring(0, 140) + '...' : this.model.get("comment");
    var options = _.extend(this.model.toJSON(), { comment: comment });
    this.$el.append(_.template(this.template, options));
    return this;
  },

  _onMouseClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var coordinates = [this.model.get("latitude"), this.model.get("longitude")];
      app.map.setZoom(17);

    setTimeout(function() {
    app.map.panTo(coordinates);
    }, 250)
  },

  _onAvatarClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var url = this.$el.find(".js-avatar").attr("href");
    window.location = url;
  }
});

var InformationPane = Backbone.View.extend({

  className: "InformationPane",

  events: {
    "click .js-close": "_onCloseClick",
    "click .js-help": "_onHelpClick"
  },

  template: '<div class="InformationPaneInner"><div class="PaneContent"><h3>Hello, <%= username %>!<a href="#" class="CloseButton js-close">×</a></h3><p>As you may have heard, I\'m planning a trip to Japan at the end of May. It\'ll be my very first time there and my FOMO levels are skyrocketing. What places should I visit? Where should I eat? What are the hidden secrets of this magical and crazy island? Please, help me by adding some of your favorite spots using the search field up there.<span class="TwitterHelp"><br /><br />Also, if you connect this website with your Twitter account I\'ll know who to say thanks to :^)</span><br /><br />どうもありがとう,<br /><a href="http://www.twitter.com/javier">Javier Arce</a></p> <a href="/login" class="Button">Connect with Twitter</a></div><div class="tip-container"><div class="tip"></div></div></div><a href="#" class="help js-help">?</a>',

  initialize: function(options) {
    this.options = options;
    this.model = new Backbone.Model({ open: this.options.username === "anonymous" ? true : false });
    this.model.on("change:open", this._onChangeOpen, this);
  },

  render: function() {
    var username = this.options.username !== "anonymous" ? this.options.username : "stranger";
    this.$el.append(_.template(this.template, { username: username }));

    if (this.model.get("open")) {
      this.$el.find(".InformationPaneInner").delay(550).fadeIn(250);
    }

    return this;
  },

  close: function() {
    this.model.set("open", false);
  },

  _onChangeOpen: function() {
    var self = this;
    if (this.model.get("open")) {
      this.$el.find(".InformationPaneInner").fadeIn(250, function(){
        self.$el.addClass("is--open");
      });
    } else {
      this.$el.find(".InformationPaneInner").fadeOut(250, function(){
        self.$el.removeClass("is--open");
      });
    }
  },

  _onHelpClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.model.set("open", !this.model.get("open"));
  },

  _onCloseClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.model.set("open", !this.model.get("open"));
  }
});

var App = Backbone.View.extend({

  el: "body",

  defaults: {
    places: ["Unknown place", "Misterious place", "Misterious location", "Unkown spot"],
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

  placeholder_template: "Why do you think I should go <%= place %><%= username %>?",

  popup_template: '<div class="Header"><h3><%= name %></h3></div><div class="Body"><div class="Message"><div class="Spinner"></div><div class="Success"><div class="SuccessMessage"><strong>どうもありがとう!</strong></div></div></div><div class="Comment"><img class="Avatar" src="<%= profile_image_url %>" /><%= comment %></div><textarea placeholder="<%= placeholder %>" name="name" rows="8" cols="40"></textarea><div class="Controls"><a href="#" class="Button js-add-place">Add this place</a></div></div><div class="Footer"><%= address %></div>',

  events: {
    "click .js-search-place": "_onSearchClick",
  },

  _onSearchClick: function(e) {
    this._killEvent(e);
    this.informationPane.close();
  },

  initialize: function() {

    _.bindAll(this, "_onVisLoaded", "_onPlaceChange", "_onClickPlace", "_onMapClick", "_onFinishedGeocoding", "_onMouseOver", "_onMouseOut", "_canClosePopup", "_onFeatureClick", "_onFeatureOver", "_onFeatureOut");

    this._setupModel();

    cartodb.createVis('map', this.defaults.vizjson, this.defaults.mapOptions).done(this._onVisLoaded);
    this.render();
  },

  render: function() {

    if (username !== "anonymous") {
      $("body").addClass("is--logged");
    }

    this.informationPane = new InformationPane({ username: username });
    this.$el.append(this.informationPane.render().$el);

    this.comments = new CommentsView();
    this.$el.append(this.comments.render().$el);

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

    layer.on('mouseover',    this._onMouseOver);
    layer.on('mouseout',     this._onMouseOut);
    layer.on('featureOut',   this._onFeatureOut);
    layer.on('featureOver',  this._onFeatureOver);
    layer.on('featureClick', this._onFeatureClick);

    var $input = $(".js-search-place");

    this.autocomplete = new google.maps.places.Autocomplete($input[0], {
      componentRestrictions: { country: "jp" }
    });

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

  _onFeatureClick: function(e, latlng, pos, data, layer) {
    this._killEvent(e);

    if (this.t) {
      clearInterval(this.t);
    }

    this.map.closePopup();
    this.model.set("selected", data.cartodb_id);
    this._openPopup(data.name, data.description, [data.latitude, data.longitude], { type: 2, comment: data.comment, profile_image_url: data.profile_image_url, screen_name: data.screen_name }, true);
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
    var self = this;

    this.informationPane.close();

    this.t = setTimeout(function()  {
      self.model.set("selected", -1);
      var coordinates = [e.latlng.lat, e.latlng.lng];
      var latlng = new google.maps.LatLng(coordinates[0], coordinates[1]);

      self.geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        self._onFinishedGeocoding(coordinates, results, status);
      });
    }, 200);
  },

  _getPlaceName: function(name) {
    if (name) {
      return name;
    }

    return _.shuffle(this.defaults.places)[0];
  },

  _getPopupContent: function(name, address, coordinates, opts, readonly) {

    var comment = "";
    var profile_image_url = avatar;

    if (opts) {
      comment           = opts.comment;
      profile_image_url = opts.profile_image_url || avatar;
    }

    var placeholder = _.template(this.placeholder_template, { place: (name !== null ? ("to " + name) : "here" ), username: (username !== "anonymous" ? ", " + username : "" ) });

    var content = _.template(this.popup_template, { 
      name: this._getPlaceName(name),
      profile_image_url: profile_image_url,
      placeholder: placeholder,
      address: address,
      comment: comment
    });

    var options = {
      type: opts.type,
      className: "Popup " + (readonly ? "is--readonly" : ""),
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

      console.log(place)
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
    $el.find(".Message").fadeIn(150);
    $.ajax({ url: "/place", data: JSON.stringify(data), type: "POST", contentType: "application/json", dataType: "json" }).done(function() {
      $el.find(".Message .Success").animate({ top: 0 }, { duration: 100, easing: "easeOutQuad" });
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
        self.informationPane.close();
      }
    });
  }

});

$(function() {
  app = new App();
});
