var _ = require('underscore');
var template = require('./comment-view.tpl');

var CoreView = require('./core-view');

var MAX_LENGTH = 140;

module.exports = CoreView.extend({
  events: {
    'click': '_onMouseClick',
    'click .js-avatar': '_onAvatarClick'
  },

  tagName: 'li',

  className: 'CommentItem js-comment-item',

  render: function () {
    var options = _.extend(this.model.toJSON(), { comment: this._getComment() });
    this.$el.append(template(options));
    return this;
  },

  _getComment: function () {
    if (this.model.get('comment').length > MAX_LENGTH) {
      return this.model.get('comment').substring(0, MAX_LENGTH) + '...';
    }

    return this.model.get('comment');
  },

  _onMouseClick: function (e) {
    this._killEvent(e);

    var coordinates = [this.model.get('latitude'), this.model.get('longitude')];

    this.trigger('onClick', coordinates, this);
  },

  _onAvatarClick: function (e) {
    this._killEvent(e);

    var url = this.$el.find('.js-avatar').attr('href');
    window.location = url;
  }
});
