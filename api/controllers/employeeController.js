const { body, validationResult } = require('express-validator');
const { getHashPassword, isResultEmpty, isDataNotValidForUpdate,
    handleValidationError, sendSuccessResponseMessage, handleError, getQueryParam,
    calculateOffsetForPagination, sendErrorResponseMessage, role } = require('../shared/helper');
const { query, findOne, countData } = require('../database/db_hepler');
const Q = require('../database/query');

function getDataWhenCreateOrUpdate(req) {
    const formData = {
        id: parseInt(req.params.id),
        name: req.body.fullname,
        email: req.body.email,
        identity_number: req.body.identity_number,
        hash_password: req.body.password,
        phone_number: req.body.phone_number,
        salary: req.body.salary,
        role: req.body.role
    };
    return formData;
}


async function loadCheckDataForUpdateOrCreateEmp(formData) {
    const emailInEmployee = await findOne(Q.user.employeeByEmail, [formData.email]);
    const emailInCustomer = await findOne(Q.user.customerByEmail, [formData.email]);
    const identity_number = await findOne(Q.user.employeeByIdCard, [formData.identity_number]);
    const phoneNumber = await findOne(Q.user.employeeByPhoneNumber, [formData.phone_number]);
    return [emailInEmployee, emailInCustomer, identity_number, phoneNumber];
}

exports.employee = async (req, res) => {
    try {
        const empId = parseInt(req.params.id);
        if (Number.isNaN(empId)) {
            return handleError(res, 400, 'Mã nhân viên không hợp lệ');
        }
        const emp = await findOne(Q.user.employeeById, [empId]);
        if (isResultEmpty(emp)) {
            sendErrorResponseMessage(res, ['Mã nhân viên không tồn tại.']);
        } else {
            res.json({ success: true, employee: emp })
        }
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.empList = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 0;
        const pagesize = parseInt(req.query.pagesize) || 10;
        const offset = calculateOffsetForPagination(pagesize, currentPage);
        const employees = await query(Q.user.employeeList, [offset, currentPage]);
        res.json({ success: true, employees });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.empSearch = async (req, res) => {
    try {
        const pageSize = parseInt(getQueryParam(req, 'pagesize', 15));
        const currentPage = parseInt(getQueryParam(req, 'page', 0));
        const rawSearchText = req.query.search;
        const offset = calculateOffsetForPagination(pageSize, currentPage);
        if (undefined === rawSearchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }
        const searchText = String(rawSearchText).replace(/\+/gi, ' ');
        const totalItems = await countData(Q.user.empSearchCount, [searchText]);
        const employees = await query(Q.user.empSearch, [searchText, offset, currentPage]);
        res.json({ success: true, totalItems, employees });
    } catch (err) {
        handleError(res, 500, err);
    }
}

function validateOnEmployeeForm() {
    return [
        body('fullname').trim().not().isEmpty().withMessage('Vui lòng điền họ tên nhân viên').escape(),
        body('email').trim().normalizeEmail().not()
            .isEmpty().withMessage('Vui lòng điền Email')
            .isEmail().withMessage('Email không hợp lệ').escape(),
        body('identity_number').trim().not().isEmpty().withMessage('Vui lòng điền số chứng minh nhân dân.')
            .matches(/^\d{9}$|^\d{12}$/).withMessage('CMND phải có 9 hoặc 12 số.').escape(),
        body('password').trim().not().isEmpty().withMessage('Vui lòng điên mật khẩu'),
        body('phone_number').trim().not().notEmpty().withMessage('Vui lòng điền số điện thoại của nhân viên.')
            .matches(/^\d{10,15}$/i).withMessage('Số điện thoại không hợp lệ.').escape(),
        body('salary').trim().not().isEmpty().withMessage('Vui lòng điền lương của nhân viên').isFloat(),
        body('role').escape()
    ]
}

exports.empCreate = [
    validateOnEmployeeForm(),
    async (req, res) => {
        const formData = getDataWhenCreateOrUpdate(req);
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const hashPW = await getHashPassword(req.body.password);
            const [emailInEmployee, emailInCustomer, identity_number, phoneNumber] =
                await Promise.resolve(loadCheckDataForUpdateOrCreateEmp(formData));
            if (!isResultEmpty(emailInEmployee) || !isResultEmpty(emailInCustomer)) {
                return sendErrorResponseMessage(res, ['Email đã được sử dụng. Xin hãy kiểm tra lại.']);
            }
            if (!isResultEmpty(identity_number)) {
                return sendErrorResponseMessage(res, ['Số cmnd đã được sử dụng. Xin hãy kiểm tra lại.']);
            }
            if (!isResultEmpty(phoneNumber)) {
                return sendErrorResponseMessage(res, ['Số điện thoại đã được sử dụng. Xin hãy kiểm tra lại.']);
            }

            const result = await query(Q.user.createEmployee, [
                formData.name, formData.email, formData.identity_number, formData.phone_number,
                formData.salary, hashPW, formData.role
            ]);
            if (result.affectedRow !== 0) {
                sendSuccessResponseMessage(res, ['Thêm nhân viên thành công.']);
            } else {
                throw new Error('Fail to create employee');
            }
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]

exports.empUpdate = [
    ...validateOnEmployeeForm(),
    updateEmployee
]

exports.empDelete = async (req, res) => {
    try {
        const empId = parseInt(req.params.id);
        if (isNaN(empId)) {
            sendErrorResponseMessage(res, 'Mã nhân viên không hợp lệ.');
        } else {
            await query(Q.user.deleteEmployee, empId);
            sendSuccessResponseMessage(res, ['Xóa nhân viên thành công.']);
        }
    } catch (err) {
        handleError(res, 500, err);
    }
}

async function updateEmployee(req, res) {
    const formData = getDataWhenCreateOrUpdate(req);
    let currentEmployeeId = parseInt(req.params.id | req.payload.id);
    const validationError = validationResult(req);
    if (Number.isNaN(currentEmployeeId)) {
        return sendErrorResponseMessage(res, ['Mã nhân viên không hợp lệ.']);
    }
    if (!validationError.isEmpty()) {
        return handleValidationError(res, validationError);
    }

    try {
        const oldEmp = await findOne(Q.user.employeeById, [currentEmployeeId]);
        if (isResultEmpty(oldEmp)) {
            sendErrorResponseMessage(res, ['Không tìm thấy nhân viên']);
        } else {
            const [emailInEmployee, emailInCustomer, identity_number, phoneNumber] =
                await Promise.resolve(loadCheckDataForUpdateOrCreateEmp(formData));

            if ((!isResultEmpty(emailInEmployee) || !isResultEmpty(emailInCustomer)) && oldEmp.email !== formData.email) {
                return sendErrorResponseMessage(res, ['Email đã được sử dụng. Xin hãy kiểm tra lại.']);
            }
            if (isDataNotValidForUpdate(identity_number, oldEmp.identity_number, formData.identity_number)) {
                return sendErrorResponseMessage(res, ['Số cmnd đã được sử dụng. Xin hãy kiểm tra lại.']);
            }
            if (isDataNotValidForUpdate(phoneNumber, oldEmp.phone_number, formData.phone_number)) {
                return sendErrorResponseMessage(res, ['Số điện thoại đã được sử dụng. Xin hãy kiểm tra lại.']);
            }

            await query(Q.user.updateEmployee, [
                formData.name, formData.email, formData.identity_number, formData.phone_number,
                formData.salary, formData.role, currentEmployeeId
            ])
            sendSuccessResponseMessage(res, ['Cập nhật thông tin thành công.']);
        }
    } catch (err) {
        handleError(res, 500, err);
    }
}