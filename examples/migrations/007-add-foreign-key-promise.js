// Note - this is an example only. Table2
// You can use Promise instead of callback in both `up` and `down` methods
// like in this example
exports.up = function() { // do not declare `next` here
  return this.addForeignKey('test_table2', // do not forget `return` here
    { name:       'table1id',
      references: { table: 'table1', column: 'id' }
    });
};

exports.down = function() {
  return this.dropForeignKey('test_table2', 'table1id');
};
