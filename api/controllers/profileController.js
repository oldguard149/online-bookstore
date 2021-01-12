const { sendSuccessResponseMessage, handleError, handleValidationError,
    role, isResultEmpty, sendErrorResponseMessage, isDataNotValidForUpdate } = require('../shared/helper');
const { query, findOne } = require('../database/db_hepler');
const Q = require('../database/query');
const { body, validationResult } = require('express-validator');

exports.updateCustomerProfile = [
    body('fullname').notEmpty().withMessage('Vui lòng điền họ tên.'),
    body('phoneNumber').notEmpty().withMessage('Vui lòng điền số điện thoại.'),
    body('address').notEmpty().withMessage('Vui lòng điền địa chỉ để giao hàng.'),

    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }
        try {
            const customerId = parseInt(req.payload.id);
            const customerInfo = {
                fullname: req.body['fullname'],
                phoneNumber: req.body['phoneNumber'],
                address: req.body['address']
            }
            const result = await query(Q.user.updateCustomerInfo,
                [customerInfo.fullname, customerInfo.phoneNumber, customerInfo.address, customerId]);
            sendSuccessResponseMessage(res, ['Thông tin đã được cập nhật.']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.updateEmployeeProfile = [
    body('fullname').notEmpty().withMessage('Vui lòng điền họ tên.'),
    body('phone-number').trim().not().notEmpty().withMessage('Vui lòng điền số điện thoại của nhân viên.')
    .matches(/^\d{10,15}$/i).withMessage('Số điện thoại không hợp lệ.').escape(),
    body('identity-number').trim().not().isEmpty().withMessage('Vui lòng điền số chứng minh nhân dân.')
    .matches(/^\d{9}$|^\d{12}$/).withMessage('CMND phải có 9 hoặc 12 số.').escape(),
    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }
        try {
            const empId = parseInt(req.payload.id);
            const newIdentityNumber = req.body['identity-number'];
            const newFullname = req.body['fullname'];
            const newPhoneNumber = req.body['phone-number'];
            const oldEmp = await findOne(Q.user.employeeById, [empId]);
            const empWithNewIdentityNumber = await findOne(Q.user.employeeByIdentityNumber, [newIdentityNumber]);
            const empWithNewPhoneNumber = await findOne(Q.user.employeeByPhoneNumber, [newPhoneNumber]);
            
            if (isDataNotValidForUpdate(empWithNewIdentityNumber, oldEmp.identity_nerm, newIdentityNumber)) {
                return sendErrorResponseMessage(res, ['Số cmnd đã được sử dụng. Xin hãy kiểm tra lại.']);
            }
            if (isDataNotValidForUpdate(empWithNewPhoneNumber, oldEmp.phone_number, newPhoneNumber)) {
                return sendErrorResponseMessage(res, ['Số điện thoại đã được sử dụng. Xin hãy kiểm tra lại.']);
            }

            const result = await query(Q.user.updateEmployeeProfile, 
                [newFullname, newIdentityNumber, newPhoneNumber, empId]);
            sendSuccessResponseMessage(res, ['Thông tin đã được cập nhật.']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]


exports.getInfo = async (req, res) => {
    try {
        const userId = parseInt(req.payload.id);
        const userRole = req.payload.role;
        let user;
        if (userRole === role.CUSTOMER) {
            user = await findOne(Q.user.customerById, [userId]);
        } else {
            user = await findOne(Q.user.employeeProfileData, [userId]);
        }

        if (isResultEmpty(user)) {
            sendErrorResponseMessage(res, ['Không tìm thấy người dùng.']);
        } else {
            res.json({ success: true, user});
        }
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.updatePassword = [
    body('new-password').isEmpty().withMessage('Vui lòng điền vào mật khẩu để cập nhật.'),
    async (req, res) => {
        try {
            const rawPassword = req.body['new-password'];
            const userId = parseInt(req.payload.id);
            const userRole = req.payload.role;
            const hashedPassword = await getHashPassword(rawPassword);
            let result;
            if (userRole === role.CUSTOMER) {
                result = await query(Q.user.updateCustomerPassword, [hashedPassword, userId]);
            } else { 
                result = await query(Q.user.updateEmployeePassword, [hashedPassword, userId]);
            }

            if (result.affectedRow !== 0) {
                sendSuccessResponseMessage(res, ['Mật khẩu mới đã được cập nhật']);
            } else {
                sendErrorResponseMessage(res, ['Xảy ra lỗi ở máy chủ. Vui lòng thử lại sau.']);
            }
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]