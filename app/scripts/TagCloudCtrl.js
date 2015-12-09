
/**
 * Tag cloud controller
 */
angular.module('hhStat', ['angular-jqcloud'])
    .controller('TagCloudCtrl', ['$scope',  function($scope) {


    	var handlers = {
    		click: function  () {
    			window.alert("Work!");
    		}
    	};

		var words = [{text: "Lorem", weight: 13},
					  {text: "Ipsum", weight: 10.5},
					  {text: "Dolor", weight: 9.4},
					  {text: "Sit", weight: 8},
					  {text: "Amet", weight: 6.2},
					  {text: "Consectetur", weight: 5},
					  {text: "Adipiscing", weight: 5}];

		$scope.words = words.map(function (w) {
			w.handlers = {
				click: 	function () {
							$scope.$parent.search(w.text);
			    		}
			}
			 
			return w;
		});
    }]);
