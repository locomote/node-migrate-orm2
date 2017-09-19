var Mocha   = require('mocha');
var fs      = require('fs');
var path    = require('path');
var helpers = require('./helpers');

const Promise = require('bluebird');

var mocha      = new Mocha({ reporter: "spec" });
var configPath = path.normalize(path.join(__dirname, 'config.js'));


if (!helpers.isTravis() && !fs.existsSync(configPath)) {
  console.error("test/config.js is missing. Take a look at test/config.example.js");
  process.exit(1);
}

function runTests(dir, cb) {
  fs.readdirSync(dir).filter(function (file) {
    return file.substr(-3) === '.js';
  }).forEach(function (file) {
    mocha.addFile(
      path.join(dir, file)
    );
  });

  mocha.run(cb);
}
const runTestsAsync = Promise.promisify(runTests);

var protocol = helpers.protocol();
var protocols = [];

if (protocol) {
  protocols = [protocol];
} else {
  protocols = Object.keys(helpers.config());
}

function run (err) {
  var pr = protocols.shift();
  if (err) {
    console.log(protocol, "tests failed");
    return process.exit(err);
  }
  if (!pr) return process.exit(0);

  process.env.ORM_PROTOCOL = pr;

  console.log(
    "\n\nRunning", pr, "tests",
    "\n------------------------"
  );

  Promise.mapSeries(['integration'], function(dir) {
    return runTestsAsync(path.normalize(path.join(__dirname, dir)));
  })
    .then(() => run())
    .catch(run);
}

run();
