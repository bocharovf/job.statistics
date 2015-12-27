/**
  * @class CurrencyService
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
	.service('CurrencyService', ['BackendService', function(backend) {

	var result = {

		convert: convert,
		selectedCurrency: "rub",
		currencies: [
			{ id: "rub", name: "Рубль", rate: 1.0 }, 
			{ id: "usd", name: "Доллар", rate: 71.0 }, 
			{ id: "eur", name: "Евро", rate: 78.0 }
		]

	};

	$http.get('localhost', {})
			.then(function (response) {
				onSearchSuccess(request, response);
			}, function (response) {
				onSearchFailed(request, response);
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
								return x.id === fromCur
							});

		var targetRate = result.currencies
							.filter(function (x) {
								return x.id === toCur
							});

		if (sourceRate.length == 0) throw new Error("Invalid currency " + fromCur);
		if (targetRate.length == 0) throw new Error("Invalid currency " + toCur);

		return amount * sourceRate[0].rate / targetRate[0].rate;			
	}
}]);





