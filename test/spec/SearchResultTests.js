(function () {
  'use strict';

  describe('SearchResult class', function () {
    
    var currency, $httpBackend;
    var currencyResponse = 
    {
      currency: [
        {  
           "rate":1.0,
           "code":"RUR"
        },
        {  
           "rate":0.012557,
           "code":"EUR"
        },
        {  
           "rate":0.013712,
           "code":"USD"
        }
      ]
    };

    beforeEach(module('hhStat'));
    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');        
        $httpBackend.whenGET(/.*dictionaries/)
                            .respond(currencyResponse);

        currency = $injector.get('CurrencyService');
        $httpBackend.flush();
      });
    });

    describe('constructor', function () {

      it('should calculate salary and amount aggregations', function () {
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

        var result = new SearchResult(null, response, currency);
      	expect(result.salary.avg).to.equal(25);
        expect(result.salary.min).to.equal(10);
        expect(result.salary.max).to.equal(40);
        expect(result.amount.total).to.equal(286654);
        expect(result.amount.used).to.equal(2);
      });
        
      it('should ignore empty salary', function () {

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

      	var result = new SearchResult(null, response, currency);
      	expect(result.salary.avg).to.equal(25);
        expect(result.salary.min).to.equal(10);
        expect(result.salary.max).to.equal(40);
        expect(result.amount.total).to.equal(286654);
        expect(result.amount.used).to.equal(2);

      });

      it('should replace empty salary.to field by salary.from and vice versa ', function () {
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
        
        var result = new SearchResult(null, response, currency);
        expect(result.salary.avg).to.equal(30);
        expect(result.salary.min).to.equal(20);
        expect(result.salary.max).to.equal(60);
        expect(result.amount.total).to.equal(286654);
        expect(result.amount.used).to.equal(3);

      });
      
      it('should swap salary.to and salary.from if to < from', function () {
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

      	var result = new SearchResult(null, response, currency);
      	expect(result.salary.avg).to.equal(25);
        expect(result.salary.min).to.equal(10);
        expect(result.salary.max).to.equal(40);

      });

      it('should convert all salary values to single currency', function () {
        var response = 
        {
          "items": [{
            "salary": {
              "to": 200,
              "from": 100,
              "currency": "USD"
            }
          }, {
            "salary": {
              "to": 200,
              "from": 100,
              "currency": "EUR"
            }
          }],
          "found": 286654, "per_page": 2, "page": 0, "pages": 1000
        };

        var result = new SearchResult(null, response, currency);
        expect(result.salary.avg).to.almost.equal(11442.43, 2);
        expect(result.salary.min).to.almost.equal(7292.88, 2);
        expect(result.salary.max).to.almost.equal(15927.37, 2);
      });

      it('should produce empty result if there are no items or they are invalid', function () {
        var response1 = 
        {
          "items": [{
            "salary": {
              "to": null,
              "from": null,
              "currency": "RUR"
            }
          }, {
            "salary": {
              "to": 200,
              "from": 400
            }
          }, 
          {}],
          "found": 40, "per_page": 2, "page": 0, "pages": 1000
        };

        var response2 = 
        {
          "items": [],
          "found": 40, "per_page": 2, "page": 0, "pages": 1000
        };        

        var result1 = new SearchResult(null, response1, currency);
        var result2 = new SearchResult(null, response2, currency);

        expect(result1.amount.used).to.equal(0);
        expect(result1.amount.total).to.equal(0);

        expect(result1.salary.avg).to.be.null;
        expect(result1.salary.min).to.be.null;
        expect(result1.salary.max).to.be.null;

        expect(result2.amount.used).to.equal(0);
        expect(result2.amount.total).to.equal(0);

        expect(result2.salary.avg).to.be.null;
        expect(result2.salary.min).to.be.null;
        expect(result2.salary.max).to.be.null;        
      });      

    });
  
    describe('merge method', function () {
      
      it('should merge results', function () {
        
        var response1 = 
        {
          "items": [{
            "salary": {
              "to": 100,
              "from": 200,
              "currency": "RUR"
            }
          }, {
            "salary": {
              "to": 300,
              "from": 350,
              "currency": "RUR"
            }
          }],
          "found": 20, "per_page": 2, "page": 0, "pages": 1000
        };

        var response2 = 
        {
          "items": [{
            "salary": {
              "to": 50,
              "from": 250,
              "currency": "RUR"
            }
          }, {
            "salary": {
              "to": 200,
              "from": 400,
              "currency": "RUR"
            }
          }],
          "found": 40, "per_page": 2, "page": 0, "pages": 1000
        };         

        var result1 = new SearchResult(null, response1, currency);
        var result2 = new SearchResult(null, response2, currency);
        
        result1.merge(result2);

        expect(result1.amount.used).to.equal(4);
        expect(result1.amount.total).to.equal(60);

        expect(result1.salary.avg).to.equal(231.25);
        expect(result1.salary.min).to.equal(50);
        expect(result1.salary.max).to.equal(400);
      });

      it('should skip empty results', function () {
        
        var response1 = 
        {
          "items": [{
            "salary": {
              "to": 100,
              "from": 200,
              "currency": "RUR"
            }
          }, {
            "salary": {
              "to": 300,
              "from": 350,
              "currency": "RUR"
            }
          }],
          "found": 20, "per_page": 2, "page": 0, "pages": 1000
        };

        var response2 = 
        {
          "items": [],
          "found": 40, "per_page": 2, "page": 0, "pages": 1000
        };         

        var response3 = 
        {
          "items": [{
            "salary": {
              "to": null,
              "from": null,
              "currency": "RUR"
            }
          }, {
            "salary": {
              "to": 200,
              "from": 400
            }
          }, 
          {}],
          "found": 40, "per_page": 2, "page": 0, "pages": 1000
        };

        var result1 = new SearchResult(null, response1, currency);
        var result2 = new SearchResult(null, response2, currency);
        var result3 = new SearchResult(null, response3, currency);
        
        result1.merge(result2);
        result1.merge(result3);

        expect(result1.amount.used).to.equal(2);
        expect(result1.amount.total).to.equal(20);

        expect(result1.salary.avg).to.equal(237.5);
        expect(result1.salary.min).to.equal(100);
        expect(result1.salary.max).to.equal(350);
      });

    });

  });

})();
