'use strict';


/**
  * @class FilterCtrl
  * @memberOf hhStat    
  * @description Manage search filters
  */

angular.module('hhStat')
    .controller('FilterCtrl', ['HeadHunter', 'SearchService', 'ChartService', '$scope', 
    	function(headHunter, search, chart, $scope) {
        var self = this;
        var availableCurrencies = ['RUR','USD','EUR'];
        this.specialAreas = [
			'Россия','Украина','Беларусь',
			'Москва','Санкт-Петербург','Московская область',
			'Новосибирск','Екатеринбург','Нижний Новгород','Казань',
			'Самара','Челябинск','Омск','Ростов-на-Дону','Уфа',
			'Красноярск','Пермь','Волгоград','Воронеж'
        ];

		this.isExpanded = false;
		this.collapsedContent = collapsedContent;

    	this.currencies = [];
		this.valueTypes = chart.valueTypes;

		this.experiences = null;
		this.areas = null;

		subscribe ('REGION_CHANGED', $scope, onSelectedRegionChanged);
		subscribe ('CURRENCY_CHANGED', $scope, onSelectedCurrencyChanged);
		subscribe ('VALUE_TYPE_CHANGED', $scope, onSelectedValueTypeChanged);
		subscribe ('EXPERIENCE_CHANGED', $scope, onSelectedExperienceChanged);

		activate();

		/****************** Functions ***************/

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Module activation function
		 */
		function activate () {
			headHunter.getCurrencies().then(function (currencies) {
				self.currencies = currencies.filter(function (cur) {
					return availableCurrencies.indexOf(cur.code) >= 0;
				});

				// TODO: select currency based on geo location 
				chart.selectedCurrency = self.currencies[0];
			});

			headHunter.getExperiences().then(function (experiences) {
				self.experiences = experiences;
			});			

			headHunter.getAreas().then(function (areas) {
				self.areas = areas;
				// TODO: select area based on geo location
			});
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Handle change of currency
		 * @param  {Object} event Event
		 * @param  {Object} args  Selected currency
		 */
		function onSelectedCurrencyChanged (event, args) {
			chart.selectedCurrency = args;
			notify('FILTER_CHANGED', { isSeriesRefreshRequired: true });
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Handle change of value type
		 * @param  {Object} event Event
		 * @param  {Object} args  Selected value type
		 */
		function onSelectedValueTypeChanged (event, args) {
			chart.selectedValueType = args;
			notify('FILTER_CHANGED', { isSeriesRefreshRequired: true });
		}		

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Handle change of region
		 * @param  {Object} event Event
		 * @param  {Object} args  Selected region
		 */
		function onSelectedRegionChanged (event, args) {
			search.selectedRegion = args;
			notify('FILTER_CHANGED', { isNewSearchRequired: true });
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Handle change of region
		 * @param  {Object} event Event
		 * @param  {Object} args  Selected region
		 */
		function onSelectedExperienceChanged (event, args) {
			search.selectedExperience = args;
			notify('FILTER_CHANGED', { isNewSearchRequired: true });
		}		

		/**
		 * @function
		 * @memberOf hhStat.FilterCtrl
		 * @description Returns summary of current filter for collapsed mode
		 * @return {string} Filter summary text
		 */
		function collapsedContent () {
	
			var filtersArray = [];
			if (chart.selectedValueType)
				filtersArray.push(chart.selectedValueType.name.toLowerCase());

			if (chart.selectedCurrency)
				filtersArray.push(chart.selectedCurrency.name.toLowerCase());

			if (search.selectedExperience)
				filtersArray.push(search.selectedExperience.name.toLowerCase());
			
			if (search.selectedRegion)
				filtersArray.push(search.selectedRegion.name);			

			return filtersArray.join(', ') || "не выбран";
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.FilterCtrl
		 * @description Subscribe to event
		 * @param  {string}   name     Event name
		 * @param  {Object}   scope    Scope
		 * @param  {Function} callback Callback 
		 */
		function subscribe (name, scope, callback) {
	        var handler = scope.$on(name, callback);
	        scope.$on('$destroy', handler);
	    }

	    /**
	     * @function
	     * @private
	     * @memberOf hhStat.FilterCtrl
	     * @description Notify parent scope
	     * @param  {String} name Event name
	     * @param  {Object} args Event args
	     */
	    function notify(name, args) {
	        $scope.$emit(name, args);
	    }

    }]);
