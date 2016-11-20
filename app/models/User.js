/**
 * This is the model of m_users table.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */

var Sequelize = require('sequelize');

module.exports = function(sequelize) {

	// define m_users table structure
	return sequelize.define('m_users', {
		id : {
			type : Sequelize.INTEGER,
			primaryKey : true,
			autoIncrement : true,
			allowNull : false
		},
		email_id : {
			type : Sequelize.STRING(100),
			allowNull : false
		},
		full_name : {
			type : Sequelize.STRING(100),
			allowNull : false
		},
		last_login_at : {
			type : Sequelize.DATE,
			allowNull : true
		},
		login_count : {
			type : Sequelize.INTEGER,
			allowNull : false,
			defaultValue : 0
		},
		active_flag : {
			type : Sequelize.BOOLEAN,
			allowNull : false,
			defaultValue : true
		},
		modify_at : {
			type : Sequelize.DATE,
			allowNull : true
		}
	});
}