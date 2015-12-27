/**
  * @class TagCloudCtrl
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
    .controller('TagCloudCtrl', ['$scope', 'BackendService', 'SearchService',  
    	function($scope, backend, search) {

		backend.getCloudTags().then(applyCloudTags);

		function applyCloudTags (words) {

			// var words = [{text: "Lorem", weight: 13},
			// 			  {text: "Ipsum", weight: 10.5},
			// 			  {text: "Dolor", weight: 9.4},
			// 			  {text: "Sit", weight: 8},
			// 			  {text: "Amet", weight: 6.2},
			// 			  {text: "Consectetur", weight: 5},
			// 			  {text: "Adipiscing", weight: 5}];

			$scope.words = words.map(function (w) {
				w.handlers = {
					click: 	function () {
								search.search(w.text);
				    		}
				}
				 
				return w;
			});
		}

    }
    ]
    );
