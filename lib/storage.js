const continuation = require("continuation-local-storage");
const { createNamespace } = continuation;
const namespaceName = "request";
const ns = createNamespace(namespaceName);

function bindCurrentNamespace(req, res, next) {
  ns.bindEmitter(req);
  ns.bindEmitter(res);

  ns.run(() => {
    next();
  });
}

function setCurrent(key, value) {
  return ns.set(key, value);
}

function getCurrent(key) {
  return ns.get(key);
}

module.exports = {
  bindCurrentNamespace,
  setCurrent,
  getCurrent,
};
