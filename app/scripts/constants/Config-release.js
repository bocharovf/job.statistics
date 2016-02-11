'use strict';

/**
  * @class ConfigConst
  * @memberOf hhStat    
  * @description Contains release constants
  * @property {String}  backendBaseUrl	Url of project backend API
  * @property {String}  headHunterUrl	Url of HH api
  */
 
 
angular
	.module('hhStat')
	.constant('ConfigConst', {
		backendBaseUrl: "http://178.62.222.137/job/server/",
    backendTimeout: 1000,
		headHunterUrl: "https://api.hh.ru/",
    headHunterTimeout: 15000
	});