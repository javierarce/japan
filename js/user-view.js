var _ = require('underscore');
var Backbone = require('backbone');
var template = require('./user-view.tpl');

module.exports = Backbone.View.extend({
  className: 'UserAvatar',

  initialize: function (options) {
    this.options = options;
  },

  render: function () {
    this.$el.append(template(_.extend(this.options, {
      url: 'http://www.twitter.com/' + this.options.username
    })));

    if (this.options.username && this.options.username !== 'anonymous') {
      this.$el.addClass('is--connected animated bounceIn');
    }

    return this;
  }
});
