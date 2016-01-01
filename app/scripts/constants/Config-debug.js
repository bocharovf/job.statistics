'use strict';

/**
  * @class ConfigConst
  * @memberOf hhStat    
  */
 
angular
	.module('hhStat', ['angular-jqcloud', 'highcharts-ng'])
	.constant('ConfigConst', {
		backendBaseUrl: "http://localhost/job.statistics.backend/data/",
		headHunterUrl: "https://api.hh.ru/"
	});