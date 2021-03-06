angular.module('fx.animations.assist', [])


.factory('Assist', ['$filter', '$window', '$timeout', function ($filter, $window, $timeout){
  return {

    emit: function(element, name, trigger){

      var $scope = angular.element(element).scope();
      $scope.$emit(trigger);

    },

    parseClassList: function(element){
      var list = element[0].classList,
          results = {trigger: false, duration: 0.3, ease: $window.Back};
      angular.forEach(list, function (className){
        if(className.slice(0,9) === 'fx-easing'){
          var ease = className.slice(10);
          console.log('here');
          results.ease = $window[$filter('cap')(ease)] ? $window[$filter('cap')(ease)] : $window.Elastic;
          console.log(results.ease);
        }
        if(className === 'fx-trigger'){
          results.trigger = true;
        }
        if(className.slice(0,8) === 'fx-speed'){
          results.duration = parseInt(className.slice(9))/1000;
        }
      });
      return results;
    },

    addTimer: function(options, element, end){
      var self = this;
      var time = options.stagger ? (options.duration * 3) * 1000 : options.duration * 1000;
      var timer = $timeout(function(){
        if(options.trigger){
          self.emit(element, options.animation, options.motion);
        }
      }, time).then(end);
      element.data(options.timeoutKey, timer);
    },
    removeTimer: function(element, timeoutKey, timer){
      $timeout.cancel(timer);
      element.removeData(timeoutKey);
    }
  };
}])

.filter('cap', [function(){
  return function (input){
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
}]);