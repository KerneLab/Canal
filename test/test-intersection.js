QUnit.test("intersection() 1 2 3 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 2, 3 ]);
});

QUnit.test("intersection() 1 2 3 3 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.intersection(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 2, 3 ]);
});

QUnit.test("intersection() 1 2 3 vs 2 3 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([ 2, 3, 3 ])).collect();
	assert.propEqual(result, [ 2, 3 ]);
});

QUnit.test("intersection() 1 2 3 vs empty", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.intersection(Canal.of([])).collect();
	assert.propEqual(result, []);
});

QUnit.test("intersection() empty vs 1 2 3", function(assert)
{
	var result = Canal.of([]) //
	.intersection(Canal.of([ 1, 2, 3 ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("intersection() empty vs empty", function(assert)
{
	var result = Canal.of([]) //
	.intersection(Canal.of([])).collect();
	assert.propEqual(result, []);
});
