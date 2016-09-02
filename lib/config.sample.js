var env = process.env.NODE_ENV || 'development';

var defaultPort = 5000;

var configuration = {
  development: {
    port: defaultPort,
    session_secret: 'my_little_dirty_secret',
    cartoDB_USER: '',
    cartoDB_API_KEY: '',
    callbackURL: 'http://localhost:5000/callback',
    default_table: 'jp',
    default_screen_name: 'anonymous',
    default_profile_image_url: 'http://mysite.com/avatar.png',
    vizjson_url: 'https://username.carto.com/api/v2/viz/1234/viz.json',
    google_api_key: 12345,
    feedOptions: {
      title: 'Title',
      description: 'Description',
      site_url: 'http://mysite.com',
      copyright: '2016 Name',
      language: 'en',
      ttl: '60'
    }
  },
  production: {
    port: defaultPort,
    session_secret: 'my_little_dirty_secret',
    cartoDB_USER: '',
    cartoDB_API_KEY: '',
    callbackURL: 'http://localhost:5000/callback',
    default_table: 'jp',
    default_screen_name: 'anonymous',
    default_profile_image_url: 'http://mysite.com/avatar.png',
    vizjson_url: 'https://username.carto.com/api/v2/viz/1234/viz.json',
    google_api_key: 12345,
    feedOptions: {
      title: 'Title',
      description: 'Description',
      site_url: 'http://mysite.com',
      copyright: '2016 Name',
      language: 'en',
      ttl: '60'
    }
  }
};

var Config = configuration[env];
module.exports.Config = Config;
