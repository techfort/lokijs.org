var app = angular.module('lokiApp', ['ui.router', 'lokijs']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        views: {
          'main': {
            templateUrl: 'templates/overview.html',
            controller: 'OverViewController'
          }
        }
      })
      .state('demo', {
        url: '/demo',
        views: {
          'main': {
            templateUrl: 'templates/example.html',
            controller: 'ExampleController'
          }
        }
      })
      .state('docs', {
        url: '/docs',
        views: {
          'main': {
            templateUrl: 'templates/docs.html',
            controller: 'DocsController'
          }
        }
      })
      .state('github', {
        url: '/github',
        views: {
          'main': {
            templateUrl: 'templates/github.html',
            controller: 'GithubController'
          }
        }
      })
  })
  .controller('GithubController', function ($scope) {
    $scope.message = 'github...';
  })
  .controller('ExampleController', function ($scope, Loki) {
    var db = new Loki('lokidemo');
    $scope.newtodo = {
      title: '',
      description: '',
      duration: 0,
      complete: false
    };

    db.loadDatabase({}, load);

    function load() {

      $scope.todos = db.getCollection('todos') || db.addCollection('todos', {
        unique: ['title']
      });
      if ($scope.todos.data.length === 0) {
        $scope.todos.insert({
          title: 'Learn LokiJS',
          description: 'Learn to use lokijs',
          duration: 3,
          complete: false
        });
        $scope.todos.insert({
          title: 'Use LokiJS',
          description: 'Use lokijs in my next project',
          duration: 10,
          complete: false
        });
        $scope.todos.insert({
          title: 'Contribute',
          description: 'Contribute to lokijs to make it even better',
          duration: 5,
          complete: false
        });
        $scope.todos.insert({
          title: 'Fork it',
          description: 'Fork lokijs on github',
          duration: 5,
          complete: false
        });
        db.saveDatabase();
      }

      $scope.dv = $scope.todos.addDynamicView('outstanding');
      $scope.dv.applyFind({
        'complete': {
          $eq: false
        }
      });
      $scope.dv.applySimpleSort('duration');
      db.saveDatabase();

      function outstanding(obj) {
        return !obj.complete;
      }

      $scope.avgDuration = function () {
        var sum = 0,
          len = $scope.dv.data().length;
        $scope.dv.data().forEach(function (i) {
          if (!i.complete) {
            sum += i.duration;
          }
        });
        return (sum / len).toFixed(2);
      };

      $scope.deleteRecord = function (id) {
        $scope.todos.remove($scope.todos.data[id]);
      };

      $scope.getIncomplete = function () {
        return $scope.dv.data().map(function (r) {
          return r.$loki;
        }).join(', ');
      };

      $scope.createNewTodo = function () {
        var newToDo = {
          title: $scope.newtodo.title,
          description: $scope.newtodo.description,
          duration: $scope.newtodo.duration,
          complete: false
        };
        if (newToDo.title === '' || !newToDo.title) {
          return;
        }
        $scope.todos.insert(newToDo);
        db.saveDatabase();
        $scope.newtodo = {
          title: '',
          description: '',
          duration: 0,
          complete: false
        };
      };
    }



  })
  .controller('OverViewController', function ($scope) {
    $scope.message = 'Overview...';
  })
  .controller('DocsController', function ($scope) {

  });

app.directive('formrow', function () {
  return {
    restrict: "E",
    templateUrl: "templates/formrow.html",
    link: function (scope, elem, attrs) {
      scope.createNewTodo();
    }
  };
});

// a bit of good old stackoverflow time saving...
function roughSizeOfObject(value, level) {
  if (level == undefined) level = 0;
  var bytes = 0;

  if (typeof value === 'boolean') {
    bytes = 4;
  } else if (typeof value === 'string') {
    bytes = value.length * 2;
  } else if (typeof value === 'number') {
    bytes = 8;
  } else if (typeof value === 'object') {
    if (value['__visited__']) return 0;
    value['__visited__'] = 1;
    for (i in value) {
      bytes += i.length * 2;
      bytes += 8; // an assumed existence overhead
      bytes += roughSizeOfObject(value[i], 1)
    }
  }

  if (level == 0) {
    clear__visited__(value);
  }
  return bytes;
}

function clear__visited__(value) {
  if (typeof value == 'object') {
    delete value['__visited__'];
    for (var i in value) {
      clear__visited__(value[i]);
    }
  }
}

$(document).ready(function () {
  $("li.navitem").click(function () {
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
});
