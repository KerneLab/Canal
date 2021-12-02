Canal.js [![Travic CI](https://api.travis-ci.com/KerneLab/Canal.svg?branch=master)](https://app.travis-ci.com/github/KerneLab/Canal) [![Codecov](https://img.shields.io/codecov/c/github/KerneLab/Canal.svg)](https://codecov.io/gh/KerneLab/Canal) [![NPM](https://img.shields.io/npm/v/canal.js.svg)](https://www.npmjs.com/package/canal.js) [![License](https://img.shields.io/npm/l/canal.js.svg)](https://www.npmjs.com/package/canal.js)
=========================
A Fluent API of Data Processing Framework in Javascript

For More [API 指引](https://github.com/KerneLab/Canal/wiki/API_Reference_CN)

> Common Transform

```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
.filter(function(d)
{
  return d > 2;
})
.distinct()
.sortWith()
.map(function(d)
{
  return [ d % 2, d ];
})
.collect();
```
```js
[1, 3]
[0, 4]
[1, 5]
```

> Attach to Array

```js
Canal.on(Array);
```
```js
[ 4, 0, 3, 5, 2, 4 ]
.canal()
.filter(function(d)
{
  return d > 2;
})
.distinct()
.sortWith()
.map(function(d)
{
  return [ d % 2, d ];
})
.collect();
```
```js
[1, 3]
[0, 4]
[1, 5]
```

> Group Operation

```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
.filter(function(d)
{
  return d > 2;
})
.distinct()
.sortWith()
.groupBy(function(d)
{
  return d % 2;
})
.collect();
```
```js
["0", [4  ]]
["1", [3,5]]
```

> Join Operation

```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
.filter(function(d)
{
  return d > 2;
})
.distinct()
.sortWith()
.groupBy(function(d)
{
  return d % 2;
})
.join(Canal.of([ 0, 1, 2 ])
.map(function(d)
{
  return [ d, d ];
}))
.collect();
```
```js
["0", [[4  ], 0]]
["1", [[3,5], 1]]
```

> Window Operation

```js
Canal.of([
  {"id":"1","grp":"1","rnk":1,"sal":1000.00},
  {"id":"2","grp":"1","rnk":1,"sal":1100.00},
  {"id":"3","grp":"1","rnk":2,"sal":1200.00},
  {"id":"4","grp":"1","rnk":2,"sal":1300.00},
  {"id":"5","grp":"1","rnk":3,"sal":1400.00},
  {"id":"6","grp":"2","rnk":1,"sal":1500.00},
  {"id":"7","grp":"2","rnk":1,"sal":1600.00},
  {"id":"8","grp":"2","rnk":2,"sal":1700.00}
]).window(
  Canal.wf.sum(d=>d.sal)
    .partBy(d=>d.grp)
    .orderBy(d=>d.rnk)
    .rows().between(-1, 1)  // From the last row to the next row
    .as("sum_sal")
).collect();
```
```js
[
  {"id":"1","grp":"1","rnk":1,"sal":1000.00,"sum_sal":2100.00},
  {"id":"2","grp":"1","rnk":1,"sal":1100.00,"sum_sal":3300.00},
  {"id":"3","grp":"1","rnk":2,"sal":1200.00,"sum_sal":3600.00},
  {"id":"4","grp":"1","rnk":2,"sal":1300.00,"sum_sal":3900.00},
  {"id":"5","grp":"1","rnk":3,"sal":1400.00,"sum_sal":2700.00},
  {"id":"6","grp":"2","rnk":1,"sal":1500.00,"sum_sal":3100.00},
  {"id":"7","grp":"2","rnk":1,"sal":1600.00,"sum_sal":4800.00},
  {"id":"8","grp":"2","rnk":2,"sal":1700.00,"sum_sal":3300.00}
]
```
