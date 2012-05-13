/*
 * nomo.js
 *
 * Copyright (c) 2012 Maximilian Antoni <mail@maxantoni.de>
 * MIT Licensed
 */
var http        = require('http');
var fs          = require('fs');
var path        = require('path');
var generator   = require('./generator');
var mod         = require('./module');
var support     = require('./support');

var template    = fs.readFileSync(__dirname + '/nomo.html').toString();


function nomoHtml(g, names) {
  var scripts = [];
  for (var n in g.modules) {
    if (g.modules.hasOwnProperty(n)) {
      if (support.has(n)) {
        n = 'nomo/support/' + n;
      }
      scripts.push('<script type="text/javascript" src="/' + n +
        '.js"></script>\n');
    }
  }
  var requires = [];
  for (var i = 0, l = names.length; i < l; i++) {
    requires.push('require("' + names[i] + '");\n');
  }
  var s = scripts.join('    ');
  var r = requires.join('      ');
  return template.replace('{{scripts}}', s).replace('{{requires}}', r);
}


function respond(res, headers, content) {
  res.writeHead(200, headers);
  res.end(content);
}


function collectFiles(g, name, requires) {
  var files = fs.readdirSync(name);
  files.forEach(function (file) {
    var p = name + '/' + file;
    if (fs.statSync(p).isDirectory()) {
      collectFiles(g, p, requires);
    } else if (/^test.+\.js|.+test\.js$/.test(file)) {
      var test = name + '/' + file;
      requires.push(test.substring(0, test.length - 3));
      g.add(mod.create(test));
    }
  });
}


var headersHtml       = { 'Content-Type' : 'text/html' };
var headersJavascript = { 'Content-Type' : 'text/javascript' };


exports.start = function (port) {
  var m, g;

  if (!port) {
    port = '4444';
  }
  console.log('Starting server on http://localhost:' + port);

  http.createServer(function (req, res) {

    if (req.url === '/') {
      m = mod.create('.');
      g = generator.create(m.nomo);
      g.add(mod.create('util'));
      g.add(mod.create('events'));
      g.add(m);

      respond(res, headersHtml, nomoHtml(g, [m.name]));
      return;
    }

    var p       = req.url.lastIndexOf('.');
    var name    = req.url.substring(1, p === -1 ? req.url.length : p);
    var suffix  = p === -1 ? '' : req.url.substring(p + 1);

    if (name === 'nomo') {
      m = mod.create('.');
      g = generator.create(m.nomo);
      g.add(mod.create('events'));
      g.add(m);

      respond(res, headersJavascript, g.toString());
      return;
    }

    if (name === 'nomo/require') {
      var requireGenerator = generator.create({
        name          : 'require.js',
        requireTarget : 'window.require'
      });

      respond(res, headersJavascript, requireGenerator.toString());
      return;
    }

    if (name === 'nomo/init') {
      respond(res, headersJavascript, 'require("process");\n' + g.init());
      return;
    }

    if (name.indexOf('nomo/support/') === 0 && suffix === 'js') {
      name = name.substring(13);
      var file  = support.folder + '/' + name + '.js';
      fs.readFile(file, function (err, content) {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        respond(res, headersJavascript, 'require.define(\'' + name +
          '\', function (module, exports) {\n' + content + '\n});');
      });
      return;
    }

    if (suffix === 'js') {
      if (g && g.modules[name]) {
        respond(res, headersJavascript, g.define(name));
      } else {
        var p = path.normalize(__dirname + '/../' + name + '.js');
        res.writeHead(200, headersJavascript);
        fs.createReadStream(p).pipe(res);
      }
      return;
    }

    if (suffix === 'html') {
      m = mod.create('.');
      g = generator.create(m.nomo);
      g.add(mod.create('events'));
      g.add(m);
      g.add(mod.create(name + '.js'));

      respond(res, headersHtml, nomoHtml(g, [name]));
      return;
    }

    if (name.indexOf('test') === 0) {
      m = mod.create('.');
      g = generator.create(m.nomo);
      g.add(mod.create('events'));
      g.add(m);
      var requires = [];
      collectFiles(g, name, requires);
      respond(res, headersHtml, nomoHtml(g, requires));
      return;
    }

  }).listen(port);

};
