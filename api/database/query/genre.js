exports.genreList =
    `SELECT g.genre_id, g.name, (SELECT COUNT(*) FROM books b WHERE b.genre_id = g.genre_id) AS bookcount
FROM genres g
ORDER BY name ASC
LIMIT ?, ?;`;

exports.genreById = `SELECT genre_id, name FROM genres WHERE genre_id = ?;`;

exports.genreByName = `SELECT * FROM genres WHERE name = ?;`;

exports.createGenre = `INSERT INTO genres VALUES (null, ?);`;

exports.updateGenre = `UPDATE genres SET name = ? WHERE genre_id = ?;`;

exports.deleteGerne = `DELETE FROM genres WHERE genre_id = ?;`;

exports.bookListForGenreDetail =
    `WITH books AS (SELECT b.* FROM books b WHERE b.genre_id = ? LIMIT ?, ?)
SELECT book.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books as book
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON book.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON book.publisher_id = p.publisher_id;`;

exports.genreCount = `SELECT COUNT(*) AS count FROM genres;`;

exports.bookCountForGenreDetail = `SELECT COUNT(*) AS count FROM books WHERE genre_id = ?;`;

exports.genreSearchCount = `SELECT COUNT(*) AS count FROM genres WHERE name LIKE CONCAT('%', ?, '%');`

exports.genreSearch = `SELECT genre_id, name FROM genres WHERE name LIKE CONCAT('%', ?,  '%') LIMIt ?, ?;`;