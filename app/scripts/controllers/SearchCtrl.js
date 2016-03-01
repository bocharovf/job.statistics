'use strict';

/**
  * @class SearchCtrl
  * @memberOf hhStat 
  * @description Control all search operations and chart display   
  */

angular.module('hhStat')
    .controller('SearchCtrl', ['$scope', 'SearchService', 'ChartService', 'BackendService', 'CurrencyService', 
    	function($scope, search, chart, backend, currency) {
    
    var self = this;

    this.query = '';
		this.queryInProgress = 0;
		this.maxQueryInProgress = 0;
		
		this.results = Object.create(null);

		this.chartConfig = new ChartExtension(true, chart.selectedChartType, 
										chart.selectedValueType, chart.selectedCurrency, currency);

		this.demoCharts = chart.chartTypes
								.filter(function (type) {
									return type !== chart.selectedChartType;
								})
								.map(function (type) {
									return new ChartExtension(false, type, 
										chart.selectedValueType, chart.selectedCurrency, currency);
								});

		this.hasResults = hasResults;
		this.percentProgress = percentProgress;
		this.searchOnEnter = searchOnEnter;
		this.search = searchQuery;		
		this.selectAsMainChart = selectAsMainChart;
		this.clearResult = clearResult;
		this.placeholder = placeholder;
		this.buttonText = buttonText;
		this.isAllResultsEmpty = isAllResultsEmpty;

		search.subscribe ('SEARCH_SUCCESS', $scope, onSearchSuccess);
		search.subscribe ('SEARCH_FAILED', $scope, onSearchFailed);
		search.subscribe ('SEARCH_START', $scope, onSearchStart);

		search.subscribe ('FILTER_CHANGED', $scope, onFilterChanged);

		activate();

		/****************** Functions ***************/
		
		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Module activation function
		 */
		function activate () {
			backend.getSuggestions()
				.then(function (suggestions) {
					self.suggestions = suggestions;
					selectRandomSuggestion();
				}, function (error) {
					self.suggestions = [{ Query: "java, c++, c#"}];
					selectRandomSuggestion();
				});			
		}

		function searchQuery (query) {
			self.query = query; // in case of click on suggestion

			if (query) selectRandomSuggestion();

			clearEmptyResults();
			search.search(query);
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Show placeholder based on current state 
		 * @return {String} Placeholder for search box
		 */
		function placeholder () {
			return self.hasResults() ? 
					'Добавьте к сравнению язык, платформу, фреймворк ...' : 
					'Язык, платформа, фреймворк ...';
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Return search button text
		 * @return {String}  Search button text
		 */
		function buttonText () {
			return self.hasResults() ? 
					'Добавить' : 
					'Найти';
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Clear all results or results for specific token
		 * @param {String} [token] Token to remove
		 */
		function clearResult (token) {
			if (token) {
				delete self.results[token];
				refreshChartSeries ();
			}
			else {
				this.results = Object.create(null);
			}
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Indicates whether search results are available
		 * @return {Boolean} True if search results are available
		 */
		function hasResults () {
			var realResults = Object.keys(self.results)
									.filter(function (key) {
										return self.results[key].amount.used > 0;
									});

			return realResults.length > 0;
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Check if all result are empty
		 * @return {Boolean} True if all results are empty
		 */
		function isAllResultsEmpty () {
			var realResults = Object.keys(self.results)
									.filter(function (key) {
										return self.results[key].amount.used > 0;
									});
			return Object.keys(self.results).length > 0 && realResults.length === 0;
		}		
		
		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Search for query if enter pressed 
		 * @param  {Event} keyEvent Event class
		 */
		function searchOnEnter (keyEvent) {
			if (keyEvent.which === 13 /*Enter*/)
    			searchQuery(self.query);
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Change main chart to be selected chart   
		 * @param  {Number} chartIndex Selected chart index
		 */
		function selectAsMainChart (chartIndex) {
			var newMainChart = self.demoCharts[chartIndex];
			
			newMainChart.isMainChart = true;
			self.chartConfig.isMainChart = false;

			self.demoCharts[chartIndex] = self.chartConfig
			self.chartConfig = newMainChart;

			refreshChartSeries();
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Current search progress in percent
		 * @return {Number} Percent of completion
		 */
		function percentProgress () {
			return Math.round(100.0 - 100.0 * self.queryInProgress / self.maxQueryInProgress, 0);
		}		

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Handle change of any filter 
		 * @param  {Event} event Event
		 * @param  {Object} args  Args
		 */
		function onFilterChanged (event, args) {
			if (args.isNewSearchRequired) 
				retrySearch();	

			if (args.isSeriesRefreshRequired)
				refreshChartSeries();
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Register new result or merge existed
		 * @param  {SearchResult} result New received SearchResult
		 */
		function mergeResult (result) {
			var key = result.request.token;
			if (key in self.results)
				self.results[key].merge(result);
			else
				self.results[key] = result;
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Perform current search again
		 */
		function retrySearch () {
			var query = Object.keys(self.results)
							.map(function (key) {
								return self.results[key].request.token;
							})
							.join(',');
			
			self.clearResult();
			self.search(query);
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Refresh all charts according to current results and settings
		 */
		function refreshChartSeries () {
			self.chartConfig.currency = chart.selectedCurrency;
			self.chartConfig.valueType = chart.selectedValueType;
			self.chartConfig.updateSeries(self.results);

			self.demoCharts.forEach(function (demoChart) {
				demoChart.currency = chart.selectedCurrency;
				demoChart.valueType = chart.selectedValueType;	

				demoChart.updateSeries(self.results)		    	
		    });
		}
		
		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Select random suggestion from available list
		 */
		function selectRandomSuggestion () {
			var amount = self.suggestions.length;
			var randomIndex = Math.floor(Math.random() * amount);
			self.suggestion = self.suggestions[randomIndex].Query;
		}


		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Handle search start event
		 * @param  {Event} event Event
		 * @param  {Object} args  Args
		 */
		function onSearchStart (event, args) {
			self.queryInProgress += args.length;
			self.maxQueryInProgress += args.length;
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Handle search success event
		 * @param  {Event} event Event
		 * @param  {Object} args  Args
		 */
		function onSearchSuccess (event, args) {
			self.queryInProgress--;

			var result = new SearchResult(args.request, args.response, currency);
			mergeResult(result);	
			refreshChartSeries();

			if (self.queryInProgress === 0) finishSearch();
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Handle search fail event
		 * @param  {Event} event Event
		 * @param  {Object} args  Args
		 */
		function onSearchFailed (event, args) {
			self.queryInProgress--;

			if (self.queryInProgress === 0) finishSearch();
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Handle end of search
		 */
		function finishSearch () {
			
			var currentFilter = {
				region: search.selectedRegion ? search.selectedRegion.id : null,
				experience: search.selectedExperience ? search.selectedExperience.id : null,
				currency: currency.selectedCurrency,
				chart: chart.selectedValueType.id,
				chartType: chart.selectedChartType.id
			};
			backend.logQuery(self.query, currentFilter);

			self.query = '';
			self.maxQueryInProgress = 0;
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Clear empty results
		 */
		function clearEmptyResults () {
			var emptyKeys = Object.keys(self.results)
									.filter(function (key) {
										return self.results[key].amount.used == 0;
									}).forEach(function  (argument) {
										self.results[key] = undefined;
									});
		}

    }]);


