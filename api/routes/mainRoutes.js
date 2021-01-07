const router = require('express').Router();
const genre = require('../controllers/genreController');
const publisher = require('../controllers/publisherController');
const author = require('../controllers/authorController');
const book = require('../controllers/bookController');
const auth = require('../controllers/authenticationController');
const cart = require('../controllers/cartController');
const recommendBook = require('../controllers/recommendBookController');
const bill = require('../controllers/billController');
const customer = require('../controllers/customerController');
const emp = require('../controllers/employeeController');

const { authMiddleware } = require('../shared/helper');
const { isCustomer } = require('../shared/permissions');

router.get('/sidenav', book.sidenav);
router.get('/', book.indexBookList);

router.get('/booklist', book.indexBookList);
router.get('/book/:isbn', book.bookDetail);
router.get('/side-ad-booklist', book.sideAdBooklist);

router.get('/genre', genre.genreList);
router.get('/author', author.authorList);
router.get('/publisher', publisher.publisherList);
router.get('/genre/:id', genre.genreDetail);
router.get('/author/:id', author.authorDetail);
router.get('/publisher/:id', publisher.publisherDetail);

router.post('/login', auth.login);
router.post('/register', auth.register);

router.post('/add-to-cart/:isbn', authMiddleware, isCustomer, cart.addToCart);
router.get('/cart', authMiddleware, isCustomer, cart.cartDetailData);
router.get('/delete-cart-item/:isbn', authMiddleware, isCustomer, cart.deleteCartItem);
router.post('/update-cart-items', authMiddleware, isCustomer, cart.updateCartItemOrderQuantity);

router.get('/create-bill', authMiddleware, isCustomer, bill.createBill);
router.get('/bill/:id', bill.billDetail);

router.get('/customer', authMiddleware, isCustomer, customer.customerInfo);
router.put('/customer', authMiddleware, isCustomer, customer.updateCustomerInfo)

router.get('/employee/:id', emp.employee);
router.put('/employee', authMiddleware, emp.empUpdate);

router.post('/update-password/customer', authMiddleware, customer.updateNewPassword);
router.post('/update-password/employee', authMiddleware, emp.updateNewPassword);

router.get('/recommend/:isbn', recommendBook.recommendBookList);
module.exports = router;