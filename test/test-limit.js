QUnit.test("limit(2) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(2).collect();
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("limit(3) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(3).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("limit(0) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.limit(0).collect();
	assert.propEqual(result, []);
});

QUnit.test("limit(2) empty", function(assert)
{
	var result = Canal.of([]) //
	.limit(2).collect();
	assert.propEqual(result, []);
});

QUnit.test("limit(0) empty", function(assert)
{
	var result = Canal.of([]) //
	.limit(0).collect();
	assert.propEqual(result, []);
});
