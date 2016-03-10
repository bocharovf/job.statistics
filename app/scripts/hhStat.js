'use strict';

/**
 * @class hhStat
 * @description Application module
 */

angular
  .module('hhStat', ['angular-jqcloud', 'highcharts-ng', 'ui.bootstrap'])
  .run(['$anchorScroll', function($anchorScroll) {
    // respect fixed header and always scroll by 90 extra pixels
    $anchorScroll.yOffset = 90;
  }])