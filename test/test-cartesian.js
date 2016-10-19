QUnit.test("cartesian() 3 vs 2", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([ "A", "B" ]))
			.collect();
	assert.propEqual(result, [ [ 1, "A" ], [ 1, "B" ], [ 2, "A" ], [ 2, "B" ],
			[ 3, "A" ], [ 3, "B" ] ]);
});

QUnit.test("cartesian() 3 vs 1", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([ "A" ])).collect();
	assert.propEqual(result, [ [ 1, "A" ], [ 2, "A" ], [ 3, "A" ] ]);
});

QUnit.test("cartesian() 1 vs 2", function(assert)
{
	var result = Canal.of([ 1 ]).cartesian(Canal.of([ "A", "B" ])).collect();
	assert.propEqual(result, [ [ 1, "A" ], [ 1, "B" ] ]);
});

QUnit.test("cartesian() 3 vs 0", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([])).collect();
	assert.propEqual(result, []);
});

QUnit.test("cartesian() 0 vs 2", function(assert)
{
	var result = Canal.of([]).cartesian(Canal.of([ "A", "B" ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("cartesian() 0 vs 0", function(assert)
{
	var result = Canal.of([]).cartesian(Canal.of([])).collect();
	assert.propEqual(result, []);
});
