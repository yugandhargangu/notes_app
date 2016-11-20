/**
 * This is the model of m_notes table.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */

var Sequelize = require('sequelize');

module.exports = function(sequelize) {

	// define m_notes table structure
	return sequelize.define('m_notes', {
		id : {
			type : Sequelize.INTEGER,
			primaryKey : true,
			autoIncrement : true,
			allowNull : false
		},
		note_id : {
			type : Sequelize.INTEGER,
			allowNull : false
		},
		notes : {
			type : Sequelize.STRING(1000),
			allowNull : false
		},
		version_no : {
			type : Sequelize.INTEGER,
			allowNull : false,
			defaultValue : 1
		},
		active_flag : {
			type : Sequelize.BOOLEAN,
			allowNull : false,
			defaultValue : true
		},
		created_at : {
			type : Sequelize.DATE,
			allowNull : false,
			defaultValue : Sequelize.NOW
		}
	});
}