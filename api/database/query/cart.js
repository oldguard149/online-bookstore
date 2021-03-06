exports.cartByCustomerId = `SELECT cart_id, total_price, customer_id FROM carts WHERE customer_id = ?;`;

exports.createCart = `INSERT INTO carts(customer_id, total_price) VALUES (?, ?);`;

exports.cartDetailByCartIdAndIsbn = `SELECT cart_id, isbn, quantity, price FROM cartdetails WHERE cart_id = ? AND isbn = ?;`;

exports.createCartItem = `INSERT INTO cartdetails(cart_id, isbn, quantity, price) VALUES (?, ?, ?, ?);`;

exports.updateCartItem = `UPDATE cartdetails SET quantity=?, price=? WHERE cart_id = ? AND isbn = ?;`;

exports.updateCartTotalPrice = `UPDATE carts SET total_price = ? WHERE cart_id = ?;`;

exports.allItemsInCart = `SELECT isbn, quantity, price FROM cartdetails WHERE cart_id = ?;`;

exports.bookDataForCart = `SELECT isbn, quantity, price FROM books WHERE isbn = ?;`;

exports.cartItemsWithIsbnAndCartId = `
SELECT
    isbn, quantity, price
FROM
    cartdetails
WHERE
    isbn = ? AND cart_id = ?;`;

exports.bookPriceAndQuantity = `SELECT price, quantity FROM books WHERE isbn = ?;`;

exports.deleteCartItem = `
DELETE FROM
    cartdetails
WHERE
    isbn = ?
    AND cart_id = ?;`;

exports.cartDetailByCustomerId = `
WITH cart_items AS (
    SELECT
        cd.isbn,
        cd.quantity,
        cd.price
    FROM
        cartdetails cd
        RIGHT JOIN
            carts c
            ON c.cart_id = cd.cart_id
    WHERE
        c.customer_id = ?
)
SELECT
    ci.isbn,
    ci.quantity,
    ci.price,
    b.name AS book_name,
    b.quantity AS available_qty,
    b.image_url AS image_url,
    a.fullname AS author_name,
    p.name AS publisher_name
FROM
    cart_items ci
    INNER join books b ON b.isbn = ci.isbn
    LEFT OUTER JOIN (
        writtens w
        JOIN authors a ON w.author_id = a.author_id
    ) ON b.isbn = w.isbn
    LEFT OUTER JOIN publishers p ON b.publisher_id = p.publisher_id
ORDER BY
    ci.isbn;`;

exports.cartItemsWithIsbnList = `
SELECT
    b.isbn,
    b.price,
    b.name AS book_name,
    b.quantity as available_qty,
    b.image_url as image_url,
    a.fullname as author_name,
    p.name as publisher_name
FROM
    books b
LEFT OUTER JOIN (
    writtens w
    JOIN authors a ON w.author_id = a.author_id
) ON b.isbn = w.isbn
LEFT OUTER JOIN publishers p ON b.publisher_id = p.publisher_id
WHERE
    b.isbn IN (?)
ORDER BY
    b.isbn;`