var config = process.env.MYSQL_DATABASE ? {} : require('../db/config.js');
var knex = require('knex')({
  client: 'mysql',
  //TODO find the proper address for the 
  connection: process.env.CLEARDB_DATABASE_URL || {
    host: process.env.RDS_HOSTNAME || process.env.MYSQL_DATABASE_SERVER || config.host, // TODO: Set hardcoded host as env variable.
    user: process.env.RDS_USERNAME || process.env.MYSQL_DATABASE_USER || config.user,
    password: process.env.RDS_PASSWORD || process.env.MYSQL_DATABASE_PASSWORD || config.password,
    database: process.env.RDS_DB_NAME || process.env.MYSQL_DATABASE || config.database,
    port: process.env.RDS_PORT || '3306',
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
