exports.billListForCustomer = `SELECT * FROM bills WHERE customer_id=?;`;

exports.billByBillId = `
SELECT
    bill_id,
    customer_id,
    emp_id,
    bill_status,
    total_price,
    create_date
FROM
    bills
WHERE
    bill_id = ?;`;

exports.billItemsByBillId = `
SELECT
    bd.isbn,
    b.name,
    bd.quantity,
    bd.price
FROM
    billdetails bd
    JOIN books b using (isbn)
WHERE
    bill_id = ?;`;

exports.billList = `SELECT * FROM bills LIMIT ?, ?;`;

exports.billCount = `SELECT COUNT(*) AS count FROM bills;`;

exports.unconfirmedBillList = `SELECT * FROM bills WHERE bill_status = 'UNCONFIRMED' LIMIT ?, ?`;

exports.unconfirmedBillCount = `SELECT COUNT(*) AS count FROM bills WHERE bill_status = 'UNCONFIRMED';`;

exports.createBill = `
INSERT INTO 
    bills (bill_id, customer_id, emp_id, total_price, create_date) 
VALUES
    (?, ?, ?, ?, ?);`;

exports.createBillItem = `
INSERT INTO
    billdetails (bill_id, isbn, quantity, price)
VALUES
    (?, ?, ?, ?);`;

exports.bookQuantity = `SELECT quantity FROM books WHERE isbn = ?;`;

exports.updateBillTotalPrice = `UPDATE bills SET total_price = ? WHERE bill_id = ?;`;

exports.confirmBill = `UPDATE bills SET bill_status='CONFIRMED', emp_id=? WHERE bill_id = ?;`;

exports.cancelBill = `UPDATE bills SET bill_status='CANCELLED', emp_id=? WHERE bill_id=?;`;

exports.deleteBillWitthBillId = `DELETE FROM bills WHERE bill_id = ?;`;

exports.deleteBillItemsWithBillId = `DELETE FROM billdetails WHERE bill_id = ?;`;