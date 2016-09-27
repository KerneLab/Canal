# Canal
Functional Programming Framework of Calculation in Javascript.

> Common Transform
```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
  .filter(function(d)
  {
    return d > 2;
  }).distinct()
  .sort()
  .map(function(d)
  {
    return [ d % 2, d ];
  }).collect()
```
```js
[1,3]
[0,4]
[1,5]
```

> Group Operation
```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
  .filter(function(d)
  {
    return d > 2;
  }).distinct()
  .sort()
  .map(function(d)
  {
    return [ d % 2, d ];
  })
  .groupBy().collect()
```
```js
[0,[4]]
[1,[3,5]]
```

> Join Operation
```js
Canal.of([ 4, 0, 3, 5, 2, 4 ])
  .filter(function(d)
  {
    return d > 2;
  }).distinct()
  .sort()
  .map(function(d)
  {
    return [ d % 2, d ];
  })
  .groupBy()
  .join(Canal.of([ 0, 1, 2 ]).map(function(d)
  {
	  return [ d, d ];
  })).collect()
```
```js
[4,0]
[3,1]
[5,1]
```
