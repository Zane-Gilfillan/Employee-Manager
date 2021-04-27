# Employee-Manager

## Initializing 

Clone this repository and then run:

`npm install` agains the package.json dependencies

to start the application run:

`node main.js`

## Main Code Structure 

The heart of the application is running through an Inquirer prompt against a MYSQL database. A small code snippit on how the app begins can be seen below:

```
let mainPrompt = () => {
    inquirer.prompt([
        {
            message: "What do you want to do?",
            type: "list",
            name: "doWhat",
            choices: ["View","Add","Edit","Remove","Quit"]
        }
    ]).then(answers => {
        switch(answers.doWhat) {
            case "View":
                return viewPrompt();
            case "Add":
                return addPrompt(false);
            case "Edit":
                return updatePrompt(false);
            case "Remove":
                return removePrompt(false);
            case "Quit":
                return quitApp();
        }
    });
}
```
And another example shows how we are accessing MYSQL through queries:

```
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
    }
```


