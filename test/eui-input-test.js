moduleForComponent('eui-input');

test('starts with errorState null', function() {
  expect(1);
  var input = this.subject();
  this.append();
  ok(!input.get('errorState'));
});

test('page load: errorState updated when element has a value', function() {
  expect(1);
  var input = this.subject({value: 'bonk', error: true});
  this.append();
  ok(input.get('errorState'));
});

test('page load: errorState updated when element has no value', function() {
  expect(1);
  var input = this.subject({error: true});
  this.append();
  ok(!input.get('errorState'));
});

// NOTE: this test is setup in a somewhat roundabout way because the current implementation
// of the validation support mixin does not allow a more direct testing approach. That is, we cannot
// setup the initial state and then modify the error property to trigger an errorState change
// because the mixin does not listen to changes on the error property, only the value property.
// Once the implementation is improved this can be replaced with a more direct test.
var fakeController = Em.Object.extend({
  value: null,

  error: Ember.computed('value', function() {
    return this.get('value.length') !== 5;
  })
});
test('element value change: errorState not updated when not starting in errorState', function() {
  expect(2);
  var input = this.subject({c: fakeController.create(), errorBinding: 'c.error', valueBinding: 'c.value'});
  this.append();
  ok(!input.get('errorState'));
  Em.run(function() {
    input.set('value', '1234');
  });
  ok(!input.get('errorState'));
});

// NOTE: see above.
test('element value change: errorState updated when starting in errorState', function() {
  expect(2);
  var input = this.subject({c: fakeController.create({value: '1234'}), errorBinding: 'c.error', valueBinding: 'c.value'});
  this.append();
  ok(input.get('errorState'));
  Em.run(function() {
    input.set('value', '12345');
  });
  ok(!input.get('errorState'));
});

// NOTE: see above
test('element loses focus: errorState updated on focusout', function() {
  expect(3);
  var input = this.subject({c: fakeController.create(), errorBinding: 'c.error', valueBinding: 'c.value'});
  this.append();
  ok(!input.get('errorState'));
  Em.run(function() {
    input.set('value', '1234');
  });
  ok(!input.get('errorState'));
  Em.run(function() {
    input.$().trigger('focusout');
  });
  ok(input.get('errorState'));
});

// NOTE: see above
test('force error check: errorState is updated when forceValidate is true', function() {
  expect(1);
  var input = this.subject({c: fakeController.create(), errorBinding: 'c.error', valueBinding: 'c.value'});
  this.append();
  // NOTE: we are also going out of our way to set this after the input is created because forceValidate
  // is *currently* being observed instead of computed. This test should change once that is not longer true
  Em.run(function(){
    input.set('forceValidate', true);
  });
  ok(input.get('errorState'));
});
