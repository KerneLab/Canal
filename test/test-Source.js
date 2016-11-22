QUnit.test("Source", function(assert)
{
	var result = Canal.of([ 0, 1, 2, 3 ]).collect();
	assert.propEqual(result, [ 0, 1, 2, 3 ]);
});

QUnit.test("Source begin", function(assert)
{
	var result = Canal.of([ 0, 1, 2, 3 ], 1).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("Source end", function(assert)
{
	var result = Canal.of([ 0, 1, 2, 3 ], null, 3).collect();
	assert.propEqual(result, [ 0, 1, 2 ]);
});

QUnit.test("Source begin end", function(assert)
{
	var result = Canal.of([ 0, 1, 2, 3 ], 1, 3).collect();
	assert.propEqual(result, [ 1, 2 ]);
});
