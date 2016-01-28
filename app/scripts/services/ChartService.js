'use strict';

/**
  * @class ChartService
  * @memberOf hhStat   
  * @description Support chart operations
  */
 
angular.module('hhStat')
	.service('ChartService', [ 'CurrencyService', function (currencyService) {

		var result = {};
		result.chartTypes = [
			{id: 'pie', name: 'Круговая'},
			{id: 'column', name: 'Колоночная'},
			{id: 'bar', name: 'Бары'},
			{id: 'polar', name: 'Полюса'}
		];		

		result.valueTypes = [
			{id: 'avgSalary', name: 'Средняя зарплата', title: 'Соотношение средних зарплат'},
			{id: 'amountTotal', name: 'Кол-во вакансий', title: 'Соотношение количества вакансий'}
		];

		result.selectedCurrency = null;
		result.selectedValueType = result.valueTypes[0];
		result.selectedChartType = result.chartTypes[1];

		return result;
}]);
