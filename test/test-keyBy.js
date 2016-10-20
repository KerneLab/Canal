QUnit.test("keyBy() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	assert.propEqual(result, [ [ "1.", 1 ], [ "2.", 2 ], [ "3.", 3 ] ]);
});

QUnit.test("keyBy() 1", function(assert)
{
	var result = Canal.of([ 1 ]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	assert.propEqual(result, [ [ "1.", 1 ] ]);
});

QUnit.test("keyBy() empty", function(assert)
{
	var result = Canal.of([]) //
	.keyBy(function(d)
	{
		return d + ".";
	}).collect();
	assert.propEqual(result, []);
});
