// You can use Promise instead of callback in both `up` and `down` methods
// like in this example
exports.up = function() { // do not declare `next` here
  return this.createTable('table_primary_keys', { // do not forget `return` here
    price  : { type : "number" }
  });
};

exports.down = function() {
  return this.dropTable('table_primary_keys');
};


