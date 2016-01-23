'use strict';

/**
 * @class SearchResult
 * @memberOf hhStat
 * @description Represents aggregated search result
 * @param {Object} request  Request made to HH
 * @param {JSON} rawData   	JSON response from HH
 * @param {CurrencyService} currency	Instance of CurrencyService
 */
function SearchResult (request, rawData, currency) {
	var self = this;

	this.request = request;
	this.merge = merge;
	this.currency = currency;

	this.salary = {
		min: null,
		max: null,
		avg: null 
	};

	this.amount = {
		total: 0,
		used: 0
	};	

	var validVacancies = rawData.items.filter(function (x) {
		return x.salary && (x.salary.from || x.salary.to) && x.salary.currency;
	});

	if (validVacancies.length === 0) return; // skip empty results

	var salarySum = validVacancies.map(function (x) {
		self.amount.used++;

		var fromRub = self.currency.convert(x.salary.from, x.salary.currency, "RUR");
		var toRub = self.currency.convert(x.salary.to, x.salary.currency, "RUR");  

		var low = Math.min(fromRub || toRub, toRub || fromRub);
		var high = Math.max(toRub || fromRub, fromRub || toRub);

		self.salary.min = self.salary.min ? Math.min(self.salary.min, low, high) : Math.min(low, high);
		self.salary.max = self.salary.max ? Math.max(self.salary.max, low, high) : Math.max(low, high);

		return (low + high) / 2.0;
	}).reduce(function (a, b) {
		return a + b;
	});

	this.salary.avg = (this.amount.used > 0 ? salarySum / this.amount.used : 0);
	this.amount.total = rawData.found | 0;

	/**
	 * @function
	 * @memberOf hhStat.SearchResult
	 * @description Add specified result into current result
	 * @param  {SearchResult} result Result to add
	 */
	function merge (result) {
		// skip merge with empty results
		if (result.amount.used === 0) return;

		 
		if (this.amount.used === 0 ) { 
			// if this is empty result - copy from real
			this.amount.total = result.amount.total;
			this.amount.used = result.amount.used;
			this.salary.min = result.salary.min;
			this.salary.max = result.salary.max;
			this.salary.avg = result.salary.avg;
		}
		else {
			// if both results are real - merge
			this.amount.total = result.amount.total;
			this.amount.used += result.amount.used;
			this.salary.min = Math.min(result.salary.min, this.salary.min);
			this.salary.max = Math.max(result.salary.max, this.salary.max);
			this.salary.avg = (this.salary.avg + result.salary.avg) / 2.0;
		}

	}
}