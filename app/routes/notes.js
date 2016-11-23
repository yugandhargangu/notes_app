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
var dateFormat = require('dateformat');
var sha1 = require('sha1');
var router = express.Router();

/**
 * Middle ware to filter login users
 */
router.use('*', function(req, res, next) {
	// if user authenticated then continue
	if (req.session.user) {
		res.locals.session = req.session;
		next();
	} else {
		// go to root if user not login
		res.redirect('/');
	}
});

/*
 * GET method
 * 
 * load note list page.
 */
router.get('/', function(req, res, next) {
	res.render('notes');
});

/*
 * POST method
 * 
 * To get notes
 */
router.post('/', function(req, res, next) {
	// short variables
	// NoteSubject model
	var NoteSubject = req.app.settings.models.NoteSubject;
	// Note model
	var Note = req.app.settings.models.Note;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	// form data
	var form = req.body;
	
	// check for all note count
	NoteSubject.count({
		where:{
			user_id:req.session.user,
			active_flag:{$is:true}
		}
	}).then(function(row_count){
		// if count is 0 then return response
		if (row_count == 0) {
			res.status(200).json({
				count:0
			});
		} else {
			// load notes as per request
			var page = 1;
			var per_page = 10;
			// check page number
			if (form.page) {
				page = form.page;
			}
			// number of notes per page
			if (form.per_page) {
				per_page = form.per_page;
			}
			var limit_start = (page - 1) * per_page;
			
			// Fetch notes as per limit
			NoteSubject.findAll({
				attributes:['id','subject'],
				include: [
					{
						model:Note,
						order:[['version_no','DESC']],
						offset:0,
						limit:1
					}
				],
				where:{
					active_flag:{$is:true},
					user_id:req.session.user,
				},
				order: [['created_at', 'DESC']],
				offset:limit_start,
				limit:per_page
			}).then(function(result){
				// If no rows found then response
				if(result == null){
					res.status(200).json({
						count:0
					});
					return;
				} else {
					// Format response data
					var notes = [];
					for(var i = 0;i<result.length;i++){
						var note_subject = result[i];
						var note = note_subject.m_notes[0]; 
						notes[i] = {
								id:note_subject.id,
								subject:note_subject.subject,
								date:dateFormat(note.created_at,'yyyy-mm-dd H:MM'),
								data:note.notes
						};
					}
					var successResponse = {
							count:row_count,
							notes:notes
						};
					res.status(200).json(successResponse);
				}
			});
		}
	}).catch(function(err){
		// Error response
		res.status(200).json({
			count:-1,
			message:'Error occurred. Please try again'
		});
	});
});

/*
 * GET method
 * 
 * add new note page.
 */
router.get('/add.html', function(req, res, next) {
	// With empty values
	var noteInfo ={
			id:	'',
			subject:'',
			note:''
		};
	res.render('noteinfo', noteInfo);
});

/*
 * GET method
 * 
 * To view note
 */
router.get('/view.html', function(req, res, next) {
	// short variables
	// NoteSubject model
	var NoteSubject = req.app.settings.models.NoteSubject;
	// Note model
	var Note = req.app.settings.models.Note;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	if (req.query.id) {
		// fing note subject
		NoteSubject.findOne({
			attributes:['subject'],
			where:{
				id:req.query.id,
				active_flag:{$is:true}
			}
		}).then(function(result){
			if (result === null){
				// redirect to notes in case id is not found in database
				res.redirect('/notes');
				return;
			}
			var subject_obj = result.dataValues;
			// find latest note version number
			Note.max('version_no',{
				where:{
					note_id:req.query.id
				}
			}).then(function(max){
				if (max === null){
					// redirect if note is not present
					res.redirect('/notes');
					return;
				}
				// find note with latest version
				Note.findOne({
					attributes:['notes'],
					where:{
						note_id:req.query.id,
						version_no:max
					}
				}).then(function(result){
					// render view with note information
					var noteInfo = {
						id:	req.query.id,
						subject:subject_obj.subject,
						note:result.dataValues.notes
					};
					res.render('noteview', noteInfo);
				});
			});
		}).catch(function(err){
			// redirect to add if any error occurs
			res.redirect('/notes');
		});
	} else {
		// redirect id not id is present
		res.redirect('/notes');
	}		
});

/*
 * GET method
 * 
 * edit page
 */
router.get('/edit.html', function(req, res, next) {
	// short variables
	// NoteSubject model
	var NoteSubject = req.app.settings.models.NoteSubject;
	// Note model
	var Note = req.app.settings.models.Note;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	if (req.query.id) {
		// fing note subject
		NoteSubject.findOne({
			attributes:['subject'],
			where:{
				id:req.query.id,
				active_flag:{$is:true}
			}
		}).then(function(result){
			if (result === null){
				// redirect to add in case id is not found in database
				res.redirect('/notes/add.html');
				return;
			}
			var subject_obj = result.dataValues;
			// find latest note version number
			Note.max('version_no',{
				where:{
					note_id:req.query.id
				}
			}).then(function(max){
				if (max === null){
					// redirect if note is not present
					res.redirect('/notes/add.html');
					return;
				}
				// find note with latest version
				Note.findOne({
					attributes:['notes'],
					where:{
						note_id:req.query.id,
						version_no:max
					}
				}).then(function(result){
					// render view with note information
					var noteInfo = {
						id:	req.query.id,
						subject:subject_obj.subject,
						note:result.dataValues.notes
					};
					
					res.render('noteinfo', noteInfo);
				});
			});
		}).catch(function(err){
			// redirect to add if any error occurs
			res.redirect('/notes/add.html');
		});
	} else {
		// redirect id not id is present
		res.redirect('/notes/add.html');
	}		
});

/*
 * POST method
 * 
 * To save new note or update existed note
 */
router.post('/save.html', function(req, res, next) {
	// short variables
	// NoteSubject model
	var NoteSubject = req.app.settings.models.NoteSubject;
	// Note model
	var Note = req.app.settings.models.Note;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	// request form
	var form = req.body;

	var errorResponse = {
			code : -1,
			message:'Error occurred. Please try after some time.'
		};
	if (form.id == '') { // new note
		var note_subject = {
			user_id : req.session.user,
			subject : form.subject
		};
		// insert into m_note_subjects
		NoteSubject.create(note_subject).then(function(result) {
			var note_subject_obj = result.dataValues;
			var notes = {
				note_id : note_subject_obj.id,
				notes : form.note
			};
			return Note.create(notes);
		}).then(function(result) {
			// note add success response
			res.status(200).json({
				code : 0,
				note_id :result.note_id
			});
		});
	} else { // update old note
		
		// find max version number of note
		Note.max('version_no',{
			where:{
				note_id:form.id
			}
		}).then(function(max){
			if(max === null){
				// note update error response
				res.status(200).json(errorResponse);
			}else{
				// create new note with version increment
				var notes = {
						note_id : form.id,
						notes : form.note,
						version_no:max + 1
					};
				Note.create(notes);
				// Sign up error status
				res.status(200).json({
					code : 0,
					note_id :form.id
				});
			}
		}).catch(function(err){
			// Sign up error status
			res.status(200).json(errorResponse);
		});
	}
});

/*
 * POST method
 * 
 * To delete note
 */
router.post('/delete.html', function(req, res, next) {
	// short variables
	// NoteSubject model
	var NoteSubject = req.app.settings.models.NoteSubject;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	// request form
	var form = req.body;
	
	// delete note
	NoteSubject.update({
		active_flag:false
	},{
		where:{
			id :form.id,
			user_id:req.session.user
		}
	}).then(function(result){
		// delete success
		res.status(200).json({
			code : 0
		});
	}).catch(function(err){
		// error status
		res.status(200).json({
			code : -1,
			message:'Error occurred. Please try after some time.'
		});
	});
});

/*
 * GET method
 * 
 * change password page.
 */
router.get('/changepassword.html', function(req, res, next) {
	res.render('changepassword');
});

/*
 * POST method
 * 
 * To update password
 */
router.post('/changepassword.html', function(req, res, next) {
	// short variables
	// NoteSubject model
	var Auth = req.app.settings.models.Auth;
	// sequelize object
	var sequelize = req.app.settings.models.sequelize;
	// request form
	var form = req.body;
	
	// Fetch auth to confirm user password
	Auth.findOne({
		attributes:['password'],
		where:{
			user_id:req.session.user,
			active_flag:{
				$is:true
			}
		}
	}).then(function(result){
		if(result == null){
			// not records found response
			res.status(200).json({
				count:-1,
				message:'Error occurred. Please try again'
			});
			return;
		}
		// confirm password
		if(sha1(form.old_password) === result.dataValues.password){
			// Update current password record active_flag to false
			Auth.update({
				active_flag:false
			},{
				where:{
					user_id:req.session.user,
					active_flag:{
						$is:true
					}
				}
			});
			
			// Create new record
			Auth.create({
				user_id:req.session.user,
				password:sha1(form.new_password)
			}).then(function(result){
				// success
				res.status(200).json({
					code:0,
					new_id:result.id
				});
			});
		} else {
			// Password is not matching
			res.status(200).json({
				count:1,
				message:'Old password is wrong. Please try again.'
			});
		}
	}).catch(function(err){
		// error response
		res.status(200).json({
			count:-1,
			message:'Error occurred. Please try again'
		});
	});
});

/*
 * GET method
 * 
 * Delete session
 */
router.get('/logout.html', function(req, res, next) {
	// destroy the session
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
