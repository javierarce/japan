var env = process.env.NODE_ENV || 'development';

var defaultPort = 5000;

var configuration = {
  development: {
    port: defaultPort,
    cartoDB_USER: "arce",
    cartoDB_API_KEY: "1741d40b28579498ce1633d714168f9b0823198f",
    callbackURL: 'http://192.168.1.61:5000/callback',
    twitterConsumerKey: "sOP4WvqOUtUEgdoaO7Vg",
    twitterConsumerSecret: "GoXieWy47wRgkFGTAWBlFWBSzQZbwDcnOTpiwJSjwk",
    default_table: "jp",
    default_screen_name: "anonymous",
    default_profile_image_url: "https://pbs.twimg.com/profile_images/125613612/n5552189986_174811_8055_reasonably_small.jpg"
  },
  production: {
    port: defaultPort,
    cartoDB_USER: "arce",
    cartoDB_API_KEY: "1741d40b28579498ce1633d714168f9b0823198f",
    callbackURL: 'http://shielded-ridge-8024.herokuapp.com/callback',
    twitterConsumerKey: "sOP4WvqOUtUEgdoaO7Vg",
    twitterConsumerSecret: "GoXieWy47wRgkFGTAWBlFWBSzQZbwDcnOTpiwJSjwk",
    default_table: "jp",
    default_screen_name: "anonymous",
    default_profile_image_url: "https://pbs.twimg.com/profile_images/125613612/n5552189986_174811_8055_reasonably_small.jpg"
  }
};

configuration[env].redirectURL = "http://" + configuration[env].URL + "/callback";

var Config = configuration[env];
module.exports.Config = Config;
