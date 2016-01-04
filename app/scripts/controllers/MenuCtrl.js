'use strict';

/**
  * @class MenuCtrl
  * @memberOf hhStat    
  * @description Responsible for navigation
  */

angular.module('hhStat')
    .controller('MenuCtrl', ['$location', '$anchorScroll', 
    	function($location, $anchorScroll) {
        var self = this;

        this.scrollTo = scrollTo;

        /**
         * @function
         * @memberOf hhStat.MenuCtrl
         * @description Scroll to particular anchor
         * @param  {String} id Anchor to scroll
         */
        function scrollTo(id) {
        	$location.hash(id);
        	$anchorScroll();
        };
			
    }]);
