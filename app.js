var _              = require('underscore');
var express        = require('express');
var http           = require("http");
var https          = require("https");
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var session        = require('express-session');
var RedisStore     = require('connect-redis')(session);
var swig           = require('swig');
var crypto         = require('crypto');
var everyauth      = require('everyauth');
var consolidate    = require('consolidate');
var fs             = require('fs');
var request        = require('request');
var Config         = require("./lib/config").Config;
var CartoDB        = require('cartodb');
var sanitizeHtml   = require('sanitize-html');
var RSS            = require('rss');

//var Firebase     = require("firebase");

var app = express();

everyauth.twitter.consumerKey(Config.twitterConsumerKey).consumerSecret(Config.twitterConsumerSecret).findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserMetadata) {
  session.twitterUserMetadata = twitterUserMetadata;
  session.save();

  //var f = new Firebase("https://cartodb.firebaseio.com/");

  //f.set({
    //username: twitterUserMetadata.screen_name,
    //avatar: twitterUserMetadata.profile_image_url
  //});

  return {
    screen_name: twitterUserMetadata.screen_name,
    avatar: twitterUserMetadata.profile_image_url
  };
}).redirectPath("/redirect");

// Configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
    store: new RedisStore({ host: 'localhost', port: 6379 }),
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
    secret: Config.session_secret
}));
app.use(everyauth.middleware(app));
app.use(express.static(__dirname + '/public'));

app.engine('ejs', consolidate.swig);

cartoDB = new CartoDB({
  user: Config.cartoDB_USER,
  api_key: Config.cartoDB_API_KEY
});

if (process.env.NODE_ENV === "development") {
  cartoDBLog = require("fs").createWriteStream(__dirname + "/log/responses.log");
  cartoDB.pipe(cartoDBLog);
}

cartoDB.connect();
cartoDB.on("connect", function() {
  return console.log("connected");
});

// =============================
// Helpers
// =============================

function getOptions(host, port, method, path, headers) {
  return {
    host: host,
    port: port,
    method: method,
    path: path,
    headers: _.extend({
      "Content-Type": "application/json"
    }, headers)
  };
}

function get(res, options) {
  return https.request(options, function(resp) {
    var data = "";
    resp.on("data", function(chunk) {
      return data += chunk;
    });
    return resp.on("end", function() {
      res.writeHead(resp.statusCode, {
        "Content-Type": "application/json"
      });
      res.write(data);
      return res.end();
    });
  }).end();
}

// =============================
// Methods
// =============================

getTwitterData = function(request) {
  if (isAuthenticated(request)) {
    return request.session.twitterUserMetadata;
  } else {
    return null;
  }
};
isAuthenticated = function(request) {
  if (request.session && request.session.twitterUserMetadata && request.session.twitterUserMetadata.screen_name) {
    return true;
  } else {
    return false;
  }
};

getRandomID = function(length) {
  if (length == null) {
    length = 10;
  }
  return crypto.randomBytes(length).toString('hex');
};

insert = function(options, callback) {

  var data = options.data;

  query = "INSERT INTO {table} (the_geom, name, description, comment, screen_name, profile_image_url) VALUES(ST_GeomFromText('POINT({lng} {lat})', 4326), '{name}', '{description}', '{comment}', '{screen_name}', '{profile_image_url}');";

  console.log(options);
  console.log(query)

  var name    = data.name    ? data.name.replace(/'/g, "''") : "";
  var address = data.address ? data.address.replace(/'/g, "''") : "";
  var comment = data.comment ? data.comment.replace(/'/g, "''") : "";

  var allowedTags = [ 'b', 'i', 'em', 'strong' ];

  name    = sanitizeHtml(name);
  comment = sanitizeHtml(comment, { allowedTags: allowedTags });
  address = sanitizeHtml(address);

  var opts = {
    table: options.table,
    lat: data.coordinates[0],
    lng: data.coordinates[1],
    name: name,
    screen_name: options.twitter.screen_name,
    profile_image_url: options.twitter.profile_image_url,
    description: address,
    comment: comment
  };

  console.log(opts);

  return cartoDB.query(query, opts, callback);
};

getComments = function(options, callback) {

  var data = options.data;

  query = "SELECT * FROM {table} LIMIT 25 ORDER BY updated_at DESC;";

  var opts = {
    table: options.table,
  };

  return cartoDB.query(query, opts, callback);
};

deleteGeometry = function(data, callback) {

  console.log(data)
  query = "DELETE FROM {table} WHERE geometry_id = {geometry_id};";

  return cartoDB.query(query, {
    table: data.table,
    geometry_id: data.geometry_id
  }, callback);

};

getLoginData = function(req) {
  if (isAuthenticated(req)) {
    return getTwitterData(req);
  } else {
    return { profile_image_url: Config.default_profile_image_url, screen_name: Config.default_screen_name };
  }
}

// =============================
// Routes
// =============================

app.get('/', function(req, res){
  var user = getLoginData(req);
  res.render('index', { user: user });
});

app.get("/redirect", function(request, response) {
  return response.redirect("/");
});

app.get('/login', function(req, res){
  res.redirect("/auth/twitter");
});

app.get('/rss', function(req, res){
  var feedOptions = {
    title: 'My Japan trip',
    description: 'RSS Feed of the tips for my trip to Japan',
    site_url: 'http://japan.javierarce.com/rss',
    site_url: 'http://japan.javierarce.com',
    copyright: '2015 Javier Arce',
    language: 'en',
    ttl: '60'
  };

  getComments({ table: Config.default_table }, function(e, data) {
    res.writeHead(res.statusCode, {
      "Content-Type": "text/xml"
    });

    var feed = new RSS(feedOptions);

    var rows = data.rows;

    if (rows) {
      for (var i = 0; i < rows.length; i++) {
        feed.item({
          title:  rows[i].name,
          description: rows[i].description,
          author: "@" + rows[i].screen_name,
          date: rows[i].created_at
        });
      }
      var xml = feed.xml();
    }

    res.write(xml);
    return res.end();
  });

});

app.post('/place', function(req, res){

  var twitter = { profile_image_url: Config.default_profile_image_url, screen_name: Config.default_screen_name };

  if (isAuthenticated(req)) {
    twitter = getTwitterData(req);
  }

  insert({ table: Config.default_table, data: req.body, twitter: twitter }, function(e, data) {
    console.log(e, data);

    res.writeHead("200", {
      "Content-Type": "application/json"
    });

    res.write(JSON.stringify(data));
    res.end();
  });

});

port = process.env.PORT || Config.port;

server = app.listen(port, function() {
  return console.log("Listening on " + port);
});
