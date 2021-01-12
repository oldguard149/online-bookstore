const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const Q = require('../database/query');
const pool = require('../config/pool');
const { findOne, queryUsingTransaction, query } = require('../database/db_hepler');
const { sendErrorResponseMessage, sendSuccessResponseMessage,
    handleError, handleValidationError, isResultEmpty, getHashPassword, role } = require('../shared/helper')

function generateJwt(user) {
    const expirey = new Date();
    expirey.setDate(expirey.getDate() + 7);
    const id = user.customer_id || user.emp_id;
    return jwt.sign({
        'id': id,
        'role': user.role,
        'expirey': parseInt(expirey.getTime() / 1000) // divide by 1000 to convert time from ms to s
    }, process.env.jwt_secret, { algorithm: 'HS256' });
}


exports.login = [
    body('email').trim().not().isEmpty().withMessage('Vui lòng điền email.').isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail().escape(),
    body('password').trim().not().isEmpty().withMessage('Vui lòng điền mật khẩu.'),

    async (req, res) => {
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return handleValidationError(res, validationError);
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return sendErrorResponseMessage(res, [err]);
                }
                if (user) {
                    const token = generateJwt(user);
                    res.status(200).json({ token, 'success': true });
                } else {
                    sendErrorResponseMessage(res, [info.message]);
                }
            })(req, res);
        } catch (error) {
            handleError(res, 500, error);
        }
    }
];

exports.register = [ // todo: check unique for phone number
    body('name').trim().not().isEmpty().withMessage('Vui lòng điền họ và tên.'),
    body('email').trim().not().isEmpty().withMessage('Vui lòng điền email.').normalizeEmail().isEmail().withMessage('Email không hợp lệ.').escape(),
    body('password').trim().not().isEmpty().withMessage('Vui lòng điền mật khẩu.'),
    body('phoneNumber').trim().optional({ checkFalsy: true }).matches(/^\d{10,15}$/i).withMessage('Số điện thoại không hợp lệ.'),
    body('address').trim().optional({ checkFalsy: true }),

    async (req, res) => {
        const connection = await pool.getConnection();
        const formData = {
            name: req.body.name,
            email: req.body.email,
            phone_number: req.body.phone_number || null,
            address: req.body.address || null
        }
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return handleValidationError(res, validationError);
            }

            const checkEmailInCustomer = await findOne(Q.user.customerByEmail, [formData.email]);
            const checkEmailInEmployee = await findOne(Q.user.employeeByEmail, [formData.email]);
            if (!isResultEmpty(checkEmailInCustomer) || !isResultEmpty(checkEmailInEmployee)) {
                const error = ['Email đã được sử dụng. Vui lòng sử dụng email khác.'];
                return sendErrorResponseMessage(res, error);
            }
            const hashPW = await getHashPassword(req.body.password);

            await queryUsingTransaction(connection, Q.startTransaction);
            const customer = await queryUsingTransaction(connection, Q.user.createCustomer, [
                formData.name, formData.email, hashPW, formData.phone_number, formData.address
            ]);

            await queryUsingTransaction(connection, Q.cart.createCart, [customer.insertId, 0]);
            await queryUsingTransaction(connection, Q.commit);
            sendSuccessResponseMessage(res, ['Đăng ký tài khoản thành công.']);
        } catch (err) {
            await queryUsingTransaction(connection, Q.rollback);
            handleError(res, 500, err, 'Đã xảy ra lỗi ở server. Xin vui lòng đăng ký lại.');
        } finally {
            connection.release();
        }
    }
]