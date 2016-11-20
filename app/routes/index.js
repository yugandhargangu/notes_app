/**
 * @file
 * 
 * This is a route of all common urls. These urls doesn't need any
 * authentication.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */

var express = require('express');
var sha1 = require('sha1');
var router = express.Router();

/*
 * GET method
 * 
 * Application index path. This is application default page.
 */
router.get('/', function(req, res, next) {
	res.render('index');
});

/*
 * GET method
 * 
 * Login page URL. Loads login page.
 */
router.get('/login.html', function(req, res, next) {
	res.render('login');
});

/*
 * POST method
 * 
 * Login page URL. Validate user credentials.
 */
router.post('/login.html', function(req, res, next) {
	res.render('login');
});

/*
 * GET method
 * 
 * Sign up URL. Loads sign up page.
 * 
 * View={signup.jade}
 */
router.get('/signup.html', function(req, res, next) {
	res.render('signup');
});

/*
 * POST method
 * 
 * Sign up URL. Create new user.
 */
router.post('/signup.html', function(req, res, next) {
	
	// define short variables
	// User model
	var User = req.app.settings.models.User;
	// Auth model
	var Auth = req.app.settings.models.Auth;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	// request form data
	var form = req.body;
	
	// check if email Id exists
	User.findOne({
		attributes:[[sequelize.fn('COUNT',sequelize.col('id')), 'user_count']],
		where:{
			email_id:form.email_id,
			active_flag:{$is:true}
		}
	}).then(function(result){
		var user_count = result.dataValues.user_count;
		// Return error message if email id is already exists
		if(user_count > 0){
			res.status(200).json({
				code : 1,
				message:'Email Id is already existed. Please login.'
			});
			return;
		}
		
		// create user create data
		var user = {
				email_id : form.email_id,
				full_name : form.full_name
		};
		User.create(user).then(function(user) {
			// create user auth data
			var auth = {
					password : sha1(form.password),
					user_id : user.id
			};
			return Auth.create(auth);
		}).then(function(auth){
			// Sign up success status
			res.status(200).json({
				code : 0,
				message:'Registration is successful. Please sign in to continue.',
				user_id:auth.user_id
			});
		}).catch(function(err){
			// Sign up error status
			res.status(200).json({
				code : -1,
				message:'Error occurred. Please try after some time.'
			});
		});
	}).catch(function(err){
		// Sign up error status
		res.status(200).json({
			code : -1,
			message:'Error occurred. Please try after some time.'
		});
	});
});

module.exports = router;
