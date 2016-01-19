'use strict';


/**
  * @class FilterCtrl
  * @memberOf hhStat    
  * @description Manage search filters
  */

angular.module('hhStat')
    .controller('FilterCtrl', ['HeadHunter', 'SearchService', '$scope', '$rootScope',
    	function(headHunter, search, $scope, $rootScope) {
        var self = this;
        var availableCurrencies = ['RUR','USD','EUR'];

		this.isExpanded = false;
		this.collapsedContent = collapsedContent;

    	this.currencies = [];
		this.selectedCurrency = null;

		this.areas = null;

		subscribe ('REGION_CHANGED', $scope, onSelectedRegionChanged);
		subscribe ('CURRENCY_CHANGED', $scope, onSelectedCurrencyChanged);

		activate();

		/****************** Functions ***************/

		function activate () {
			headHunter.getCurrencies().then(function (currencies) {
				self.currencies = currencies.filter(function (cur) {
					return availableCurrencies.indexOf(cur.code) >= 0;
				});

				// TODO: select currency based on geo location 
				self.selectedCurrency = self.currencies[0];
			});

			headHunter.getAreas().then(function (areas) {
				self.areas = areas;
				// TODO: select area based on geo location
			});
		}

		function onSelectedCurrencyChanged (event, args) {
			search.selectedCurrency = args;
		}

		function onSelectedRegionChanged (event, args) {
			search.selectedRegion = args;
		}

		function collapsedContent () {
			return "Фильтр не выбран";
		}

		function subscribe (name, scope, callback) {
	        var handler = scope.$on(name, callback);
	        scope.$on('$destroy', handler);
	    }		
    }]);
