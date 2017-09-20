"use strict";
var _             = require('lodash');
var should        = require('should');
var sinon         = require('sinon');
var sandbox       = sinon.sandbox.create();

var MigrationDSL  = require('../../lib/migration-dsl');


var fake = {
  object: function () { return {} },

  dialect: function () {
    return {
      addCollectionColumn: _.noop,
      createCollection: _.noop,
      renameCollectionColumn: _.noop,
      addIndex: _.noop,
      removeIndex: _.noop,
      dropCollectionColumn: _.noop,
      dropCollection: _.noop,
      addPrimaryKey: _.noop,
      dropPrimaryKey: _.noop,
      addForeignKey: _.noop,
      dropForeignKey: _.noop,
      hasCollection: _.noop,
      getCollectionProperties: _.noop
    };
  },

  driver: function (dialect) {
    return {
      dialect: dialect,
      query: {
        escapeId: 'the-escape-id'
      },
      execQuery: _.noop
    }
  },

  dsl: function (driver) {
    return new MigrationDSL(driver);
  }
};

describe('MigrationDSL', function() {

  var dialect = fake.dialect();
  var driver = fake.driver(dialect);
  var dsl;

  beforeEach(function () {
    sandbox.stub(require("sql-ddl-sync"), 'dialect').callsFake(function () { return dialect; });
    dsl = fake.dsl(driver);
  });

  afterEach(function () {
    sandbox.verify();
    sandbox.restore();
  });

  describe('MigrationDSL.prototype.createTable', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'createCollection').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noColumns = {};
        dsl.createTable('fake_table', noColumns, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var noColumns = {};
        return dsl.createTable('fake_table', noColumns)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addColumn', function() {
    beforeEach(function () {
      sandbox.stub(dsl, '_createColumn').callsFake(function ()  { return fake.object() });
      sandbox.stub(dialect, 'addCollectionColumn').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.addColumn('fake_column', {columnName: fake.object()}, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        return dsl.addColumn(fake.object(), {columnName: fake.object()})
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.renameColumn', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'renameCollectionColumn').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        
        dsl.renameColumn('collection_name', 'old_name', 'new_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        return dsl.renameColumn('collection_name', 'old_name', 'new_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addIndex', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'addIndex').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        var emptyOptions = {};
        dsl.addIndex('index_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.addIndex('index_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropIndex', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'removeIndex').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        var emptyOptions = {};
        dsl.dropIndex('index_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.dropIndex('index_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropColumn', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'dropCollectionColumn').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropColumn('collection_name', 'column_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        dsl.dropColumn('collection_name', 'column_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropTable', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'dropCollection').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropTable('collection_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        dsl.dropColumn('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addPrimaryKey', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'addPrimaryKey').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.addPrimaryKey('collection_name', 'column_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        return dsl.addPrimaryKey('collection_name', 'column_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addForeignKey', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'addForeignKey').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var emptyOptions = {};

        dsl.addForeignKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.addForeignKey('collection_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropPrimaryKey', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'dropPrimaryKey').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var emptyOptions = {};

        dsl.dropPrimaryKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.dropPrimaryKey('collection_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropForeignKey', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'dropForeignKey').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var emptyOptions = {};

        dsl.dropForeignKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.dropForeignKey('collection_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.hasTable', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'hasCollection').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.hasTable('collection_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        return dsl.hasTable('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.getColumns', function() {
    beforeEach(function () {
      sandbox.stub(dialect, 'getCollectionProperties').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.getColumns('collection_name', cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        return dsl.getColumns('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.execQuery', function() {
    beforeEach(function () {
      sandbox.stub(driver, 'execQuery').yields(null, 123);
    });

    describe('Callback support', function () {
      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var emptyOptions = {};
        dsl.execQuery('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', function () {
      it('returns Promise unless callback is specified', function () {
        var emptyOptions = {};
        return dsl.execQuery('collection_name', emptyOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });
  });
});
