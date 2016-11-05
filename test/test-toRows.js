QUnit.test("toRows() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).toRows().collect();
	assert.propEqual(result, [ [ 1 ], [ 2 ], [ 3 ] ]);
});

QUnit.test("toRows(v->v+1) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).toRows(function(d)
	{
		return d + 1;
	}).collect();
	assert.propEqual(result, [ [ 2 ], [ 3 ], [ 4 ] ]);
});
