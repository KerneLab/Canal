QUnit.test("unpack() 3", function(assert)
{
	var result = Canal.of([ [ 1, 2 ], [ 2, 3 ], [ 3, 4 ] ]) //
	.unpack(function(a, b)
	{
		return a + b;
	}).collect();
	assert.propEqual(result, [ 3, 5, 7 ]);
});

QUnit.test("unpack() 1", function(assert)
{
	var result = Canal.of([ [ 1, 2, 3 ] ]) //
	.unpack(function(a, b, c)
	{
		return a * b;
	}).collect();
	assert.propEqual(result, [ 2 ]);
});

QUnit.test("unpack() empty", function(assert)
{
	var result = Canal.of([]) //
	.unpack(function(a, b)
	{
		return a + b;
	}).collect();
	assert.propEqual(result, []);
});
