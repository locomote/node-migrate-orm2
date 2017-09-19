const _             = require('lodash');
const sinon         = require('sinon');
const sandbox       = sinon.sandbox.create();

const MigrationDSL  = require('../../lib/migration-dsl');


const fake = {
  object: () => { return {} },

  dialect: () => {
    return {
      addCollectionColumn: _.noop
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

  describe('MigrationDSL.prototype.addColumn', function() {
    const dialect = fake.dialect();
    let dsl;

    beforeEach(() => {
      sandbox.stub(require("sql-ddl-sync"), 'dialect', () => dialect);
      dsl = fake.dsl( fake.driver(dialect) );
      sandbox.stub(dsl, '_createColumn', () =>  { return fake.object() });
      sandbox.stub(dialect, 'addCollectionColumn').yields(null, 123);
    });

    afterEach(() => {
      sandbox.verify();
      sandbox.restore();
    });

    describe('Callback support', () => {
      it('calls the passed callback', (done) => {
        const cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        dsl.addColumn(fake.object(), {columnName: fake.object()}, cb);
      });
    });
  });
});
