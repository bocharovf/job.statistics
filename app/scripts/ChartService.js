 
angular.module('hhStat')
	.service('chart', function() {

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
						enabled: !isDemo
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
		            }		            
				},					
				series: [],
				loading: false,
				title: { text: text },
				xAxis: { title: { text: null } },
				yAxis: { title: { text: (isDemo ? null : yTitle)} }
				
			}; 

			return config;
		}
	});