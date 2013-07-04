var locator, application, lookup, originalLookup;

module("Ember.Application Depedency Injection", {
  setup: function(){
    originalLookup = Ember.lookup;
    application = Ember.run(Ember.Application, 'create');

    locator = application.__container__;
  },

  teardown: function(){
    Ember.lookup = originalLookup;
    Ember.run(application, 'destroy');
  }
});

test('the default resolver can look things up in other namespaces', function() {
  var UserInterface = Ember.lookup.UserInterface = Ember.Namespace.create();
  UserInterface.NavigationController = Ember.Controller.extend();

  var nav = locator.lookup('controller:userInterface/navigation');

  ok(nav instanceof UserInterface.NavigationController, "the result should be an instance of the specified class");
});

test('the default resolver looks up templates in Ember.TEMPLATES', function() {
  function fooTemplate() {}
  function fooBarTemplate() {}
  function fooBarBazTemplate() {} 

  Ember.TEMPLATES['foo'] = fooTemplate;
  Ember.TEMPLATES['fooBar'] = fooBarTemplate;
  Ember.TEMPLATES['fooBar/baz'] = fooBarBazTemplate;

  equal(locator.lookup('template:foo'), fooTemplate, "resolves template:foo");
  equal(locator.lookup('template:fooBar'), fooBarTemplate, "resolves template:foo_bar");
  equal(locator.lookup('template:fooBar.baz'), fooBarBazTemplate, "resolves template:foo_bar.baz");
});

test('the default resolver looks up basic name as no prefix', function() {
  equal(locator.lookup('controller:basic'), Ember.Controller);
});

test('the default resolver looks up arbitrary types on the namespace', function() {
  application.FooManager = Ember.Object.extend({});
  equal(locator.resolve('manager:foo'), application.FooManager, "looks up FooManager on application");
});

