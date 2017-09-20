"use strict";
var should        = require('should');
var sinon         = require('sinon');
var sandbox       = sinon.sandbox.create();

var MigrationDSL  = require('../../lib/migration-dsl');

var noop = function(){};

var fake = {
  object: function () { return {} },
  
  dialect: function () {
    return {
      addCollectionColumn: noop,
      createCollection: noop,
      renameCollectionColumn: noop,
      addIndex: noop,
      removeIndex: noop,
      dropCollectionColumn: noop,
      dropCollection: noop,
      addPrimaryKey: noop,
      dropPrimaryKey: noop,
      addForeignKey: noop,
      dropForeignKey: noop,
      hasCollection: noop,
      getCollectionProperties: noop
    };
  },

  driver: function (dialect) {
    return {
      dialect: dialect,
      query: {
        escapeId: 'the-escape-id'
      },
      execQuery: noop
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

    describe('optimistic case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'createCollection').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noMatterOptions = {};
        dsl.createTable('fake_table', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.createTable('fake_table', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'createCollection').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.createTable('fake_table', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.createTable('fake_table', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addColumn', function() {
    beforeEach(function () {
      sandbox.stub(dsl, '_createColumn').callsFake(function ()  { return fake.object() });
    });

    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'addCollectionColumn').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.addColumn('fake_column', {columnName: fake.object()}, cb);
      });

      it('returns Promise unless callback is specified', function () {
        return dsl.addColumn(fake.object(), {columnName: fake.object()})
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'addCollectionColumn').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs(sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')));

        dsl.addColumn('fake_column', {columnName: fake.object()}, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.addColumn('fake_column', {columnName: fake.object()})
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.renameColumn', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'renameCollectionColumn').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.renameColumn('collection_name', 'old_name', 'new_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        return dsl.renameColumn('collection_name', 'old_name', 'new_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'renameCollectionColumn').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.renameColumn('collection_name', 'old_name', 'new_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.renameColumn('collection_name', 'old_name', 'new_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    })
  });

  describe('MigrationDSL.prototype.addIndex', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'addIndex').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        var noMatterOptions = {};
        dsl.addIndex('index_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.addIndex('index_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'addIndex').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.addIndex('index_name', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.addIndex('index_name', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropIndex', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'removeIndex').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        var noMatterOptions = {};
        dsl.dropIndex('index_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropIndex('index_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'removeIndex').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.dropIndex('index_name', noMatterOptions, cb)
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropIndex('index_name', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropColumn', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'dropCollectionColumn').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropColumn('collection_name', 'column_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        dsl.dropColumn('collection_name', 'column_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'dropCollectionColumn').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.dropColumn('collection_name', 'column_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.dropColumn('collection_name', 'column_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropTable', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'dropCollection').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropTable('collection_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        dsl.dropColumn('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'dropCollection').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.dropTable('collection_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.dropTable('collection_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addPrimaryKey', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'addPrimaryKey').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.addPrimaryKey('collection_name', 'column_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        return dsl.addPrimaryKey('collection_name', 'column_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'addPrimaryKey').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.addPrimaryKey('collection_name', 'column_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.addPrimaryKey('collection_name', 'column_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addForeignKey', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'addForeignKey').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noMatterOptions = {};

        dsl.addForeignKey('collection_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.addForeignKey('collection_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'addForeignKey').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.addForeignKey('collection_name', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.addForeignKey('collection_name', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropPrimaryKey', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'dropPrimaryKey').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noMatterOptions = {};
        dsl.dropPrimaryKey('collection_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropPrimaryKey('collection_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'dropPrimaryKey').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.dropPrimaryKey('collection_name', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropPrimaryKey('collection_name', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropForeignKey', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'dropForeignKey').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noMatterOptions = {};
        dsl.dropForeignKey('collection_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropForeignKey('collection_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'dropForeignKey').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.dropForeignKey('collection_name', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.dropForeignKey('collection_name', noMatterOptions)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.hasTable', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'hasCollection').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.hasTable('collection_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        return dsl.hasTable('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'hasCollection').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.hasTable('collection_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.hasTable('collection_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.getColumns', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(dialect, 'getCollectionProperties').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.getColumns('collection_name', cb);
      });

      it('returns Promise unless callback is specified', function () {
        return dsl.getColumns('collection_name')
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(dialect, 'getCollectionProperties').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        dsl.getColumns('collection_name', cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        return dsl.getColumns('collection_name')
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });

  describe('MigrationDSL.prototype.execQuery', function() {
    describe('optimistic case', function() {
      beforeEach(function () {
        sandbox.stub(driver, 'execQuery').yields(null, 123);
      });

      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        var noMatterOptions = {};
        dsl.execQuery('collection_name', noMatterOptions, cb);
      });

      it('returns Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.execQuery('collection_name', noMatterOptions)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function() {
      beforeEach(function() {
        sandbox.stub(driver, 'execQuery').yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () { done() });

        cb.once().withArgs( sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')) );

        var noMatterOptions = {};
        dsl.execQuery('collection_name', noMatterOptions, cb);
      });

      it('returns rejected Promise unless callback is specified', function () {
        var noMatterOptions = {};
        return dsl.execQuery('collection_name', noMatterOptions)
          .catch(function (err) {
                err.should.be.instanceOf(Error);
                err.message.should.equal('problem');
              });
          });
    });
  });
});
