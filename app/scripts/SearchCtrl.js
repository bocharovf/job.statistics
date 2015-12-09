

angular.module('hhStat')
    .controller('SearchCtrl', function($scope) {
       
		$scope.query = "";
		$scope.suggestion = "c#, java, c++";
		
		$scope.search = search;

		function search (phrase) {
			
			var tokenArray = tokenise (phrase, /[,;]/);
			tokenArray.forEach(searchToken);
		}

		/**
		 * Split search phrase into array of tokens
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
		 * Query external api with concrete search token 
		 * @param  {string} token Search token
		 */
		function searchToken (token) {
			console.log("Search for " + token);
		}
    });


