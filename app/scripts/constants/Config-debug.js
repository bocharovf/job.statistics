'use strict';

/**
  * @class ConfigConst
  * @memberOf hhStat    
  * @description Contains development constants
  * @property {String}  backendBaseUrl	Url of project backend API
  * @property {String}  headHunterUrl	Url of HH api
  */
angular
	.module('hhStat')
	.constant('ConfigConst', {
		backendBaseUrl: "http://localhost/job.statistics.backend/data/",
		headHunterUrl: "https://api.hh.ru/"
	});