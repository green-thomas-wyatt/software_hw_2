var mysql = require('mysql2');
 
require('dotenv').config(); // use npm install for this first
 
var connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'Spec6007!',
    database : 'HW_2'
});

connection.connect((err => {
    if(err) throw err;
    console.log('MySQL Connected');
}));
 
module.exports = connection;
