describe('Home Controller', function () {
  var $controller, scope, location, projects, run;
  beforeEach(module('RegistroDeTopicosDeControl.Home'));
  
  beforeEach(inject(function (_$controller_) {
    scope = {};
    location = {};
    projects = {};
    $controller = _$controller_;
  }));
  
  beforeEach(function () {
    var controller;
    
    location.path = jasmine.createSpy('path');
    projects.load = jasmine.createSpy('load').andCallFake(function (successCallback) {
      var list = [];
      successCallback(list);
      return list;      
    });
    
    run = function () { $controller("HomeCtrl", {$scope: scope, $location: location, projects: projects}) };
  });
  
  it('should load projects and add them to scope', function () {
    run();
    
    expect(projects.load).toHaveBeenCalled();
    expect(scope.projects).toBeDefined();
    expect(scope.projects.length).toEqual(0);
  });
  
  it ('should navigate to the project setup when there are no projects', function () {
    run();
    
    expect(location.path).toHaveBeenCalledWith('/signup');
  });
  
  it ('should not navigate to project setup when there are projects', function () {
    projects.load = jasmine.createSpy('load').andCallFake(function (successCallback) {
      var list = [ {id:'someProject'} ];
      successCallback(list);
      return list;
    });
    run();
    
    expect(location.path.calls.length).toEqual(0);
  });
});