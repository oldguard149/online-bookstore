const router = require('express').Router();
const genre = require('../controllers/genreController');
const publisher = require('../controllers/publisherController');
const author = require('../controllers/authorController');
const book = require('../controllers/bookController');
const auth = require('../controllers/authenticationController');
const cart = require('../controllers/cartController');
const other = require('../controllers/otherController');
const bill = require('../controllers/billController');
const profile = require('../controllers/profileController');

const { authMiddleware } = require('../shared/helper');
const { isCustomer } = require('../shared/permissions');

router.get('/sidenav', book.sidenav);
router.get('/', book.indexBookList);

router.get('/booklist', book.indexBookList);
router.get('/book/:isbn', book.bookDetail);
router.get('/side-ad-for-guest', other.sideAdBooklistForGuestGuest);
router.get('/side-ad-for-customer', authMiddleware, other.sideAdBooklistForCustomer)

router.get('/genre', genre.genreList);
router.get('/author', author.authorList);
router.get('/publisher', publisher.publisherList);
router.get('/genre/:id', genre.genreDetail);
router.get('/author/:id', author.authorDetail);
router.get('/publisher/:id', publisher.publisherDetail);

router.post('/login', auth.login);
router.post('/register', auth.register);

router.post('/add-to-cart/:isbn', authMiddleware, isCustomer, cart.addToCart); // can sua post cart
router.get('/cart', authMiddleware, isCustomer, cart.cartDetailData);
router.get('/delete-cart-item/:isbn', authMiddleware, isCustomer, cart.deleteCartItem); // can sua delete cart:isbb
router.post('/update-cart-items', authMiddleware, isCustomer, cart.updateCartItemOrderQuantity);
router.post('/cartitems-with-isbnlist', cart.cartItemsWithIsbnList);
router.post('/sync-cart', authMiddleware, isCustomer, cart.syncCart);
router.get('/create-bill', authMiddleware, isCustomer, bill.createBill);
router.get('/bills', authMiddleware, isCustomer,bill.billListForCustomer);
router.get('/bill/:id', authMiddleware, isCustomer, bill.billDetailForCustomer);

router.get('/search', other.search);

router.get('/profile', authMiddleware, profile.getInfo);
router.post('/change-password', authMiddleware, profile.updatePassword);
router.put('/profile/employee', authMiddleware, profile.updateEmployeeProfile);
router.put('/profile/customer', authMiddleware, profile.updateCustomerProfile);

router.get('/recommend/:isbn', other.recommendBookList);

module.exports = router;