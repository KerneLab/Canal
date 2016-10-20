QUnit.test("sortWith() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith().collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("sortWith() 3 2 1", function(assert)
{
	var result = Canal.of([ 3, 2, 1 ]) //
	.sortWith().collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("sortWith(null,false) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(null, false).collect();
	assert.propEqual(result, [ 3, 2, 1 ]);
});

QUnit.test("sortWith(cmp) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(function(a, b)
	{
		return a - b;
	}).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("sortWith(cmp,false) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.sortWith(function(a, b)
	{
		return a - b;
	}, false).collect();
	assert.propEqual(result, [ 3, 2, 1 ]);
});

QUnit.test("sortWith() empty", function(assert)
{
	var result = Canal.of([]) //
	.sortWith().collect();
	assert.propEqual(result, []);
});
