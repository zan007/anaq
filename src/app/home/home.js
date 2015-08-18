angular.module('home', ['dataSource', 'fileService', 'ngEnter']).

controller('HomeCtrl', ['$scope', '$rootScope', 'dataSource', 'fileService', '$http',
    function($scope, $rootScope, dataSource, fileService, $http) {

    //$scope.photos = fileService.getAllFilesFromFolder('../img/osteologia/')
   
    $scope.randPicture  = "";
    $scope.category = '';
    $scope.categories = [
        {   
            name: 'Osteologia',
            path: 'osteologia'
        }, 
        {
            name: "Oun",
            path: 'oun'
        }, 
        {
            name: "Gis",
            path: 'gis'
        }, 
        {
            name: "brzuch",
            path: 'brzuch'
        }, 
        {
            name: "klatka",
            path: 'klatka'
        }, 
        {
            name: "moczowy",
            path: 'mocz'
        }, 
        {
            name: "noga",
            path: 'noga'
        }, 
        {
            name: "reka",
            path: 'reka'
        }
    ]
    $scope.showAnswer = false;
    $scope.randPicture = "quiz.jpg";
    $scope.activeCategory = $scope.categories[0].path;
    $scope.changeCategory = function(path) {
       // dataSource.getPictures(path.replace('/',''));
       
        $scope.activeCategory = path;
        console.log($scope.activeCategory);
        $scope.nextPhoto();
    }


    $scope.nextPhoto = function() {
       
        //dataSource.randPicture($scope.category);
        dataSource.randPicture($scope.activeCategory);
        /*var randIndex = Math.floor((Math.random() * $rootScope.pictures.length) + 0);
        $scope.randPicture = $rootScope.pictures[randIndex];
        $scope.propAnswer = prepareName($scope.randPicture);
        $scope.showAnswer = false;*/
    }
     $scope.nextPhoto();
    $scope.getPhoto = function(){
      dataSource.randPicture($scope.activeCategory);
     
    }

    $rootScope.$watch('myPhoto', function(photo){
        $scope.myPhoto = photo;
        $scope.randFileName = $rootScope.randFileName;
    });

    $scope.checkAnswer = function(){
        $scope.good = false;
        $scope.showAnswer = true;
        if( Object.prototype.toString.call( $scope.randFileName ) !== '[object Array]' ) {
            if($scope.answer == $scope.randFileName){
                $scope.good = true;
            } else {
                $scope.good = false;
            }
        } else {
            for(var i=0;i<$scope.randFileName.length;i++){
                if($scope.answer == $scope.randFileName[i].trim().replace('.','')){
                    $scope.good = true;
                    return;
                }
                else{
                    $scope.good = false;
                }
            }
        }
    }

    /*var prepareName = function(name) {
        var propName = '';
        if(name.indexOf('.jpg') != -1){
            propName = name.replace('.jpg','').replace('(baz.)','').replace('(baz)','');
        }
        if(name.indexOf('.png') != -1){
            propName = name.replace('.png','');
        }
        propName = propName.replace('(baz.)','').replace('.','').replace(/\([0-9]\)/,'').trim().toLowerCase();
        if(propName.indexOf(',') != -1){
            propName.replace('.','');
            propNames = propName.split(',');
            for(var i =0;i<propNames.length;i++){
                propNames[i];
            }
            return propNames;
        } else {
            return propName;
        }
    }*/

    $scope.prevPhoto = function() {}

    }
]);
