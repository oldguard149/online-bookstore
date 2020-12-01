exports.bookByIsbn = `SELECT * FROM books WHERE isbn = ?;`;

// there is case that author is null (also genre or publisher)
// left outer join make sure there are still book if those entities link is break
exports.bookDetail = `
SELECT
    b.isbn,
    b.name,
    b.image_url,
    b.summary,
    b.quantity AS available_qty,
    b.price,
    b.genre_id AS genre_id,
    b.publisher_id AS publisher_id,
    p.name AS publisher_name,
    g.name AS genre_name,
    a.author_id AS author_id,
    a.fullname AS author_name
FROM
    books AS b
    LEFT OUTER JOIN (
        writtens w
        JOIN authors a ON w.author_id = a.author_id
    ) ON b.isbn = w.isbn
    LEFT OUTER JOIN publishers p ON b.publisher_id = p.publisher_id
    LEFT OUTER JOIN genres g ON b.genre_id = g.genre_id
WHERE
    b.isbn = ?;`;

exports.recommendBook = `
WITH books AS (SELECT b.* FROM books b WHERE (b.publisher_id = ? OR b.genre_id = ?) AND b.isbn != ? LIMIT ?)
SELECT b.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books b
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON b.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON b.publisher_id = p.publisher_id;`;

exports.bookList = `
WITH books AS (SELECT b.* FROM books b LIMIT ?, ?)
SELECT book.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books as book
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON book.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON book.publisher_id = p.publisher_id;`;

exports.indexBookList = `
WITH books AS (SELECT b.name, b.isbn, b.price, b.publisher_id FROM books b LIMIT ?, ?)
SELECT book.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books as book
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON book.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON book.publisher_id = p.publisher_id;`;

exports.bookCount = `SELECT COUNT(*) AS count FROM books;`;

exports.genreForBookManager = `SELECT * FROM genres;`;

exports.publisherForBookManaer = `SELECT publisher_id, name FROM publishers;`;

exports.createBook = `
INSERT INTO books (isbn, name, image_url, summary, genre_id, publisher_id) 
VALUES (?, ?, ?, ?, ?, ?);`;

exports.updateBook = `
UPDATE books SET isbn=?, name=?, image_url=?, summary=?, genre_id=?, publisher_id=?
WHERE isbn = ?;`;

exports.deleteBook = `DELETE FROM books WHERE isbn = ?;`;

exports.bookSearch =
    `SELECT isbn, name FROM books WHERE isbn = ? OR name LIKE CONCAT('%', ?, '%') LIMIT ?, ?;`;

exports.bookSearchCount = `SELECT COUNT(*) AS count FROM books WHERE isbn = ? OR name LIKE CONCAT('%', ?, '%');`;

exports.written = `INSERT INTO writtens(isbn, author_id) VALUES (?, ?);`;

exports.deleteAuthorFromWrittens = `DELETE FROM writtens WHERE isbn = ?;`;


//------------------------------------------ IMPORT STOCK FORM ------------------------------------------
exports.createImportStockForm = `
INSERT INTO importbookforms (import_date, total_price, emp_id, publisher_id)
VALUES (?, ?, ?, ?);`;

exports.updateBookStock = `UPDATE books SET quantity=?, price=? WHERE isbn = ?;`;

exports.createStockFormDetail = `
INSERT INTO importbookformdetails(form_id, isbn, quantity, price)
VALUES (?, ?, ?, ?);`;

exports.updateImportStockFormTotalPrice = `UPDATE importbookforms SET total_price=? WHERE form_id = ?;`;