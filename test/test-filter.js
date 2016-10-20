QUnit.test("filter() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	assert.propEqual(result, [ 3 ]);
});

QUnit.test("filter() 1 2", function(assert)
{
	var result = Canal.of([ 1, 2 ]).filter(function(d)
	{
		return d > 2;
	}).collect();
	assert.propEqual(result, []);
});

QUnit.test("filter() empty", function(assert)
{
	var result = Canal.of([]).filter(function(d)
	{
		return d > 2;
	}).collect();
	assert.propEqual(result, []);
});
