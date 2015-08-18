angular.module('fileService', []).

factory('fileService', ['$rootScope',  function($rootScope) {

	var service = {};

	service.getAllFilesFromFolder = function(dir) {
		var reader = new FileReader(dir);

	    reader.onload = function(){
	     	var dataURL = reader.result;
	     	return reader.readAsDataURL();

	    };
	   
	};
  // factory function body that constructs shinyNewServiceInstance
  return service;
}]);