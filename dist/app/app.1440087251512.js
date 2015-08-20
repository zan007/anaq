angular.module("about",["dataSource"]).controller("AboutCtrl",["$scope","$rootScope","dataSource",function(){}]),angular.module("MargoSim",["ngRoute","home","gallery","about","router","dataSource","ngTouch","hideMenu","ui.bootstrap","tile","appAnimations","fileService","ngEnter"]).controller("AppCtrl",["$scope","$route","routes","dataSource","$location",function(a,b,c){a.routes=c.getList()}]).controller("CarouselCtrl",["$scope",function(a){a.myInterval=3e3,a.slides=[{image:"http://lorempixel.com/400/200/"},{image:"http://lorempixel.com/400/200/food"},{image:"http://lorempixel.com/400/200/sports"},{image:"http://lorempixel.com/400/200/people"}]}]),angular.module("appAnimations",[]).animation(".list-out",["$window",function(a){return{start:function(b,c){TweenMax.set(b,{position:"relative"});var d=1;TweenMax.to(b,1,{opacity:0,width:0}),a.setTimeout(c,1e3*d)}}}]).animation(".list-in",["$window",function(a){return{setup:function(a){TweenMax.set(a,{opacity:0,width:0})},start:function(b,c){var d=1;TweenMax.to(b,d,{opacity:1,width:210}),a.setTimeout(c,1e3*d)}}}]).animation(".list-move",["$window",function(a){return{start:function(b,c){var d=1;TweenMax.to(b,d,{opacity:1,width:210}),a.setTimeout(c,1e3*d)}}}]),angular.module("ngEnter",[]).directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),angular.module("tile",[]).directive("tile",function(){return{scope:{data:"=tile"},link:function(a){a.frontTileFlag=!0,TweenLite.set(".tile-wrapper",{perspective:800}),TweenLite.set(tile,{transformStyle:"preserve-3d"}),TweenLite.set(back,{rotationY:-180}),TweenLite.set([back,front],{backfaceVisibility:"hidden"}),a.rotate=function(){1==a.frontTileFlag?(TweenLite.to(tile,1.2,{rotationY:180,ease:Back.easeOut}),a.frontTileFlag=!1):(a.frontTileFlag=!0,TweenLite.to(tile,1.2,{rotationY:0,ease:Back.easeOut}))}},templateUrl:"tile"}}),angular.module("dataSource",[]).factory("dataSource",["$http","$q","$rootScope",function(a,b,c){var d={skills:[]};c.model=d,c.pictures={},c.opened=!1,c.usedSkills=[{name:"",lvl:""}];var e=function(d,e){c.$broadcast("dataSource.start");var f=a(d).then(function(a){var b;return e&&(b=e(a.data,a.status,a.headers)),c.$broadcast("dataSource.stop"),b||a.data}).then(null,function(a){return c.$broadcast("dataSource.error"),b.reject(a)});return f};return a.get("init").then(function(a){var b=a.data;d.skills=b.skills,c.$broadcast("dataSource.ready")}).then(null,function(){c.$broadcast("dataSource.error")}),{getPictures:function(a){return e({method:"GET",url:"/pictures",params:{category:a}},function(a){c.pictures=a})},randPicture:function(a){return e({method:"POST",url:"/rand-picture",params:{section:a}},function(a){c.myPhoto=a.file,console.log(a),c.randFileName=a.fileName})}}}]),angular.module("fileService",[]).factory("fileService",["$rootScope",function(){var a={};return a.getAllFilesFromFolder=function(a){var b=new FileReader(a);b.onload=function(){b.result;return b.readAsDataURL()}},a}]),angular.module("utils.fastFilter",[]).factory("fastFilter",["$filter","$rootScope",function(a){return{create:function(b,c){function d(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&!angular.equals(a[c],p[c])&&b.push(i[c]);return b.length?h[Math.min.apply(Math,b)]:null}function e(a,b,c){if(0==a.length)return b;var d=g[a[0]];return d.cached=b,e(a.slice(1),d.run(b,c),c)}for(var f=b.replace(/\s+/g,"").split("|"),g=[],h=[],i=[],j=0;j<f.length;j++){var k=f[j].split(":"),l=k[0],m=k.slice(1);h[j]=l,g[l]={name:l,params:m,run:function(b,c){for(var d=[b],e=this.params,f=0;f<e.length;f++)d[f+1]=c[e[f]];return a(this.name).apply(this,d)},cached:void 0,order:j};for(var n=0;n<m.length;n++)i[m[n]]=j}var o=void 0,p=c,q=void 0;return{filter:function(a,b){if(!a)return a;var c=h[0];if(p&&a==o&&(c=d(b),!c))return q;if(o!=a)for(var f in g)delete g[f].cached;o=a,p=angular.copy(b);var i=h.slice(g[c].order);if(i.length>0){var j=g[i[0]];return q=e(i,void 0===j.cached?a:j.cached,b)}return a},get:function(){return angular.copy(p)}}}}}]),angular.module("gallery",["dataSource"]).controller("GalleryCtrl",["$scope","$rootScope","dataSource",function(){}]),angular.module("hideMenu",[]).directive("hideMenu",function(){return{scope:{opened:"=hideMenu"},link:function(a,b){b.bind("click",function(){event.pageX>99&&a.$apply(function(){a.opened=!1})})}}}),angular.module("home",["dataSource","fileService","ngEnter"]).controller("HomeCtrl",["$scope","$rootScope","dataSource","fileService","$http",function(a,b,c){a.randPicture="",a.category="",a.categories=[{name:"Osteologia",path:"osteologia"},{name:"Oun",path:"oun"},{name:"Gis",path:"gis"},{name:"brzuch",path:"brzuch"},{name:"klatka",path:"klatka"},{name:"moczowy",path:"mocz"},{name:"noga",path:"noga"},{name:"reka",path:"reka"}],a.showAnswer=!1,a.randPicture="quiz.jpg",a.activeCategory=a.categories[0].path,a.changeCategory=function(b){a.activeCategory=b,console.log(a.activeCategory),a.nextPhoto()},a.nextPhoto=function(){c.randPicture(a.activeCategory)},a.nextPhoto(),a.getPhoto=function(){c.randPicture(a.activeCategory)},b.$watch("myPhoto",function(c){a.myPhoto=c,a.randFileName=b.randFileName}),a.checkAnswer=function(){if(a.good=!1,a.showAnswer=!0,"[object Array]"!==Object.prototype.toString.call(a.randFileName))a.good=a.answer==a.randFileName?!0:!1;else for(var b=0;b<a.randFileName.length;b++){if(a.answer==a.randFileName[b].trim().replace(".",""))return void(a.good=!0);a.good=!1}},a.prevPhoto=function(){}}]),angular.module("router",[]).provider("routes",function(){{var a=[{title:"home",path:"/",icon:"icon-home",selected:!0},{title:"gallery",path:"/gallery",icon:"icon-gallery",selected:!1},{title:"about",path:"/about",icon:"icon-about",selected:!1},{title:"contact",path:"/contact",icon:"icon-contact",selected:!1}];a[0]}this.$get=function(){return{register:function(b){for(var c=b,d=0;d<a.length;d++)c=c.when(a[d].path,{idx:d});c.otherwise({redirectTo:"/"})},select:function(b){for(var c=0;c<a.length;c++)a[c].selected=!1;b.selected=!0},getList:function(){return a}}}}).config(["$routeProvider","$locationProvider","routesProvider",function(a,b,c){c.$get().register(a),b.html5Mode(!0)}]).directive("router",["routes","$location",function(a,b){return{restrict:"A",controller:["$scope","$attrs",function(c,d){var e=(c[d.router]||{},a.getList());c.$on("$routeChangeSuccess",function(b,f){f.$$route&&(c[d.router]=e[f.$$route.idx],a.select(c[d.router]))}),this.setRoute=function(e){c[d.router]=e,a.select(e),b.path(e.path)}}]}}]).directive("routeTo",function(){return{restrict:"A",require:"^router",scope:{item:"=routeTo",initCombo:"@"},link:function(a,b,c,d){var e="ontouchstart"in document.documentElement?"touchstart":"mousedown";b.bind(e,function(){""===c.initCombo&&a.$root.initTransactionCombo(),d.setRoute(a.item),a.$apply()})}}});