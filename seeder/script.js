const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const series = require('async/series');
const { query } = require('../api/database/db_hepler');


series([
    createTables,
    insertPublishers,
    insertGenres,
    insertBooks,
    insertAuthors,
    insertWrittens
], (err, result) => {
    if (err) console.log(err);
    else console.log('Data has been inserted into database.');
});

async function createTables(callback) {
    const tables = require('./tables.json');
    for (const id in tables) {
        await query(tables[id]);
    }
}


function insertPublishers(callback) {
    const jsonStream = StreamArray.withParser();
    const sql = `INSERT INTO publishers(publisher_id, name, email) VALUES (?,?,null);`
    jsonStream.on('data', async ({ key, value: publisher }) => {
        await query(sql, [publisher['publisher_id'], publisher['name']]);
    });
    jsonStream.on('error', (err) => console.log(err));
    fs.createReadStream('publishers.json', { encoding: 'utf-8' })
        .pipe(jsonStream.input)
        .on('end', () => callback(null, 'done'));

}

function insertGenres(callback) {
    const jsonStream = StreamArray.withParser();
    const sql = `INSERT INTO genres(genre_id, name) VALUES (?,?);`;
    jsonStream.on('data', async ({ key, value: genre }) => {
        await query(sql, [genre['genre_id'], genre['name']]);
    });

    jsonStream.on('error', (err) => console.log(err));
    fs.createReadStream('genres.json', { encoding: 'utf-8' }).pipe(jsonStream.input).on('end', () => callback(null, 'done'));;
}

function insertBooks(callback) {
    const jsonStream = StreamArray.withParser();
    const sql = `INSERT INTO books (isbn, name, image_url, summary, quantity, price, genre_id, publisher_id) 
    VALUES (?, ?, ?, null, 50, ?, ?, ?);`;
    jsonStream.on('data', async ({ key, value: book }) => {
        try {
            await query(sql,
                [book['isbn'], book['name'], book['imageurl'], 9, book['genre_id'], book['publisher_id']]);
        } catch (error) {
            console.log(error.sqlMessage);
        }
    });

    jsonStream.on('error', (err) => console.log(err));
    fs.createReadStream('books.json', { encoding: 'utf-8' }).pipe(jsonStream.input).on('end', () => callback(null, 'done'));
}

function insertAuthors(callback) {
    const jsonStream = StreamArray.withParser();
    const sql = `INSERT INTO authors(author_id, fullname) VALUES (?,?);`;
    jsonStream.on('data', async ({ key, value: author }) => {
        try {
            await query(sql, [author['author_id'], author['fullname']]);
        } catch (error) {
            console.log(`${error.sqlMessage}`);
        }
    });

    jsonStream.on('error', (err) => console.log(err));
    fs.createReadStream('authors.json', { encoding: 'utf-8' }).pipe(jsonStream.input).on('end', () => callback(null, 'done'));
}

function insertWrittens(callback) {
    const jsonStream = StreamArray.withParser();
    const sql = `INSERT INTO writtens(isbn, author_id) VALUES (?,?);`;
    jsonStream.on('data', async ({ key, value: written }) => {
        try {
            await query(sql, [written['isbn'], written['author_id']]);
        } catch (error) {
            console.log(error.sqlMessage);
        }
    });

    jsonStream.on('error', (err) => console.log(err));
    fs.createReadStream('writtens.json', { encoding: 'utf-8' }).pipe(jsonStream.input).on('end', () => callback(null, 'done'));
}