Canal.js [![Travic CI](https://travis-ci.org/KerneLab/Canal.svg?branch=master)](https://travis-ci.org/KerneLab/Canal)
=========================
Functional Programming Framework of Data Processing in Javascript.

[API 指引](https://github.com/KerneLab/Canal/wiki/API_Reference_CN)

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
.collect()
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
.map(function(d)
{
  return [ d % 2, d ];
})
.groupBy()
.collect()
```
```js
[0, [4  ]]
[1, [3,5]]
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
.map(function(d)
{
  return [ d % 2, d ];
})
.groupBy()
.join(Canal.of([ 0, 1, 2 ])
.map(function(d)
{
  return [ d, d ];
}))
.collect()
```
```js
[0, [[4  ], 0]]
[1, [[3,5], 1]]
```

> Window Operation

```js
function sum(unpacker)
{
  return function(rows, begin, end, current)
  {
    return Canal.of(rows, begin, end) //
    .unpack(unpacker) //
    .reduce((a, b) => a+b).get();
  };
}

var result = Canal.of([
  {"id":1,"sex":1,"grp":0,"sal":3032},
  {"id":2,"sex":1,"grp":1,"sal":2153},
  {"id":3,"sex":2,"grp":0,"sal":2545},
  {"id":4,"sex":1,"grp":1,"sal":1894}
]).toRows().window(
  Canal.item(sum(d=>d.id))
    .partBy(d=>d.grp)
    .orderBy(d=>d.sex),
  Canal.item(sum(d=>d.sal))
    .partBy(d=>d.grp, d=>d.sex),
  Canal.item(sum(d=>d.sal))
    .partBy(d=>d.grp)
    .orderBy(d=>d.sal)
    .between(null, 0)
).collect();
```
```js
[
  [{"id":3,"sex":2,"grp":0,"sal":2545}, 4, 2545, 2545],
  [{"id":1,"sex":1,"grp":0,"sal":3032}, 1, 3032, 5577],
  [{"id":4,"sex":1,"grp":1,"sal":1894}, 6, 4047, 1894],
  [{"id":2,"sex":1,"grp":1,"sal":2153}, 6, 4047, 4047]
]
```
