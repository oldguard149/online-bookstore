const { v4: uuidv4 } = require('uuid');
const pool = require('../config/pool');
const Q = require('../database/query');
const { queryUsingTransaction, findOne, query } = require('../database/db_hepler');
const { handleError, isResultEmpty, sendErrorResponseMessage, sendSuccessResponseMessage } = require('../shared/helper');


exports.createBill = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const totalPrice = 0;
        const customerId = parseInt(req.payload.id);
        const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
        const cart_id = parseInt(cart.cart_id);
        const bill_id = uuidv4(); // generate from uuid
        const cartItems = await query(Q.cart.allItemsInCart, [cart_id]);
        
        await queryUsingTransaction(connection, Q.startTransaction);
        await queryUsingTransaction(connection, Q.bill.createBill, 
            [bill_id, customerId, null, 0, new Date()]);
        for (const cartItem of cartItems) {
            const bookQuantity = await findOne(Q.bill.bookQuantity, [cartItem.isbn]);
            if (cartItem.quantity <= bookQuantity) {
                const newBookStockQuantity = bookQuantity - cartItem.quantity;
                await queryUsingTransaction(connection, Q.bill.createBillItem,
                    [bill_id, cartItem.isbn, cartItem.quantity, cartItem.price]);

                await queryUsingTransaction(connection, Q.UpdateBookStockQuantity,
                    [newBookStockQuantity, cartItem.isbn]);
                
                await queryUsingTransaction(connection, Q.cart.deleteCartItem, 
                    [cartItem.isbn, cart_id]);
                
                totalPrice += parseInt(cartItem.quantity) * parseFloat(cartItem.price);
            } else {
                throw Error(`Order quantity of ${cartItem.isbn} is not valid.`);
            }
        }
        
        await queryUsingTransaction(connection, Q.bill.updateBillTotalPrice, [totalPrice, bill_id]);
        await queryUsingTransaction(connection, Q.commit);
    } catch (error) {
        await queryUsingTransaction(connection, Q.rollback);
        handleError(res, 500, error);
    } finally {
        connection.release();
    }
}

exports.confirmBill = async (req, res) => {
    try {
        const bill_id = req.params.id;
        const bill = await query(Q.bill.billByBillId, [bill_id]);
        if (isResultEmpty(bill)) {
            sendErrorResponseMessage(res, [`Bill with id ${bill_id} doesn't exist`]);
        } else {
            await query(Q.bill.confirmBill, [bill_id]);
            sendSuccessResponseMessage(res, [`Bill confirmed successfully.`]);
        }
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.cancelBillOrder = async (req, res) => {
    try {
        
    } catch (err) {
        handleError(res, 500, err);
    }
};