'use strict';

/**
  * @class Cors
  * @memberOf hhStat.Server   
  * @description Middleware to enable CORS
  */

/**
 * @function
 * @memberOf hhStat.Server.Cors
 * @description Add CORS header to response
 * @param  {Object} req Request
 * @param  {Object} res Response
 * @param  {Function} next
 */
function enableCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

module.exports = enableCors;