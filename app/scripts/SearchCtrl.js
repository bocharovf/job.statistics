

angular.module('hhStat')
    .controller('SearchCtrl', ['$scope', 'search', 'chart', function($scope, search, chart) {
       
		$scope.suggestion = "c#, java, c++";
		$scope.queryInProgress = 0;
		
		$scope.results = Object.create(null);
		$scope.hasResults = hasResults;

		$scope.selectedChartType = 'pie';
		$scope.chartConfig = chart.createConfig(false, $scope.selectedChartType, 
													'Сравнение средних зарплат', 'Рубли');

		$scope.demoCharts = chart.chartTypes.map(function (type) {
			return chart.createConfig(true, type.id);
		});

		$scope.search = search.search;
		$scope.changeChartType = changeChartType;

		search.subscribe ('SEARCH_SUCCESS', $scope, onSearchSuccess);
		search.subscribe ('SEARCH_FAILED', $scope, onSearchFailed);
		search.subscribe ('SEARCH_START', $scope, onSearchStart);

		function onSearchStart (event, args) {
			$scope.queryInProgress += args.length;
		}

		function onSearchSuccess (event, args) {
			$scope.queryInProgress--;

			var result = new SearchResult(args.request, args.response);
			mergeResult(result);	
			refreshChartSeries();

			if($scope.queryInProgress==0) console.log("RESULT", $scope.results);
		}

		function onSearchFailed (event, args) {
			$scope.queryInProgress--;
		}

		function hasResults () {
			return (Object.keys($scope.results).length > 0);
		}

		function mergeResult (result) {
			var key = result.request.token;
			if (key in $scope.results) { 
				// merge results
				var existed = $scope.results[key];
				existed.amount.total += result.amount.total;
				existed.amount.used += result.amount.used;

				existed.salary.min = Math.min(result.salary.min, existed.salary.min);
				existed.salary.max = Math.max(result.salary.max, existed.salary.max);
				existed.salary.avg = (existed.salary.avg + result.salary.avg) / 2.0;
			} else {
				$scope.results[key] = result;
			}
		}

		// TODO: use different type of chart and series
		function refreshChartSeries () {
			var colors = Highcharts.getOptions().colors;
			var chart = $scope.chartConfig;
			
			var categories = Object.keys($scope.results).sort();
			var data = categories.map(function (token, i) {
				return {
					y: $scope.results[token].salary.avg,
					color: colors[i],
					name: token
				};
			});		

			var serie =	{
		            name: 'Avg. salary',
		            data: data,
		            size: '100%',
		            dataLabels: {
		                formatter: function () {
		                    return this.y > 5 ? this.point.name : null;
		                },
		                color: '#ffffff',
		                distance: -30
		            }
		        };

		    chart.series[0] = serie;

		    $scope.demoCharts.forEach(function (chart) {
		    	chart.series[0] = serie;
		    });
		}

		function changeChartType (chart) {
			$scope.chartConfig.options.chart.type = chart.options.chart.type;
		}
		
    }]);


