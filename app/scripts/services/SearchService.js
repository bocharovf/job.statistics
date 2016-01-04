'use strict';

/**
  * @class SearchService
  * @memberOf hhStat    
  * @description Service responsible for searching
  */
 
angular.module('hhStat')
	.service('SearchService', ['$http', '$rootScope', 'HeadHunter', 
	function($http, $rootScope, headHunter) {
	
	var result = {
		search: search,
		subscribe: subscribe
	};
	
	return result;
	
	/**
	 * @function	 
	 * @memberOf hhStat.SearchService
	 * @description Subscribe to event
	 * @param  {string}   name     Event name
	 * @param  {object}   scope    Angular scope object
	 * @param  {Function} callback Function to call
	 */
	function subscribe (name, scope, callback) {
        var handler = $rootScope.$on(name, callback);
        scope.$on('$destroy', handler);
    }

    /**
     * @function
     * @memberOf hhStat.SearchService* 
     * @description Fire an event
     * @param  {string} name Event name
     * @param  {object} args Event args
     */
    function notify(name, args) {
        $rootScope.$emit(name, args);
    }    

    /**
     * @function
     * @memberOf hhStat.SearchService
     * @description Search whole phrase
     * @param  {string} phrase Phrase to search
     */
	function search (phrase) {
		var tokenArray = tokenise (phrase, /[,;]/);
		var tokenAliases = tokenArray.map(findAliases);

		var requests = [];
		tokenAliases.forEach(function (token) {
			var requestArray = [0,1,2,3].map(function (x) {
				return {
					page: x,
					token: token.token,
					aliases: token.aliases
				};
			});

			 requests = requests.concat(requestArray);
		});

		notify('SEARCH_START', requests);
		requests.forEach(perfomRequest);
	}

	/**
     * @function
     * @private
     * @memberOf hhStat.SearchService
	 * @description Split search phrase into array of tokens
	 * @param  {string} phrase Search phrase
	 * @sep    {RegExp} sep    Separator regular expression 
	 * @return {string[]}      Array of tokens
	 */
	function tokenise (phrase, sep) {
		var rawArray = phrase.split(sep);
		return rawArray
		.map(function (x) {
			return x.trim();
		})
		// remove empty items
		.filter(function (x) {
			return x;
		})
		// distinct
		.reduce(function(a,b) {
			if (a.indexOf(b) < 0 ) a.push(b);
			return a;
		},[]);
	}

	/**
     * @function
     * @private
     * @memberOf hhStat.SearchService
	 * @description Produce array of aliases for token
	 * @param  {string} token Search token
	 * @return {string[]}     Array of aliases
	 */
	function findAliases (token) {
		return { token: token, aliases: [token]};
	}

	/**
     * @function
     * @private
     * @memberOf hhStat.SearchService
	 * @description Query external api with concrete search token 
	 * @param  {string} aliases Search aliases
	 */
	function perfomRequest (request) {
		var textSubquery = request.aliases.join(' OR ');
		headHunter.getVacancies(textSubquery, {
				perPage: 500,
				page: request.page
			})
			.then(function (response) {
				onSearchSuccess(request, response);
			}, function (response) {
				onSearchFailed(request, response);
			});
	}

	/**
	 * @function
	 * @private
	 * @memberOf hhStat.SearchService
	 * @description Fire 'SEARCH_SUCCESS' event
	 * @param  {Object} request  Request 
	 * @param  {Object} response Response
	 */
	function onSearchSuccess (request, response) {
		notify('SEARCH_SUCCESS', { request: request, response: response.data} );
	}

	/**
	 * @function
	 * @private
	 * @memberOf hhStat.SearchService
	 * @description Fire 'SEARCH_FAILED' event
	 * @param  {Object} request  Request 
	 * @param  {Object} response Response
	 */
	function onSearchFailed (request, response) {
		notify('SEARCH_FAILED', { request: request, response: response})
	}	

}]);





