QUnit.test("groupBy() 1:1 0:2 1:3", function(assert)
{
	var result = Canal.of([ 2, 3, 4 ]) //
	.groupBy(function(d)
	{
		return d % 2;
	}).collect();
	assert.propEqual(result, [ [ "0", [ 2, 4 ] ], [ "1", [ 3 ] ] ]);
});

QUnit.test("groupBy() 0:1", function(assert)
{
	var result = Canal.of([ 1 ]) //
	.groupBy(function(d)
	{
		return d - 1;
	}, function(d)
	{
		return d + 1;
	}).collect();
	assert.propEqual(result, [ [ "0", [ 2 ] ] ]);
});

QUnit.test("groupBy() empty", function(assert)
{
	var result = Canal.of([]) //
	.groupBy().collect();
	assert.propEqual(result, []);
});
