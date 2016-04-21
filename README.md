# RegistroDeTopicosDeControl

Next step:
  Wire up an in-memory projects store and see the creation flow E2E.
  Make sure all tests are accounted for.
  Handle auth error scenarios
  Handle body parsing errors
  
  I think I might use a simple service to store state accross controllers. They are singletons in the application so i can just use it as my datastore.
  It can be smart enough to use cached versions or refreshed versions.