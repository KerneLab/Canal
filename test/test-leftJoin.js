QUnit.test("leftJoin()", function(assert)
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ])
			.leftJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ]))
			.mapJoint(function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	assert.propEqual(result, [ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ 4, 2 ] ]);
});

QUnit.test("leftJoin() 1 vs empty", function(assert)
{
	var result = Canal.of([ [ "a", 1 ] ]).leftJoin(Canal.of([])).mapJoint(
			function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	assert.propEqual(result, [ [ 1, "_" ] ]);
});

QUnit.test("leftJoin() empty vs 1", function(assert)
{
	var result = Canal.of([]).leftJoin(Canal.of([ [ "b", 1 ] ])).mapJoint(
			function(l, r)
			{
				return [ l, r.or("_") ];
			}).collect();
	assert.propEqual(result, []);
});

QUnit.test("leftJoin() empty vs empty", function(assert)
{
	var result = Canal.of([]).leftJoin(Canal.of([])).mapJoint(function(l, r)
	{
		return [ l, r.or("_") ];
	}).collect();
	assert.propEqual(result, []);
});
