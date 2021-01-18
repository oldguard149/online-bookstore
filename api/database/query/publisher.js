exports.bookListForPublisherDetail =
    `WITH books AS (SELECT b.* FROM books b WHERE b.publisher_id = ? LIMIT ?, ?)
SELECT book.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books as book
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON book.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON book.publisher_id = p.publisher_id;`;

exports.bookCountForPublisherDetail =
    `SELECT COUNT(*) AS count FROM books WHERE publisher_id = ?`;

exports.publisherList =
    `SELECT p.name, p.publisher_id, (SELECT COUNT(*) FROM books b WHERE b.publisher_id = p.publisher_id) AS bookcount
FROM publishers p
ORDER BY publisher_id ASC
LIMIT ?, ?;`;

exports.publisherCount = `SELECT COUNT(*) AS count FROM publishers`;

exports.publisherById = `SELECT * FROM publishers WHERE publisher_id = ?;`;

exports.publisherByName = `SELECT publisher_id, name FROM publishers WHERE name = ?;`;

exports.publisherByEmail = `Select publisher_id, name, email FROM publishers WHERE email = ?;`;

exports.createPublisher = `INSERT INTO publishers(name, email) VALUES (?, ?);`;

exports.updatePublisher = `UPDATE publishers SET name=?, email=? WHERE publisher_id = ?;`;

exports.deletePublisher = `DELETE FROM publishers WHERE publisher_id = ?;`;

exports.publisherSearch = `SELECT publisher_id, name FROM publishers WHERE name LIKE CONCAT('%', ?, '%') LIMIT ?, ?;`;

exports.publisherSearchCount = `SELECT COUNT(publisher_id) as count FROM publishers WHERE name LIKE CONCAT('%', ?, '%');`;

exports.publisherForStockImport = `SELECT publisher_id, name FROM publishers;`;