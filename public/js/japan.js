/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

var InputField = Backbone.View.extend({

  className: "InputField",

  template: '<input type="text" placeholder="Search for a nice place" /><a href="#" class="CenterMapButton js-center-button"></a>',

  events: {
    "click input": "_onSearchClick",
    "click .js-center-button": "_onCenterButtonClick"
  },

  initialize: function(options) {
    this.options = options;
  },

  render: function() {
    this.$el.html(_.template(this.template));
    return this;
  },

  _onCenterButtonClick: function(e) {
    e & e.preventDefault();
    e & e.stopPropagation();
    this.trigger("onCenterButtonClick", this)
  },

  _onSearchClick: function(e) {
    e & e.preventDefault();
    e & e.stopPropagation();
    this.trigger("onSearchClick", this)
  }
});

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
      view.bind("onClick", function(coordinates) {
        self.trigger("goToCoordinates", coordinates, self);
      });
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

    this.trigger("onClick", coordinates, this);
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

    var open = this.model.get("open");

    if (localStorage) {
      var help = localStorage.getItem("japan_trip_help");
      if (help) {
        if (JSON.parse(help).open === false) {
          open = false;
          this.model.set({ open: false }, { silent: true });
        }
      }
    }

    if (open) {
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

      if (localStorage) {
        localStorage.setItem("japan_trip_help", JSON.stringify({ open: this.model.get("open")}));
      }
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
    places: ["Unknown place", "Misterious place", "Misterious location", "Unkown spot", "Uncharted spot", "Unexplored location", "Unnamed location", "Exotic place"],
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

    this._renderInputField();
    this._renderInformationPane();
    this._renderComments();
  },

  _renderInformationPane: function() {
    this.informationPane = new InformationPane({ username: username });
    this.$el.append(this.informationPane.render().$el);
  },

  _renderComments: function() {
    var self = this;

    this.comments = new CommentsView();
    this.comments.bind("goToCoordinates", function(coordinates) {
      self._goTo(17, coordinates);
    });
    this.$el.append(this.comments.render().$el);
  },

  _renderInputField: function() {
    this.searchField = new InputField();
    this.searchField.bind("onSearchClick", this._closeInformationPane, this);
    this.searchField.bind("onCenterButtonClick", this._centerMap, this);
    this.$el.append(this.searchField.render().$el);
  },

  _closeInformationPane: function() {
    this.informationPane.close();
  },

  _centerMap: function() {
    var self = this;
    this.map.setZoom(7);
    setTimeout(function() {
      self.map.panTo([36.1733569352216, 137.757568359375]);
    }, 250);

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

    this._setupLocalStorage();

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

    this.autocomplete = new google.maps.places.Autocomplete(this.searchField.$("input")[0], {
      componentRestrictions: { country: "jp" }
    });
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._onPlaceChange);

    this.geocoder = new google.maps.Geocoder();
  },

  _setupLocalStorage: function() {

    if (!localStorage) return;

    var storedPosition = localStorage.getItem("japan_trip");

    if (storedPosition) {
      var position = JSON.parse(storedPosition);
      this._goTo(position.zoom, [position.lat, position.lng]);
    }

    this.map.on('moveend', function(e) {
      localStorage.setItem("japan_trip", JSON.stringify( { zoom: e.target.getZoom(), lat: e.target.getCenter().lat, lng: e.target.getCenter().lng } ))
    });

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

    var placeholder = _.template(this.placeholder_template, { place: (name !== null ? ("to " + name) : "here" ), username: (username !== "anonymous" ? ", @" + username : "" ) });

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

  _goTo: function(zoom, coordinates) {
    var self = this;

    this.map.setZoom(zoom);

    setTimeout(function() {
      self.map.panTo(coordinates);
    }, 250);
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
