'use strict';

/**
 * @class hierarchyFilter
 * @memberOf hhStat    
 * @description Directive that represents search filter for hierarchy of regions
 */

angular.module('hhStat')
  .directive('hierarchyFilter', function() {
    return {
      scope: {
        max: '@',
        header: '@',
        eventName: '@',
        hierarchy: '=',
        alwaysOnTop: '='
      },
      controller: ['$scope', hierarchyFilterController],
      restrict: 'E',
      templateUrl: 'templates/HierarchyFilter.html'
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

      $scope.$watch(function() {
        return $scope.hierarchy
      },
      updateAvailableOptions, true);

      /*************** Functions ****************/

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @description Updates array of values to choose in filter
       */
      function updateAvailableOptions() {
        var availableOptions = hierarchyApplyFilter($scope.hierarchy, $scope.selectedOptions)
        if (availableOptions)
          availableOptions = availableOptions.sort(compareRespectSpecial);

        $scope.availableOptions = availableOptions;
        $scope.max = defaultMax;

        var filter = $scope.selectedOptions.length > 0 ? $scope.selectedOptions[$scope.selectedOptions.length - 1] : null;

        notify($scope.eventName, filter);
      }

      /**
       * @function
       * @private
       * @memberOf hhStat.hierarchyFilter
       * @description Return specific subset of hierarchy
       * @param  {Object} tree    Hierarchy object
       * @param  {Object[]} filters Path in hierarchy
       * @return {Object[]}         Subset of hierarchy
       */
      function hierarchyApplyFilter(tree, filters) {
        if (tree) {
          var currentLayer = tree;
          filters.forEach(function(filter) {
            currentLayer = currentLayer
              .filter(function(area) {
                return area.id === filter.id
              })[0].areas;
          });

          return currentLayer
            .map(function(area) {
              return {
                id: area.id,
                name: area.name
              }
            });
        }

      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @private
       * @description Comprarator to sort options 
       * first by special index then aplphabeticaly
       * @param  {Object} a First value
       * @param  {Object} b Second value
       * @return {Number}   0 = eq 1 = gt -1 = lt
       */
      function compareRespectSpecial(a, b) {
        var specialA = $scope.alwaysOnTop.indexOf(a.name);
        var specialB = $scope.alwaysOnTop.indexOf(b.name);

        if (specialA >= 0 && specialB >= 0)
          return specialA - specialB;

        if (specialA >= 0 && specialB < 0) return -1;
        if (specialA < 0 && specialB >= 0) return 1;

        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        return 0;
      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @description Add specified option to filters
       * @param  {Object} option Option to select
       */
      function selectOption(option) {
        $scope.selectedOptions.push(option);
        updateAvailableOptions();
      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @description Remove filters started from specified level
       * @param  {Number} layer Sequental number of filter to remove
       */
      function removeSelection(layer) {
        $scope.selectedOptions = $scope.selectedOptions.slice(0, layer);
        updateAvailableOptions();
      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @description Expand current filter layer
       */
      function expandOptions() {
        $scope.max = $scope.availableOptions.length;
      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @description Toggle state of whole filter
       */
      function toggleExpanded() {
        $scope.isExpanded = !$scope.isExpanded;
      }

      /**
       * @function
       * @memberOf hhStat.hierarchyFilter
       * @private
       * @description Notify parent context
       * @param  {String} name Event name
       * @param  {Object} args Arguments
       */
      function notify(name, args) {
        $scope.$emit(name, args);
      }
    }

  });