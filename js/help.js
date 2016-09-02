var Backbone = require('backbone');
var template = require('./help.tpl');

var LocalStorage = require('./local-storage');
var STORAGE_KEY = 'japanmap';
var STORAGE_KEY_HELP = 'help';
var CoreView = require('./core-view');

module.exports = CoreView.extend({

  className: 'InformationPane',

  events: {
    'click .js-help': '_onHelpClick'
  },

  initialize: function (options) {
    LocalStorage.init(STORAGE_KEY);

    this.options = options;

    var open = !(LocalStorage.get(STORAGE_KEY_HELP) === false);

    this.model = new Backbone.Model({ open: open });

    this.model.on('change:open', this._onChangeOpen, this);
  },

  render: function () {
    this.$el.append(template({
      username: this._getUsername(),
      tooltip: 'Hi!'
    }));

    if (this.model.get('open')) {
      this.$el.find('.js-pane').delay(550).fadeIn(250);
    } else {
      this.$el.addClass('animated bounceIn');
    }

    return this;
  },

  close: function () {
    this.model.set('open', false);
  },

  _onChangeOpen: function () {
    if (this.model.get('open')) {
      this._show();
    } else {
      this._hide();
    }
  },

  _show: function () {
    var self = this;

    this.$el.find('.js-pane').fadeIn(150, function () {
      self.$el.addClass('is--open');
    });
  },

  _hide: function () {
    var self = this;

    this.$el.find('.js-pane').fadeOut(150, function () {
      self.$el.removeClass('is--open');
    });

    LocalStorage.set(STORAGE_KEY_HELP, JSON.stringify(this.model.get('open')));
  },

  _onHelpClick: function (e) {
    this.model.set('open', !this.model.get('open'));
  },

  _onCloseClick: function (e) {
    this._killEvent(e);
    this.model.set('open', !this.model.get('open'));
  },

  _getUsername: function () {
    return this.options.username !== 'anonymous' ? this.options.username : 'stranger';
  },

  isOpen: function () {
    return this.model.get('open');
  }
});

