/**
 * This is the models init file.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */

var Sequelize = require('sequelize');
var config = require('../config');

// init database connection
var sequelize = new Sequelize(config.database.db_name, config.database.username, config.database.password, {
	host : config.database.host,
	post : config.database.port,
	dialect : config.database.dialect,
	pool : {
		max : 5,
		min : 0,
		idle : 10000
	}
});

// model names
var models = [ 'User', 'Auth', 'NoteSubject', 'Note' ];

// load models
models.forEach(function(model) {
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// Relationships
(function(m) {
	m.Auth.belongsTo(m.User,{foreignKey:'user_id'});
	m.NoteSubject.belongsTo(m.User,{foreignKey:'user_id'});
	m.Note.belongsTo(m.NoteSubject,{foreignKey:'note_id'});
	m.User.hasMany(m.Auth,{foreignKey:'user_id'});
	m.User.hasMany(m.NoteSubject,{foreignKey:'user_id'});
	m.NoteSubject.hasMany(m.Note,{foreignKey:'note_id'});
})(module.exports);

sequelize.sync().then(function() {
	console.log('Sequelize sync is done.');
}).catch(function(error){
    console.error(error.stack);
});

// export connection
module.exports.sequelize = sequelize;