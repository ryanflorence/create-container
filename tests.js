var expect = require('expect');
var createContainer= require('./index');

describe('createContainer', () => {
  it('registers and looks up modules', () => {
    var container = createContainer();
    container.register('foo', () => 'FOO');
    expect(container.lookup('foo')).toEqual('FOO');
  });

  it('looks up dependencies', () => {
    var container = createContainer();
    container.register('foo', () => 'FOO');
    container.register('bar', (lookup) => {
      return lookup('foo') + ':' + 'BAR';
    });
    expect(container.lookup('bar')).toEqual('FOO:BAR');
  });

  it('yells about circular dependencies', () => {
    var container = createContainer();
    container.register('foo', (lookup) => lookup('foo'));
    expect(() => container.lookup('foo')).toThrow();
  });

  it('yells if a module is not registered', () => {
    var container = createContainer();
    expect(() => container.lookup('foo')).toThrow();
  });

  it('takes initial modules', () => {
    var container = createContainer({
      foo () {
        return 'FOO'
      },
      bar (lookup) {
        return lookup('foo')+':BAR';
      }
    });
    expect(container.lookup('bar')).toEqual('FOO:BAR');
  });
});

