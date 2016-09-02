var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  _killEvent: function (e) {
    e && e.preventDefault();
    e && e.stopPropagation();
  },

  _shake: function ($el) {
    $el.addClass('animated shake');
    $el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $el.removeClass('animated shake');
    });
  }
});
