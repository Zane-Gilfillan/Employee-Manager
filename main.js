// Setup dependencies
const inquirer = require('inquirer');
const db = require('./db.js');
const ascii = require('ascii-art-font');

// Initalize the app
let init = () => {

    console.log("\n"+"=".repeat(62)+"\n");
    ascii.create('    Employee','Doom',(err, result) => {
        if (err) throw err;
        console.log(result);
        ascii.create('      Manager','Doom',(err, result) => {
            if (err) throw err;
            console.log(result);
            console.log("\n"+"=".repeat(62)+"\n");
            mainPrompt();
        });
    });
    
}

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

function viewPrompt() {
    inquirer.prompt([
        {
            message: "View:",
            type: "list",
            name: "table_name",
            choices: [{name: "All Employees", value: "employees"},{name:"All Departments",value: "departments"},{name:"All Roles", value: "roles"}]
        }
    ]).then(answers => {

        db.showAll(answers.table_name, callMainPrompt);
    });
}

//choice for adding to database

function addPrompt(table_name) {

    if (table_name === false) {

        inquirer.prompt([
            {
                message: "What do you want to add?",
                name: "table_name",
                type: "list",
                choices: [
                    {
                        name: "New Employee",
                        value: "employees"
                    },
                    {
                        name: "New Role",
                        value: "roles"
                    },
                    {
                        name: "New Department",
                        value: "departments"
                    },
                    {
                        name: "Back to Main Menu",
                        value: "mainMenu"
                    }
                ]
            }
        ]).then(answers => {

            if (answers.table_name === "mainMenu") return mainPrompt();

            return addPrompt(answers.table_name);
        });

    }

    if (table_name === "employees") {

        let questions = [
            {
                message: "First Name:",
                name: "firstName"
            },
            {
                message: "Last Name:",
                name: "lastName"
            }
        ];

        db.choices.roles().then(res => {
            questions.push(formatListQuestion("role","role_id",res));
            db.choices.employees().then(res => {
                questions.push({
                    message: "Select manager:",
                    type: "list",
                    name: "manager_id",
                    choices: res
                });
                inquirer.prompt(questions).then(answers => {
                    db.createRow(answers,table_name,callMainPrompt);  
                });
            });
        });
    } 
    
    else if (table_name === "roles") {
        let questions = [
            {
                message: "Role Title:",
                name: "title"
            },
            {
                message: "Salary",
                name: "salary",
                validate: salary => {
                    if (isNaN(salary)) {
                        console.log("\n Invalid: Must be a number. Do not include decimals.");
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ];

        db.choices.departments().then(res => {
            questions.push(formatListQuestion("department","department_id",res));   
            inquirer.prompt(questions).then(answers => {
                db.createRow(answers,table_name, callMainPrompt);
    
            });
        });

    } 
    
    else if (table_name === "departments") {
        inquirer.prompt([
            {
                message: "Department Name:",
                name: "name"
            }
        ]).then(answers => {
            db.createRow(answers,table_name, callMainPrompt);
        });
    }
}