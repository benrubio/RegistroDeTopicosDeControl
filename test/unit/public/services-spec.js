
describe('Projects Services', function () {
  var projects, $httpBackend, $cookies;
  beforeEach(module('topicosServices'));

  beforeEach(inject(function (_projects_, _$httpBackend_, _$cookies_) {
    projects = _projects_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
  }));
  
  it('project count is 0 on cold start', function () {
    expect(projects.list.length).toEqual(0);
  });
  
  it('fetches projects on load', function () {
    var validateHeadres;
    
    $cookies.put('gtoken', 'testGtoken');
    
    validateHeaders = function (headers) {
      return headers['gtoken'] === 'testGtoken';
    };
    
    $httpBackend.expect('GET', '/projects', null, validateHeaders).respond(function(method, url, data){ 
        return [200, [{ id: 'someProject' }]]; 
    });

    projects.load();
    $httpBackend.flush();

    expect(projects.list.length).toEqual(1);
    expect(projects.list[0].id).toEqual('someProject');
  });
  
  afterEach(function () {
    $cookies.remove('gtoken');
  });
});