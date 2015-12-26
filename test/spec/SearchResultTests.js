(function () {
  'use strict';

  describe('SearchResult class', function () {

    describe('Service response has correct salary fields', function () {
      
      it('should calculate average salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.avg).to.equal(25);
      });

      it('should calculate min salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.min).to.equal(10);
      });

      it('should calculate max salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.max).to.equal(40);
      });

      it('should retrieve total amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.total).to.equal(286654);
      });

      it('should calculate used amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.used).to.equal(2);
      });

      var response = 
		{
			"items": [{
				"salary": {
					"to": 20,
					"from": 10,
					"currency": "RUR"
				}
			}, {
				"salary": {
					"to": 40,
					"from": 30,
					"currency": "RUR"
				}
			}],
			"found": 286654, "per_page": 2, "page": 0, "pages": 1000
		};
    });

    describe('Service response has empty salary fields', function () {
      
      it('should calculate average salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.avg).to.equal(25);
      });

      it('should calculate min salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.min).to.equal(10);
      });

      it('should calculate max salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.max).to.equal(40);
      });

      it('should retrieve total amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.total).to.equal(286654);
      });

      it('should calculate used amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.used).to.equal(2);
      });

      var response = 
		{
			"items": [{
				"salary": {
					"to": 20,
					"from": 10,
					"currency": "RUR"
				}
			}, {
				"salary": null
			}, {
				"salary": null
			}, {
				"salary": {
					"to": 40,
					"from": 30,
					"currency": "RUR"
				}
			}, {
				"salary": null
			}],
			"found": 286654, "per_page": 2, "page": 0, "pages": 1000
		};
    });

	describe('Service response has empty salary .to-.from fields', function () {
      
      it('should calculate average salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.avg).to.equal(30);
      });

      it('should calculate min salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.min).to.equal(20);
      });

      it('should calculate max salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.max).to.equal(60);
      });

      it('should retrieve total amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.total).to.equal(286654);
      });

      it('should calculate used amount of records', function () {
      	var result = new SearchResult(null, response);
      	expect(result.amount.used).to.equal(3);
      });

      var response = 
		{
			"items": [{
				"salary": {
					"to": 20,
					"currency": "RUR"
				}
			}, {
				"salary": null
			}, {
				"salary": null
			}, {
				"salary": {
					"from": 30,
					"currency": "RUR"
				}
			}, {
				"salary": {
					"to": 60,
					"from": 20,
					"currency": "RUR"
				}
			}, {
				"salary": null
			}],
			"found": 286654, "per_page": 2, "page": 0, "pages": 1000
		};
    });

    describe('Service response has mixed up from-to salary fields', function () {
      
      it('should calculate average salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.avg).to.equal(25);
      });

      it('should calculate min salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.min).to.equal(10);
      });

      it('should calculate max salary', function () {
      	var result = new SearchResult(null, response);
      	expect(result.salary.max).to.equal(40);
      });

      var response = 
		{
			"items": [{
				"salary": {
					"to": 10,
					"from": 20,
					"currency": "RUR"
				}
			}, {
				"salary": {
					"to": 30,
					"from": 40,
					"currency": "RUR"
				}
			}],
			"found": 286654, "per_page": 2, "page": 0, "pages": 1000
		};
    });


  });
})();
