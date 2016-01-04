'use strict';

/**
  * @class MenuCtrl
  * @memberOf hhStat    
  */

angular.module('hhStat')
    .controller('MenuCtrl', ['$location', '$anchorScroll', 
    	function($location, $anchorScroll) {
        var self = this;

        this.scrollTo = scrollTo;

        function scrollTo(id) {
        	$location.hash(id);
        	$anchorScroll();
        };
			
    }]);
