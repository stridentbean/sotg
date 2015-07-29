/**
 * Schema for mySql
 *@module db/schema
 */

var db = require('../config/db.js');

/**
 * Remove all tables from the database 
 */

// Run 'node server/db/schema.js clean' to drop all tables
// Run 'node server/db/schema.js create' to create all tables
// To set an environment variable and drop/create the 'test' database
// prepend the command with NODE_ENV=test
// Like this: 'NODE_ENV=test node server/db/schema.js clean'
if (process.argv[2] === 'clean') {

  db.knex.schema.dropTableIfExists('keywords_users').then(function(table) {
    console.log('Dropped table keywords_users');

    db.knex.schema.dropTableIfExists('api_transactions').then(function(table) {
      console.log('Dropped table api_transactions');

      db.knex.schema.dropTableIfExists('keywords').then(function(table) {
        console.log('Dropped table keywords');

        db.knex.schema.dropTableIfExists('users').then(function(table) {
          console.log('Dropped table users');
        });

      });

    });

  });
  db.knex.schema.dropTableIfExists('tweets').then(function(table) {
    console.log('Dropped table tweets');
  });
  db.knex.schema.dropTableIfExists('streaming_servers').then(function(table) {
    console.log('Dropped table streaming_servers');
  });

  setTimeout(function() {
    process.exit();
  }, 500);
} else {
  //create tables
  db.knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('users', function(user) {
        user.increments('id').primary();
        user.timestamps();
        user.string('username');
        user.string('password');
        // user.string('salt'); bcrypt takes care of this for us
        user.string('apiKey');
        user.decimal('throttle');
        user.datetime('lastApiCall');
        user.string('resetPasswordToken');
        user.integer('resetPasswordExpires');
      }).then(function(table) {
        console.log('Created table users');
        db.knex.schema.hasTable('keywords').then(function(exists) {
          if (!exists) {
            db.knex.schema.createTable('keywords', function(keyword) {
              keyword.increments('id').primary();
              keyword.string('keyword');
              keyword.string('streamId');
              keyword.timestamps();
            }).then(function(table) {
              console.log('Created table keywords');
              db.knex.schema.hasTable('keywords_users').then(function(exists) {
                if (!exists) {
                  db.knex.schema.createTable('keywords_users', function(table) {
                    table.integer('User_id').unsigned().references('users.id').onDelete('CASCADE');
                    table.integer('Keyword_id').unsigned().references('keywords.id').onDelete('CASCADE');
                    table.primary(['User_id', 'Keyword_id']);
                    table.unique(['User_id', 'Keyword_id']);
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

  db.knex.schema.hasTable('api_transactions').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('api_transactions', function(api_transaction) {
        api_transaction.increments('id').primary();
        api_transaction.timestamps();
        api_transaction.integer('userId').unsigned().references('users.id').notNullable();
        api_transaction.string('route');
        api_transaction.string('method');
      }).then(function(table) {
        console.log('Created table api_transactions');
      });
    }
  });

  db.knex.schema.hasTable('tweets').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('tweets', function(tweet) {
        // tweed IDs come back as strings because they are too large
        // for JS ints. But bookshelf doesn't let you store 'id'
        // as a string because it's a reserved word for ints only
        tweet.string('tweetId');
        tweet.string('userId');
        tweet.string('text');
        tweet.string('source');
        tweet.float('longitude');
        tweet.float('latitude');
        tweet.integer('retweetCount');
        tweet.integer('favoriteCount');
        tweet.bigInteger('tweetCreatedAt');
        tweet.string('lang');
        tweet.float('sentiment');
      }).then(function(table) {
        console.log('Created table tweets');
      });
    }
  });

  db.knex.schema.hasTable('streaming_servers').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('streaming_servers', function(table) {
        table.increments('id').primary();
        table.string('key');
        table.timestamps();
        table.boolean('registered');
        table.string('ip');
        table.integer('port');
      }).then(function(table) {
        console.log('Created table streaming_servers');
      });
    }
  });
}

if (process.argv[2] === 'create') {
  setTimeout(function() {
    process.exit();
  }, 500);
}


db.truncateAllTables = function(done) {

  db.knex.raw('delete from keywords_users').then(function(then) {

  });

  db.knex.raw('delete from api_transactions').then(function(then) {

  });
  db.knex.raw('delete from users').then(function(then) {

  });
  db.knex.raw('delete from tweets').then(function(then) {

  });
  db.knex.raw('delete from keywords').then(function(then) {

  });
  
  db.knex.raw('update streaming_servers set registered = false').then(function(then) {

  });
  db.knex.raw('delete from streaming_servers').then(function(then) {

  });

  done();
};

module.exports = db;
