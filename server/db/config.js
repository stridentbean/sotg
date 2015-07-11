var config = {
  user : process.env.MYSQL_DATABASE_USER,
  password : process.env.MYSQL_DATABASE_PASSWORD,
  host : '127.0.0.1', 
  database: process.env.MYSQL_DATABASE
};

module.exports = config;
