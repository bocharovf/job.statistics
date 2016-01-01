'use strict';

/**
  * @class ConfigConst
  * @memberOf hhStat    
  */
 
angular
	.module('hhStat', ['angular-jqcloud', 'highcharts-ng'])
	.constant('ConfigConst', {
		backendBaseUrl: "http://job.bocharovf.ru/data/",
		headHunterUrl: "https://api.hh.ru/"
	});