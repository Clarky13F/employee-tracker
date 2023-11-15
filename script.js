const mysql = require('mysql');
const inquirer = require('inquirer');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'employee_tracker',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + connection.threadId);
});


function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'menuOption',
                message: 'Select an option:',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                ],
            },
        ])
        .then((answers) => {

        });
}

mainMenu();

function viewAllDepartments() {
    const query = 'SELECT * FROM departments';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying departments: ' + err);
            return;
        }

        console.log('All Departments:');
        for (const department of results) {
            console.log(department.id, department.name);
        }

        mainMenu();
    });
}