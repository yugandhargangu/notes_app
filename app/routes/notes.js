/**
 * @file
 * 
 * This is a route of all notes urls. Can be accessed after succes login. These
 * urls need authentication.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */

var express = require('express');
var router = express.Router();

/* GET notes page. */
router.get('/', function(req, res, next) {
	res.render('notes');
});

/* GET add page. */
router.get('/add.html', function(req, res, next) {
	res.render('noteinfo');
});

/* GET edit page. */
router.get('/edit.html', function(req, res, next) {
	res.render('noteinfo');
});

/* GET delete page. */
router.get('/delete.html', function(req, res, next) {
	res.render('noteinfo');
});

/* GET delete page. */
router.get('/changepassword.html', function(req, res, next) {
	res.render('changepassword');
});

module.exports = router;
