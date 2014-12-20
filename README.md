create-container
================

Simple application container.

Installation
------------

`npm install create-container`

Usage
-----

```js
var createContainer = require('create-container');

var container = createContainer();

container.register('foo', () => {
  return 'FOO';
});

container.register('bar', (lookup) => {
  // lookup other modules
  var foo = lookup('foo');
  return foo + ':BAR';
});

container.lookup('bar'); // => "FOO:BAR"
```

Example with React Router
-------------------------

```js
// main.js
var React = require('react');
var createContainer = require('create-container');

// can register on creation
var container = createContainer({
  routes:     require('./routes'),
  router:     require('./router'),
  FooHandler: require('./FooHandler'),
  Actions:    require('./Actions')
});

// or on the fly
container.register('token', () => window.__TOKEN__);

// start the app
container.lookup('router').run((Handler) => {
  React.render(<Handler/>, document.body);
});
```

```js
// routes.js
var { Route } = require('react-router');

module.exports = (lookup) => {
  return (
    <Route handler={lookup('FooHandler')} />
  );
};
```


```js
// FooHandler.js
var React = require('react');

module.exports = (lookup) => {
  var token = lookup('token');
  var Actions = lookup('Actions');
  return React.createClass({
    statics: {
      willTransitionTo (transition) {
        var data = { user: {}, token: token };
        req.post('http://example-api.com/users', data, (user) {
          transition.redirect(`/users/${user.id}`);
        });
      }
    },

    handleClick () {
      Actions.doSomething();
    },

    // ...
  });
};
```


```js
// Actions.js
module.exports = (lookup) => {
  return {
    doSomething () {
      lookup('router').transitionTo('somewhere');
    }
  };
};
```


```js
// router.js
var Router = require('react-router');

module.exports = (lookup) => {
  return Router.create({
    routes: lookup('routes'),
    location: Router.HistoryLocation
  });
};
```

