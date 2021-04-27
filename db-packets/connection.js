const connectionReq = require('./database_info')
const mysql = require('mysql')

// Create database connection with .env
const db = mysql.createConnection({
    host: connectionReq.db_host,
    port: connectionReq.db_port,
    user: connectionReq.db_user,
    password: connectionReq.db_password,
    database: "employee_db"
});

// Make the connection
db.connect(err => {
    if (err) throw err;
    

    console.log("nice!")

    app.init();
});