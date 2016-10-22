QUnit.test("rightJoin()", function(assert)
{
	var result = Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ]).rightJoin(
			Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]))
			.mapJoint(function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	assert.propEqual(result, [ [ "_", 1 ], [ 1, 2 ], [ 1, 3 ], [ 2, 4 ] ]);
});

QUnit.test("rightJoin() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "b", 1 ] ]).rightJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	assert.propEqual(result, []);
});

QUnit.test("rightJoin() empty vs 1", function(assert)
{
	var result = Canal.of([]).rightJoin(Canal.of([ [ "a", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l.or("_"), r ];
			}).collect();
	assert.propEqual(result, [ [ "_", 1 ] ]);
});

QUnit.test("rightJoin() empty vs empty", function(assert)
{
	var result = Canal.of([]).rightJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l.or("_"), r ];
	}).collect();
	assert.propEqual(result, []);
});
