'use strict';

/**
  * @class Model
  * @memberOf hhStat.Server   
  * @description Application backend model
  */

var settings = require('./settings.json');

var mongodb = require('mongodb');
var monk = require('monk');

var db = monk(settings.dbConnectionString);

module.exports.getSuggestions = getSuggestions;
module.exports.getCloudTags = getCloudTags;
module.exports.addLog = addLog;

/**
 * @function
 * @memberOf hhStat.Server.Model
 * @description Return array of suggestions
 * @param  {Function} cb Callback
 * @return {Object}      Promise
 */
function getSuggestions (cb) {
	db.get('suggestions').find({}, cb);	
}

/**
 * @function
 * @memberOf hhStat.Server.Model
 * @description Return array of suggestions
 * @param  {Function} cb Callback
 * @return {Object}      Promise
 */
function getCloudTags (cb) {
	db.get('cloudTags').find({}, cb);	
}

/**
 * @function
 * @memberOf hhStat.Server.Model
 * @description Return array of suggestions
 * @param  {Function} cb Callback
 * @return {Object}      Promise
 */
function addLog (record, cb) {
	db.get('log').insert(record, cb);
}
  
