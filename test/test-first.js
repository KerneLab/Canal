QUnit.test("first(2) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.first(2).collect();
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("first(3) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.first(3).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("first(0) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.first(0).collect();
	assert.propEqual(result, []);
});

QUnit.test("first(2) empty", function(assert)
{
	var result = Canal.of([]) //
	.first(2).collect();
	assert.propEqual(result, []);
});

QUnit.test("first(0) empty", function(assert)
{
	var result = Canal.of([]) //
	.first(0).collect();
	assert.propEqual(result, []);
});
