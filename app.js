var _ = require('underscore');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var everyauth = require('everyauth');
var consolidate = require('consolidate');
var Config = require('./lib/config').Config;
var CartoDB = require('cartodb');
var sanitizeHtml = require('sanitize-html');
var RSS = require('rss');

var app = express();

everyauth.twitter.consumerKey(Config.twitterConsumerKey).consumerSecret(Config.twitterConsumerSecret).findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
  session.twitterUserMetadata = twitterUserMetadata;
  session.save();
  return {
    screen_name: twitterUserMetadata.screen_name,
    avatar: twitterUserMetadata.profile_image_url
  };
}).redirectPath('/redirect');

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

var cartoDB = new CartoDB({
  user: Config.cartoDB_USER,
  api_key: Config.cartoDB_API_KEY
});

if (process.env.NODE_ENV === 'development') {
  var cartoDBLog = require('fs').createWriteStream(__dirname + '/log/responses.log');
  cartoDB.pipe(cartoDBLog);
}

cartoDB.connect();
cartoDB.on('connect', function () {
  return console.log('connected');
});

// =============================
// Methods
// =============================

var getTwitterData = function (request) {
  if (isAuthenticated(request)) {
    return request.session.twitterUserMetadata;
  } else {
    return null;
  }
};

var isAuthenticated = function (request) {
  if (request.session && request.session.twitterUserMetadata && request.session.twitterUserMetadata.screen_name) {
    return true;
  } else {
    return false;
  }
};

var insert = function (options, callback) {
  var data = options.data;

  var query = "INSERT INTO {table} (the_geom, name, description, comment, screen_name, profile_image_url) VALUES(ST_GeomFromText('POINT({lng} {lat})', 4326), '{name}', '{description}', '{comment}', '{screen_name}', '{profile_image_url}');";

  var name = data.name ? data.name.replace(/'/g, "''") : '';
  var address = data.address ? data.address.replace(/'/g, "''") : '';
  var comment = data.comment ? data.comment.replace(/'/g, "''") : '';

  var allowedTags = [ 'b', 'i', 'em', 'strong' ];

  name = sanitizeHtml(name);
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

  return cartoDB.query(query, opts, callback);
};

var getComments = function (options, callback) {
  var query = 'SELECT * FROM {table} ORDER BY updated_at DESC LIMIT 100';

  var opts = {
    table: options.table
  };
  return cartoDB.query(query, opts, callback);
};

var getLoginData = function (req) {
  if (isAuthenticated(req)) {
    return getTwitterData(req);
  } else {
    return { profile_image_url: Config.default_profile_image_url, screen_name: Config.default_screen_name };
  }
};

// =============================
// Routes
// =============================

app.get('/', function (req, res) {
  var user = getLoginData(req);
  res.render('index', {
    map: Config.map,
    user: user,
    vizjson_url: Config.vizjson_url,
    google_api_key: Config.google_api_key
  });
});

app.get('/redirect', function (request, response) {
  return response.redirect('/');
});

app.get('/login', function (req, res) {
  res.redirect('/auth/twitter');
});

app.get('/comments', function (req, res) {
  var query = 'SELECT *, ST_X(ST_Centroid(the_geom)) as longitude, ST_Y(ST_Centroid(the_geom)) as latitude FROM ' + Config.map.table + ' ORDER BY created_at DESC';

  return cartoDB.query(query, {}, function (e, data) {
    res.writeHead('200', {
      'Content-Type': 'application/json'
    });

    res.write(JSON.stringify(data));
    res.end();
  });
});

app.get('/rss', function (req, res) {
  getComments({ table: Config.map.table }, function (e, data) {
    res.writeHead(res.statusCode, {
      'Content-Type': 'text/xml'
    });

    var feed = new RSS(Config.feedOptions);

    if (data && data.rows) {
      var rows = data.rows;

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        feed.item({
          title: row.name,
          description: row.comment + '<br /><br />' + row.description,
          author: '@' + row.screen_name,
          url: 'http://japan.javier.is/item?=' + row.cartodb_id,
          guid: 'http://japan.javier.is/item?=' + row.cartodb_id,
          date: row.created_at
        });
      }
    }

    res.write(feed.xml());
    return res.end();
  });
});

var getOptions = function (host, port, method, path, headers) {
  return {
    host: host,
    port: port,
    method: method,
    path: path,
    headers: _.extend({
      'Content-Type': 'application/json'
    }, headers)
  };
};

app.get('/download', function (req, res) {
  var query = 'SELECT * FROM jp ORDER BY updated_at DESC&format=csv';

  var options = getOptions('arce.carto.com', 80, 'GET', '/api/v2/sql?q=' + encodeURI(query));

  return http.request(options, function (resp) {
    var data = '';

    resp.on('data', function (chunk) {
      data += chunk;
      return data;
    });

    return resp.on('end', function () {
      res.writeHead(resp.statusCode, {
        'Content-Type': 'application/csv',
        'Content-Disposition': 'attachment; filename=jp-tips.csv'
      });

      res.write(data);
      return res.end();
    });
  }).end();
});

app.post('/place', function (req, res) {
  var twitter = { profile_image_url: Config.default_profile_image_url, screen_name: Config.default_screen_name };

  if (isAuthenticated(req)) {
    twitter = getTwitterData(req);
  }

  insert({ table: Config.map.table, data: req.body, twitter: twitter }, function (e, data) {
    res.writeHead('200', {
      'Content-Type': 'application/json'
    });

    res.write(JSON.stringify(data));
    res.end();
  });
});

var port = process.env.PORT || Config.port;

app.listen(port, function () {
  return console.log('Listening on ' + port);
});
