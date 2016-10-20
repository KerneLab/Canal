QUnit.test("skip(2) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.skip(2).collect();
	assert.propEqual(result, [ 3 ]);
});

QUnit.test("skip(0) 1 2", function(assert)
{
	var result = Canal.of([ 1, 2 ]) //
	.skip(0).collect();
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("skip(1) 1", function(assert)
{
	var result = Canal.of([ 1 ]) //
	.skip(1).collect();
	assert.propEqual(result, []);
});

QUnit.test("skip(0) empty", function(assert)
{
	var result = Canal.of([]) //
	.skip(0).collect();
	assert.propEqual(result, []);
});

QUnit.test("skip(1) empty", function(assert)
{
	var result = Canal.of([]) //
	.skip(1).collect();
	assert.propEqual(result, []);
});
