INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('Engineering'),
    ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Manager', 75000.00, 1),
    ('Sales Representative', 50000.00, 1),
    ('Marketing Manager', 80000.00, 2),
    ('Marketing Coordinator', 55000.00, 2),
    ('Software Engineer', 90000.00, 3),
    ('Web Developer', 80000.00, 3),
    ('HR Manager', 75000.00, 4),
    ('HR Assistant', 55000.00, 4);
    
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Alice', 'Johnson', 3, 1),
    ('Bob', 'Williams', 4, 2),
    ('Charlie', 'Brown', 5, 3),
    ('David', 'Lee', 6, 3),
    ('Eva', 'Garcia', 7, NULL),
    ('Frank', 'Wilson', 8, 7);
