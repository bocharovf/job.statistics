'use strict';

/**
  * @class ChartService
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
	.service('ChartService', function() {

		var result = {};
		result.chartTypes = [
			{id: 'pie', name: 'Круговая'},
			{id: 'column', name: 'Колоночная'},
			{id: 'bar', name: 'Бары'}
		];		
		result.createConfig = createConfig;

		return result;

		function createConfig (isDemo, chartType, text, yTitle) {

			var config = {
				options: {
					chart: {
						type: chartType,
						animation: false,
						backgroundColor: '#ededea'
					},
					legend: {
						enabled: !isDemo
					},
					tooltip: {
						enabled: !isDemo,
						formatter: function (argument) {
							return 'Средняя зарплата <b>' + Math.round(this.y,0) + ' руб.</b>';
						}
					},
					exporting: {
		            	buttons: {
		            		contextButton: {
		            			enabled: !isDemo,
		            			symbolFill: '#ededea'
		            		}
		            	}
		            },
		            navigation: {
		            	buttonOptions: {
		            		enabled: !isDemo,
		            		symbolFill: '#ededea'
		            	}
		            }, 
					plotOptions: {
		                pie: {
		                    allowPointSelect: true,
		                    cursor: 'pointer',
		                    dataLabels: {
		                        enabled: false
		                    },
		                    showInLegend: !isDemo
		                }
		            },
		            credits: {
		            	enabled: true,
		            	href: "http://job.bocharovf.ru",
		            	text: "http://job.bocharovf.ru"
		            },
		            loading: {
		            	showDuration: 0,
		            	hideDuration: 0
		            }
				},					
				series: [],
				title: { text: text },
				xAxis: { title: { text: null } },
				yAxis: { title: { text: (isDemo ? null : yTitle)} }
				
			}; 

			return config;
		}
	});