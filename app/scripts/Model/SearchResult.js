

/**
 * Represents aggregated search result
 * @param {string} token   	Token, requested by user
 * @param {string} alias   	Alias of token
 * @param {int} page		Page of dataset
 * @param {json} rawData 	Raw response from service
 */
function SearchResult (request, rawData) {
	this.request = request;

	this.salary = {
		min: 0,
		max: 0,
		avg: 0
	};

	this.amount = {
		total: 0,
		used: 0
	};	

	var self = this;
	var salarySum = rawData.items.filter(function (x) {
		return x.salary;
	}).map(function (x) {
		self.amount.used++;
		var low = x.salary.from | x.salary.to;
		var high = x.salary.to | x.salary.from;

		if (self.salary.min > low) self.salary.min = low;
		if (self.salary.max < high) self.salary.max = high;

		return (low + high) / 2.0;
	}).reduce(function (a, b) {
		return a + b;
	});

	this.salary.avg = (this.amount.used > 0 ? salarySum / this.amount.used : 0);
	this.amount.total = rawData.found | 0;

}