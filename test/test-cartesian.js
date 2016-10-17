QUnit.test("cartesian()", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).cartesian(Canal.of([ "A", "B", "C" ]))
			.collect();
	assert.propEqual(result, [ [ 1, "A" ], [ 1, "B" ], [ 1, "C" ], [ 2, "A" ],
			[ 2, "B" ], [ 2, "C" ], [ 3, "A" ], [ 3, "B" ], [ 3, "C" ] ]);
});
