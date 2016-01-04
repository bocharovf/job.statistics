'use strict';

/**
  * @class MenuCtrl
  * @memberOf hhStat    
  */

angular.module('hhStat')
    .controller('MenuCtrl', ['$location', '$anchorScroll', 
    	function($location, $anchorScroll) {
    	
    	//$anchorScroll.yOffset = -190;
    	this.scrollTo = scrollTo;

		function scrollTo(id) {
			console.log(id);
			$location.hash(id);
			$anchorScroll();
		};
						
    }]);
