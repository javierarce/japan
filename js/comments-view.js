var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./comments-view.tpl');
var Comments = require('./comments');
var CommentView = require('./comment-view');
var CoreView = require('./core-view');

module.exports = CoreView.extend({

  className: 'CommentsPane is--first-time',

  events: {
    'click .js-toggle': '_onToggleClick'
  },

  initialize: function () {
    this.comments = new Comments();
    this.comments.bind('reset', this._onLoadComments, this);
    this.comments.fetch({ success: this._onLoadComments.bind(this) });

    this.model = new Backbone.Model({ open: false, first: true });
    this.model.on('change:open', this._onChangeOpen, this);
  },

  render: function () {
    this.$el.empty();
    this.$el.html(template);
    this.comments.each(this._renderComment, this);
    return this;
  },

  refresh: function () {
    this.model.set('first', true);
    this.comments.fetch({ success: this._onSuccess.bind(this) });
  },

  _onSuccess: function () {
    this._onLoadComments();
    this._onChangeOpen();
  },

  _onLoadComments: function () {
    this.render();
    this.trigger('fetched', this.comments, this);
    this.$el.addClass('has--loaded');
  },

  _renderComment: function (comment) {
    var view = new CommentView({ model: comment });

    view.bind('onClick', function (coordinates) {
      this.trigger('goToCoordinates', { coordinates: coordinates, comment: comment }, this);
    }, this);

    this.$('.js-comment-list').append(view.render().$el);
  },

  _onChangeOpen: function () {
    var self = this;

    if (this.model.get('open')) {
      if (this.model.get('first')) {
        this.$el.find('.js-comment-item').each(function (i, el) {
          if (i > 10) {
            i = 10;
          }

          $(el).delay(100 * i).queue(function (now) {
            $(this).show().addClass('animated-fast fadeInUp');
            now();
          });
        });
      }

      this.$el.animate({ right: 0 }, { duration: 100, easing: 'easeInQuad', complete: function () {
        self.$el.addClass('is--open');
        self.model.set('first', false);
        self.$el.removeClass('is--first-time');
      }});
    } else {
      this.$el.animate({ right: -250 }, { duration: 100, easing: 'easeOutQuad', complete: function () {
        self.$el.removeClass('is--open');
      }});
    }
  },

  _onToggleClick: function (e) {
    this.model.set('open', !this.model.get('open'));
  }
});
