'use strict';

/**
 * @class TagCloudCtrl
 * @memberOf hhStat    
 * @description Control tag cloud
 */

angular.module('hhStat')
  .controller('TagCloudCtrl', ['BackendService', 'SearchService',
    function(backend, search) {
      var self = this;

      backend.getCloudTags().then(applyCloudTags);

      /**
       * @function
       * @memberOf hhStat.TagCloudCtrl
       * @param  {Object[]} words Array of words and weights
       */
      function applyCloudTags(words) {

        self.words = words.map(function(w) {
          w.handlers = {
            click: function() {
              search.search(w.text);
            }
          }

          return w;
        });
      }

    }
  ]);