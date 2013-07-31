

var app = angular.module('lokiApp', [])
.factory('DataStore', function (){
  return new loki('Demo');
});

app.config(function($routeProvider, $locationProvider){
  $routeProvider
    .when('/',{
      templateUrl: 'templates/overview.html',
      controller: 'OverViewController'
    })
    .when('/example',{
      templateUrl: 'templates/example.html',
      controller: 'ExampleController'
    })
    .when('/github',{
      templateUrl: 'templates/github.html',
      controller: 'GithubController'
    })
    .otherwise({ redirectTo: '/'})
    $locationProvider.html5Mode(true);
    
})
.controller('GithubController', function ($scope){
  $scope.message = 'github...';
})
.controller('ExampleController', function ($scope, DataStore){
  $scope.message = 'Examples...';
  $scope.newtodo = null;
  $scope.todos = DataStore.addCollection('todos', 'Todo',['title']);
  $scope.todos.document({ title: 'Learn LokiJS', description: 'Learn to use this awesomely tiny db', complete: false });
  $scope.createNewTodo = function(){
    var newToDo = {
      title : $scope.newtodo.title,
      description : $scope.newtodo.description,
      complete: false
    }
    $scope.todos.document(newToDo);
    $scope.newtodo = null;
  }

})
.controller('OverViewController', function ($scope){
  $scope.message = 'Overview...';
});

app.directive('formrow', function(){
  return {
    restrict: "E",
    templateUrl: "templates/formrow.html",
    link: function(scope, elem, attrs){
      scope.createNewTodo();
    }
  };
});