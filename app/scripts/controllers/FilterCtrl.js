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
        
		this.isExpanded = false;
		this.collapsedContent = collapsedContent;

    	this.currencies = [];
		this.selectedCurrency = null;

		this.areas = null;

		subscribe ('FILTER_CHANGED', $scope, onFilterChanged);

		activate();

		/****************** Functions ***************/

		function activate () {
			headHunter.getCurrencies().then(function (currencies) {
				self.currencies = currencies;
				self.selectedCurrency = self.currencies[0];
			});

			headHunter.getAreas().then(function (areas) {
				self.areas = areas;
			});
			
		}

		function onSelectedCountryChanged (newValue, oldValue) {
			if (newValue) {
				headHunter.getCities(newValue.id)
					.then(function(cities) {
						self.cities = cities;
					});
			} else {
				self.cities = [];
			}
		}

		function onFilterChanged (event, args) {
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
