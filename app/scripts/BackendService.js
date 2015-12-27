/**
  * @class BackendService
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
	.service('BackendService', ['ConfigConst', '$http', function(config, $http) {

	var result = {
		getSuggestions: getSuggestions,
		getCloudTags: getCloudTags
	};

	return result;

	/**
	 * @name getSuggestions
	 * @function
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
	 * @name getCloudTags
	 * @function
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





