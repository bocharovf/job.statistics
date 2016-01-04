'use strict';

/**
  * @class HeadHunter
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
	.service('HeadHunter', ['ConfigConst', '$http', function(config, $http) {

	var result = {
		getCurrencies: getCurrencies,
		getVacancies: getVacancies
	};

	return result;

	/**
	 * @name getCurrencies
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





