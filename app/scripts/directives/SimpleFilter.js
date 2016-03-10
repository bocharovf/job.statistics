'use strict';

/**
 * @class simpleFilter
 * @memberOf hhStat    
 * @description Directive that represents simple filter
 */

angular.module('hhStat')
  .directive('simpleFilter', function() {
    return {
      scope: {
        max: '@',
        header: '@',
        eventName: '@',
        displayField: '@',
        valueField: '@',
        allowEmpty: '@',
        options: '=?',
        selectedOption: '=?'
      },
      controller: ['$scope', simpleFilterController],
      restrict: 'E',
      templateUrl: 'templates/SimpleFilter.html'
    };

    function simpleFilterController($scope) {
      var val = $scope.valueField;

      $scope.isExpanded = true;
      $scope.availableOptions = [];

      $scope.selectOption = selectOption;
      $scope.expandOptions = expandOptions;
      $scope.toggleExpanded = toggleExpanded;
      $scope.removeSelection = removeSelection;

      $scope.$watch(function() {
        return $scope.options
      },
      updateAvailableOptions, true);

      /*************** Functions ****************/

      function updateAvailableOptions() {
        if (!$scope.options || $scope.options.length === 0) return;

        if (!$scope.allowEmpty)
          $scope.selectedOption = $scope.selectedOption || $scope.options[0];

        $scope.availableOptions = $scope.options
          .filter(function(option) {
            return $scope.selectedOption ? option[val] !== $scope.selectedOption[val] : true;
          });

        notify($scope.eventName, $scope.selectedOption);
      }

      /**
       * @function
       * @memberOf hhStat.simpleFilter
       * @description Remove selection
       */
      function removeSelection() {
        if ($scope.allowEmpty) {
          $scope.selectedOption = null;
          updateAvailableOptions();
        }
      }

      function selectOption(option) {
        $scope.selectedOption = option;
        updateAvailableOptions();
      }

      function expandOptions() {
        $scope.max = $scope.options.length;
      }

      function toggleExpanded() {
        $scope.isExpanded = !$scope.isExpanded;
      }

      function notify(name, args) {
        $scope.$emit(name, args);
      }
    }

  });