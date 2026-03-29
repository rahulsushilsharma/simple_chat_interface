#!/usr/bin/env node
/**
 * Clean JavaScript Reference (Node.js)
 * Similar spirit to the Python version — showcases language + runtime features
 */

import fs from "fs/promises";
import { performance } from "perf_hooks";
import { Worker, isMainThread } from "worker_threads";

/* --------------------------------------------------
1. Mutability (objects vs copy)
-------------------------------------------------- */
function demoMutability() {
  const a = [1, { x: 1 }];
  const b = a; // reference copy
  b[1].x = 999;

  const c = [...a]; // shallow copy
  c[1].x = 5;

  const d = structuredClone(a); // deep copy

  console.log("original:", a[1].x);
  console.log("deep copy safe:", d[1].x);
}

/* --------------------------------------------------
2. enumerate equivalent
-------------------------------------------------- */
function demoEnumerate() {
  const names = ["Rahul", "Aman", "Neha"];
  names.forEach((name, i) => console.log(i + 1, name));
}

/* --------------------------------------------------
3. zip equivalent
-------------------------------------------------- */
function zip(a, b) {
  return a.map((v, i) => [v, b[i]]);
}

function demoZip() {
  const ids = [101, 102, 103];
  const names = ["Pen", "Book", "Bag"];
  console.log(Object.fromEntries(zip(ids, names)));
}

/* --------------------------------------------------
4. any / all
-------------------------------------------------- */
function demoAnyAll() {
  const nums = [0, 0, 5, 0];
  console.log("any:", nums.some(Boolean));
  console.log("all:", nums.every(Boolean));
}

/* --------------------------------------------------
5. map / filter
-------------------------------------------------- */
function demoMapFilter() {
  const nums = [1, 2, 3, 4, 5, 6];
  console.log(nums.map((x) => x * x));
  console.log(nums.filter((x) => x % 2 === 0));
}

/* --------------------------------------------------
6. sort with key
-------------------------------------------------- */
function demoSort() {
  const users = [
    { name: "Rahul", age: 25 },
    { name: "Aman", age: 20 },
    { name: "Neha", age: 30 },
  ];
  console.log(users.sort((a, b) => a.age - b.age));
}

/* --------------------------------------------------
7. reduce (sum/min/max)
-------------------------------------------------- */
function demoMath() {
  const nums = [10, 20, 30];
  console.log(
    "sum",
    nums.reduce((a, b) => a + b, 0),
  );
  console.log("min", Math.min(...nums));
  console.log("max", Math.max(...nums));
}

/* --------------------------------------------------
8. reverse
-------------------------------------------------- */
function demoReverse() {
  const arr = [1, 2, 3, 4];
  console.log([...arr].reverse());
}

/* --------------------------------------------------
9. timing decorator equivalent
-------------------------------------------------- */
function timeIt(fn) {
  return (...args) => {
    const s = performance.now();
    const r = fn(...args);
    console.log(fn.name, "took", (performance.now() - s).toFixed(3), "ms");
    return r;
  };
}

const fib = timeIt(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

/* --------------------------------------------------
10. Class / static factory
-------------------------------------------------- */
class User {
  constructor(name, date) {
    this.name = name;
    this.date = date;
  }
  static createCurrent(name) {
    return new User(name, Date.now());
  }
  toString() {
    return `User(${this.name})`;
  }
}

/* --------------------------------------------------
11. Async await
-------------------------------------------------- */
async function asyncTask(name) {
  await new Promise((r) => setTimeout(r, 100));
  return "done " + name;
}
async function demoAsync() {
  console.log(await Promise.all([asyncTask("A"), asyncTask("B")]));
}

/* --------------------------------------------------
12. Worker thread (multiprocessing equivalent)
-------------------------------------------------- */
function demoWorker() {
  return new Promise((resolve) => {
    const worker = new Worker(
      `
            const {parentPort}=require("worker_threads");
            parentPort.postMessage([1,2,3,4].map(x=>x*x));
        `,
      { eval: true },
    );
    worker.on("message", (msg) => {
      console.log("worker:", msg);
      resolve();
    });
  });
}

/* --------------------------------------------------
13. WeakRef
-------------------------------------------------- */
function demoWeakRef() {
  let obj = { a: 1 };
  const w = new WeakRef(obj);
  obj = null;
  global.gc?.();
  console.log("alive?", w.deref());
}

/* --------------------------------------------------
14. File operations
-------------------------------------------------- */
async function demoFile() {
  await fs.writeFile("test.txt", "hello world");
  console.log("file written");
}

/* --------------------------------------------------
15. Generator
-------------------------------------------------- */
function* accumulator() {
  let total = 0;
  while (true) {
    const val = yield total;
    if (val == null) break;
    total += val;
  }
}

function demoGenerator() {
  const g = accumulator();
  g.next();
  console.log(g.next(5).value, g.next(10).value);
}

/* --------------------------------------------------
16. Proxy (descriptor-like behavior)
-------------------------------------------------- */
const positiveHandler = {
  set(obj, prop, val) {
    if (val < 0) throw Error("must be positive");
    obj[prop] = val;
    return true;
  },
};
function demoProxy() {
  const acc = new Proxy({ balance: 100 }, positiveHandler);
  console.log(acc.balance);
}

/* --------------------------------------------------
MAIN
-------------------------------------------------- */
async function main() {
  console.log(
    "hello",
    process.argv.includes("--name")
      ? process.argv[process.argv.indexOf("--name") + 1]
      : "world",
  );

  demoMutability();
  demoEnumerate();
  demoZip();
  demoAnyAll();
  demoMapFilter();
  demoSort();
  demoMath();
  demoReverse();

  fib(20);

  console.log(User.createCurrent("Rahul").toString());

  await demoAsync();
  await demoWorker();
  await demoFile();

  demoGenerator();
  demoProxy();
  demoWeakRef();
}

if (isMainThread) main();
