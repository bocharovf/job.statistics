'use strict';

/**
  * @class simpleFilter
  * @memberOf hhStat    
  * @description Directive that represents simple filter
  */
 
angular.module('hhStat')
	.directive('simpleFilter', function(){
	return {
		 scope: {
		 	max: "@",
		 	header: "@",
		 	eventName: "@",
		 	displayField: "@",
		 	valueField: "@",		 	
		 	options: "=",
		 	selectedOption: "="
		 },
		controller: ['$scope', simpleFilterController],
		restrict: 'E',
		templateUrl: 'scripts/directives/SimpleFilter.html'
	};

	function simpleFilterController($scope) {
		var defaultMax = $scope.max;
		var val = $scope.valueField;

		$scope.isExpanded = true;
		$scope.availableOptions = [];

		$scope.selectOption = selectOption;
		$scope.expandOptions = expandOptions;
		$scope.toggleExpanded = toggleExpanded;

		$scope.$watch(function () { return $scope.options }, 
					updateAvailableOptions, true);

		/*************** Functions ****************/

		function updateAvailableOptions() {
			console.log("!");
			if (!$scope.options || $scope.options.length === 0) return;
			$scope.selectedOption = $scope.selectedOption || $scope.options[0];

			$scope.availableOptions = $scope.options
											.filter(function (option) {
												return option[val] !== $scope.selectedOption[val];
											});

			notify($scope.eventName, $scope.selectedOption[val]);
		}

		function selectOption (option) {
			$scope.selectedOption = option;
			updateAvailableOptions();
		}

		function expandOptions () {
			$scope.max = $scope.options.length;
		}

		function toggleExpanded () {
			$scope.isExpanded = !$scope.isExpanded;
		}

	    function notify(name, args) {
	        $scope.$emit(name, args);
	    }    		
	}

});