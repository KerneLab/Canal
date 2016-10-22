QUnit.test("take(1) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).take(1);
	assert.propEqual(result, [ 1 ]);
});

QUnit.test("take(3) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).take(3);
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("take(4) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).take(4);
	assert.propEqual(result, [ 1, 2, 3 ]);
});

QUnit.test("take(0) 1 2 3", function(assert)
{
	var result = Canal.of([ 1, 2, 3 ]).take(0);
	assert.propEqual(result, []);
});

QUnit.test("take(1) empty", function(assert)
{
	var result = Canal.of([]).take(1);
	assert.propEqual(result, []);
});
