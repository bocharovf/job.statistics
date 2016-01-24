'use strict';

/**
  * @class HeadHunter
  * @memberOf hhStat    
  * @description Data service to interact with Head Hunter API
  */
 
angular.module('hhStat')
	.service('HeadHunter', ['ConfigConst', '$http', function(config, $http) {

	var result = {
		getCurrencies: getCurrencies,
		getExperiences: getExperiences, 
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
	 * @description Query HH for array of experiences
	 * @return {Promise}
	 */
	function getExperiences (argument) {
		return getCacheableResource('dictionaries')
					.then(function (result) {
						return result.experience;
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
		if (settings.experience)
			params.push({param: 'experience', value: settings.experience});

		var queryString = '?' + params.map(function (arg) {
								return arg.param + '=' + arg.value;
							})
							.join('&');

		return $http.get(config.headHunterUrl + 'vacancies' + queryString, 
						{ timeout: config.headHunterTimeout })
			
	}

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @private
	 * @description Query for resource for first time and cache response
	 * @return {Promise} Returns requested resource
	 */
	function getCacheableResource (resourceName) {
		var requestConfig = {
			timeout: config.headHunterTimeout,
			cache: true
		};

		return $http.get(config.headHunterUrl + resourceName, requestConfig)
					.then(function (result) {
						return result.data;
					});
	}

}]);





