let i18nHandler = function() {}

function i18n(fn) {
  i18nHandler = fn || i18nHandler;
}

function t() {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;
}

export {
  i18n,
  t
}