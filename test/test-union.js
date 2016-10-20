QUnit.test("union() 1 2 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2 ]) //
	.union(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 1, 2, 2, 3 ]);
});

QUnit.test("union() 1 2 vs empty", function(assert)
{
	var result = Canal.of([ 1, 2 ]) //
	.union(Canal.of([])).collect();
	assert.propEqual(result, [ 1, 2 ]);
});

QUnit.test("union() empty vs 2 3", function(assert)
{
	var result = Canal.of([]) //
	.union(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 2, 3 ]);
});

QUnit.test("union() empty vs empty", function(assert)
{
	var result = Canal.of([]) //
	.union(Canal.of([])).collect();
	assert.propEqual(result, []);
});
