QUnit.test("subtract() 1 2 3 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("subtract() 1 2 3 vs 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("subtract() 1 2 vs 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2 ]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("subtract() 1 2 3 3 vs 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 2, 3 ])).collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("subtract() 1 2 3 3 vs 2 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 2, 2, 3 ])).collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("subtract() 1 2 3 3 vs 1 2", function(assert)
{
	var result = Canal.of([ 1, 2, 3, 3 ]) //
	.subtract(Canal.of([ 1, 2 ])).collect();
	assert.propEqual(result, [ 3, 3 ]);
});

QUnit.test("subtract() empty vs 1 2 3", function(assert)
{
	var result = Canal.of([]) //
	.subtract(Canal.of([ 1, 2, 3 ])).collect();
	assert.propEqual(result, []);
});

QUnit.test("subtract() 1 2 3 vs empty", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.subtract(Canal.of([])).collect();
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("subtract() empty vs empty", function(assert)
{
	var result = Canal.of([]) //
	.subtract(Canal.of([])).collect();
	assert.propEqual(result, []);
});
