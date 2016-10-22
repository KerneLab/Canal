QUnit.test("reduce()", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 4 ]).reduce(function(a, b)
	{
		return a * b;
	});
	assert.propEqual(result, 24);
});

QUnit.test("reduce() 1 2", function(assert)
{
	var result = Canal.of([ 1, 2 ]).reduce(function(a, b)
	{
		return a * b;
	});
	assert.propEqual(result, 2);
});

QUnit.test("reduce() 1", function(assert)
{
	var result = Canal.of([ 1 ]).reduce(function(a, b)
	{
		return a * b;
	});
	assert.propEqual(result, 1);
});

QUnit.test("reduce() empty", function(assert)
{
	var result = Canal.of([]).reduce(function(a, b)
	{
		return a * b;
	});
	assert.propEqual(result, undefined);
});
