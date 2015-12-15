 
angular.module('hhStat')
	.service('chart', function() {

		var result = {};
		result.chartTypes = [
			{id: 'pie', name: 'Круговая'},
			{id: 'column', name: 'Колоночная'}
		];		
		result.createConfig = createConfig;

		return result;

		function createConfig (chartType) {
			console.log('chartType',chartType);

			var config;
			if (['pie', 'column'].indexOf(chartType) >= 0) {

				config = {
					options: {
						chart: {
							type: chartType
						}
					},					
					series: [],
					title: {
						text: 'Сравнение зарплат по категориям'
					},	
					loading: false,	
					yAxis: {
						title: {
							text: 'Зарплата'
						}
					}			
				}; 
			}

			return config;
		}
	});