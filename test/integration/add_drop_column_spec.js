var _       = require('lodash');
var should  = require('should');
var helpers = require('../helpers');
var Task    = require('./../../');

describe('add/drop column dsl', function (done) {
  var task;
  var conn;

  before(function (done) {
    helpers.connect(function (err, connection) {
      if (err) return done(err);

      conn = connection;
      done();
    });
  });

  after(function (done) {
    conn.close(done);
  });

  beforeEach(function(done){
    task = new Task(conn, { dir: 'migrations' });
    helpers.cleanupDbAndDir(conn, task.dir, ['table1'], done);
  });

  afterEach(function (done) {
    helpers.cleanupDir('migrations', done);
  });

  beforeEach(function(done){
    task.mkdir(function(err, result){
      should.not.exist(err);
      helpers.writeMigration(task, '001-create-table1.js',  table1Migration);
      helpers.writeMigration(task, '002-add-one-column.js', column1Migration);
      done();
    });
  });

  it('runs one migration successfully', function(done){
    task.up(function (err, result) {
      should.not.exist(err);

      if (helpers.protocol() == "sqlite") {
        conn.execQuery(
          'PRAGMA TABLE_INFO(??)', ['table1'], function (err, result) {
            should.not.exist(err);
            should.equal(result.length, 3);
            should.equal(result[2].name, 'full_name');
            done();
          }
        );
      } else {
        conn.execQuery(
          'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = ? AND column_name LIKE ?',
          ['table1', 'full_name'],
          function (err, result) {
            should.not.exist(err);

            should.equal(_.values(result[0])[0], 'full_name')
            done();
          }
        );
      }
    });
  });
});

var table1Migration = "exports.up = function (next) {          \n\
this.createTable('table1', {                                   \n\
  id     : { type : \"serial\", key: true },                   \n\
  name   : { type : \"text\", required: true }                 \n\
}, next);                                                      \n\
};                                                             \n\
                                                               \n\
exports.down = function (next){                                \n\
  this.dropTable('table1', next);                              \n\
};";

var column1Migration = "exports.up = function (next) {         \n\
this.addColumn('table1', {                                     \n\
  full_name   : { type : 'text', required: false }             \n\
}, next);                                                      \n\
};                                                             \n\
exports.down = function(next){                                 \n\
  this.dropColumn('table1', 'malcolm', next);                  \n\
};";
