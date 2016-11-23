/**
 * This is the model of m_auths table.
 * 
 * @author Yugandhar Gangu
 * @createAt 2016/11/20
 */
var Sequelize = require('sequelize');

module.exports = function(sequelize) {

	// define m_auth table structure
	return sequelize.define('m_auth', {
		id : {
			type : Sequelize.INTEGER,
			primaryKey : true,
			autoIncrement : true,
			allowNull : false
		},
		user_id : {
			type : Sequelize.INTEGER,
			allowNull : false
		},
		password : {
			type : Sequelize.STRING,
			allowNull : false
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
	}, {
		timestamps : false,
	});
}