const bcrypt = require('bcrypt');
const jwt = require('express-jwt');

const role = { ADMIN: 'ADMIN', EMP: 'EMP', CUSTOMER: 'CUSTOMER' };

const authMiddleware = jwt({
    secret: process.env.jwt_secret,
    userProperty: 'payload',
    algorithms: ['HS256']
});

async function getHashPassword(plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
            if (err) reject(err);
            resolve(hash);
        })
    })
    return hashedPassword;
}

function pagination(current, totalPage) {
    const list = [];
    const pageLimit = 3;
    let lowerLimit = upperLimit = Math.min(current, totalPage);

    for (var b = 1; b < pageLimit && b < totalPage;) {
        if (lowerLimit > 1) {
            lowerLimit--; b++;
        }
        if (b < pageLimit && upperLimit < totalPage) {
            upperLimit++; b++;
        }
    }

    for (var i = lowerLimit; i <= upperLimit; i++) {
        list.push(i);
    }
    return list;
}

// function calculateOffsetForPagination(bookPerPage, currentPage) {
//     return (bookPerPage * currentPage - bookPerPage)
// }

function calculateOffsetForPagination(bookPerPage, currentPage) {
    return bookPerPage * currentPage;
}

function isResultEmpty(rows) {
    // first condition is for findOne: "undefined" === typeof rows || undifined === rows
    // the second is for query: (Array.isArray(rows) && rows.length === 0)
    return undefined === rows || (Array.isArray(rows) && rows.length === 0);
}

function preprocessBookList(arr) {
    const result = [];
    let lastIndex = 0;
    let index = 0;
    if (isResultEmpty(arr)) {
        return [];
    }
    do {
        const element = arr[index];
        if (result.length > 0 && element.isbn === result[lastIndex].isbn) {
            result[lastIndex].Authors.push({ author_id: element.author_id || "", fullname: element.author_name || "" });
            index++;
        } else {
            result.push({
                "isbn": element.isbn,
                "name": element.name,
                "image_url": element.image_url,
                "summary": element.summary,
                "available_qty": element.available_qty,
                "price": element.price,
                Genre: {
                    genre_id: element.genre_id || null,
                    name: element.genre_name || null
                },
                Publisher: {
                    publisher_id: element.publisher_id || null,
                    name: element.publisher_name || null
                },
                Authors: [
                    { author_id: element.author_id || null, fullname: element.author_name || null }
                ]
            })
            lastIndex = result.length - 1;
            index++;
        }
    } while (index < arr.length);
    return result;
}

function preprocessCartItem(data) {
    if (isResultEmpty(data)) {
        return { cartItems: [], totalItems: 0 };
    } else {
        const r = [];
        let index = 0, lastindex = 0;
        do {
            const currentElement = data[index];
            if (r.length > 0 && currentElement.isbn === r[lastindex].isbn) {
                r[lastindex].authors.push(currentElement.author_name);
            } else {
                r.push({
                    isbn: currentElement.isbn,
                    order_qty: currentElement.quantity,
                    price: currentElement.price,
                    book_name: currentElement.book_name,
                    available_qty: currentElement.available_qty,
                    image_url: currentElement.image_url,
                    publisher_name: currentElement.publisher_name,
                    authors: [currentElement.author_name]
                });
                lastindex = r.length - 1;
            }
            index++;
        } while (index < data.length);
        return { cartItems: r, totalItems: r.length };
    }
}


// field must be unique. If oldField !== newField, that mean value has been changed
// objectWithValueOfNewField not empty mean newValue already exist, return false because
// newValue violate unique constraint 
function isDataNotValidForUpdate(objectWithValueOfNewField, oldValue, newValue) {
    return (!isResultEmpty(objectWithValueOfNewField) && oldValue !== newValue)
}

function handleError(res, status, error, msg = 'Server error.') {
    console.error(error);
    return res.status(parseInt(status)).json({ message: msg });
}

function getValidationError(errors) {
    const r = [];
    errors.forEach(error => {
        r.push(error.msg);
    });
    return r;
}

function handleValidationError(res, error) {
    return res.json({ success: false, message: getValidationError(error.array()) });
}

function sendSuccessResponseMessage(res, messageArray) {
    return res.json({ success: true, message: messageArray });
}

function sendErrorResponseMessage(res, messageArray) {
    return res.json({ success: false, message: messageArray });
}

/** Get query params. key: string */
function getQueryParam(req, key, defaultValue) {
    return req.query[key] ? req.query[key] : defaultValue;
}
module.exports = {
    role,
    getHashPassword,
    pagination,
    calculateOffsetForPagination,
    isResultEmpty,
    preprocessBookList,
    isDataNotValidForUpdate,
    handleError,
    authMiddleware,
    getValidationError,
    handleValidationError,
    sendSuccessResponseMessage,
    sendErrorResponseMessage,
    getQueryParam,
    preprocessCartItem
}