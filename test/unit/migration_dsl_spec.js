"use strict";
const _             = require('lodash');
const should        = require('should');
const sinon         = require('sinon');
const sandbox       = sinon.sandbox.create();

const MigrationDSL  = require('../../lib/migration-dsl');


const fake = {
  object: () => { return {} },

  dialect: () => {
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

  driver: (dialect) => {
    return {
      dialect: dialect,
      query: {
        escapeId: 'the-escape-id'
      },
      execQuery: _.noop
    }
  },

  dsl: (driver) => {
    return new MigrationDSL(driver);
  }
};

describe('MigrationDSL', function() {

  const dialect = fake.dialect();
  const driver = fake.driver(dialect);
  let dsl;

  beforeEach(() => {
    sandbox.stub(require("sql-ddl-sync"), 'dialect').callsFake(() => dialect);
    dsl = fake.dsl(driver);
  });

  afterEach(() => {
    sandbox.verify();
    sandbox.restore();
  });

  describe('MigrationDSL.prototype.createTable', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'createCollection').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        const noColumns = {};
        dsl.createTable('fake_table', noColumns, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const noColumns = {};
        return dsl.createTable('fake_table', noColumns)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addColumn', function() {
    beforeEach(() => {
      sandbox.stub(dsl, '_createColumn').callsFake(() =>  { return fake.object() });
      sandbox.stub(dialect, 'addCollectionColumn').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.addColumn('fake_column', {columnName: fake.object()}, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        return dsl.addColumn(fake.object(), {columnName: fake.object()})
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.renameColumn', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'renameCollectionColumn').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        
        dsl.renameColumn('collection_name', 'old_name', 'new_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        return dsl.renameColumn('collection_name', 'old_name', 'new_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addIndex', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'addIndex').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        const emptyOptions = {};
        dsl.addIndex('index_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.addIndex('index_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropIndex', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'removeIndex').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        const emptyOptions = {};
        dsl.dropIndex('index_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.dropIndex('index_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropColumn', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'dropCollectionColumn').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropColumn('collection_name', 'column_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        dsl.dropColumn('collection_name', 'column_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropTable', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'dropCollection').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.dropTable('collection_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        dsl.dropColumn('collection_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addPrimaryKey', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'addPrimaryKey').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);
        dsl.addPrimaryKey('collection_name', 'column_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        return dsl.addPrimaryKey('collection_name', 'column_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.addForeignKey', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'addForeignKey').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        const emptyOptions = {};

        dsl.addForeignKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.addForeignKey('collection_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropPrimaryKey', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'dropPrimaryKey').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        const emptyOptions = {};

        dsl.dropPrimaryKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.dropPrimaryKey('collection_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.dropForeignKey', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'dropForeignKey').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        const emptyOptions = {};

        dsl.dropForeignKey('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.dropForeignKey('collection_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.hasTable', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'hasCollection').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.hasTable('collection_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        return dsl.hasTable('collection_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.getColumns', function() {
    beforeEach(() => {
      sandbox.stub(dialect, 'getCollectionProperties').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.getColumns('collection_name', cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        return dsl.getColumns('collection_name')
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });

  describe('MigrationDSL.prototype.execQuery', function() {
    beforeEach(() => {
      sandbox.stub(driver, 'execQuery').yields(null, 123);
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        const emptyOptions = {};
        dsl.execQuery('collection_name', emptyOptions, cb);
      });
    });

    describe('Promise support', () => {
      it('returns Promise unless callback is specified', () => {
        const emptyOptions = {};
        return dsl.execQuery('collection_name', emptyOptions)
          .then((val) => {
            val.should.be.equal(123);
          });
      });
    });
  });
});
