'use strict';

/**
 * @class BackendService
 * @memberOf hhStat 
 * @description Data service to interact with backend API   
 */

angular.module('hhStat')
  .service('BackendService', ['ConfigConst', 'CommonService', '$http',
    function(config, common, $http) {

      var result = {
        getSuggestions: getSuggestions,
        getCloudTags: getCloudTags,
        logRemote: logRemote,
        logQuery: logQuery
      };

      var defaultConfig = {
        timeout: config.headHunterTimeout,
        cache: true
      };

      return result;

      /**
       * @function
       * @memberOf hhStat.BackendService
       * @description Query backend for array of suggestions
       * @return {Promise}
       */
      function getSuggestions() {
        return $http.get(config.backendBaseUrl + 'dictionary/suggestions', defaultConfig)
          .then(function(result) {
            return result.data;
          });
      }

      /**
       * @function
       * @memberOf hhStat.BackendService
       * @description Query backend for array of tags and weights
       * @return {Promise}
       */
      function getCloudTags() {
        return $http.get(config.backendBaseUrl + 'dictionary/cloudTags', defaultConfig)
          .then(function(result) {
            return result.data.map(function(tag) {
              return {
                text: tag.Tag,
                weight: tag.Weight
              }
            });
          });
      }

      /**
       * @function
       * @memberOf hhStat.BackendService
       * @description Log information to database
       * @param  {Object} info Information or error data to log
       * @param  {Bool} isError Is it error ot not
       */
      function logRemote(info, isError) {
        var payload = {
          isError: isError || false,
          browser: navigator.userAgent,
          error: info
        };

        $http.post(config.backendBaseUrl + 'common/log',
          payload,
          defaultConfig);
      }

      /**
       * @function
       * @memberOf hhStat.BackendService
       * @description Log query to database
       * @param  {string} query Query to log
       * @param {Object} filter Current filter
       */
      function logQuery(query, filter) {
        var payload = {
          query: query,
          session: common.session,
          filter: filter
        };

        $http.post(config.backendBaseUrl + 'common/queries',
          payload,
          defaultConfig);
      }

    }
  ]);