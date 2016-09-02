var Backbone = require('backbone');
var template = require('./data-download.tpl');

module.exports = Backbone.View.extend({
  className: 'DataDownload',

  initialize: function (options) {
    this.options = options;
    this.model = new Backbone.Model({ count: '…' });
    this.model.bind('change:count', this._updateCount, this);
  },

  render: function () {
    this.$el.append(template({
      url: '/download',
      tooltip: 'Download dataset',
      count: this.model.get('count')
    }));

    this.$el.addClass('animated bounceIn');

    return this;
  },

  setCount: function (count) {
    this.model.set('count', count);
  },

  _updateCount: function () {
    this.$('.js-count').text(this.model.get('count'));
  }
});
