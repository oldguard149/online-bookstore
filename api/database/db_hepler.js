const pool = require('../config/pool');
const Q = require('./query');


function query(query, parameters = []) {
    return new Promise(async function (resolve, reject) {
        try {
            const [result, field] = await pool.query(query, parameters);
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}

function findOne(query, parameters=[]) {
    return new Promise(async (resolve, reject) => {
        try {
            const [result, _] = await pool.query(query, parameters);
            resolve(result[0]);
        } catch (error) {
            reject(error);
        }
    })
}

function countData(query, parameters=[]) {
    return new Promise(async (resolve, reject) => {
        try {
            const [result, field] = await pool.query(query, parameters);
            resolve(result[0].count);
        } catch (error) {
            reject(error)
        }
    })
}

function findOneUsingTransaction(connection, query, parameters=[]) {
    return new Promise(async (resolve, reject) => {
        try {
            const [result, field] = await connection.query(query, parameters);
            resolve(result[0]);
        } catch(error) {
            reject(error);
        }
    })
}

function queryUsingTransaction(connection, query, parameters=[]) {
    return new Promise(async (resolve, reject) => {
        try {
            const [result, field] = await connection.query(query, parameters);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    })
}

const loadDataForSideNav = async () => {
	const genres = await query(Q.genreForSidenav);
	const publishers = await query(Q.publisherForSidenav);
	const authors = await query(Q.authorForSidenav);
	return { genres, publishers, authors };
}

const loadGenresAndPublishers = async () => {
	const genres = await query(Q.book.genreForBookManager);
	const publishers = await query(Q.book.publisherForBookManaer);
	return {genres, publishers};
}

module.exports = {
    query,
    countData,
    findOne,
    findOneUsingTransaction,
    queryUsingTransaction,
    loadDataForSideNav,
    loadGenresAndPublishers
}