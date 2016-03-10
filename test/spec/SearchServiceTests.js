/*global inject:false*/
(function() {
  'use strict';

  describe('Search service', function() {
    var search, $httpBackend;

    beforeEach(module('hhStat'));
    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        search = $injector.get('SearchService');
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('search method', function() {

      it('should create request 4 pages for simple query', function() {
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=0&text=query/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=1&text=query/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=2&text=query/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=3&text=query/).respond({});
        search.search('query');
        $httpBackend.flush();
      });

      it('should tokenise complex query and request 4 pages per token', function() {
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=0&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=1&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=2&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=3&text=query1/).respond({});

        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=0&text=query2/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=1&text=query2/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=2&text=query2/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=3&text=query2/).respond({});

        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=0&text=query3/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=1&text=query3/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=2&text=query3/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=3&text=query3/).respond({});

        search.search('query1,query2;query3');
        $httpBackend.flush();
      });

      it('should normalise query: trim tokens, remove doubles and empty tokens', function() {
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=0&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=1&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=2&text=query1/).respond({});
        $httpBackend.expectGET(/.*vacancies\?only_with_salary=true&order_by=relevance&per_page=500&page=3&text=query1/).respond({});

        search.search('  ,,, ;; , , query1   ; ; ;,  query1, ');
        $httpBackend.flush();
      });

    });

  });
})();