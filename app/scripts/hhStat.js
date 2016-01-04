'use strict';

/**
  * @class hhStat
  */
 
angular
	.module('hhStat', ['angular-jqcloud', 'highcharts-ng'])
	.run(['$anchorScroll', function($anchorScroll) {
	  // respect fixed header and always scroll by 90 extra pixels
	  $anchorScroll.yOffset = 90;   
	}])
