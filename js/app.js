

var app = angular.module('lokiApp', ['ui.state'])
.factory('DataStore', function (){
  return new loki('Demo');
});

app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('index',{
    url: '/',
    views : {
      'main' : {
        templateUrl: 'templates/overview.html',
        controller: 'OverViewController'  
      }
    }
  })
  .state('demo',{
    url: '/demo',
    views: {
      'main' : {
        templateUrl: 'templates/example.html',
        controller: 'ExampleController'  
      }
    }
  })
  .state('docs',{
    url: '/docs',
    views: {
      'main' : {
        templateUrl: 'templates/docs.html',
        controller: 'DocsController'  
      }
    }
  })
  .state('github',{
    url: '/github',
    views : {
      'main' : {
        templateUrl: 'templates/github.html',
        controller: 'GithubController'
      }
    }
  })
})
.controller('GithubController', function ($scope){
  $scope.message = 'github...';
})
.controller('ExampleController', function ($scope, DataStore){
  $scope.message = 'Examples...';
  $scope.newtodo = null;
  $scope.todos = DataStore.addCollection('todos', 'Todo',['title']);
  $scope.todos.insert({ title: 'Learn LokiJS', description: 'Learn to use lokijs', duration : 3, complete: false });
  $scope.todos.insert({ title: 'Use LokiJS', description: 'Use lokijs in my next project', duration: 10, complete: false });
  $scope.todos.insert({ title: 'Contribute', description: 'Contribute to lokijs to make it even better', duration: 5, complete: false });
  $scope.todos.insert({ title: 'Fork it', description: 'Fork lokijs on github', duration: 5, complete: false });

  function outstanding(obj){
    return !obj.complete;
  }

  $scope.todos.storeView('outstanding', outstanding);
  $scope.avgDuration = function(){
    function getDuration(obj){
      return obj.complete ? null : obj.duration;
    }
    function getAverage(array){
      var cumulator = 0;
      var i = array.length >>> 0;
      var actual = 0;
      while(i--){
        if(array[i] != null){
          cumulator += array[i];
          actual++;
        }
      }
      return ( cumulator / actual).toFixed(2);
    }

    return $scope.todos.mapReduce( getDuration, getAverage );
  };

  $scope.deleteRecord = function(id){
    $scope.todos.remove( $scope.todos.data[id] );
  }

  $scope.getIncomplete = function(){
    return '[' + $scope.todos.view('outstanding').map( function(obj){ return obj.id; }).filter().join(',') + ']';
  };

  $scope.getCollectionSize = function(){
    return roughSizeOfObject($scope.todos);
  }

  $scope.createNewTodo = function(){
    var newToDo = {
      title : $scope.newtodo.title,
      description : $scope.newtodo.description,
      duration: $scope.newtodo.duration,
      complete: false
    }
    $scope.todos.insert(newToDo);
    $scope.newtodo = null;
  }

})
.controller('OverViewController', function ($scope){
  $scope.message = 'Overview...';
})
.controller('DocsController', function ($scope){
  
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

Array.prototype.filter = function(){
  
  var i = this.length >>> 0;
  while(i--){
    if(this[i] == null){
      this.splice(i,1);
    }
  }
  return this;
}

// a bit of good old stackoverflow time saving...
function roughSizeOfObject( value, level ) {
    if(level == undefined) level = 0;
    var bytes = 0;

    if ( typeof value === 'boolean' ) {
        bytes = 4;
    }
    else if ( typeof value === 'string' ) {
        bytes = value.length * 2;
    }
    else if ( typeof value === 'number' ) {
        bytes = 8;
    }
    else if ( typeof value === 'object' ) {
        if(value['__visited__']) return 0;
        value['__visited__'] = 1;
        for( i in value ) {
            bytes += i.length * 2;
            bytes+= 8; // an assumed existence overhead
            bytes+= roughSizeOfObject( value[i], 1 )
        }
    }

    if(level == 0){
        clear__visited__(value);
    }
    return bytes;
}

function clear__visited__(value){
    if(typeof value == 'object'){
        delete value['__visited__'];
        for(var i in value){
            clear__visited__(value[i]);
        }
    }
}

$(document).ready(function(){
  $("li.navitem").click(function(){
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
});