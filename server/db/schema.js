/**
  * Schema for mySql
  *@module db/schema
  */

var db = require('../config/db.js');

/**
 * Remove all tables from the database 
 */

if (process.argv[2] === 'clean'){

  db.knex.schema.dropTableIfExists('keywords_users').then(function(table) {
    console.log('Dropped table keywords_users');
  });

  db.knex.schema.dropTableIfExists('ApiTransactions').then(function(table) {
    console.log('Dropped table ApiTransactions');

    db.knex.schema.dropTableIfExists('Users').then(function(table) {
      console.log('Dropped table Users');
    });

  });

  db.knex.schema.dropTableIfExists('Tweets').then(function(table) {
    console.log('Dropped table Tweets');
  });

  db.knex.schema.dropTableIfExists('Keywords').then(function(table) {
    console.log('Dropped table Keywords');
  });
} else {
  //create tables
  db.knex.schema.hasTable('Users').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('Users', function(user) {
        user.increments('id').primary();
        user.timestamps();
        user.string('username');
        user.string('password');
        // user.string('salt'); bcrypt takes care of this for us
        user.string('apiKey');
      }).then(function(table) {
        console.log('Created table Users');
        db.knex.schema.hasTable('Keywords').then(function(exists) {
          if (!exists) {
            db.knex.schema.createTable('Keywords', function(keyword) {
              keyword.increments('id').primary();
              keyword.string('keyword');
              keyword.integer('streamId');
              keyword.timestamps();
            }).then(function(table) {
              console.log('Created table Keywords');
              db.knex.schema.hasTable('keywords_users').then(function(exists) {
                if (!exists) {
                  db.knex.schema.createTable('keywords_users', function(table) {
                    table.integer('User_id').unsigned().references('Users.id').onDelete('CASCADE');
                    table.integer('Keyword_id').unsigned().references('Keywords.id').onDelete('CASCADE');
                  }).then(function(table) {
                    console.log('Created table keywords_users');
                  });
                }
              });
            });
          }
        });
      });
    }
  });

  db.knex.schema.hasTable('ApiTransactions').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('ApiTransactions', function(apiTransactions) {
        apiTransactions.increments('id').primary();
        apiTransactions.timestamps();
        apiTransactions.integer('userId').unsigned().references('Users.id').notNullable();
        apiTransactions.string('route');
        apiTransactions.string('method');
      }).then(function(table) {
        console.log('Created table ApiTransactions');
      });
    }
  });

  db.knex.schema.hasTable('Tweets').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('Tweets', function(tweets) {
        // tweed IDs come back as strings because they are too large
        // for JS ints. But bookshelf doesn't let you store 'id'
        // as a string because it's a reserved word for ints only
        tweets.string('tweetId');
        tweets.string('userId');
        tweets.string('text');
        tweets.string('source');
        tweets.float('longitude');
        tweets.float('latitude');
        tweets.integer('retweetCount');
        tweets.integer('favoriteCount');
        tweets.bigInteger('tweetCreatedAt');
        tweets.string('lang');
        tweets.float('sentiment');
      }).then(function(table) {
        console.log('Created table Tweets');
      });
    }
  });
}





db.truncateAllTables = function(done) {

  db.knex.raw('delete from keywords_users').then(function(then) {

  });

  db.knex.raw('delete from ApiTransactions').then(function(then) {

  });
  db.knex.raw('delete from Users').then(function(then) {

  });
  db.knex.raw('delete from Tweets').then(function(then) {

  });
  db.knex.raw('delete from Keywords').then(function(then) {

  });

  done();
};

module.exports = db;
