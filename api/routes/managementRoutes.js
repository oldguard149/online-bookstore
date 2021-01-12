const express = require('express');
const router = express.Router();
const book = require('../controllers/bookController');
const genre = require('../controllers/genreController');
const author = require('../controllers/authorController');
const publisher = require('../controllers/publisherController');
const bill = require('../controllers/billController');
const emp = require('../controllers/employeeController');

router.get('/search/genre', genre.genreSearch);
router.get('/genre/:id', genre.genre);
router.post('/genre', genre.genreCreate);
router.put('/genre/:id', genre.genreUpdate);
router.delete('/genre/:id', genre.genreDelete);


router.get('/search/author', author.authorSearch);
router.get('/author/:id', author.author);
router.put('/author/:id', author.authorUpdate);
router.delete('/author/:id', author.authorDelete);
router.get('/author-delete-data/:id', author.authorDeleteData);

router.get('/search/publisher', publisher.publisherSearch);
router.get('/publisher/:id', publisher.publisher);
router.post('/publisher', publisher.publisherCreate);
router.put('/publisher/:id', publisher.publisherUpdate);
router.delete('/publisher/:id', publisher.publisherDelete);

router.get('/search/book', book.bookSearch);
router.get('/book/:isbn', book.book);
router.post('/book', book.bookCreate);
router.put('/book/:isbn', book.bookUpdate);
router.delete('/book/:isbn', book.bookDelete);
router.get('/genres-and-publishers', book.fetchGenresAndPublishers);
router.post('/stocks', book.importBookStock);

router.get('/confirm-bill/:id', bill.confirmBill);
router.get('/cancel-bill/:id', bill.cancelBillOrder);
router.get('/bills', bill.billList);
router.get('/bill/:id', bill.billDetail);
router.delete('/bill/:id', bill.billDelete);

router.get('/search/employee', emp.empSearch);
router.get('/employee', emp.empList);
router.get('/employee/:id', emp.employee);
router.post('/employee', emp.empCreate);
router.put('/employee/:id', emp.empUpdate);
router.delete('/employee/:id', emp.empDelete);

module.exports = router;