var Backbone = require('backbone');

module.exports = Backbone.Collection.extend({
  url: '/comments',

  parse: function (response) {
    return response.rows;
  }
});

