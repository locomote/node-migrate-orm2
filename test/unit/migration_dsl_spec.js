"use strict";
var should        = require('should');
var sinon         = require('sinon');
var sandbox       = sinon.sandbox.create();
var shared        = require('shared-examples-for');

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

shared.examplesFor('supporting callback interface', function(setupContextFunc) {
  if(typeof(setupContextFunc) !== 'function') { throw '`setupContextFunc` is required!';  }
  var opts;
  var sandbox = sinon.sandbox.create();

  describe('Callback interface', function() {
    beforeEach('Setup context', function () {
      setupContextFunc(opts = {});

      if (!opts.testedObject) {
        throw '`testedObject`option is required!';
      }
      if (!opts.testedMethodName) {
        throw '`testedMethodName`option is required!';
      }
      if (!opts.internalObject) {
        throw '`internalObject`option is required!';
      }
      if (!opts.internalMethodName) {
        throw '`internalMethodName`option is required!';
      }
      if (opts.internalMethodArgs && !Array.isArray(opts.internalMethodArgs)) {
        throw '`InternalMethodArgs` option must be Array!';
      }
    });

    afterEach(function () {
      sandbox.verifyAndRestore();
    });

    var internalCallArgs = function (cb) {
      var args = [];

      if (opts.internalMethodArgs) {
        args = args.concat(opts.internalMethodArgs);
      }

      if (cb) {
        args.push(cb);
      }

      return args;
    };

    describe('optimistic case', function () {

      beforeEach('stub internal call', function () {
        sandbox.stub(opts.internalObject, opts.internalMethodName).yields(null, 123);
      });


      it('calls the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(done);

        cb.once().withArgs(null, 123);

        opts.testedObject[opts.testedMethodName].apply(opts.testedObject, internalCallArgs(cb));
      });
    });

    describe('error case', function () {
      beforeEach(function () {
        sandbox.stub(opts.internalObject, opts.internalMethodName).yields(new Error('problem'));
      });

      it('transfer error to the passed callback', function (done) {
        var cb = sandbox.mock();
        cb.callsFake(function () {
          done()
        });

        cb.once().withArgs(sinon.match.instanceOf(Error).and(sinon.match.has('message', 'problem')));

        opts.testedObject[opts.testedMethodName].apply(opts.testedObject, internalCallArgs(cb));
      });
    });
  })
});

shared.examplesFor('supporting Promise interface', function(setupContextFunc) {
  if(typeof(setupContextFunc) !== 'function') { throw '`setupContextFunc` is required!';  }
  var opts;
  var sandbox = sinon.sandbox.create();

  describe('Promise interface', function () {

    beforeEach('Setup context', function () {
      setupContextFunc(opts = {});
      if (!opts.testedObject) {
        throw '`testedObject`option is required!';
      }
      if (!opts.testedMethodName) {
        throw '`testedMethodName`option is required!';
      }
      if (!opts.internalObject) {
        throw '`internalObject`option is required!';
      }
      if (!opts.internalMethodName) {
        throw '`internalMethodName`option is required!';
      }
      if (opts.internalMethodArgs && !Array.isArray(opts.internalMethodArgs)) {
        throw '`InternalMethodArgs` option must be Array!';
      }
    });

    afterEach(function () {
      sandbox.verifyAndRestore();
    });

    describe('optimistic case', function () {
      beforeEach(function () {
        sandbox.stub(opts.internalObject, opts.internalMethodName).yields(null, 123);
      });

      it('returns Promise unless callback is specified', function () {
        return opts.testedObject[opts.testedMethodName].apply(opts.testedObject, opts.internalMethodArgs)
          .then(function (val) {
            val.should.be.equal(123);
          });
      });
    });

    describe('error case', function () {
      beforeEach(function () {
        sandbox.stub(opts.internalObject, opts.internalMethodName).yields(new Error('problem'));
      });

      it('returns rejected Promise unless callback is specified', function () {
        return opts.testedObject[opts.testedMethodName].apply(opts.testedObject, opts.internalMethodArgs)
          .catch(function (err) {
            err.should.be.instanceOf(Error);
            err.message.should.equal('problem');
          });
      });
    });
  });
});

describe('MigrationDSL', function() {

  var dialect = fake.dialect();
  var driver = fake.driver(dialect);
  var dsl;

  beforeEach(function () {
    this.currentTestOptions = {};
  });

  beforeEach(function () {
    sandbox.stub(require("sql-ddl-sync"), 'dialect').callsFake(function () { return dialect; });
    dsl = fake.dsl(driver);
  });

  afterEach(function () {
    sandbox.verify();
    sandbox.restore();
  });

  describe('MigrationDSL.prototype.createTable', function() {
      var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'createTable';
      opts.internalObject     = dialect;
      opts.internalMethodName ='createCollection';
      opts.internalMethodArgs = ['collection_name', {}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.addColumn', function() {

    beforeEach(function () {
      sandbox.stub(dsl, '_createColumn').callsFake(function ()  { return fake.object() });
    });

    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'addColumn';
      opts.internalObject     = dialect;
      opts.internalMethodName ='addCollectionColumn';
      opts.internalMethodArgs = ['fake_column', {columnName: {}}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.renameColumn', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'renameColumn';
      opts.internalObject     = dialect;
      opts.internalMethodName ='renameCollectionColumn';
      opts.internalMethodArgs = ['collection_name', 'old_name', 'new_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.addIndex', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'addIndex';
      opts.internalObject     = dialect;
      opts.internalMethodName ='addIndex';
      opts.internalMethodArgs = ['index_name', {}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.dropIndex', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'dropIndex';
      opts.internalObject     = dialect;
      opts.internalMethodName ='removeIndex';
      opts.internalMethodArgs = ['index_name', {}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.dropColumn', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'dropColumn';
      opts.internalObject     = dialect;
      opts.internalMethodName ='dropCollectionColumn';
      opts.internalMethodArgs = ['collection_name', 'column_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.dropTable', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'dropTable';
      opts.internalObject     = dialect;
      opts.internalMethodName ='dropCollection';
      opts.internalMethodArgs = ['collection_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.addPrimaryKey', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'addPrimaryKey';
      opts.internalObject     = dialect;
      opts.internalMethodName ='addPrimaryKey';
      opts.internalMethodArgs = ['collection_name', 'column_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.addForeignKey', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'addForeignKey';
      opts.internalObject     = dialect;
      opts.internalMethodName ='addForeignKey';
      opts.internalMethodArgs = ['collection_name', {}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.dropPrimaryKey', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'dropPrimaryKey';
      opts.internalObject     = dialect;
      opts.internalMethodName ='dropPrimaryKey';
      opts.internalMethodArgs = ['collection_name','column_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.dropForeignKey', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'dropForeignKey';
      opts.internalObject     = dialect;
      opts.internalMethodName ='dropForeignKey';
      opts.internalMethodArgs = ['collection_name','column_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.hasTable', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'hasTable';
      opts.internalObject     = dialect;
      opts.internalMethodName ='hasCollection';
      opts.internalMethodArgs = ['collection_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.getColumns', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'getColumns';
      opts.internalObject     = dialect;
      opts.internalMethodName ='getCollectionProperties';
      opts.internalMethodArgs = ['collection_name'];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });

  describe('MigrationDSL.prototype.execQuery', function() {
    var setupContext = function (opts) {
      opts.testedObject       = dsl;
      opts.testedMethodName   = 'execQuery';
      opts.internalObject     = driver;
      opts.internalMethodName ='execQuery';
      opts.internalMethodArgs = ['collection_name', {}];
    };

    shared.shouldBehaveLike('supporting callback interface', setupContext);

    shared.shouldBehaveLike('supporting Promise interface', setupContext);
  });
});
