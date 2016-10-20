QUnit.test("map() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	assert.propEqual(result, [ 0.5, 1, 1.5 ]);
});

QUnit.test("map() 1", function(assert)
{
	var result = Canal.of([ 1 ]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	assert.propEqual(result, [ 0.5 ]);
});

QUnit.test("map() empty", function(assert)
{
	var result = Canal.of([]) //
	.map(function(d)
	{
		return d / 2;
	}).collect();
	assert.propEqual(result, []);
});
