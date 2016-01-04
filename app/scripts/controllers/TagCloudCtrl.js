'use strict';

/**
  * @class TagCloudCtrl
  * @memberOf hhStat    
  */
 
angular.module('hhStat')
    .controller('TagCloudCtrl', ['BackendService', 'SearchService',  
    	function(backend, search) {
    	var self = this;
    	
		backend.getCloudTags().then(applyCloudTags);

		function applyCloudTags (words) {

			self.words = words.map(function (w) {
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
