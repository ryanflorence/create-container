module.exports = (modules) => {
  var registry = {};
  var resolved = {};
  var resolving = {};

  var register = (name, def) => {
    registry[name] = def;
  };

  var resolve = (name) => {
    resolving[name] = true;
    var lookupDep = (dep) => lookup(dep, name);
    var module = registry[name](lookupDep);
    resolved[name] = module;
    delete resolving[name];
    return module;
  };

  var lookup = (name, parent) => {
    if (!registry[name])
      throw new Error(`module ${name} has not been registered`);
    if (resolving[name])
      throw new Error(`circular dependency detected for ${name} from ${parent}`);
    return resolved[name] || resolve(name);
  };

  if (modules)
    for (var name in modules)
      register(name, modules[name]);

  return { register, lookup };
};

