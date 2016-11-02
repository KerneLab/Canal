QUnit.test("choose() 1 2 3", function(assert)
{
	var result = Canal.of([ [ 1, 2 ], [ 3, 2 ], [ 3, 1 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	assert.propEqual(result, [ [ 3, 2 ], [ 3, 1 ] ]);
});

QUnit.test("choose() 1", function(assert)
{
	var result = Canal.of([ [ 3, 2 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	assert.propEqual(result, [ [ 3, 2 ] ]);
});

QUnit.test("choose() 0", function(assert)
{
	var result = Canal.of([ [ 1, 2 ] ]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	assert.propEqual(result, []);
});

QUnit.test("choose() empty", function(assert)
{
	var result = Canal.of([]) //
	.choose(function(a, b)
	{
		return a > b;
	}).collect();
	assert.propEqual(result, []);
});
