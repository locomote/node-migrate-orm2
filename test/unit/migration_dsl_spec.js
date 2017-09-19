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
      createCollection: _.noop
    };
  },

  driver: (dialect) => {
    return {
      dialect: dialect,
      query: {
        escapeId: 'the-escape-id'
      }
    }
  },

  dsl: (driver) => {
    return new MigrationDSL(driver);
  }
};

describe('MigrationDSL', function() {

  const dialect = fake.dialect();
  let dsl;

  beforeEach(() => {
    sandbox.stub(require("sql-ddl-sync"), 'dialect').callsFake(() => dialect);
    dsl = fake.dsl(fake.driver(dialect));
  });

  afterEach(() => {
    sandbox.verify();
    sandbox.restore();
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

});
