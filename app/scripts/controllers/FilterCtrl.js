'use strict';


/**
  * @class FilterCtrl
  * @memberOf hhStat    
  * @description Manage search filters
  */

angular.module('hhStat')
    .controller('FilterCtrl', function($scope) {
        var self = this;
        
    	this.selCurrency = "rub";
    	this.selCountry = "rus";
    	this.selCity = "moscow";

		this.currencies = [
			{id: "rub", name: "Рубль"},
			{id: "usd", name: "Доллар"},
			{id: "eur", name: "Евро"}
		];

		this.countries = [
			{id: "rus", name: "Россия"},
			{id: "ukr", name: "Украина"},
			{id: "blr", name: "Белорусия"}
		];

		this.cities = [
			{id: "moscow", name: "Москва"},
			{id: "kiev", name: "Киев"},
			{id: "st.petersburg", name: "Санкт-Петербург"}
		];
						
    });
