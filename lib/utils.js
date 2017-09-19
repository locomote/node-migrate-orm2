const _       = require('lodash');
const Promise = require('bluebird');

function callbackOrPromise(originalMethod) {
  return function() {
    const ctx = this;

    const cb = _.last(arguments);
    if(typeof cb === "function") {
      return originalMethod.apply(ctx, arguments);
    } else {
      return Promise.promisify(originalMethod).apply(ctx, arguments);
    }
  }
}

module.exports = {
  callbackOrPromise
};