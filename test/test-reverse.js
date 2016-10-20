QUnit.test("reverse() 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.reverse().collect();
	assert.propEqual(result, [ 3, 2, 1 ]);
});

QUnit.test("reverse() 1", function(assert)
{
	var result = Canal.of([ 1 ]) //
	.reverse().collect();
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("reverse() empty", function(assert)
{
	var result = Canal.of([]) //
	.reverse().collect();
	assert.propEqual(result, []);
});
