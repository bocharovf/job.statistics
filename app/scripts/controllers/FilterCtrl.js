'use strict';


/**
  * @class FilterCtrl
  * @memberOf hhStat    
  */

angular.module('hhStat')
    .controller('FilterCtrl', function($scope) {
         
    	$scope.selCurrency = "rub";
    	$scope.selCountry = "rus";
    	$scope.selCity = "moscow";

		$scope.currencies = [
			{id: "rub", name: "Рубль"},
			{id: "usd", name: "Доллар"},
			{id: "eur", name: "Евро"}
		];

		$scope.countries = [
			{id: "rus", name: "Россия"},
			{id: "ukr", name: "Украина"},
			{id: "blr", name: "Белорусия"}
		];

		$scope.cities = [
			{id: "moscow", name: "Москва"},
			{id: "kiev", name: "Киев"},
			{id: "st.petersburg", name: "Санкт-Петербург"}
		];
						
    });
