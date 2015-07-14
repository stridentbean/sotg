var config = process.env.MYSQL_DATABASE ? {} : require('../db/config.js');
var knex = require('knex')({
  client: 'mysql',
  //TODO find the proper address for the 
  connection: process.env.CLEARDB_DATABASE_URL || {
    host: process.env.MYSQL_DATABASE_SERVER || config.host, // TODO: Set hardcoded host as env variable.
    user: process.env.MYSQL_DATABASE_USER || config.user,
    password: process.env.MYSQL_DATABASE_PASSWORD || config.password,
    database: process.env.MYSQL_DATABASE || config.database,
    charset: 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

bookshelf.truncateAllTables = function(next) {
  knex('User').truncate().then(function() {
    next();
  });
};

module.exports = bookshelf;
