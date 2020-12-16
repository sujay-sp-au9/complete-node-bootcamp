console.log(arguments);
console.log(require("module").wrapper);

const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2000, 8));
console.log(calc1.multiply(2000, 8));
console.log(calc1.divide(2000, 8));

// exports

// const calc2 = require("./test-module-2");
const { add, multiply, divide } = require("./test-module-2");
console.log(add(2000, 8));
console.log(multiply(2000, 8));
console.log(divide(2000, 8));

// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
