exports.bookListForAuthorDetail =
    `WITH books AS (SELECT b.* FROM books b, writtens w WHERE b.isbn = w.isbn AND w.author_id = ? LIMIT ?, ?)
SELECT books.*, p.name AS publisher_name, a.fullname AS author_name, a.author_id AS author_id
FROM books
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON books.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON books.publisher_id = p.publisher_id;`

exports.authorList =`
SELECT a.author_id, a.fullname, (SELECT COUNT(*) FROM writtens w WHERE w.author_id = a.author_id) AS bookcount
FROM authors a
LIMIT ?, ?;`

exports.authorCount = `SELECT COUNT(author_id) AS count FROM authors;`

exports.bookCountForAuthorDetail = `SELECT COUNT(author_id) AS count FROM writtens WHERE author_id = ?;`;

exports.authorById = `SELECT author_id, fullname FROM authors WHERE author_id = ?`;

exports.authorByFullname = `SELECT author_id, fullname FROM authors WHERE fullname = ?;`;

exports.authorSearch = `SELECT fullname, author_id FROM authors WHERE fullname LIKE CONCAT('%', ?, '%') LIMIT ?, ?;`;

exports.authorSearchCount = `SELECT COUNT(author_id) AS count FROM authors WHERE fullname LIKE CONCAT('%', ?, '%');`

exports.updateAuthor = `UPDATE authors SET fullname=?, info=? WHERE author_id = ?;`;

exports.deleteAuthor = `DELETE FROM authors WHERE author_id = ?;`;

exports.createAuthor = `INSERT INTO authors(fullname, info) VALUES (?, ?);`;

exports.bookListForAuthorDelete = `
SELECT b.isbn, b.name
FROM books b
JOIN writtens w ON b.isbn = w.isbn 
WHERE w.author_id = ?;`

exports.authorInfoForManagement = `SELECT author_id, fullname, info FROM authors WHERE author_id = ?;`;