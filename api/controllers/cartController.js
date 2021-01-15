const { role, isResultEmpty, sendSuccessResponseMessage,
    sendErrorResponseMessage, handleError, handleValidationError, preprocessCartItem } = require('../shared/helper');
const { query, findOne, queryUsingTransaction, findOneUsingTransaction } = require('../database/db_hepler');
const Q = require('../database/query');
const { body, validationResult } = require('express-validator');
const pool = require('../config/pool');

//* in route index.js, insert a middleware to guarantee that user accesses its route is customer
exports.addToCart = [
    body('order_qty').not().isEmpty().withMessage('Please fill in qty').isInt().withMessage('qty must be number'),

    async (req, res) => { // POST: api/add-to-cart/:isbn
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return handleValidationError(res, validationError);
            }
            const isbn = req.params.isbn;
            const quantity = parseInt(req.body.order_qty);
            const customerId = parseInt(req.payload.id);
            const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
            const book = await findOne(Q.cart.bookDataForCart, [isbn]);
            if (isResultEmpty(book)) {
                return sendErrorResponseMessage(res, ['isbn không hợp lệ.']);
            }

            const cartItem = await findOne(Q.cart.cartDetailByCartIdAndIsbn, [cart.cart_id, isbn]);

            // book isn't in cart yet, create a new cartItem
            if (isResultEmpty(cartItem)) {
                if (quantity <= book.quantity) {
                    await query(Q.cart.createCartItem, [cart.cart_id, book.isbn, quantity, book.price]);
                    return sendSuccessResponseMessage(res, ['Sản phẩm đã được thêm vào giỏ hàng.']);
                }
            } else { // cart item already exist, update its new quantity and price
                const newQuantity = quantity + cartItem.quantity;
                if (newQuantity <= book.quantity) {
                    await query(Q.cart.updateCartItem, [newQuantity, book.price, cart.cart_id, isbn]);
                    return sendSuccessResponseMessage(res, ['Sản phẩm đã được thêm vào giỏ hàng.']);
                }
            }
            sendErrorResponseMessage(res, ['Số lượng sách bạn đặt hàng không đủ. Vui lòng chọn một con số thấp hơn.']);
        } catch (error) {
            handleError(res, 500, error);
        }
    }
];

exports.cartDetailData = async (req, res) => {
    try {
        const customerId = parseInt(req.payload.id);
        const rawData = await query(Q.cart.cartDetailByCustomerId, [customerId]);
        const { cartItems, totalItems } = preprocessCartItem(rawData);
        res.json({ success: true, cartItems: cartItems, totalItems });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const customerId = parseInt(req.payload.id);
        const isbn = req.params.isbn;
        const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
        await query(Q.cart.deleteCartItem, [isbn, cart.cart_id]);
        sendSuccessResponseMessage(res, [`Success delete ${isbn} in cart of customer with id ${customerId}`]);
    } catch (err) {
        handleError(res, 500, err);
    }
};


// POST api/update-cart-item, data is FormArray
exports.updateCartItemOrderQuantity = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const customerId = parseInt(req.payload.id);
        const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
        if (isResultEmpty(cart)) {
            throw Error('Lỗi máy chủ');
        }
        const cartItems = req.body.cartItemFormArray;
        await queryUsingTransaction(connection, Q.startTransaction);
        for (const item of cartItems) {
            await queryUsingTransaction(connection, Q.cart.updateCartItem,
                [parseInt(item.quantity), item.price, cart.cart_id, item.isbn]);
        }

        await queryUsingTransaction(connection, Q.commit);
        sendSuccessResponseMessage(res, ['ok']);
    } catch (err) {
        await queryUsingTransaction(connection, Q.rollback);
        handleError(res, 500, err);
    } finally {
        connection.release();
    }
};


exports.cartItemsWithIsbnList = async (req, res) => {
    try {
        const requestIsbn = req.body.items;
        const isbnList = Object.keys(requestIsbn);
        const rawData = await query(Q.cart.cartItemsWithIsbnList, [isbnList]);
        const { cartItems, totalItems } = preprocessCartItem(rawData);
        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i]['order_qty'] = Number(requestIsbn[cartItems[i].isbn]);
        }
        res.json({ success: true, cartItems, totalItems });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.syncCart = async (req, res) => {
    const items = req.body.items;
    const customerId = parseInt(req.payload.id);
    const connection = await pool.getConnection();
    if (Object.keys(items).length === 0) {
        return sendSuccessResponseMessage(res, ['Không có sách để cập nhật.']);
    }
    try {
        const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
        if (isResultEmpty(cart)) {
            return sendErrorResponseMessage(res, ['Lỗi hệ thống']);
        }
        const cartId = cart.cart_id;
        for (const item of items) {
            const book = await findOneUsingTransaction(connection, Q.cart.bookPriceAndQuantity, [item.isbn]);
            if (isResultEmpty(book)) {// invalid book
                continue;
            } else {
                const cartItem = await findOneUsingTransaction(connection, Q.cart.cartDetailByCartIdAndIsbn,
                    [cartId, item.isbn]);
                    console.log(cartItem);
                if (isResultEmpty(cartItem)) { // item not exist in cart, create new one
                    await queryUsingTransaction(connection, Q.cart.createCartItem,
                        [cartId, item.isbn, item.quantity, book.price]);
                } else { // item already exist, update its quantity
                    await queryUsingTransaction(connection, Q.cart.updateCartItem,
                        [parseInt(cartItem.quantity) + parseInt(item.quantity), book.price, cartId, item.isbn]);
                }
            }
        }
        sendSuccessResponseMessage(res, ['Giỏ hàng đã được cập nhật']);
    } catch (error) {
        handleError(res, 500, error);
    } finally {
        connection.release();
    }
}