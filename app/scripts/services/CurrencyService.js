'use strict';

/**
  * @class CurrencyService
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
	.service('CurrencyService', ['HeadHunter', function(headHunter) {

	var result = {
		convert: convert,
		selectedCurrency: "RUR",
		currencies: []
	};

	headHunter.getCurrencies()
			.then(function (currencies) {
				result.currencies = currencies;
			}, function (response) {
				
			});

	return result;

	/**
	 * Convert money from one currency to another
	 * @param  {float} amount  Value in source currency
	 * @param  {string} fromCur Source currency
	 * @param  {string} toCur   Target currency
	 * @return {object}         Currency object
	 */
	function convert (amount, fromCur, toCur) {
		var sourceRate = result.currencies
							.filter(function (x) {
								return x.code === fromCur
							});

		var targetRate = result.currencies
							.filter(function (x) {
								return x.code === toCur
							});

		if (sourceRate.length == 0) throw new Error("Invalid currency " + fromCur);
		if (targetRate.length == 0) throw new Error("Invalid currency " + toCur);

		return amount * targetRate[0].rate / sourceRate[0].rate;			
	}
}]);





