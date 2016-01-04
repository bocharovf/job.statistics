'use strict';

/**
  * @class hhStat
  */
 
angular
	.module('hhStat', ['angular-jqcloud', 'highcharts-ng'])
	.run(['$anchorScroll', function($anchorScroll) {
	  $anchorScroll.yOffset = 90;   // always scroll by 50 extra pixels
	}])
