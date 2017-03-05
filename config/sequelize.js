/**
 * Created by airing on 2017/3/3.
 */
var Sequelize = require('sequelize');

exports.sequelize = function () {
	return new Sequelize('ionicbook', 'root', '', {'dialect': 'mysql',host: 'localhost', port:3306});
}