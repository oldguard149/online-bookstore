exports.userInEmployee = `SELECT fullname, emp_id, email, hash_password, role FROM employees WHERE email = ?;`;

exports.userInCustomer = `SELECT fullname, customer_id, email, hash_password FROM customers WHERE email = ?;`;

exports.createCustomer = `
INSERT INTO customers (fullname, email, hash_password, phone_number, address)
VALUES (?, ?, ?, ?, ?);`;

exports.customerByEmail = `SELECT customer_id FROM customers WHERE email = ?;`;

exports.customerById = `
SELECT
    customer_id,
    fullname,
    email,
    phone_number,
    address
FROM 
    customers 
WHERE 
    customer_id = ?;`;

exports.updatePasswordForCustomer = `UPDATE customers SET hash_password = ? WHERE customer_id = ?;`;

exports.updateCustomerInfo = `
UPDATE
    customers
SET
    fullname = ?,
    phone_number = ?,
    address = ?
WHERE
    customer_id = ?;`;

exports.employeeList = `
SELECT
    emp_id,
    fullname,
    email,
    identity_number,
    phone_number,
    salary,
    role
FROM employees;`

exports.employeeByEmail = `SELECT emp_id FROM employees WHERE email = ?;`;

exports.employeeById = `SELECT * FROM employees WHERE emp_id = ?;`;

exports.employeeByPhoneNumber = `SELECT emp_id FROM employees WHERE phone_number = ?;`;

exports.employeeByIdCard = `SELECT emp_id FROM employees WHERE identity_number = ?;`;

exports.createEmployee = `
INSERT INTO employees (fullname, email, identity_number, phone_number, salary, hash_password, role)
VALUES (?, ?, ?, ?, ?, ?, ?);`;

exports.updateEmployee = `
UPDATE employees SET fullname=?, email=?, identity_number=?, phone_number=?, salary=?, role=?
WHERE emp_id = ?;`;

exports.deleteEmployee = `DELETE FROM employees WHERE emp_id = ?;`;

exports.updatePasswordForEmployee = `UPDATE employees SET hash_password = ? WHERE emp_id = ?;`;


exports.createRecoverPasswordLink = `INSERT INTO recoverpasswords(email, token, role, create_date) values (?, ?, ?, ?);`;

exports.checkTokenWhenRecoverPassword = `SELECT FROM recoverpasswords WHERE token = ?;`;

exports.updateCustomerPassword = `UPDATE customers SET hash_password=? WHERE customer_id = ?;`;

exports.updateEmployeePassword = `UPDATE employees SET hash_password=? WHERE emp_id = ?;`;