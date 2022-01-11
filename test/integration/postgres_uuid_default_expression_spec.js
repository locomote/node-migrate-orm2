var _          = require('lodash');
var should     = require('should');
var sinon      = require('sinon');
var fs         = require('fs');
var path       = require('path');
var helpers    = require('../helpers');
var Migrator   = require('./../../');
var Promise    = require('bluebird');

if (helpers.protocol() !== 'postgresql') return;

describe('Postgres', function() {
  var task;
  var conn;

  var SELECT_COLUMN = 'SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = ? AND column_name = ?';
  var getColumnInfo = function (table, column, cb) {
    return conn.execQueryAsync(SELECT_COLUMN, [table, column]);
  };

  before(function (done) {
    helpers.connect(function (err, connection) {
      should.not.exist(err);
      conn = connection;
      conn.execQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', function (err) {
        should.not.exist(err);
        helpers.cleanupDb(conn, ['table_with_uuid'], function (err) {
          should.not.exist(err);
          done();
        });
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
          id     : { type : 'uuid', key: true, defaultExpression: 'uuid_generate_v4()' }, \n\
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

    it('creates a uuid typed id column with default value', function () {
      return task.up().then(function () {
        return getColumnInfo('table_with_uuid', 'id').then(function (colData) {
          should.equal(colData[0].data_type, 'uuid');
          should.equal(colData[0].column_default, 'uuid_generate_v4()');
        });
      })
    });
  });
});
