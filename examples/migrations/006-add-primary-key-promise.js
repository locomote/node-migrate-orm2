// You can use Promise instead of callback in both `up` and `down` methods
// like in this example
exports.up = function() { // do not declare `next` here
  return this.addPrimaryKey('table_primary_keys', 'price'); // do not forget `return` here
};

exports.down = function() {
  return this.dropPrimaryKey('table_primary_keys', 'price');
};
