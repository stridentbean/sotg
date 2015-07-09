var knex = require('knex')({
  client : 'mysql',
  //TODO find the proper address for the 
  connection : process.env.CLEARDB_DATABASE_URL || {
    host : '127.0.0.1',
    user : 'root',
    //password : '123',
    database : 'test',
    charset : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

bookshelf.knex.schema.hasTable('User').then(function (exists) {
  if (!exists) {
    bookshelf.knex.schema.createTable('User', function (user) {
      user.increments('id').primary();
      user.timestamps();
      user.string('email');
      user.string('apiKey');
    }).then(function (table) {
      console.log('Created table', table);
    });
  }
});

module.exports = bookshelf;
