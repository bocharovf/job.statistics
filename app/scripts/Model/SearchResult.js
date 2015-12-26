

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
		min: null,
		max: null,
		avg: null 
	};

	this.amount = {
		total: 0,
		used: 0
	};	

	var self = this;
	var salarySum = rawData.items.filter(function (x) {
		return x.salary && (x.salary.from || x.salary.to);
	}).map(function (x) {
		self.amount.used++;
		var low = Math.min(x.salary.from || x.salary.to, x.salary.to || x.salary.from);
		var high = Math.max(x.salary.to || x.salary.from, x.salary.from || x.salary.to);

		self.salary.min = self.salary.min ? Math.min(self.salary.min, low, high) : Math.min(low, high);
		self.salary.max = self.salary.max ? Math.max(self.salary.max, low, high) : Math.max(low, high);

		return (low + high) / 2.0;
	}).reduce(function (a, b) {
		return a + b;
	});

	this.salary.avg = (this.amount.used > 0 ? salarySum / this.amount.used : 0);
	this.amount.total = rawData.found | 0;

}