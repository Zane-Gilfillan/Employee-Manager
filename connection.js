const connectionReq = require('./database_info')
const mysql = require('mysql')

const connectionInfo = require('./dbinfo');
const app = require('./index.js');

// Create database connection with .env
const db = mysql.createConnection({
    host: connectionInfo.db_host,
    port: connectionInfo.db_port,
    user: connectionInfo.db_user,
    password: connectionInfo.db_password,
    database: connectionInfo.db_name
});

// Make the connection
db.connect(err => {
    if (err) throw err;
    // console.log("connected as id "+connection.threadId);
    app.init();
});