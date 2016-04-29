
describe('Projects Services', function () {
  var projects, $httpBackend, $cookies, basicProjectLoad;
  beforeEach(module('topicosServices'));

  beforeEach(inject(function (_projects_, _$httpBackend_, _$cookies_) {
    projects = _projects_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
  }));
  
  it('fetches projects on initial load', function () {
    basicProjectLoad();
  });
  
  it('returns cached projects on subsequent loads', function () {
    var result;
    basicProjectLoad();
    
    result = projects.load();
  });
  
  it('refreshes cache when requested', function () {
    basicProjectLoad();
    
    projects.reload();
    
    basicProjectLoad();
  });
  
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();    
  });
  
  basicProjectLoad = function() {
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
  
  
  afterEach(function () {
    $cookies.remove('gtoken');
  });
});