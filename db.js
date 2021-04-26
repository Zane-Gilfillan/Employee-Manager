// Setup dependencies
const mysql = require('mysql');
require("dotenv").config();
require('console.table');

// Setup file dependencies
const connectionInfo = require('./database_info.js');
const app = require('./main.js');

// Create database connection with .env variables
const db = mysql.createConnection({
    host: connectionInfo.db_host,
    port: connectionInfo.db_port,
    user: connectionInfo.db_user,
    password: connectionInfo.db_pass,
    database: "employee_db"
});

// Make the connection
db.connect(err => {
    if (err) throw err;
    
    app.init();
});

let showAll = (table_name,callback) => {
    let query = "";
    if (table_name === "employees") {

        // show all employees 

        query = `SELECT emp1.firstName AS 'First Name', emp1.lastName AS 'Last Name', title AS 'Title', name AS 'Department', salary AS 'Salary', GROUP_CONCAT(DISTINCT emp2.firstName,' ', emp2.lastName) AS 'Manager'
        FROM employees emp1
        JOIN roles ON emp1.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees emp2 ON emp1.manager_id = emp2.id
        GROUP BY emp1.id
        ORDER BY emp1.lastName ASC`;
    } else if (table_name === "roles") {

        // show all rolels   

        query = `SELECT title AS 'Position', name AS 'Department', salary AS 'Salary', COUNT(employees.role_id) AS 'Total Employees'
        FROM roles
        LEFT OUTER JOIN departments ON roles.department_id = departments.id
        LEFT OUTER JOIN employees ON employees.role_id = roles.id
        GROUP BY roles.id
        ORDER BY title ASC`;
    } else if (table_name === "departments") {

        // show all departments
        
        query = `SELECT name AS 'Department', COUNT(roles.department_id) AS 'Total Roles'
        FROM departments
        LEFT OUTER JOIN roles ON roles.department_id = departments.id
        GROUP BY departments.id
        ORDER BY name ASC`;
    }

    db.query(query,table_name,(err,res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        callback();
    });
}

let createRow = (data,table_name,callback) => {
    db.query(`INSERT INTO ${table_name} SET ?`,[data],function(err,res) {
        if (err) throw err;
        console.log("\nSuccess! Added to "+table_name+".\n");
        callback();
    });
}