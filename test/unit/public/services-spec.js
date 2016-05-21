
describe('Projects Services', function () {
  var projects, $httpBackend, $cookies, loadProject, loadProjects, createProject;
  beforeEach(module('topicosServices'));

  beforeEach(inject(function (_projects_, _$httpBackend_, _$cookies_) {
    projects = _projects_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
  }));
  
  afterEach(function () {
    $cookies.remove('gtoken');
    
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();    
  });
  
  describe('Get', function () {
    it('fetches projects on initial load', function () {
      loadProjects();
    });

    it('returns cached projects on subsequent loads', function () {
      var result;
      loadProjects();

      result = projects.load();
      expect(result).toBeDefined();
    });

    it('refreshes cache when requested', function () {
      loadProjects();

      projects.reload();

      loadProjects();
    });

  });
  
  describe('Get single project', function () {
    it('fetches project on initial load', function () {
      loadProject('0');
    });
    
    it('returns cached project on subsequent load', function () {
      var result, success;
      
      loadProject('0');
      
      success = jasmine.createSpy('success');
      
      result = projects.loadProject('0', success);
      expect(result).toBeDefined();
      expect(result.id).toEqual('0');
      expect(success).toHaveBeenCalled();
    });
    
    it('refreshes cache when requested', function () {
      loadProject('0');
      projects.reload();
      loadProject('0');
    });
    
    it('returns cached project from creation', function () {
      var success;
      
      createProject();
      
      success = jasmine.createSpy('success');
      
      result = projects.loadProject('newProjectId', success);
      expect(result).toBeDefined();
      expect(success).toHaveBeenCalled();
    });
  });

  describe('Create', function () {
    it('creates provided project', function () {
      createProject();
    });
    
    it('returns the newly created project', function () {
      loadProjects();
      createProject();
      
      result = projects.load(success);
      
      expect(result.length).toEqual(2);
      expect(result[1].id).toEqual('newProjectId');
    });
  });
  
  loadProject = function (id) {
    var validateHeadres, result, success, project;

    $cookies.put('gtoken', 'testGtoken');

    validateHeaders = function (headers) {
      return headers['gtoken'] === 'testGtoken';
    };

    success = jasmine.createSpy('success');

    project = { id: id };
    $httpBackend.expect('GET', '/projects/' + id, null, validateHeaders).respond(function(method, url, data){ 
        return [200, project]; 
    });

    result = projects.loadProject(id, success);
    $httpBackend.flush();

    expect(result.id).toEqual(id);
    expect(success).toHaveBeenCalled();    
  };
  
  loadProjects = function() {
    var validateHeadres, result, success;

    $cookies.put('gtoken', 'testGtoken');

    validateHeaders = function (headers) {
      return headers['gtoken'] === 'testGtoken';
    };

    success = jasmine.createSpy('success');

    $httpBackend.expect('GET', '/projects', null, validateHeaders).respond(function(method, url, data){ 
        return [200, [{ id: 'someProject' }]]; 
    });

    result = projects.load(success);
    $httpBackend.flush();

    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual('someProject');
    expect(success).toHaveBeenCalled();
  };
  
  createProject = function() {
    var fakeProject = {};
    $cookies.put('gtoken', 'testGtoken');

    validateHeaders = function (headers) {
      return headers['gtoken'] === 'testGtoken';
    };

    validateData = function (data) {
      var expected = JSON.stringify(fakeProject);
      return data === expected;
    }

    success = jasmine.createSpy('success');

    $httpBackend.expect('POST', '/projects', validateData, validateHeaders).respond(function(method, url, data){ 
        return [200, { id: 'newProjectId' }]; 
    });

    result = projects.create(fakeProject, success);
    $httpBackend.flush();

    expect(result.id).toEqual('newProjectId');
    expect(success).toHaveBeenCalled();
  };
});