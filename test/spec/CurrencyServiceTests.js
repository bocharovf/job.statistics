/*global inject:false,expect:false*/
(function() {
  'use strict';

  describe('Currency service', function() {
    var currency, $httpBackend;
    var currencyResponse = {
      currency: [{
        'rate': 1.0,
        'code': 'RUR'
      }, {
        'rate': 0.012557,
        'code': 'EUR'
      }, {
        'rate': 0.013712,
        'code': 'USD'
      }]
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

    describe('convert method', function() {

      it('should convert from one cur to another', function() {

        var rub2usd = currency.convert(100, 'RUR', 'USD');
        var eur2rub = currency.convert(100, 'EUR', 'RUR');
        var usd2usd = currency.convert(100, 'USD', 'USD');

        expect(rub2usd).to.almost.equal(1.3712, 4);
        expect(eur2rub).to.almost.equal(7963.6856, 4);
        expect(usd2usd).to.almost.equal(100.0, 4);
      });

      it('should throw "Invalid currency" if either cur does not exists', function() {
        expect(function() {
          currency.convert(42, 'XXX', 'USD');
        }).to.throw('Invalid currency XXX');

        expect(function() {
          currency.convert(42, 'USD', 'XXX');
        }).to.throw('Invalid currency XXX');
      });

    });

  });
})();