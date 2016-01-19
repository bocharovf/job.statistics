'use strict';

/**
  * @class hierarchyFilter
  * @memberOf hhStat    
  * @description Directive that represents search filter for hierarchy of regions
  */
 
angular.module('hhStat')
	.directive('hierarchyFilter', function(){
	return {
		 scope: {
		 	max: "@",
		 	header: "@",
		 	eventName: "@",
		 	hierarchy: "="
		 },
		controller: ['$scope', hierarchyFilterController],
		restrict: 'E',
		templateUrl: 'scripts/directives/HierarchyFilter.html'
	};

	function hierarchyFilterController($scope) {
		var defaultMax = $scope.max;

		$scope.isExpanded = true;
		$scope.availableOptions = [];
		$scope.selectedOptions = [];

		$scope.selectOption = selectOption;
		$scope.removeSelection = removeSelection;
		$scope.expandOptions = expandOptions;
		$scope.toggleExpanded = toggleExpanded;

		$scope.$watch(function () { return $scope.hierarchy }, 
					updateAvailableOptions, true);

		/*************** Functions ****************/

		function updateAvailableOptions() {
			$scope.availableOptions = hierarchyApplyFilter($scope.hierarchy, $scope.selectedOptions);
			$scope.max = defaultMax;

			var filter = $scope.selectedOptions.length > 0
								? $scope.selectedOptions[$scope.selectedOptions.length - 1].id
								: null;

			notify($scope.eventName, filter);			
		}

		function hierarchyApplyFilter (tree, filters) {
			if (tree) {
				var currentLayer = tree;
				filters.forEach(function (filter) {
					currentLayer = currentLayer
									.filter(function (area) {
										return area.id === filter.id
									})[0].areas;
				});

				return currentLayer
							.map(function (area) {
								return { id: area.id, name: area.name}
							});	
			}
			
		}

		function selectOption (option) {
			$scope.selectedOptions.push(option);
			updateAvailableOptions();
		}

		function removeSelection (layer) {
			$scope.selectedOptions = $scope.selectedOptions.slice(0, layer);
			updateAvailableOptions();
		}

		function expandOptions () {
			$scope.max = $scope.availableOptions.length;
		}

		function toggleExpanded () {
			$scope.isExpanded = !$scope.isExpanded;
		}

	    function notify(name, args) {
	        $scope.$emit(name, args);
	    }    		
	}

});