const util = require('util')

/* eslint-disable no-console */
console.error = (...args) => {
  const message = util.format(...args);

  if (/(Invalid prop|Failed prop type)/gi.test(message)) {
    throw new Error(message);
  }
}
