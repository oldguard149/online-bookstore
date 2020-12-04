const express = require('express');
const router = express.Router();
const book = require('../controllers/bookController');
const genre = require('../controllers/genreController');
const author = require('../controllers/authorController');
const publisher = require('../controllers/publisherController');
const bill = require('../controllers/billController');

router.get('/genre/search', genre.genreSearch);
router.get('/genre/:id', genre.genre);
router.post('/genre', genre.genreCreate);
router.put('/genre/:id', genre.genreUpdate);
router.delete('/genre/:id', genre.genreDelete);


router.get('/author/search', author.authorSearch);
router.get('/author/:id', author.author);
router.put('/author/:id', author.authorUpdate);
router.delete('/author/:id', author.authorDelete);
router.get('/author-delete-data/:id', author.authorDeleteData);

router.get('/publisher/search', publisher.publisherSearch);
router.get('/publisher/:id', publisher.publisher);
router.post('/publisher', publisher.publisherCreate);
router.put('/publisher/:id', publisher.publisherUpdate);
router.delete('/publisher/:id', publisher.publisherDelete);

router.get('/book/search', book.bookSearch);
router.get('/book/:isbn', book.book);
router.post('/book', book.bookCreate);
router.put('/book/:isbn', book.bookUpdate);
router.delete('/book/:isbn', book.bookDelete);
router.get('/genres-and-publishers', book.fetchGenresAndPublishers);

router.get('/confirm-bill/:id', bill.confirmBill);

module.exports = router;