const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log("TIMER 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  setTimeout(() => console.log("TIMER 2 finished"), 0);
  setTimeout(() => console.log("TIMER 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start + "\nPassword encrypted")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start + "\nPassword encrypted")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start + "\nPassword encrypted")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start + "\nPassword encrypted")
  );
});

console.log("Top level code");
