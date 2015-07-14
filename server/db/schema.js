/**
  * Schema for mySql
  *@module db/schema
  */
var db = require('../config/db.js');  
//drop all tables. 
if (false) {
  db.knex.schema.dropTableIfExists('User').then(function(table) {
    console.log('Dropped table', table);
  });
}

//create tables
db.knex.schema.hasTable('User').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('User', function(user) {
      user.increments('id').primary();
      user.timestamps();
      user.string('username');
      user.string('password');
      // user.string('salt'); bcrypt takes care of this for us
      user.string('apiKey');
    }).then(function(table) {
      console.log('Created table', table);
      sendIt();
    });
  }
});

db.knex.schema.hasTable('Tweet').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('Tweet', function(tweet) {
      tweet.bigInteger('id');
      tweet.string('text');
      tweet.string('GPS');
      tweet.timestamp('timestamp');
      //hashtags as a foreign key
      tweet.json('urls');
    });
  }
});

db.knex.schema.hasTable('Hashtag').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('Hashtag', function(hashtag) {
      hashtag.increments('id').primary();
      hashtag.string('tag');
    });
  }
});

/**
  * Remove all tables from the database 
  *@arg next {function} Function to run after truncation is complete
  */

module.exports = db;
