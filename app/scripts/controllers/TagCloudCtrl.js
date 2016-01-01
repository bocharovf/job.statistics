'use strict';

/**
  * @class TagCloudCtrl
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
    .controller('TagCloudCtrl', ['$scope', 'BackendService', 'SearchService',  
    	function($scope, backend, search) {

		backend.getCloudTags().then(applyCloudTags);

		function applyCloudTags (words) {

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
