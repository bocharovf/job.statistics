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
		getVacancies: getVacancies
	};

	return result;

	/**
	 * @function
	 * @memberOf hhStat.HeadHunter
	 * @description Query HH for array of currencies
	 * @return {Promise}
	 */
	function getCurrencies () {
		return $http.get(config.headHunterUrl + 'dictionaries', {})
					.then(function (result) {
						return result.data.currency;
					});
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
		var queryString = '?' + params.map(function (arg) {
								return arg.param + '=' + arg.value;
							})
							.join('&');

		return $http.get(config.headHunterUrl + 'vacancies' + queryString, {})
			
	}



}]);





