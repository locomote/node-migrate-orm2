var _          = require('lodash');
var should     = require('should');
var sinon      = require('sinon');
var fs         = require('fs');
var path       = require('path');
var helpers    = require('../helpers');
var Migrator   = require('./../../');
var Promise    = require('bluebird');

if (helpers.protocol() !== 'mysql') return;

describe('Postgres', function() {
  var task;
  var conn;

  before(function (done) {
    helpers.connect(function (err, connection) {
      should.not.exist(err);
      conn = connection;
      helpers.cleanupDb(conn, ['table_with_uuid'], function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  after(function (done) {
    helpers.cleanupDir('migrations', function () {
      conn.close(done);
    });
  });

  describe('UUID column support', function() {
    var tablePromisedMigration = "\n\
      exports.up = function () {                                                          \n\
        return this.createTable('table_with_uuid', {                                      \n\
          id     : { type : 'text', key: true, defaultExpression: 'uuid()' }, \n\
          name   : { type : 'text', required: true }                                      \n\
        });                                                                               \n\
      };";

    //ensure the migration folder is cleared before each test
    beforeEach(function (done) {
      task = new Migrator(conn, {dir: 'migrations'});
      helpers.cleanupDbAndDir(conn, task.dir, ['table_with_uuid'], function () {
        task.setup(function (err) {
          should.not.exist(err);
          helpers.writeMigration(task, '001-create-table-with-uuid.js', tablePromisedMigration);
          done();
        });
      });
    });

    it('sets default value via expression', function () {
      return task.up().then(function () {
        return conn.execQueryAsync("INSERT INTO table_with_uuid (name) VALUES (?)", ["cat"]).then(function () {
          return conn.execQueryAsync("SELECT * FROM table_with_uuid").then(function (items) {
            should.equal(items.length, 1);
            should.equal(items[0].name, 'cat');
            var uuidV1 = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/i;
            items[0].id.should.match(uuidV1);
          });
        });
      })
    });
  });
});
