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

		this.queryInProgress = 0;
		this.results = Object.create(null);
		this.selectedChartType = 'pie';
		this.chartConfig = chart.createConfig(false, this.selectedChartType, 
													'Сравнение средних зарплат', 'Рубли');

		this.demoCharts = chart.chartTypes
								.map(function (type) {
									return chart.createConfig(true, type.id);
								});

		this.hasResults = hasResults;
		this.searchOnEnter = searchOnEnter;
		this.search = search.search;		
		this.changeChartType = changeChartType;
		this.clearResult = clearResult;
		this.placeholder = placeholder;
		this.isAllResultsEmpty = isAllResultsEmpty;
		
		search.subscribe ('SEARCH_SUCCESS', $scope, onSearchSuccess);
		search.subscribe ('SEARCH_FAILED', $scope, onSearchFailed);
		search.subscribe ('SEARCH_START', $scope, onSearchStart);
		search.subscribe ('CURRENCY_CHANGED', $scope, onSelectedCurrencyChanged);

		activate();

		/****************** Functions ***************/
		
		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Module activation function
		 */
		function activate () {
			backend.getSuggestions().then(function (suggestions) {
				self.suggestions = suggestions;
				selectRandomSuggestion();
			});			
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
    			self.search(self.query);
		}

		/**
		 * @function
		 * @memberOf hhStat.SearchCtrl
		 * @description Change type of main chart
		 * @param  {string} chart Identifier of chart type
		 */
		function changeChartType (chart) {
			self.chartConfig.options.chart.type = chart.options.chart.type;
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
			if (key in self.results) { 
				self.results[key].merge(result);
			} else {
				self.results[key] = result;
			}
		}

		/**
		 * @function
		 * @private
		 * @memberOf hhStat.SearchCtrl
		 * @description Refresh all charts according to current results
		 */
		function refreshChartSeries () {
			var colors = Highcharts.getOptions().colors;
			var chart = self.chartConfig;
			
			var categories = Object.keys(self.results).sort();
			var data = categories.map(function (token, i) {
				return {
					y: self.results[token].salary.avg,
					color: colors[i],
					name: token
				};
			});		

			var serie =	{
		            name: null,
		            data: data,
		            size: '100%',
		            //showInLegend: false,
		            dataLabels: {
		                formatter: function () {
		                    return this.point.name;
		                },
		                color: '#ffffff',
		                distance: -30
		            }
		        };

		    chart.series[0] = serie;
			chart.xAxis.categories = categories;

		    self.demoCharts.forEach(function (chart) {
		    	chart.series[0] = serie;
		    	chart.xAxis.categories = categories;
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
		 * @description Handle change of currency 
		 * @param  {Event} event Event
		 * @param  {Object} args  Args
		 */
		function onSelectedCurrencyChanged (event, args) {
			refreshChartSeries();
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
			self.query = '';
		}

    }]);


