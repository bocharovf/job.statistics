'use strict';

/**
  * @class BackendService
  * @memberOf hhStat 
  * @description Data service to interact with backend API   
  */
 
angular.module('hhStat')
	.service('BackendService', ['ConfigConst', '$http', function(config, $http) {

	var result = {
		getSuggestions: getSuggestions,
		getCloudTags: getCloudTags
	};

	return result;

	/**
	 * @function
	 * @memberOf hhStat.BackendService
	 * @description Query backend for array of suggestions
	 * @return {Promise}
	 */
	function getSuggestions () {
		return $http.get(config.backendBaseUrl + 'suggestions', {})
					.then(function (result) {
						return result.data;
					});
	}

	/**
	 * @function
	 * @memberOf hhStat.BackendService
	 * @description Query backend for array of tags and weights
	 * @return {Promise}
	 */
	function getCloudTags () {
		return $http.get(config.backendBaseUrl + 'cloudTags', {})
					.then(function (result) {
						return result.data.map(function (tag) {
							return {
								text: tag.Tag,
								weight: tag.Weight,
							}
						});
					});
	}

}]);





