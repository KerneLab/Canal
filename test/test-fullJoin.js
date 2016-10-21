QUnit.test("fullJoin()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]).fullJoin(
			Canal.of([ [ "b", 1 ], [ "c", 2 ] ])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r.or("_") ];
	}).collect();
	assert.propEqual(result, [ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ "_", 2 ] ]);
});

QUnit.test("fullJoin() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).fullJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r.or("_") ];
			}).collect();
	assert.propEqual(result, [ [ 1, "_" ] ]);
});

QUnit.test("fullJoin() empty vs 1", function(assert)
{
	var result = Canal.of([]).fullJoin(Canal.of([ [ "b", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r.or("_") ];
			}).collect();
	assert.propEqual(result, [ [ "_", 1 ] ]);
});

QUnit.test("fullJoin() empty vs empty", function(assert)
{
	var result = Canal.of([]).fullJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r.or("_") ];
	}).collect();
	assert.propEqual(result, []);
});
