QUnit.test("zip() 1 2 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2 ]) //
	.zip(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ [ 1, 2 ], [ 2, 3 ] ]);
});

QUnit.test("zip() 1 2 3 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.zip(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ [ 1, 2 ], [ 2, 3 ] ]);
});

QUnit.test("zip() empty vs 1", function(assert)
{
	var result = Canal.of([]) //
	.zip(Canal.of([ 1 ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("zip() empty vs empty", function(assert)
{
	var result = Canal.of([]) //
	.zip(Canal.of([])).collect();
	assert.propEqual(result, []);
});
