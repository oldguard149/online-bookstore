const { sendSuccessResponseMessage, handleError, handleValidationError, getHashPassword } = require('../shared/helper');
const { query, findOne } = require('../database/db_hepler');
const Q = require('../database/query');
const { body, validationResult } = require('express-validator');

exports.updateCustomerInfo = [
    body('fullname').notEmpty().withMessage('Please fill in your full name'),
    body('phone-number').notEmpty().withMessage('Please fill in your phone number'),
    body('address').notEmpty().withMessage('Address is required for delivering'),

    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }
        try {
            const customerId = parseInt(req.payload.id);
            const customerInfo = {
                fullname: req.body['fullname'],
                phoneNumber: req.body['phone-number'],
                address: req.body['address']
            }
            const result = await query(Q.user.updateCustomerInfo,
                [customerInfo.fullname, customerInfo.phoneNumber, customerInfo.address, customerId]);
            sendSuccessResponseMessage(res, ['Customer information has been updated.']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];


exports.customerInfo = async (req, res) => {
    try {
        const customerId = parseInt(req.payload.id);
        const customer = await findOne(Q.user.customerById, [customerId]);
        res.json({ success: true, customer });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.updateNewPassword = [
    body('new_password').not().isEmpty().withMessage('Please filled in password to continue.'),
    async (req, res) => {
        try {
            const customerId = parseInt(req.payload.id);
            const hashedPassword = await getHashPassword(req.body.new_password);
            const result = await query(Q.user.updatePasswordForCustomer, [hashedPassword, customerId]);
            if (result.affectedRow != 0) {
                sendSuccessResponseMessage(res, ['Password has been updated']);
            } else {
                sendErrorResponseMessage(res, ['Some error occured. Please try again later']);
            }
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]