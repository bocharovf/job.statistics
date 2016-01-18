'use strict';

/**
  * @class HeadHunter
  * @memberOf hhStat    
  * @description Data service to interact with Head Hunter API
  */
 
angular.module('hhStat')
	.service('HeadHunter', ['ConfigConst', '$http', '$q', function(config, $http, $q) {

	var cache = {};

	var result = {
		getCurrencies: getCurrencies,
		getVacancies: getVacancies,
		getAreas: getAreas
	};

	return result;

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @description Query HH for array of currencies
	 * @return {Promise}
	 */
	function getCurrencies () {
		return getCacheableResource('dictionaries')
					.then(function (result) {
						return result.currency;
					});
	}

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @description Query HH for tree of areas
	 * @return {Promise}
	 */
	function getAreas () {
		return getCacheableResource('areas');
	}	

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @description Query HH for vacancies
	 * @param  {string} text     'text' query parameter
	 * @param  {Object} settings Additional query parameters
	 * @return {Promise}
	 */
	function getVacancies (text, settings) {
		var params = [
			{param: 'only_with_salary', value: 'true'},
			{param: 'order_by', value: 'relevance'},
			//"id": "1", "name": "Информационные технологии, интернет, телеком"
			//{param: 'specialization', value: '1'}, 
			{param: 'per_page', value: settings.perPage || 500 },
			{param: 'page', value: settings.page || 0 },
			{param: 'text', value: encodeURIComponent(text) }
		];
		
		if (settings.area) 
			params.push({param: 'area', value: settings.area});

		var queryString = '?' + params.map(function (arg) {
								return arg.param + '=' + arg.value;
							})
							.join('&');

		return $http.get(config.headHunterUrl + 'vacancies' + queryString, {})
			
	}

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @private
	 * @description Query for resource for first time and cache response
	 * @return {Promise} Returns requested resource
	 */
	function getCacheableResource (resourceName) {

		if (cache[resourceName])
		{
			var def = $q.defer();
			def.resolve(cache[resourceName]);
			return def.promise;
		}

		return $http.get(config.headHunterUrl + resourceName, {})
					.then(function (result) {
						cache[resourceName] = result.data;
						return result.data;
					});
	}

}]);





