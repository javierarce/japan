var CoreView = require('./core-view');
var template = require('./input-field.tpl');

module.exports = CoreView.extend({
  className: 'InputField',

  events: {
    'click input': '_onSearchClick',
    'click .js-button': '_onCenterButtonClick'
  },

  initialize: function (options) {
    this.options = options;
  },

  render: function () {
    this.$el.html(template({
      placeholder: 'Search for a nice place',
      tooltip: 'Center the map'
    }));
    return this;
  },

  _onCenterButtonClick: function (e) {
    this.trigger('onCenterButtonClick', this);
  },

  _onSearchClick: function (e) {
    this._killEvent(e);
    this.trigger('onSearchClick', this);
  }
});
