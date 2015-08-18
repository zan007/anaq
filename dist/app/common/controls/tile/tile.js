angular.module('tile', [])

.directive('tile', function() {
    return {
        scope: {
            data: '=tile'
        },
        link: function($scope) {
            $scope.frontTileFlag = true;
            
            TweenLite.set(".tile-wrapper", {
                perspective: 800
            });
            TweenLite.set(tile, {
                transformStyle: "preserve-3d"
            });
            TweenLite.set(back, {
                rotationY: -180
            });
            TweenLite.set([back, front], {
                backfaceVisibility: "hidden"
            });

            $scope.rotate = function() {
                if ($scope.frontTileFlag == true) {
                    TweenLite.to(tile, 1.2, {
                        rotationY: 180,
                        ease: Back.easeOut
                    });
                    $scope.frontTileFlag = false;

                } else {
                    $scope.frontTileFlag = true;
                    TweenLite.to(tile, 1.2, {
                        rotationY: 0,
                        ease: Back.easeOut
                    });
                }
            };
        },
        templateUrl: 'tile'

    }
});
