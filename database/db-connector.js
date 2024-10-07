// Get an instance of mysql we can use in the app
var mysql = require('mysql');

// Create a 'connection pool' using the provided credentials
/* var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_leesan2',
  password: 'xxxxx',
  database: 'cs340_leesan2',
}); */

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_negusem',
  password: '1420',
  database: 'cs340_negusem',
});

// Export it for use in our application
module.exports.pool = pool;
