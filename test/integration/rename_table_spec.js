var should  = require('should');
var helpers = require('../helpers');
var Task    = require('./../../');

describe('rename table dsl', function (done) {
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

  //ensure the migration folder is cleared before each test
  beforeEach(function (done) {
    task = new Task(conn, { dir: 'migrations' });
    helpers.cleanupDbAndDir(conn, task.dir, ['table1', 'table2'], done);
  });

  afterEach(function (done) {
    helpers.cleanupDir('migrations', done);
  });

  beforeEach(function (done) {
    task.mkdir(function (err, result) {
      should.not.exist(err);
      helpers.writeMigration(task, '001-create-table1.js', table1Migration);
      helpers.writeMigration(task, '002-rename-table1.js', column1Migration);
      done();
    });
  });

  it('runs one migration successfully', function (done){
    task.up(function (err, result) {
      should.not.exist(err);
      conn.execQuery(
        'SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_name = ?', ['table1'],
        function (err, results) {
          should.not.exist(err);
          should.equal(results.length, 0);

          conn.execQuery(
            'SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_name = ?', ['table2'],
            function (err, results) {
              should.not.exist(err);
              should.equal(results.length, 1);
              should.equal(results[0].table_name, 'table2');

              console.log(results);

              done();
            }
          );
        }
      );
    });
  });
});

var table1Migration =
"exports.up = function (next) {                                 \n\
  this.createTable('table1', {                                  \n\
    id     : { type : \"serial\", key: true },                  \n\
    name   : { type : \"text\", required: true }                \n\
  }, next);                                                     \n\
};                                                              \n\
                                                                \n\
exports.down = function (next){                                 \n\
  this.dropTable('table1', next);                               \n\
};";

var column1Migration =
"exports.up = function (next) {                                 \n\
  this.renameTable('table1', 'table2', next);                   \n\
};                                                              \n\
exports.down = function(next){                                  \n\
  this.renameTable('table2', 'table1', next);                   \n\
};";
