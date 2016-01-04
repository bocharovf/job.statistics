'use strict';

/**
  * @class SearchCtrl
  * @memberOf hhStat    
  */

angular.module('hhStat')
    .controller('SearchCtrl', ['$scope', 'SearchService', 'ChartService', 'BackendService', 'CurrencyService', 
    	function($scope, search, chart, backend, currency) {
       	var self = this;

		backend.getSuggestions().then(function (suggestions) {
			self.suggestions = suggestions;
			selectRandomSuggestion();
		});

		this.queryInProgress = 0;
		this.results = Object.create(null);
		this.selectedChartType = 'pie';
		this.chartConfig = chart.createConfig(false, this.selectedChartType, 
													'Сравнение средних зарплат', 'Рубли');

		this.demoCharts = chart.chartTypes.map(function (type) {
			return chart.createConfig(true, type.id);
		});

		this.hasResults = hasResults;
		this.searchOnEnter = searchOnEnter;
		this.search = search.search;		
		this.changeChartType = changeChartType;

		search.subscribe ('SEARCH_SUCCESS', $scope, onSearchSuccess);
		search.subscribe ('SEARCH_FAILED', $scope, onSearchFailed);
		search.subscribe ('SEARCH_START', $scope, onSearchStart);

		// -------- Exposed
		
		/**
		 * @function
		 * @memberOf SearchCtrl
		 * @description Indicates whether search results are available
		 * @return {Boolean} True if search results are available
		 */
		function hasResults () {
			return (Object.keys(self.results).length > 0);
		}
		
		/**
		 * @function
		 * @memberOf SearchCtrl
		 * @description Search for query if enter pressed 
		 * @param  {Event} keyEvent Event class
		 */
		function searchOnEnter (keyEvent) {
			if (keyEvent.which === 13 /*Enter*/)
    			self.search(self.query);
		}

		/**
		 * @function
		 * @memberOf SearchCtrl
		 * @description Change type of main chart
		 * @param  {string} chart Identifier of chart type
		 */
		function changeChartType (chart) {
			self.chartConfig.options.chart.type = chart.options.chart.type;
		}

		// -------- Internals		

		function mergeResult (result) {
			var key = result.request.token;
			if (key in self.results) { 
				self.results[key].merge(result);
			} else {
				self.results[key] = result;
			}
		}

		// TODO: use different type of chart and series
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
		
		function selectRandomSuggestion () {
			var amount = self.suggestions.length;
			var randomIndex = Math.floor(Math.random() * amount);
			self.suggestion = self.suggestions[randomIndex].Query;
		}

		function onSearchStart (event, args) {
			self.queryInProgress += args.length;
		}

		function onSearchSuccess (event, args) {
			self.queryInProgress--;

			var result = new SearchResult(args.request, args.response, currency);
			mergeResult(result);	
			refreshChartSeries();

			if (self.queryInProgress === 0) finishSearch();
		}

		function onSearchFailed (event, args) {
			self.queryInProgress--;

			if (self.queryInProgress === 0) finishSearch();
		}

		function finishSearch () {
			self.query = '';
		}

    }]);


