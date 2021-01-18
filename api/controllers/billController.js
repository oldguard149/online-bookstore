const { v4: uuidv4 } = require('uuid');
const pool = require('../config/pool');
const Q = require('../database/query');
const { queryUsingTransaction, findOne, query, countData } = require('../database/db_hepler');
const { handleError, isResultEmpty, sendErrorResponseMessage, sendSuccessResponseMessage } = require('../shared/helper');


exports.createBill = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        let totalPrice = 0;
        const customerId = parseInt(req.payload.id);
        const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
        const cart_id = parseInt(cart.cart_id);
        const billId = uuidv4();

        const cartItems = await queryUsingTransaction(connection, Q.cart.allItemsInCart, [cart_id]);
        if (isResultEmpty(cartItems)) { // make sure there are at least one book in cart before create bill
            sendErrorResponseMessage(res, ['Không có sách trong giỏ hàng của bạn.']);
        } else {
            await queryUsingTransaction(connection, Q.startTransaction);
            await queryUsingTransaction(connection, Q.bill.createBill,
                [billId, customerId, null, 0, new Date()]);
            for (const cartItem of cartItems) {
                const book = await findOne(Q.bill.bookQuantity, [cartItem.isbn]);
                const bookQuantity = parseInt(book.quantity);

                if (cartItem.quantity <= bookQuantity) {
                    const newBookStockQuantity = bookQuantity - cartItem.quantity;
                    await queryUsingTransaction(connection, Q.bill.createBillItem,
                        [billId, cartItem.isbn, cartItem.quantity, cartItem.price]);

                    await queryUsingTransaction(connection, Q.book.updateBookStockQuantity,
                        [newBookStockQuantity, cartItem.isbn]);

                    await queryUsingTransaction(connection, Q.cart.deleteCartItem,
                        [cartItem.isbn, cart_id]);

                    totalPrice += parseInt(cartItem.quantity) * parseFloat(cartItem.price);
                } else {
                    return sendErrorResponseMessage(res, [`Số lượng sách không đủ. Vui lòng chọn một số nhỏ hơn.`])
                }
            }

            await queryUsingTransaction(connection, Q.bill.updateBillTotalPrice, [totalPrice, billId]);
            await queryUsingTransaction(connection, Q.commit);
            res.json({ success: true, message: ['Hóa đơn đã được tạo'], billid: billId });
        }
    } catch (error) {
        await queryUsingTransaction(connection, Q.rollback);
        handleError(res, 500, error);
    } finally {
        connection.release();
    }
}

exports.confirmBill = async (req, res) => {
    try {
        const billId = req.params.id;
        const emp_id = req.payload.id;
        const bill = await query(Q.bill.billByBillId, [billId]);
        if (isResultEmpty(bill)) {
            sendErrorResponseMessage(res, [`Hóa đơn với id ${billId} không tồn tại.`]);
        } else {
            await query(Q.bill.confirmBill, [emp_id, billId]);
            sendSuccessResponseMessage(res, [`Duyệt đơn thành công.`]);
        }
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.cancelBillOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const billId = req.params.id;
        const emp_id = req.payload.id;
        const bill = await findOne(Q.bill.billByBillId, [billId]);
        if (isResultEmpty(bill)) {
            sendErrorResponseMessage(res, [`Hóa đơn với id ${billId} không tồn tại.`]);
        } else {
            const customerId = bill.customer_id;
            const cart = await findOne(Q.cart.cartByCustomerId, [customerId]);
            const cart_id = parseInt(cart.cart_id);
            const billItems = await query(Q.bill.billItemsByBillId, [billId]);
            await queryUsingTransaction(connection, Q.startTransaction)
            for (const billItem of billItems) {
                await queryUsingTransaction(connection, Q.cart.createCartItem,
                    [cart_id, billItem.isbn, billItem.quantity, billItem.price]);
            }
            await queryUsingTransaction(connection, Q.bill.cancelBill, [emp_id, billId]);
            await queryUsingTransaction(connection, Q.commit);
            sendSuccessResponseMessage(res, ['Hóa đơn đã bị hủy.']);
        }
    } catch (err) {
        await queryUsingTransaction(connection, Q.rollback);
        handleError(res, 500, err);
    } finally {
        connection.release();
    }
};

exports.billList = async (req, res) => {
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const type = req.query.type;
        console.log(req.query);
        let bills;
        let totalItems;
        if (type === 'all') {
            bills = await query(Q.bill.billList, [offset, limit]);
            totalItems = await countData(Q.bill.billListCount);
        } else {
            bills = await query(Q.bill.billsFilterByStatus, [type, offset, limit]);
            totalItems = await countData(Q.bill.billsFilterByStatusCount, [type]);
        }
        res.json({ success: true, bills , totalItems});
    } catch (error) {
        handleError(res, 500, error, 'Lỗi máy chủ khi tải danh sách hóa đơn');
    }
}

exports.billDetail = async (req, res) => {
    try {
        const billId = req.params.id;
        const bill = await findOne(Q.bill.billByBillId, [billId]);
        if (isResultEmpty(bill)) {
            return sendErrorResponseMessage(res, [`Hóa đơn với id ${billId} không tồn tại.`]);
        }
        const billItems = await query(Q.bill.billItemsByBillId, [billId]);
        const customer = await findOne(Q.user.customerById, [bill.customer_id]);
        bill['items'] = billItems;
        bill['customer'] = customer;
        res.json({ success: true, bill: bill });
    } catch (error) {
        handleError(req, 500, error, `Lỗi máy chủ. Vui lòng thử lại sau.`);
    }
}

exports.billDelete = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const billId = req.params.id;
        await queryUsingTransaction(connection, Q.startTransaction);
        await queryUsingTransaction(connection, Q.bill.deleteBillWitthBillId, [billId]);
        await queryUsingTransaction(connection, Q.bill.deleteBillItemsWithBillId, [billId]);
        await queryUsingTransaction(connection, Q.commit);
        sendSuccessResponseMessage(res, ['Hóa đơn đã được xóa']);
    } catch (err) {
        await queryUsingTransaction(Q.rollback);
        handleError(res, 500, err);
    } finally {
        connection.release();
    }
};

exports.billListForCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.payload.id);
        const bills = await query(Q.bill.billListForCustomer, [customerId]);
        res.json({ success: true, bills });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.billDetailForCustomer = async (req, res) => {
    try {
        const customerId = parseInt(req.payload.id);
        const billId = req.params.id;
        const bill = await findOne(Q.bill.billByBillId, [billId]);
        if (bill.customer_id === customerId) {
            const billItems = await query(Q.bill.billItemsByBillId, [bill.bill_id]);
            bill['items'] = billItems;
            res.json({ success: true, bill });
        } else {
            sendErrorResponseMessage(res, [`Bạn không được phép xem hóa đơn này.`]);
        }
    } catch (err) {
        handleError(res, 500, err);
    }
}