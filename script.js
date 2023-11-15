const mysql = require('mysql');
const inquirer = require('inquirer');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'tracker',
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
            switch (answers.menuOption) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                default:
                    console.log('Invalid option selected.');
                    connection.end();
            }
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



function viewAllRoles() {
    const query = 'SELECT * FROM roles';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying roles: ' + err);
            return;
        }

        console.log('All Roles:');
        for (const role of results) {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        }

        mainMenu();
    });
}

function viewAllEmployees() {
    const query = 'SELECT * FROM employees';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying employees: ' + err);
            return;
        }

        console.log('All Employees:\n');
        console.table(results);
        // for (const employee of results) {
        //     console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        // }

        mainMenu();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the new department:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO departments (name) VALUES (?)';
            const values = [answers.departmentName];

            connection.query(query, values, (err) => {
                if (err) {
                    console.error('Error adding department: ' + err);
                    return;
                }

                console.log(`Department '${answers.departmentName}' added successfully.`);
                mainMenu();
            });
        });
}




function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of the new role:',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the salary for the new role:',
            },
            {
                type: 'input',
                name: 'roleDepartment',
                message: 'Enter the department ID for the new role:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [answers.roleTitle, answers.roleSalary, answers.roleDepartment];

            connection.query(query, values, (err) => {
                if (err) {
                    console.error('Error adding role: ' + err);
                    return;
                }

                console.log(`Role '${answers.roleTitle}' added successfully.`);
                mainMenu();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter the first name of the new employee:',
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter the last name of the new employee:',
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: 'Enter the role ID for the new employee:',
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: 'Enter the manager ID for the new employee:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager];

            connection.query(query, values, (err) => {
                if (err) {
                    console.error('Error adding employee: ' + err);
                    return;
                }

                console.log(`Employee '${answers.employeeFirstName} ${answers.employeeLastName}' added successfully.`);
                mainMenu();
            });
        });
}

function updateEmployeeRole() {
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employeeName FROM employees';

    connection.query(employeeQuery, (err, employeeResults) => {
        if (err) {
            console.error('Error querying employees: ' + err);
            return;
        }

        const employees = employeeResults.map((employee) => ({
            name: employee.employeeName,
            value: employee.id,
        }));

        const roleQuery = 'SELECT id, title FROM roles';

        connection.query(roleQuery, (err, roleResults) => {
            if (err) {
                console.error('Error querying roles: ' + err);
                return;
            }

            const roles = roleResults.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            // Prompt the user to select an employee and a new role
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: 'Select the employee to update:',
                        choices: employees,
                    },
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select the new role for the employee:',
                        choices: roles,
                    },
                ])
                .then((answers) => {
                    const updateQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';
                    const updateValues = [answers.newRoleId, answers.employeeId];

                    connection.query(updateQuery, updateValues, (err) => {
                        if (err) {
                            console.error('Error updating employee role: ' + err);
                            return;
                        }

                        console.log('Employee role updated successfully.');
                        mainMenu();
                    });
                });
        });
    });
}