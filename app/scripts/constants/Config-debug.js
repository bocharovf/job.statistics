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
		backendBaseUrl: "http://192.168.0.100/job.statistics.backend/api/",
		backendTimeout: 1000,
    headHunterUrl: "https://api.hh.ru/",
    headHunterTimeout: 15000
	});