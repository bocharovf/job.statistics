'use strict';

/**
  * @class CommonService
  * @memberOf hhStat 
  * @description Common and shared functionality
  */
 
angular.module('hhStat')
	.service('CommonService', [function() {

	var result = {
		session: guid()
	};

	return result;

	/****************** Functions ***************/

	/**
	 * @function
	 * @private
	 * @memberOf hhStat.CommonService
	 * @description Produce unique identifier
	 * @return {string} Unique identifier
	 */
	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}

}]);
